"use client";
import React from "react";
import { ScaninHeader } from "@/components/ui/scanin-header";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { HowItWorks } from "@/components/ui/how-it-works";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleScanClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push("/scan");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#0a0a0a]">
      <ScaninHeader />

      <div className="flex flex-col overflow-hidden pb-10 sm:pb-16 md:pb-24 lg:pb-32 pt-24 sm:pt-32 md:pt-40">
        <ContainerScroll
          titleComponent={
            <div className="pb-6 sm:pb-10 md:pb-16 lg:pb-24 px-4 sm:px-6">
              <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold text-white leading-snug">
                Ubah Catatan Tulisan Tangan <br />
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-[6rem] font-bold mt-1 inline-block leading-none">
                  Jadi PDF Rapi
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 mt-4 sm:mt-5 max-w-2xl mx-auto leading-relaxed">
                Scanin membantu kamu mengubah catatan tulisan tangan menjadi dokumen PDF yang rapi dan terstruktur secara otomatis.
              </p>
              <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10">
                <button 
                  onClick={handleScanClick}
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-[11px] sm:text-xs md:text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200"
                >
                  Mulai Scan
                </button>
                <button className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-[11px] sm:text-xs md:text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200">
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>
          }
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="mx-auto rounded-lg sm:rounded-xl md:rounded-2xl object-contain w-full h-auto bg-[#111] shadow-2xl"
          >
            <source src="/preview.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </ContainerScroll>
      </div>
      
      <HowItWorks />
    </main>
  );
}
