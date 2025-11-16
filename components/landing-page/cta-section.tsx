"use client";

import Link from "next/link";
import Image from "next/image";

export function CTASection() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
      <div className="relative overflow-hidden rounded-3xl bg-gray-50 p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Content */}
          <div className="order-2 md:order-1">
            <span className="inline-block border-2 border-[#FF6B35] text-[#FF6B35] px-5 py-2 rounded-full text-sm font-semibold mb-6">
              Platform Terpercaya
            </span>
            <h2 className="text-[#2c3e50] text-3xl md:text-4xl font-black mb-4 leading-tight">
              Kembangkan Bisnis Lokal Anda Bersama Kami
            </h2>
            <p className="text-[#5a6c7d] text-base md:text-lg mb-8 leading-relaxed">
              JelajahKita membantu UMKM lokal mencapai lebih banyak pelanggan
              dengan tools marketing digital yang mudah digunakan. Gratis tanpa
              biaya tersembunyi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/map">
                <button className="w-full sm:w-auto bg-[#FF6B35] text-white border-2 border-[#FF6B35] px-8 py-3.5 rounded-full text-base font-semibold hover:bg-[#ff8c42] hover:border-[#ff8c42] transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg">
                  Mulai Sekarang
                </button>
              </Link>
              <Link href="#featured">
                <button className="w-full sm:w-auto bg-white text-[#FF6B35] border-2 border-[#FF6B35] px-8 py-3.5 rounded-full text-base font-semibold hover:bg-[#FF6B35] hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg">
                  Lihat Demo
                </button>
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="order-1 md:order-2 relative">
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&h=600&fit=crop"
                alt="UMKM dan bisnis lokal"
                width={800}
                height={600}
                className="w-full h-72 md:h-80 object-cover"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6B35]/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
