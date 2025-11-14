"use client";

import { useState, useEffect } from "react";
import { Plus, Store, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface UMKM {
  id: string;
  name: string;
  category: string;
  thumbnail_url: string | null;
}

export default function UmkmDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [umkmList, setUmkmList] = useState<UMKM[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && umkmList.length === 0) {
      fetchUmkmList();
    }
  }, [isOpen]);

  const fetchUmkmList = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      // Get UMKM with their thumbnail from media
      const { data: umkmData, error: umkmError } = await supabase
        .from("umkm")
        .select("id, name, category")
        .order("created_at", { ascending: false });

      if (umkmError) throw umkmError;

      if (umkmData) {
        // Get thumbnails for each UMKM
        const umkmWithThumbnails = await Promise.all(
          umkmData.map(async (umkm) => {
            const { data: mediaData } = await supabase
              .from("media")
              .select("image_url")
              .eq("umkm_id", umkm.id)
              .eq("is_thumbnail", true)
              .single();

            return {
              ...umkm,
              thumbnail_url: mediaData?.image_url || null,
            };
          })
        );

        setUmkmList(umkmWithThumbnails);
      }
    } catch (error) {
      console.error("Error fetching UMKM:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUmkmClick = (id: string) => {
    router.push(`/umkm/${id}`);
    setIsOpen(false);
  };

  const handleAddNew = () => {
    router.push("/usaha-baru");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center gap-2 bg-[#FF6B35] hover:bg-[#ff8c42] text-white px-4 py-2 rounded-full transition-colors"
      >
        <Plus size={16} />
        <span className="font-medium text-sm">Tambah UMKM</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">
                Kelola UMKM
              </h3>
            </div>

            {/* UMKM List */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-8 text-center">
                  <div className="w-8 h-8 border-3 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Memuat UMKM...</p>
                </div>
              ) : umkmList.length > 0 ? (
                <div className="py-2">
                  {umkmList.map((umkm) => (
                    <button
                      key={umkm.id}
                      onClick={() => handleUmkmClick(umkm.id)}
                      className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {umkm.thumbnail_url ? (
                          <Image
                            src={umkm.thumbnail_url}
                            alt={umkm.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Store size={20} className="text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {umkm.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {umkm.category}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ChevronRight
                        size={16}
                        className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <Store size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Belum ada UMKM</p>
                </div>
              )}
            </div>

            {/* Add New Button */}
            <div className="">
              <Link
                href={'/umkm'}
                className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-[#FF6B35] font-medium text-sm"
              >
                <span>Lihat lebih banyak</span>
              </Link>
            </div>
            <div className="border-t border-gray-100">
              <button
                onClick={handleAddNew}
                className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-[#FF6B35] font-medium text-sm"
              >
                <div className="w-12 h-12 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center flex-shrink-0">
                  <Plus size={20} className="text-[#FF6B35]" />
                </div>
                <span>Tambah UMKM Baru</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}