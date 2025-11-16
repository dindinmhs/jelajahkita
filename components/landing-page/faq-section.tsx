"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  isVisible: boolean;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
  index,
  isVisible,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`border border-[#FF6B35]/20 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-[#FFF8E7]/50 transition-colors duration-300 group"
      >
        <h3 className="text-lg font-bold text-[#004E64] pr-4 group-hover:text-[#FF6B35] transition-colors">
          {question}
        </h3>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FFA62B] flex items-center justify-center transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <span className="material-symbols-outlined text-white !text-lg">
            expand_more
          </span>
        </div>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
      >
        <div className="px-6 pb-6 pt-0">
          <div className="border-t border-[#FF6B35]/10 pt-4">
            <p className="text-[#60584C] leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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
        rootMargin: "0px 0px -100px 0px",
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

  const faqs = [
    {
      question: "Apa itu Jelajahkita dan bagaimana cara kerjanya?",
      answer:
        "Jelajahkita adalah platform digital yang menghubungkan Anda dengan UMKM lokal di sekitar. Cukup buka aplikasi, cari UMKM berdasarkan kategori atau lokasi, dan temukan produk serta jasa berkualitas dari para pelaku usaha lokal. Anda bisa melihat detail bisnis, rating, dan lokasi mereka di peta interaktif.",
    },
    {
      question: "Apakah Jelajahkita gratis untuk digunakan?",
      answer:
        "Ya! Jelajahkita sepenuhnya gratis untuk pengguna yang ingin mencari dan mengeksplorasi UMKM lokal. Untuk pelaku usaha yang ingin mendaftarkan bisnis mereka, kami juga menyediakan paket gratis dengan fitur dasar, serta paket premium untuk fitur lebih lengkap seperti promosi dan analitik.",
    },
    {
      question: "Bagaimana cara mendaftarkan bisnis UMKM saya?",
      answer:
        "Mendaftarkan bisnis Anda sangat mudah! Klik tombol \"Daftarkan Bisnismu\" di halaman utama, isi formulir dengan informasi bisnis seperti nama, kategori, lokasi, dan foto produk. Setelah verifikasi, bisnis Anda akan langsung muncul di peta dan dapat ditemukan oleh ribuan pengguna Jelajahkita.",
    },
    {
      question: "Kategori UMKM apa saja yang tersedia di Jelajahkita?",
      answer:
        "Jelajahkita mendukung berbagai kategori UMKM termasuk Kuliner (makanan & minuman), Kerajinan Tangan (handmade & crafts), Fashion (pakaian & aksesoris), Jasa (reparasi, salon, dll), dan Produk Agrikultur (sayuran, buah, hasil tani). Kami terus menambah kategori sesuai kebutuhan komunitas lokal.",
    },
    {
      question: "Bagaimana cara menemukan UMKM terdekat dari lokasi saya?",
      answer:
        "Jelajahkita dilengkapi dengan fitur peta interaktif yang menampilkan UMKM di sekitar Anda secara real-time. Aktifkan lokasi pada perangkat Anda, dan aplikasi akan otomatis menampilkan UMKM terdekat beserta jarak dan rute menuju lokasi tersebut. Anda juga bisa filter berdasarkan kategori untuk hasil yang lebih spesifik.",
    },
    {
      question: "Apakah data dan informasi bisnis saya aman?",
      answer:
        "Keamanan data adalah prioritas kami. Semua informasi bisnis dan data pengguna dienkripsi dengan standar keamanan tinggi. Kami tidak membagikan data pribadi Anda kepada pihak ketiga tanpa izin. Data bisnis yang ditampilkan hanya informasi publik yang memang Anda izinkan untuk dipublikasikan.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 relative overflow-hidden bg-gray-50"
      ref={sectionRef}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div
          className={`absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-[#FF6B35]/10 to-[#FFA62B]/10 rounded-full blur-3xl transition-all duration-1000 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        ></div>
        <div
          className={`absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-[#FFA62B]/10 to-[#FFF8E7]/20 rounded-full blur-3xl transition-all duration-1200 delay-300 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        ></div>

        {/* Floating Elements */}
        <div
          className={`absolute top-40 left-1/4 w-6 h-6 bg-[#FF6B35] rounded-full animate-bounce transition-all duration-800 delay-500 ${
            isVisible ? "opacity-60 scale-100" : "opacity-0 scale-0"
          }`}
        ></div>
        <div
          className={`absolute bottom-1/3 right-1/4 w-8 h-8 border-2 border-[#FFA62B] rotate-45 animate-pulse transition-all duration-800 delay-700 ${
            isVisible ? "opacity-40 scale-100" : "opacity-0 scale-0"
          }`}
        ></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16">
          <div
            className={`inline-flex items-center space-x-2 backdrop-blur-sm rounded-full px-6 py-2 border-2 border-[#FF6B35]/80 transition-all duration-800 ${
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-4 scale-95"
            }`}
          >
            <span className="material-symbols-outlined text-[#FF6B35] !text-xl">
              help
            </span>
            <span className="text-medium font-bold text-[#FF6B35]">
              Pertanyaan yang Sering Diajukan
            </span>
          </div>

          <h2
            className={`text-4xl lg:text-5xl font-black text-[#004E64] leading-tight transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Pertanyaan
            <span className="bg-gradient-to-r from-[#FF6B35] via-[#FFA62B] to-[#FFA62B] bg-clip-text text-transparent">
              {" "}
              Umum
            </span>
          </h2>

          <p
            className={`text-lg text-[#60584C] max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Temukan jawaban untuk pertanyaan yang sering diajukan tentang
            platform Jelajahkita
          </p>
        </div>

        {/* FAQ Content with Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Image */}
          <div
            className={`hidden lg:block transition-all duration-1000 delay-600 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="sticky top-32">
              <Image
                src="/question4.png"
                alt="FAQ Illustration"
                width={600}
                height={600}
                className="w-full h-auto rounded-2xl"
                priority
              />
            </div>
          </div>

          {/* Right Side - FAQ Items */}
          <div
            className={`space-y-4 transition-all duration-1000 delay-600 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
