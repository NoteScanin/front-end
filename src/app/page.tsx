"use client";
import React from "react";
import { Navbar } from "@/components/ui/mini-navbar";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#0a0a0a]">
      <Navbar />

      <div className="flex flex-col overflow-hidden pb-[500px] pt-[80px]">
        <ContainerScroll
          titleComponent={
            <div className="pb-20 md:pb-24">
              <h1 className="text-4xl font-semibold text-white">
                Ubah Catatan Tulisan Tangan <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                  Jadi PDF Rapi
                </span>
              </h1>
              <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
                Scanin membantu kamu mengubah catatan tulisan tangan menjadi dokumen PDF yang rapi dan terstruktur secara otomatis.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
                <button className="px-6 py-3 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200">
                  Mulai Scan
                </button>
                <button className="px-6 py-3 text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200">
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>
          }
        >
          <Image
            src="https://ui.aceternity.com/_next/image?url=%2Flinear.webp&w=3840&q=75"
            alt="Scanin Preview"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </main>
  );
}
