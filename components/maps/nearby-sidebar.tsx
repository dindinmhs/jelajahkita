"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MapPin, Navigation2 } from "lucide-react";
import Image from "next/image";
import { useMapStore } from "@/lib/store/useMapStore";
import { getCategoryIcon } from "@/lib/utils/category-icons";
import { motion, AnimatePresence } from "framer-motion";

interface UMKM {
  id: string;
  name: string;
  category: string;
  thumbnail_url: string | null;
  distance_km?: number;
}

export default function NearbySidebar() {
  const [isClient, setIsClient] = useState(false);

  const {
    isSidebarOpen,
    sidebarView,
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
          user_lat: userLocation[1],
          user_lon: userLocation[0],
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
    <>
      {/* ✅ Sidebar Panel with Animation - No separate toggle button */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-24 left-4 bottom-4 w-80 z-40 flex flex-col overflow-hidden"
          >
            {/* Header Card */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/95 shadow-md backdrop-blur-md rounded-2xl p-4 mb-3"
            >
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-[#FF6B35] to-[#ff8c42] p-2 rounded-lg">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Usaha Terdekat</h2>
                  {filteredUmkm.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {filteredUmkm.length} UMKM ditemukan
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Content Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex-1 rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {isLoadingNearby ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 text-sm">Mencari UMKM terdekat...</p>
                  </div>
                ) : !userLocation ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <MapPin className="text-gray-400" size={32} />
                    </div>
                    <p className="text-gray-600 text-sm px-4 font-medium">
                      Aktifkan lokasi untuk melihat UMKM terdekat
                    </p>
                  </div>
                ) : filteredUmkm.length === 0 ? (
                  <div className="flex bg-white shadow-md flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 rounded-full mb-4">
                      <MapPin className="text-gray-400" size={32} />
                    </div>
                    <p className="text-gray-600 text-sm px-4 font-medium">
                      Tidak ada UMKM ditemukan di sekitar Anda
                    </p>
                    <p className="text-gray-400 text-xs px-4 mt-2">
                      Coba ubah kategori atau perluas area pencarian
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredUmkm.map((umkm, index) => (
                      <motion.div
                        key={umkm.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleUmkmClick(umkm)}
                        className="bg-white rounded-xl p-3 shadow-md hover:scale-[1.02] transition-all cursor-pointer group border border-gray-100"
                      >
                        <div className="flex gap-3">
                          <div className="relative w-20 h-20 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
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
                            <div className="flex items-center gap-1 mt-2 bg-orange-50 rounded-full px-2 py-1 w-fit">
                              <Navigation2 className="text-[#FF6B35]" size={12} />
                              <span className="text-xs font-semibold text-[#FF6B35]">
                                {(umkm.distance_km ?? 0).toFixed(2)} km
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </>
  );
}