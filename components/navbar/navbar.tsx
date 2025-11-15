"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AuthButton } from "../auth-button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed left-0 right-0 z-50 px-0 transition-all duration-700 ease-out"
      style={{
        top: isScrolled ? "1rem" : "0",
        paddingLeft: isScrolled ? "1rem" : "0",
        paddingRight: isScrolled ? "1rem" : "0",
      }}
    >
      <div
        className="mx-auto transition-all duration-700 ease-out"
        style={{
          maxWidth: isScrolled ? "72rem" : "100%",
        }}
      >
        <nav
          className="bg-white/70 backdrop-blur-md transition-all duration-1000 ease-out border border-white/20"
          style={{
            borderRadius: isScrolled ? "9999px" : "0",
            boxShadow: isScrolled
              ? "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
              : "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          }}
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <Link className="flex items-center" href="/">
                <Image
                  src="/logo.png"
                  alt="UMKM Lokal Logo"
                  width={240}
                  height={160}
                  className="h-14 w-auto"
                  priority
                />
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
              <Link
                className="text-[16px] font-medium text-[#004E64] hover:text-[#FF6B35] transition-colors"
                href="/"
              >
                Beranda
              </Link>
              <Link
                className="text-[16px] font-medium text-[#004E64] hover:text-[#FF6B35] transition-colors"
                href="#categories"
              >
                Kategori
              </Link>
              <Link
                className="text-[16px] font-medium text-[#004E64] hover:text-[#FF6B35] transition-colors"
                href="#about"
              >
                Tentang
              </Link>
              <Link
                className="text-[16px] font-medium text-[#004E64] hover:text-[#FF6B35] transition-colors"
                href="#register"
              >
                Daftar Bisnis
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <AuthButton />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
