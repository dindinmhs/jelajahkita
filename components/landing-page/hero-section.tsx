"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for fade in effect
  useEffect(() => {
    const currentSection = sectionRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-50 min-h-screen flex items-center justify-center"
    >
      {/* Gradient Background - Canva Style - Static, no animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-0 left-0 w-full h-[45%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 107, 53, 0.15) 50%, rgba(255, 248, 231, 0) 100%)",
          }}
        />
      </div>

      {/* Content with animation */}
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-64 pb-16 z-10">
        {/* Text Content - Centered at Top */}
        <div className="flex flex-col items-center text-center mb-12">
          <h1
            className={`text-[#004E64] text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Temukan Kekayaan Lokal di
            <br />
            Ujung Jarimu
          </h1>
          <p
            className={`text-[#004E64] text-base md:text-lg max-w-2xl mb-8 transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Jelajahi dan dukung ribuan UMKM otentik di sekitarmu, dari kuliner
            hingga kerajinan tangan yang unik.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <Link href="/map">
              <button className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-[#FF6B35] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#FF6B35]/90 transition-colors shadow-md">
                <span className="truncate">Jelajahi UMKM Terdekat</span>
              </button>
            </Link>
            <Link href="/umkm">
              <button className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-white text-[#FF6B35] border-2 border-[#FF6B35] text-base font-bold leading-normal tracking-[0.015em] hover:text-white hover:bg-[#FF6B35] transition-colors shadow-md">
                <span className="truncate">Daftarkan Bisnismu</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Image Container with White Background */}
        <div
          className={`relative w-full max-w-3xl mx-auto transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="rounded-3xl shadow-2xl">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden">
              <Image
                className="w-full h-full object-cover"
                alt="Ilustrasi kios pasar UMKM tradisional Indonesia"
                src="/hero2.png"
                width={800}
                height={500}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
