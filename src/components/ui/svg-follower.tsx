"use client"

import type React from "react"
import { useRef, useEffect, useCallback, useState } from "react"

interface Position {
  x: number
  y: number
}

interface Point {
  position: Position
  time: number
  drift: Position
  age: number
  direction: Position
}

interface SVGFollowerProps {
  colors?: string[]
  removeDelay?: number
}

export function SVGFollower({
  colors = ["#ff3366", "#33ccff", "#99ff33", "#ffcc00", "#cc33ff"],
  removeDelay = 400,
}: SVGFollowerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const followersRef = useRef<Follower[]>([])
  const animationRef = useRef<number>(0)

  class Follower {
    private points: Point[] = []
    private line: SVGPathElement
    private color: string
    private stage: SVGSVGElement

    constructor(stage: SVGSVGElement, color: string) {
      this.stage = stage
      this.color = color
      this.line = document.createElementNS("http://www.w3.org/2000/svg", "path")
      this.line.style.fill = color
      this.line.style.stroke = color
      this.line.style.strokeWidth = "1.5"
      this.line.style.opacity = "0.7"
      this.stage.appendChild(this.line)
    }

    private getDrift(): number {
      return (Math.random() - 0.5) * 3
    }

    public add(position: Position) {
      const direction = { x: 0, y: 0 }
      if (this.points[0]) {
        direction.x = (position.x - this.points[0].position.x) * 0.25
        direction.y = (position.y - this.points[0].position.y) * 0.25
      }

      const point: Point = {
        position: position,
        time: Date.now(),
        drift: {
          x: this.getDrift() + direction.x / 2,
          y: this.getDrift() + direction.y / 2,
        },
        age: 0,
        direction: direction,
      }

      const shapeChance = Math.random()
      const chance = 0.08
      if (shapeChance < chance) this.makeCircle(point)
      else if (shapeChance < chance * 2) this.makeSquare(point)
      else if (shapeChance < chance * 3) this.makeTriangle(point)

      this.points.unshift(point)
    }

    private createLine(points: Point[]): string {
      const path: string[] = [points.length ? "M" : ""]

      if (points.length > 0) {
        let forward = true
        let i = 0

        while (i >= 0) {
          const point = points[i]
          const offsetX = point.direction.x * ((i - points.length) / points.length) * 0.6
          const offsetY = point.direction.y * ((i - points.length) / points.length) * 0.6
          const x = point.position.x + (forward ? offsetY : -offsetY)
          const y = point.position.y + (forward ? offsetX : -offsetX)
          point.age += 0.2

          path.push(String(x + point.drift.x * point.age))
          path.push(String(y + point.drift.y * point.age))

          i += forward ? 1 : -1
          if (i === points.length) {
            i--
            forward = false
          }
        }
      }

      return path.join(" ")
    }

    public trim() {
      if (this.points.length > 0) {
        const last = this.points[this.points.length - 1]
        const now = Date.now()
        if (last.time < now - removeDelay) {
          this.points.pop()
        }
      }
      this.line.setAttribute("d", this.createLine(this.points))
    }

    private makeCircle(point: Point) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      const radius = Math.max(2, (Math.abs(point.direction.x) + Math.abs(point.direction.y)) * 0.8)
      circle.setAttribute("r", String(radius))
      circle.style.fill = this.color
      circle.setAttribute("cx", "0")
      circle.setAttribute("cy", "0")
      this.moveShape(circle, point)
    }

    private makeSquare(point: Point) {
      const size = Math.max(4, (Math.abs(point.direction.x) + Math.abs(point.direction.y)) * 1.2)
      const square = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      square.setAttribute("width", String(size))
      square.setAttribute("height", String(size))
      square.style.fill = this.color
      this.moveShape(square, point)
    }

    private makeTriangle(point: Point) {
      const size = Math.max(4, (Math.abs(point.direction.x) + Math.abs(point.direction.y)) * 1.2)
      const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
      triangle.setAttribute("points", `0,0 ${size},${size / 2} 0,${size}`)
      triangle.style.fill = this.color
      this.moveShape(triangle, point)
    }

    private moveShape(shape: SVGElement, point: Point) {
      this.stage.appendChild(shape)
      const driftX = point.position.x + point.direction.x * (Math.random() * 20) + point.drift.x * (Math.random() * 10)
      const driftY = point.position.y + point.direction.y * (Math.random() * 20) + point.drift.y * (Math.random() * 10)

      shape.style.transform = `translate(${point.position.x}px, ${point.position.y}px)`
      shape.style.transition = "all 0.5s ease-out"
      shape.style.transformOrigin = "center"

      setTimeout(() => {
        shape.style.transform = `translate(${driftX}px, ${driftY}px) scale(0) rotate(${Math.random() * 360}deg)`
        setTimeout(() => {
          if (this.stage.contains(shape)) {
            this.stage.removeChild(shape)
          }
        }, 500)
      }, 10)
    }
  }

  const animate = useCallback(() => {
    followersRef.current.forEach((follower) => follower.trim())
    animationRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    if (!svgRef.current) return

    // Initialize followers
    followersRef.current = colors.map((color) => new Follower(svgRef.current!, color))

    // Start animation loop
    animate()

    const handleMouseMove = (e: MouseEvent) => {
      const position: Position = {
        x: e.clientX,
        y: e.clientY,
      }
      followersRef.current.forEach((follower) => follower.add(position))
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const position: Position = {
        x: touch.clientX,
        y: touch.clientY,
      }
      followersRef.current.forEach((follower) => follower.add(position))
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
      
      // Cleanup DOM elements
      followersRef.current = []
      if (svgRef.current) {
        svgRef.current.innerHTML = ""
      }
    }
  }, [colors, animate])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    >
      <svg 
        ref={svgRef} 
        className="w-full h-full" 
        xmlns="http://www.w3.org/2000/svg" 
      />
    </div>
  )
}
