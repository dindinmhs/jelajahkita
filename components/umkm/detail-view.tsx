"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Star,
  Edit2,
  ExternalLink,
  Instagram,
  Facebook,
  Globe as WebIcon,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface Media {
  id: string;
  image_url: string;
  is_thumbnail: boolean;
}

interface OperationalHour {
  id: string;
  day: number;
  open: string;
  close: string;
  status: string;
}

interface UmkmLink {
  id: string;
  platform: string;
  url: string;
}

interface Catalog {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

interface UmkmData {
  id: string;
  name: string;
  description: string;
  address: string;
  no_telp: string;
  category: string;
  lat: number;
  lon: number;
  media: Media[];
  operational_hours: OperationalHour[];
  umkm_links: UmkmLink[];
  catalog: Catalog[];
}

interface DetailViewProps {
  umkmData: UmkmData;
}

export default function DetailView({ umkmData }: DetailViewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const getDayName = (day: number) => {
    const days: { [key: number]: string } = {
      1: "Senin",
      2: "Selasa",
      3: "Rabu",
      4: "Kamis",
      5: "Jumat",
      6: "Sabtu",
      7: "Minggu",
    };
    return days[day] || "";
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram size={18} />;
      case "facebook":
        return <Facebook size={18} />;
      case "website":
        return <WebIcon size={18} />;
      default:
        return <ExternalLink size={18} />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === umkmData.media.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? umkmData.media.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/umkm">
              <button className="flex items-center gap-2 text-gray-700 hover:text-[#FF6B35] font-medium transition-all">
                <ArrowLeft size={20} />
                Kembali ke Dashboard
              </button>
            </Link>
            <Link href={`/umkm/${umkmData.id}/edit`}>
              <button className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#ff5722] text-white px-4 py-2 rounded-xl transition-all">
                <Edit2 size={18} />
                Edit
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Image Gallery */}
          {umkmData.media && umkmData.media.length > 0 && (
            <div className="relative h-96 bg-gray-200">
              <Image
                src={umkmData.media[selectedImageIndex].image_url}
                alt={umkmData.name}
                fill
                className="object-cover"
              />
              {umkmData.media.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft size={24} className="text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight size={24} className="text-gray-800" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {umkmData.media.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === selectedImageIndex
                            ? "bg-white w-8"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Header Info */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {umkmData.name}
                </h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {umkmData.category}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {umkmData.description}
              </p>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informasi Kontak
                </h3>
                {umkmData.address && (
                  <div className="flex items-start gap-3">
                    <MapPin
                      className="text-gray-400 mt-1 flex-shrink-0"
                      size={18}
                    />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Alamat</p>
                      <p className="text-sm text-gray-900">
                        {umkmData.address}
                      </p>
                    </div>
                  </div>
                )}
                {umkmData.no_telp && (
                  <div className="flex items-start gap-3">
                    <Phone
                      className="text-gray-400 mt-1 flex-shrink-0"
                      size={18}
                    />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Telepon</p>
                      <a
                        href={`tel:${umkmData.no_telp}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {umkmData.no_telp}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Operational Hours */}
              {umkmData.operational_hours &&
                umkmData.operational_hours.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock size={18} />
                      Jam Operasional
                    </h3>
                    <div className="space-y-2">
                      {umkmData.operational_hours
                        .sort((a, b) => a.day - b.day)
                        .map((hour) => (
                          <div
                            key={hour.id}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {getDayName(hour.day)}
                            </span>
                            <span
                              className={`text-sm ${
                                hour.status === "open"
                                  ? "text-green-600 font-medium"
                                  : "text-red-600"
                              }`}
                            >
                              {hour.status === "open"
                                ? `${hour.open} - ${hour.close}`
                                : "Tutup"}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Social Links */}
            {umkmData.umkm_links && umkmData.umkm_links.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Media Sosial
                </h3>
                <div className="flex flex-wrap gap-3">
                  {umkmData.umkm_links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {getSocialIcon(link.platform)}
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {link.platform}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Catalog/Products */}
            {umkmData.catalog && umkmData.catalog.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBag size={18} />
                  Produk & Layanan
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {umkmData.catalog.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {item.image_url && (
                        <div className="relative h-32 bg-gray-100">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-3">
                        <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-[#FF6B35] font-bold text-sm">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
