"use client";

import Link from "next/link";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import UserProfile from "./auth/user-profile";
import { useUserStore } from "@/lib/store/user-store";

export function AuthButton() {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    // Listen perubahan auth
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser]);

  return user ? (
    <div className="flex items-center gap-4">
      <UserProfile
        displayName={user.user_metadata.email}
        email={user.email}
      />
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <Link href="/auth/login">
        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-5 bg-white text-[#FF6B35] border-2 border-[#FF6B35] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#FF6B35] hover:text-white transition-colors">
          <span className="truncate">Masuk</span>
        </button>
      </Link>
      <Link href="/auth/sign-up">
        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-5 bg-[#FF6B35] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#ff8c42] transition-colors shadow-md">
          <span className="truncate">Daftar</span>
        </button>
      </Link>
    </div>
  );
}
