import Link from "next/link";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/bg-auth-jelajahkita.jpeg"
          alt="Error page background"
          fill
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/60"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 sm:p-5">
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-3">
            <div className="w-36 rounded-2xl flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Jelajahkita Logo"
                width={400}
                height={400}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="text-[#FF6B35] font-medium border-white rounded-full bg-white hover:bg-gray-50 hover:text-[#a53208] text-sm sm:text-base px-3 sm:px-4"
          >
            <span className="hidden sm:inline">Butuh Bantuan</span>
            <span className="sm:hidden">Bantuan</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-88px)] px-4 sm:px-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
            {/* Icon & Title */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Terjadi Kesalahan
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                Maaf, terjadi kesalahan pada sistem. Silakan coba lagi atau
                hubungi tim support jika masalah berlanjut.
              </p>
            </div>

            {/* Error Message */}
            <div className="space-y-4 mb-6">
              {params?.error ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Kode error: {params.error}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Terjadi kesalahan yang tidak terduga</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                href="/auth/login"
                className="w-full bg-[#FF6B35] hover:bg-[#ff8c42] text-white py-2.5 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                Kembali ke Login
              </Link>

              <div className="text-center space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-gray-400 text-sm">atau</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Butuh bantuan? </span>
                    <Link
                      href="/"
                      className="text-[#FF6B35] hover:text-[#ff8c42] font-medium transition-colors"
                    >
                      Hubungi Support
                    </Link>
                  </div>
                  <div>
                    <span className="text-gray-600">Atau coba </span>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-[#FF6B35] hover:text-[#ff8c42] font-medium transition-colors"
                    >
                      Muat Ulang Halaman
                    </button>
                  </div>
                  <div>
                    <Link
                      href="/"
                      className="text-gray-500 hover:text-[#FF6B35] transition-colors"
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
