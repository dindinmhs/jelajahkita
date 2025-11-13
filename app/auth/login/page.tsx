"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Masuk...");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    setLoadingMessage("Masuk...");

    const loginTimeout = setTimeout(() => {
      setError("Login timeout. Silakan coba lagi.");
      setIsLoading(false);
      setLoadingMessage("Masuk...");
    }, 10000);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setLoadingMessage("Memuat...");

      if (data.session) {
        setLoadingMessage("Mengalihkan...");

        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData.session) {
          clearTimeout(loginTimeout);
          router.replace("/protected");

          setTimeout(() => {
            window.location.href = "/protected";
          }, 100);
        } else {
          throw new Error("Session tidak dapat diverifikasi");
        }
      } else {
        throw new Error("Session tidak dapat dibuat");
      }
    } catch (error: unknown) {
      clearTimeout(loginTimeout);
      setError(
        error instanceof Error ? error.message : "Terjadi kesalahan saat masuk"
      );
    } finally {
      setIsLoading(false);
      setLoadingMessage("Masuk...");
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/bg-auth-jelajahkita.jpeg"
          alt="UMKM and local business"
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
      <div className="relative z-10 flex items-center min-h-[calc(100vh-88px)] px-4 sm:px-6">
        <div className="flex-1 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-16">
          {/* Left Side - Hero Text & Stats */}
          <div className="hidden lg:block flex-1 text-white text-left">
            <h1 className="text-6xl mb-8 leading-tight font-black">
              <span className="bg-gradient-to-r from-[#ff4a08] via-[#FFA62B] to-[#ffd8a2] bg-clip-text text-transparent">
                TEMUKAN
              </span>{" "}
              UMKM
              <br />
              <span className="bg-gradient-to-r from-[#ff4a08] via-[#FFA62B] to-[#ffd8a2] bg-clip-text text-transparent">
                LOKAL
              </span>{" "}
              <span className="bg-[#ffd8a2] bg-clip-text text-transparent">
                TE
              </span>
              RBAIK!
            </h1>

            {/* Statistics */}
            <div className="flex items-end gap-12 mb-8">
              <div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-8xl">500</span>
                  <span className="text-3xl mb-2">+</span>
                </div>
                <p className="text-white/80 text-sm leading-tight max-w-[120px]">
                  UMKM Lokal
                  <br />
                  Terdaftar dan
                  <br />
                  Terverifikasi
                </p>
              </div>

              <div className="-mt-8">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-8xl">4.8</span>
                  <span className="text-2xl mb-2">/5.0</span>
                </div>
                <p className="text-white/80 text-sm leading-tight max-w-[120px]">
                  Rating
                  <br />
                  Rata-rata
                  <br />
                  dari pengguna
                  <br />
                  yang puas
                </p>
              </div>

              <div className="mb-2">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-8xl">10</span>
                  <span className="text-3xl mb-2">+</span>
                </div>
                <p className="text-white/80 text-sm leading-tight max-w-[120px]">
                  Kategori
                  <br />
                  Bisnis
                  <br />
                  dari kuliner hingga
                  <br />
                  kerajinan tangan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span>
                Mari dukung UMKM lokal dan ekonomi Indonesia bersama-sama
              </span>
            </div>
          </div>

          {/* Login Form */}
          <div className="w-full max-w-sm sm:max-w-md lg:w-96 mx-auto lg:mx-0">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  Masuk ke Jelajahkita
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm">
                  Belum punya akun?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="text-[#FF6B35] hover:underline"
                  >
                    Daftar disini
                  </Link>
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 sm:pl-10 text-sm border-gray-200 text-black sm:text-base focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                      placeholder="Masukkan alamat email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 sm:pl-10 pr-10 text-sm border-gray-200 text-black sm:text-base focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                      placeholder="Masukkan password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FF6B35] hover:bg-[#ff8c42] text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-lg"
                >
                  {isLoading ? loadingMessage : "Masuk"}
                </Button>

                {/* Forgot Password */}
                <div className="text-center">
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs sm:text-sm text-gray-500 hover:text-[#FF6B35] transition-colors"
                  >
                    Lupa password?
                  </Link>
                </div>

                {/* Terms */}
                <p className="text-xs text-center text-gray-500 leading-relaxed">
                  Dengan masuk, Anda menyetujui{" "}
                  <a href="#" className="text-[#FF6B35] hover:underline">
                    Syarat & Ketentuan
                  </a>{" "}
                  kami tentang{" "}
                  <a href="#" className="text-[#FF6B35] hover:underline">
                    Keamanan
                  </a>{" "}
                  dan{" "}
                  <a href="#" className="text-[#FF6B35] hover:underline">
                    Kebijakan Privasi
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
