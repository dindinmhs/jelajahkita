"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";

const LandingMiniMap = dynamic(() => import("./landing-mini-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Memuat peta...</p>
      </div>
    </div>
  ),
});

interface UMKM {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  image: string;
  lat: number;
  lon: number;
}

interface MapSectionClientProps {
  umkmList: UMKM[];
}

export default function MapSectionClient({ umkmList }: MapSectionClientProps) {
  const [activeUMKM, setActiveUMKM] = useState<string | null>(null);

  const handleMarkerClick = (umkmId: string) => {
    setActiveUMKM(umkmId);
    // Scroll to UMKM card
    const element = document.getElementById(`umkm-${umkmId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <div className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-[#181511] text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            Jelajahi UMKM di Sekitarmu
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Lihat lokasi UMKM secara langsung di peta dan temukan permata
            tersembunyi di dekat Anda.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Map Container */}
          <div className="w-full lg:w-3/5">
            <div
              className="relative w-full rounded-xl shadow-lg overflow-hidden"
              style={{ height: "500px" }}
              onWheel={(e) => e.stopPropagation()}
            >
              <LandingMiniMap
                umkmList={umkmList}
                onMarkerClick={handleMarkerClick}
                activeUmkm={activeUMKM}
              />
            </div>
          </div>

          {/* UMKM List - Right Side */}
          <div
            className="w-full lg:w-2/5 flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
            onWheel={(e) => e.stopPropagation()}
          >
            {umkmList.slice(0, 5).map((umkm) => (
              <div
                key={umkm.id}
                id={`umkm-${umkm.id}`}
                className={`bg-white rounded-xl p-5 shadow-md hover:shadow-xl cursor-pointer border-2 ${
                  activeUMKM === umkm.id
                    ? "border-[#ff6b35]"
                    : "border-transparent"
                }`}
                onMouseEnter={() => setActiveUMKM(umkm.id)}
                onMouseLeave={() => setActiveUMKM(null)}
                onClick={() => handleMarkerClick(umkm.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                    <Image
                      src={umkm.image}
                      alt={umkm.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="text-[#1C160C] text-lg font-bold">
                          {umkm.name}
                        </h3>
                        <p className="text-[#60584C] text-sm">
                          {umkm.category}
                        </p>
                      </div>
                      {umkm.rating > 0 && (
                        <div className="flex items-center gap-1 bg-[#FFF8E7] px-2 py-1 rounded-md flex-shrink-0">
                          <span className="material-symbols-outlined !text-base text-[#FFA62B]">
                            star
                          </span>
                          <span className="text-[#1C160C] text-sm font-medium">
                            {umkm.rating}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-[#60584C] text-sm mt-2 line-clamp-2">
                      {umkm.description}
                    </p>
                    <Link
                      href={`/map?lat=${umkm.lat}&lng=${umkm.lon}&umkm=${umkm.id}`}
                    >
                      <button className="text-[#FF6B35] text-sm font-semibold mt-3 hover:text-[#FF6B35]/80 transition-colors flex items-center gap-1">
                        Lihat Detail
                        <span className="material-symbols-outlined !text-base">
                          chevron_right
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #bdbdbd;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #636161;
        }
      `}</style>
    </div>
  );
}
