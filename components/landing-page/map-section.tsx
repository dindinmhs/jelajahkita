"use client";

import Image from "next/image";
import { useState } from "react";

const umkmList = [
  {
    id: 1,
    name: "Kedai Kopi Senja",
    category: "Kuliner",
    rating: 4.8,
    description:
      "Nikmati secangkir kopi berkualitas dengan suasana yang nyaman dan tenang.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2aKt8FgDAKWSNomHM0fnIPC_Op_gI65FFIFFoVXZe8YaW0gmix68HgPrSKpJEqI35F9NRBK8YdYsjO2_XcRFMtk9fN5S6WXFVqLcA9qw0I8tO0fwffwYEyVtSfZtso2A0_bGeLSqEgF1fOXcZkw99RlbMxSA8V5m9xSQbJUDRDeLGLyTuTC1swG6jRmEZSgOKUeTpzhwgiY4yS6wu6sdUrt6niFhxga8tP69NHuvot54_K19NgOS-lDCFgEMBUosCfTIeGSg_yOdd",
  },
  {
    id: 2,
    name: "Bengkel Jaya Abadi",
    category: "Jasa",
    rating: 4.9,
    description:
      "Solusi perbaikan kendaraan Anda dengan mekanik terpercaya dan harga bersahabat.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3ICXrkzaXkwMRiPZvNgY0IckV4dcQ6-T6NbLP60-UAI6iv6Olm6KUfDlZBiPmBN_xBS4SDaJrPWE3lfQfq0iub8EGEn5YLMzf2rrbtfZLJRIZLDYDYXsn0ePHRJvtpSd_tjtLIuR3jQMvLHQx1es8tOMaMK_nTOAukKPer2EHpAyly-MyJyE6pCDMqJ1Z-4U4NLJv0f5SIbbPhr4LP-_9mjDWfTH-YBhj4nFh4KMxuLbiL6fGCe6Eil6NFH2tvMdBfAOtl2608Hma",
  },
];

const mapMarkers = [
  {
    id: 1,
    name: "Pizza Enak",
    category: "Kuliner",
    rating: 4.8,
    top: "25%",
    left: "25%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDg7IBof-mPVZC6xKwnDWqNCHeQLwWqcNZA2u6EgvZelacS8p8VTyZBEGwVkcvMLBFBdGCTa7tbF1NC8NRdON1cGtjm5gwzZp0yJ6zpLy7yhnZmpYVWcIatv7p8NUbhXj8eiPhNsdFS3paY6eBzOSOzZtALYnK2pfwQQhiO1FSgYNejYZD4JLszpMbYSnwQw9mU-5yIWHSKUf_lzWbb6HKLC1Xfbbx-zPxnFWxdPmbuEO0CBcfKhFE_nrCeCKKyHA8mDFeaV6-5MeGJ",
  },
  {
    id: 2,
    name: "Sneakers Keren",
    category: "Fashion",
    rating: 4.9,
    top: "66%",
    left: "75%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2aKt8FgDAKWSNomHM0fnIPC_Op_gI65FFIFFoVXZe8YaW0gmix68HgPrSKpJEqI35F9NRBK8YdYsjO2_XcRFMtk9fN5S6WXFVqLcA9qw0I8tO0fwffwYEyVtSfZtso2A0_bGeLSqEgF1fOXcZkw99RlbMxSA8V5m9xSQbJUDRDeLGLyTuTC1swG6jRmEZSgOKUeTpzhwgiY4yS6wu6sdUrt6niFhxga8tP69NHuvot54_K19NgOS-lDCFgEMBUosCfTIeGSg_yOdd",
  },
];

export function MapSection() {
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [activeUMKM, setActiveUMKM] = useState<number | null>(null);

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

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Map Container */}
          <div className="w-full lg:w-3/5">
            <div className="relative w-full aspect-video rounded-xl shadow-lg overflow-hidden">
              <Image
                alt="Map Illustration"
                className="w-full h-full object-cover"
                src="/peta.png"
                fill
                style={{ objectFit: "cover" }}
              />

              {/* Map Markers */}
              {mapMarkers.map((marker) => (
                <div
                  key={marker.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 cursor-pointer"
                  style={{ top: marker.top, left: marker.left }}
                  onMouseEnter={() => setActiveMarker(marker.id)}
                  onMouseLeave={() => setActiveMarker(null)}
                >
                  <Image
                    className="w-14 h-14 rounded-md object-cover"
                    alt={marker.name}
                    src={marker.image}
                    width={56}
                    height={56}
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {marker.name}
                    </h4>
                    <p className="text-xs text-gray-500">{marker.category}</p>
                    <div className="flex items-center text-xs text-yellow-500">
                      <span className="material-symbols-outlined !text-sm">
                        star
                      </span>{" "}
                      {marker.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UMKM List - Right Side */}
          <div className="w-full lg:w-2/5 flex flex-col gap-4">
            {umkmList.map((umkm) => (
              <div
                key={umkm.id}
                className={`bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                  activeUMKM === umkm.id
                    ? "border-[#FF6B35] scale-105"
                    : "border-transparent"
                }`}
                onMouseEnter={() => setActiveUMKM(umkm.id)}
                onMouseLeave={() => setActiveUMKM(null)}
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
                      <div className="flex items-center gap-1 bg-[#FFF8E7] px-2 py-1 rounded-md flex-shrink-0">
                        <span className="material-symbols-outlined !text-base text-[#FFA62B]">
                          star
                        </span>
                        <span className="text-[#1C160C] text-sm font-medium">
                          {umkm.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-[#60584C] text-sm mt-2 line-clamp-2">
                      {umkm.description}
                    </p>
                    <button className="text-[#FF6B35] text-sm font-semibold mt-3 hover:text-[#FF6B35]/80 transition-colors flex items-center gap-1">
                      Lihat Detail
                      <span className="material-symbols-outlined !text-base">
                        chevron_right
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
