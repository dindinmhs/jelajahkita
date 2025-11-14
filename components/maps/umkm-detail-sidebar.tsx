"use client";

import { useEffect, useState } from "react";
import { useMapStore } from "@/lib/store/useMapStore";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Star,
  Navigation2,
  Share2,
  Heart,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { getCategoryIcon } from "@/lib/utils/category-icons";

export default function UmkmDetailSidebar() {
  const [isClient, setIsClient] = useState(false);
  const { selectedUmkm, setSelectedUmkm, setSidebarView } = useMapStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !selectedUmkm) return null;

  const handleBack = () => {
    setSelectedUmkm(null);
    setSidebarView("nearby");
  };

  // Dummy data
  const dummyData = {
    rating: 4.5,
    reviewCount: 612,
    description:
      "Tempat nongkrong nyaman dengan suasana hangat, menyajikan berbagai Kopi khas, camilan lezat. Cocok untuk bersantai, bekerja, atau berkumpul bersama teman.",
    phone: "+62 812-3456-7890",
    address: "Jl. Raya Contoh No. 123, Jakarta Selatan",
    hours: "08:00 - 22:00",
    images: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
      "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400",
    ],
  };

  return (
    <div className="absolute top-20 left-4 bottom-4 w-96 bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden">
      {/* Header with Back Button */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-gradient-to-r from-[#FF6B35] to-[#ff8c42]">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h2 className="text-lg font-bold text-white">Detail UMKM</h2>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Image Gallery */}
        <div className="relative h-48 bg-gray-200">
          {selectedUmkm.thumbnail_url ? (
            <Image
              src={selectedUmkm.thumbnail_url}
              alt={selectedUmkm.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="text-gray-400" size={48} />
            </div>
          )}
          {/* Action Buttons Overlay */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
              <Share2 size={18} className="text-gray-700" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
              <Heart size={18} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 space-y-4">
          {/* Title & Category */}
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {selectedUmkm.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-xs font-medium">
                {getCategoryIcon(selectedUmkm.category, 14)}
                {selectedUmkm.category}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-gray-900">
                {dummyData.rating}
              </span>
              <Star className="text-yellow-400 fill-yellow-400" size={20} />
            </div>
            <span className="text-sm text-gray-600">
              ({dummyData.reviewCount})
            </span>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button className="flex flex-col items-center gap-1 p-3 bg-[#FF6B35]/10 hover:bg-[#FF6B35]/20 rounded-xl transition-colors">
              <Navigation2 className="text-[#FF6B35]" size={20} />
              <span className="text-xs font-medium text-[#FF6B35]">
                Navigasi
              </span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
              <Phone className="text-blue-600" size={20} />
              <span className="text-xs font-medium text-blue-600">
                Telepon
              </span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
              <ExternalLink className="text-green-600" size={20} />
              <span className="text-xs font-medium text-green-600">
                Website
              </span>
            </button>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Deskripsi</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {dummyData.description}
            </p>
          </div>

          {/* Distance */}
          {selectedUmkm.distance_km && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
              <Navigation2 className="text-blue-600" size={18} />
              <div>
                <p className="text-xs text-gray-600">Jarak dari lokasi Anda</p>
                <p className="font-semibold text-blue-600">
                  {selectedUmkm.distance_km.toFixed(2)} km
                </p>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="text-gray-400 mt-1" size={18} />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Alamat</p>
                <p className="text-sm text-gray-900">{dummyData.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-gray-400 mt-1" size={18} />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Telepon</p>
                <p className="text-sm text-gray-900">{dummyData.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="text-gray-400 mt-1" size={18} />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Jam Buka</p>
                <p className="text-sm text-gray-900">{dummyData.hours}</p>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Galeri Foto</h4>
            <div className="grid grid-cols-3 gap-2">
              {dummyData.images.map((img, index) => (
                <div
                  key={index}
                  className="relative h-24 bg-gray-200 rounded-lg overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button className="w-full bg-[#FF6B35] hover:bg-[#ff5722] text-white font-semibold py-3 rounded-xl transition-colors">
          Pesan Online
        </button>
      </div>
    </div>
  );
}