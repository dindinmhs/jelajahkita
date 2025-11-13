import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/bg-auth-jelajahkita.jpeg"
          alt="UMKM and local business - Success"
          fill
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/60"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center min-h-screen px-4 sm:px-6">
        <div className="flex-1 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-16">
          {/* Left Side - Success Message - Hidden on Mobile */}
          <div className="hidden lg:block flex-1 text-white text-left">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold leading-tight">SELAMAT!</h1>
                  <p className="text-2xl text-white/80">Pendaftaran berhasil</p>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <p className="text-xl text-white/90 leading-relaxed">
                  Terima kasih telah bergabung dengan Jelajahkita! Bersama-sama
                  kita akan menjelajahi dan mendukung UMKM lokal di seluruh
                  Indonesia.
                </p>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-white mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Verifikasi Email Diperlukan
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Kami telah mengirimkan email konfirmasi ke alamat email
                        Anda. Silakan periksa kotak masuk (atau folder spam) dan
                        klik link aktivasi untuk mengaktifkan akun Anda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-white/60 text-sm">
                <span>
                  Mari mulai perjalanan menjelajahi UMKM lokal Indonesia
                </span>
              </div>
            </div>
          </div>

          {/* Success Steps - Centered on Mobile */}
          <div className="w-full max-w-sm sm:max-w-md lg:w-96 mx-auto lg:mx-0 mt-0 lg:mt-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#FF6B35] to-[#FFA62B] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl text-gray-900 font-bold mb-2">
                  Akun Terdaftar!
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm">
                  Langkah selanjutnya untuk memulai
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Next Steps */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        Verifikasi Email
                      </p>
                      <p className="text-xs text-gray-600">
                        Periksa email dan klik link aktivasi
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        Masuk ke Akun
                      </p>
                      <p className="text-xs text-gray-600">
                        Login dengan email dan password Anda
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        Mulai Eksplorasi
                      </p>
                      <p className="text-xs text-gray-600">
                        Jelajahi UMKM lokal di berbagai kategori
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6">
                  <Button
                    asChild
                    className="w-full bg-[#FF6B35] hover:bg-[#ff8c42] text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-lg"
                  >
                    <Link href="/auth/login">Lanjut ke Login</Link>
                  </Button>

                  <div className="text-center text-gray-400 text-xs sm:text-sm">
                    atau
                  </div>

                  <div className="text-center text-xs sm:text-sm">
                    <span className="text-gray-600">
                      Tidak menerima email?{" "}
                    </span>
                    <Link
                      href="/auth/sign-up"
                      className="text-[#FF6B35] hover:text-[#ff8c42] font-medium transition-colors"
                    >
                      Daftar Ulang
                    </Link>
                  </div>

                  <div className="text-center">
                    <Link
                      href="/"
                      className="text-sm text-gray-500 hover:text-[#FF6B35] transition-colors"
                    >
                      ← Kembali ke Beranda
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
