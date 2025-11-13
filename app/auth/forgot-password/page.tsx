"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setMessage(
        "Link reset kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk dan folder spam."
      );
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
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
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-88px)] px-4 sm:px-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
            {/* Icon & Title */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#FF6B35] to-[#FFA62B] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Lupa Kata Sandi?
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                Masukkan email Anda dan kami akan mengirimkan link untuk reset
                kata sandi
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 text-sm sm:text-base border-gray-200 text-black focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                    placeholder="Masukkan alamat email"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6B35] hover:bg-[#ff8c42] text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-lg"
              >
                {isLoading ? "Mengirim..." : "Kirim Link Reset"}
              </Button>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-500 hover:text-[#FF6B35] transition-colors"
                >
                  ← Kembali ke halaman masuk
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
