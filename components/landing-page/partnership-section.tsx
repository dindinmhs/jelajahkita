"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const partnerships = [
  {
    title: "Tahun ke-5",
    description:
      "Jelajahkita telah dipercaya dalam membantu ribuan UMKM lokal berkembang selama 5 tahun. Dari kuliner hingga kerajinan, kami terus mendukung wirausaha Indonesia untuk menjangkau pasar lebih luas.",
  },
  {
    title: "Tahun ke-3",
    description:
      "Kemitraan dengan berbagai pemerintah daerah untuk mempromosikan produk lokal unggulan. Program ini membantu UMKM mendapatkan sertifikasi dan akses ke pasar yang lebih besar di seluruh Indonesia.",
  },
  {
    title: "Tahun ke-4",
    description:
      "Kolaborasi dengan komunitas digital dan startup teknologi untuk memberikan solusi pembayaran digital dan manajemen bisnis modern. Memudahkan UMKM bertransformasi digital dengan mudah.",
  },
  {
    title: "Tahun ke-6",
    description:
      "Jelajahkita terus berinovasi dengan menghadirkan fitur baru seperti live streaming untuk produk, sistem rating pelanggan, dan program loyalty untuk meningkatkan kepercayaan dan penjualan UMKM lokal.",
  },
];

export function PartnershipSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative w-full bg-gray-50 py-20 overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Cg fill='%23FF6B35' fill-opacity='0.15'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm5 5h30v30H25V25z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Content - Title & Description */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-[#004E64] text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4">
            Jelajahkita
            <br />
            <span className="text-[#FF6B35]">Punya Cerita!</span>
          </h2>
          <p className="text-[#5a6c7d] text-base md:text-lg leading-relaxed mb-6">
            Telusuri perjalanan panjang Jelajahkita dalam mendukung UMKM lokal
            Indonesia, sebuah misi nyata untuk ekonomi digital yang inklusif dan
            berkelanjutan.
          </p>

          <Link href="#about">
            <button className="px-8 py-3 bg-transparent border-2 border-[#004E64] text-[#004E64] rounded-full hover:bg-[#004E64] hover:text-white transition-all duration-300 font-semibold">
              Pelajari Lebih Lanjut
            </button>
          </Link>
        </div>

        {/* Bottom Content - Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerships.map((item, index) => (
            <div
              key={index}
              className={`relative bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-[#FF6B35] hover:shadow-xl ${
                activeIndex === index ? "border-[#FF6B35] shadow-lg" : ""
              }`}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <h3 className="text-[#004E64] text-xl font-bold mb-3">
                {item.title}
              </h3>
              <p className="text-[#5a6c7d] text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
