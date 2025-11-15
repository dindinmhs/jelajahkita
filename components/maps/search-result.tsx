"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useMapStore } from "@/lib/store/useMapStore";
import Image from "next/image";
import { MapPin, Star, Navigation2 } from "lucide-react";
import { getCategoryIcon, getCategoryColor } from "@/lib/utils/category-icons";

interface SearchResult {
  id: string;
  name: string;
  category: string;
  address: string;
  thumbnail: string | null;
  average_rating: number | null;
  lon: number;
  lat: number;
}

export default function SearchResultsDropdown() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { searchQuery, selectedCategory, setSelectedUmkm, userLocation } =
    useMapStore();

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      const supabase = createClient();

      try {
        let query = supabase
          .from("umkm_full_view")
          .select("id, name, category, address, thumbnail, average_rating, lon, lat")
          .ilike("name", `%${searchQuery}%`);

        // Apply category filter if not "Semua"
        if (selectedCategory !== "Semua") {
          query = query.eq("category", selectedCategory);
        }

        const { data, error } = await query.limit(5);

        if (error) {
          console.error("Error fetching search results:", error);
          return;
        }

        setResults(data || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, selectedCategory]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calculateDistance = (lat: number, lon: number): number | null => {
    if (!userLocation) return null;

    const [userLon, userLat] = userLocation;
    const R = 6371; // Earth's radius in km

    const dLat = ((lat - userLat) * Math.PI) / 180;
    const dLon = ((lon - userLon) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSelectUmkm = (umkm: SearchResult) => {
    const distance = calculateDistance(umkm.lat, umkm.lon);
    setSelectedUmkm({
      id: umkm.id,
      name: umkm.name,
      category: umkm.category,
      thumbnail_url: umkm.thumbnail,
      distance_km: distance || undefined,
      lon: umkm.lon,
      lat: umkm.lat,
    });
    setIsOpen(false);
  };

  if (!isOpen || (!isLoading && results.length === 0 && !searchQuery.trim())) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white shadow-xl rounded-xl overflow-hidden z-50 max-h-[400px] overflow-y-auto border border-gray-200"
    >
      {isLoading ? (
        <div className="p-4 text-center">
          <div className="w-6 h-6 border-3 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-gray-600">Mencari...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="py-1">
          {results.map((umkm) => {
            const distance = calculateDistance(umkm.lat, umkm.lon);
            const categoryColor = getCategoryColor(umkm.category);

            return (
              <button
                key={umkm.id}
                onClick={() => handleSelectUmkm(umkm)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex gap-2 items-center">
                  {/* Compact Thumbnail */}
                  <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {umkm.thumbnail ? (
                      <Image
                        src={umkm.thumbnail}
                        alt={umkm.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="text-gray-400" size={20} />
                      </div>
                    )}
                  </div>

                  {/* Compact Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-medium text-sm text-gray-900 truncate group-hover:text-[#FF6B35] transition-colors">
                        {umkm.name}
                      </h4>
                      {/* Category Icon */}
                      <div
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: categoryColor }}
                      >
                        <span className="text-white">
                          {getCategoryIcon(umkm.category, 12)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      {/* Rating */}
                      {umkm.average_rating ? (
                        <div className="flex items-center gap-0.5">
                          <Star
                            className="text-yellow-400 fill-yellow-400"
                            size={12}
                          />
                          <span className="font-medium text-gray-900">
                            {umkm.average_rating.toFixed(1)}
                          </span>
                        </div>
                      ) : null}

                      {/* Distance */}
                      {distance !== null && (
                        <div className="flex items-center gap-0.5">
                          <Navigation2 className="text-gray-400" size={12} />
                          <span>{distance.toFixed(1)} km</span>
                        </div>
                      )}

                      {/* Category */}
                      <span className="text-gray-500">{umkm.category}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-4 text-center">
          <MapPin className="text-gray-300 mx-auto mb-1" size={24} />
          <p className="text-xs text-gray-600">Tidak ada hasil</p>
        </div>
      )}
    </div>
  );
}