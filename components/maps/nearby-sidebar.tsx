"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MapPin, Navigation2, X } from "lucide-react";
import Image from "next/image";
import { useMapStore } from "@/lib/store/useMapStore";
import { getCategoryIcon } from "@/lib/utils/category-icons";

interface UMKM {
  id: string;
  name: string;
  category: string;
  thumbnail_url: string | null;
  distance_km: number;
}

export default function NearbySidebar() {
  const [isClient, setIsClient] = useState(false);

  const {
    isSidebarOpen,
    sidebarView,
    toggleSidebar,
    nearbyUmkm,
    setNearbyUmkm,
    isLoadingNearby,
    setLoadingNearby,
    userLocation,
    selectedCategory,
    setSelectedUmkm,
  } = useMapStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !userLocation) return;

    const fetchNearbyUmkm = async () => {
      setLoadingNearby(true);
      const supabase = createClient();

      try {
        const { data, error } = await supabase.rpc("get_nearby_umkm", {
          // UBAH: userLocation sekarang [lon, lat], jadi perlu dibalik untuk database
          user_lat: userLocation[1], // lat adalah index 1
          user_lon: userLocation[0], // lon adalah index 0
          max_result: 20,
        });

        if (error) {
          console.error("Error fetching nearby UMKM:", error);
          return;
        }

        if (data) {
          setNearbyUmkm(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoadingNearby(false);
      }
    };

    fetchNearbyUmkm();
  }, [isClient, userLocation, setNearbyUmkm, setLoadingNearby]);

  if (!isClient) return null;
  if (!isSidebarOpen) return null;
  if (sidebarView !== "nearby") return null;

  const filteredUmkm =
    selectedCategory === "Semua"
      ? nearbyUmkm
      : nearbyUmkm.filter(
          (umkm) =>
            umkm.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const handleUmkmClick = (umkm: UMKM) => {
    setSelectedUmkm(umkm);
  };

  return (
    <div className="absolute top-20 left-4 bottom-4 w-80 bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-[#FF6B35] to-[#ff8c42]">
        <div className="flex items-center gap-2">
          <MapPin className="text-white" size={20} />
          <h2 className="text-lg font-bold text-white">Usaha Terdekat</h2>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="text-white" size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoadingNearby ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-sm">Mencari UMKM terdekat...</p>
          </div>
        ) : !userLocation ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MapPin className="text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-sm px-4">
              Aktifkan lokasi untuk melihat UMKM terdekat
            </p>
          </div>
        ) : filteredUmkm.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MapPin className="text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-sm px-4">
              Tidak ada UMKM ditemukan di sekitar Anda
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUmkm.map((umkm) => (
              <div
                key={umkm.id}
                onClick={() => handleUmkmClick(umkm)}
                className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-lg hover:border-[#FF6B35] transition-all cursor-pointer group"
              >
                <div className="flex gap-3">
                  <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {umkm.thumbnail_url ? (
                      <Image
                        src={umkm.thumbnail_url}
                        alt={umkm.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="text-gray-400" size={32} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-[#FF6B35] transition-colors">
                      {umkm.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      {getCategoryIcon(umkm.category, 12)}
                      <p className="text-xs text-gray-500">{umkm.category}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Navigation2 className="text-[#FF6B35]" size={14} />
                      <span className="text-xs font-medium text-[#FF6B35]">
                        {umkm.distance_km.toFixed(2)} km
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredUmkm.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            Menampilkan {filteredUmkm.length} UMKM terdekat
          </p>
        </div>
      )}
    </div>
  );
}