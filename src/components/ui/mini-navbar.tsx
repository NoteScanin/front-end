"use client";

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const defaultTextColor = 'text-gray-300';
  const hoverTextColor = 'text-white';
  const textSizeClass = 'text-sm font-medium';

  return (
    <a href={href} className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-300 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </a>
  );
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 80) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logoElement = (
    <a href="/" className="flex items-center gap-2 group shrink-0">
      <div className="relative flex items-center justify-center h-8">
        <svg
          width="48"
          height="24"
          viewBox="0 0 48 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white transition-transform duration-300 group-hover:scale-105"
          style={{ filter: 'drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.5))' }}
        >
          <path
            d="M 6 18 C 10 18 16 6 12 6 C 8 6 6 14 10 18 C 14 22 18 12 22 12 C 24 12 26 18 30 18 C 34 18 38 12 42 10"
            stroke="url(#gradient-logo)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="gradient-logo" x1="6" y1="6" x2="42" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#9ca3af" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-wider">
        Scanin
      </span>
    </a>
  );

  const navLinksData = [
    { label: 'Home', href: '/' },
    { label: 'Cara Kerja', href: '#cara-kerja' },
    { label: 'Mulai Scan', href: '/scan' },
  ];

  const loginButtonElement = (
    <button className="px-4 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200 shrink-0 w-full sm:w-auto">
      Masuk
    </button>
  );

  const signupButtonElement = (
    <div className="relative group shrink-0 w-full sm:w-auto">
       <div className="absolute inset-0 -m-1.5 rounded-full
                     hidden sm:block
                     bg-gray-100
                     opacity-30 filter blur-lg pointer-events-none
                     transition-all duration-300 ease-out
                     group-hover:opacity-50 group-hover:blur-xl group-hover:-m-2"></div>
       <button className="relative z-10 px-4 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-white hover:to-gray-200 transition-all duration-200 w-full sm:w-auto">
         Daftar
       </button>
    </div>
  );

  return (
    <motion.header
      initial={false}
      animate={{
        ...(mounted ? { width: isMobile ? "calc(100vw - 2rem)" : (isScrolled ? "90vw" : "max-content") } : {}),
        borderRadius: isOpen ? "1rem" : "9999px",
        backgroundColor: isScrolled ? "rgba(10, 10, 10, 0.85)" : "rgba(20, 20, 20, 0.4)",
        borderColor: isScrolled ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.08)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col px-4 sm:px-6 py-3 backdrop-blur-md border overflow-hidden max-w-[1200px] w-[calc(100vw-2rem)] sm:w-max"
    >
      <div className="flex items-center justify-between w-full">
        {/* Left: Logo */}
        <div className="flex items-center flex-1 justify-start">
           {logoElement}
        </div>

        {/* Center: Nav */}
        <nav className="hidden sm:flex items-center justify-center space-x-8 text-sm px-8 shrink-0">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        {/* Right: CTA Desktop */}
        <div className="hidden sm:flex items-center justify-end gap-3 flex-1">
          {loginButtonElement}
          {signupButtonElement}
        </div>

        {/* Right: Hamburger Mobile */}
        <div className="sm:hidden flex items-center justify-end flex-1">
          <button 
            className="flex items-center justify-center w-8 h-8 text-gray-300 hover:text-white transition-colors focus:outline-none" 
            onClick={toggleMenu} 
            aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {isOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              )}
            </motion.div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="sm:hidden flex flex-col items-center w-full"
          >
            <div className="pt-6 pb-2 w-full border-t border-white/10 mt-4">
              <nav className="flex flex-col items-center space-y-4 text-sm w-full font-medium">
                {navLinksData.map((link) => (
                  <a key={link.href} href={link.href} className="text-gray-300 hover:text-white transition-colors w-full text-center py-2" onClick={() => setIsOpen(false)}>
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="flex flex-col items-center space-y-3 mt-6 w-full px-4">
                <div className="w-full flex justify-center">{loginButtonElement}</div>
                <div className="w-full flex justify-center">{signupButtonElement}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
