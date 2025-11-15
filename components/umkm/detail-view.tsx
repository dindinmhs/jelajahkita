"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Star, ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";

const MiniMap = dynamic(() => import("./mini-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-gray-500">Memuat peta...</p>
      </div>
    </div>
  ),
});

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

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  full_name: string;
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
  review: Review[];
}

interface DetailViewProps {
  umkmData: UmkmData;
}

export default function DetailView({ umkmData }: DetailViewProps) {
  const avgRating =
    umkmData.review && umkmData.review.length > 0
      ? umkmData.review.reduce((sum, r) => sum + r.rating, 0) /
        umkmData.review.length
      : 0;
  const reviewCount = umkmData.review?.length || 0;

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/umkm">
                <button className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft size={24} />
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {umkmData.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  {avgRating > 0 && (
                    <>
                      <div className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="text-sm font-semibold text-gray-900">
                          {avgRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({reviewCount} Ulasan)
                      </span>
                      <span className="text-gray-300">•</span>
                    </>
                  )}
                  <span className="text-sm text-gray-600">
                    {umkmData.address?.split(",")[0] || umkmData.address}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/umkm/${umkmData.id}/edit`}>
                <button className="px-5 py-2 bg-[#FF6B35] hover:bg-[#ff5722] text-white font-medium rounded-full transition-colors text-sm">
                  Edit
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            {umkmData.media && umkmData.media.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900">
                    Galeri Foto
                  </h3>
                  <Link
                    href="#"
                    className="text-sm text-[#FF6B35] hover:text-[#ff5722] font-medium"
                  >
                    Lihat Semua
                  </Link>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {umkmData.media.slice(0, 5).map((media, index) => (
                    <div
                      key={media.id}
                      className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <Image
                        src={media.image_url}
                        alt={`${umkmData.name} - ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About This Business */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Tentang Bisnis Ini
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {umkmData.description}
              </p>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Lokasi</h3>
              {umkmData.lat && umkmData.lon ? (
                <>
                  <Link
                    href={`/map?lat=${umkmData.lat}&lng=${umkmData.lon}&umkm=${umkmData.id}`}
                  >
                    <div className="relative h-48 rounded-xl mb-4 overflow-hidden cursor-pointer group">
                      <MiniMap
                        lat={umkmData.lat}
                        lon={umkmData.lon}
                        name={umkmData.name}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-4 py-2 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">
                            Klik untuk lihat di peta
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href={`/map?lat=${umkmData.lat}&lng=${umkmData.lon}&umkm=${umkmData.id}`}
                  >
                    <button className="w-full py-2.5 bg-[#FF6B35] hover:bg-[#ff5722] text-white font-medium rounded-lg transition-colors text-sm">
                      Lihat di Peta
                    </button>
                  </Link>
                </>
              ) : (
                <div className="relative h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin
                        size={32}
                        className="text-gray-400 mx-auto mb-2"
                      />
                      <p className="text-sm text-gray-500">
                        Lokasi tidak tersedia
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Reviews */}
            {umkmData.review && umkmData.review.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900">
                    Ulasan Pelanggan
                  </h3>
                  <Link
                    href={`/umkm/${umkmData.id}/reviews`}
                    className="text-sm text-[#FF6B35] hover:text-[#ff5722] font-medium"
                  >
                    Lihat semua ulasan
                  </Link>
                </div>
                <div className="space-y-4">
                  {umkmData.review.slice(0, 2).map((review) => (
                    <div
                      key={review.id}
                      className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFA62B] flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {review.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {review.full_name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(review.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact & Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                Kontak & Info
              </h3>
              <div className="space-y-4">
                {umkmData.no_telp && (
                  <div className="flex items-start gap-3">
                    <Phone
                      size={18}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <a
                      href={`tel:${umkmData.no_telp}`}
                      className="text-sm text-blue-600 hover:underline font-medium"
                    >
                      {umkmData.no_telp}
                    </a>
                  </div>
                )}
                {umkmData.umkm_links && umkmData.umkm_links.length > 0 && (
                  <div className="flex items-start gap-3">
                    <ExternalLink
                      size={18}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      {umkmData.umkm_links.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline block"
                        >
                          {link.platform}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {umkmData.address && (
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-sm text-gray-600">{umkmData.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Operational Hours */}
            {umkmData.operational_hours &&
              umkmData.operational_hours.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">
                    Jam Operasional
                  </h3>
                  <div className="space-y-2.5">
                    {umkmData.operational_hours
                      .sort((a, b) => a.day - b.day)
                      .map((hour) => (
                        <div
                          key={hour.id}
                          className="flex justify-between items-center text-sm py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-gray-700 font-medium">
                            {getDayName(hour.day)}
                          </span>
                          <span
                            className={`font-semibold ${
                              hour.status === "open"
                                ? "text-gray-800"
                                : "text-red-500"
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

            {/* Products */}
            {umkmData.catalog && umkmData.catalog.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">
                  Produk
                </h3>
                <div className="space-y-3">
                  {umkmData.catalog.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {item.image_url && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-[#FF6B35] font-semibold">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
