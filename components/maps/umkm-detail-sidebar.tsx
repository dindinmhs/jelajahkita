"use client";

import { useEffect, useState } from "react";
import { useMapStore } from "@/lib/store/useMapStore";
import { useReviewStore } from "@/lib/store/useReviewStore";
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
  Instagram,
  Facebook,
  Globe as WebIcon,
  ShoppingBag,
  MessageCircle,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { getCategoryIcon } from "@/lib/utils/category-icons";
import { createClient } from "@/lib/supabase/client";
import ReviewModal from "./review-modal";
import { useNavigationStore } from "@/lib/store/useNavigation";
import { useChatStore } from "@/lib/store/useChatStore";

interface UmkmDetail {
  id: string;
  name: string;
  description: string;
  address: string;
  no_telp: string;
  category: string;
  thumbnail: string;
  lat: number;
  lon: number;
  media: Array<{
    id: string;
    image_url: string;
    is_thumbnail: boolean;
  }>;
  catalog: Array<{
    id: string;
    name: string;
    price: number;
    image_url: string;
  }>;
  operational_hours: Array<{
    id: string;
    day: number;
    open: string;
    close: string;
    status: string;
  }>;
  links: Array<{
    id: string;
    platform: string;
    url: string;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    user_id: string;
    created_at: string;
    full_name: string;
  }>;
  average_rating: number;
}

export default function UmkmDetailSidebar() {
  const [isClient, setIsClient] = useState(false);
  const [umkmDetail, setUmkmDetail] = useState<UmkmDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { selectedUmkm, setSelectedUmkm, setSidebarView, userLocation } =
    useMapStore();
  const { openReviewModal } = useReviewStore();
  const { startNavigation } = useNavigationStore();
  const { openChat } = useChatStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!selectedUmkm) return;

    const fetchUmkmDetail = async () => {
      setIsLoading(true);
      const supabase = createClient();

      try {
        const { data, error } = await supabase
          .from("umkm_full_view")
          .select("*")
          .eq("id", selectedUmkm.id)
          .single();

        if (error) {
          console.error("Error fetching UMKM detail:", error);
          return;
        }

        setUmkmDetail(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUmkmDetail();
  }, [selectedUmkm]);

  if (!isClient || !selectedUmkm) return null;

  const handleBack = () => {
    setSelectedUmkm(null);
    setSidebarView("nearby");
  };
  const handleOpenChat = () => {
    if (umkmDetail) {
      openChat(umkmDetail.id, umkmDetail.name);
    }
  };
  const handleOpenReviewModal = () => {
    if (umkmDetail) {
      openReviewModal(umkmDetail.id);
    }
  };

  const handleStartNavigation = () => {
    if (!userLocation) {
      alert("Aktifkan lokasi Anda terlebih dahulu untuk navigasi");
      return;
    }

    if (umkmDetail) {
      startNavigation(umkmDetail.name, [umkmDetail.lon, umkmDetail.lat]);
    }
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
    return days[day] || `Hari ${day}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="absolute inset-0 left-0 top-0 w-96 bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header with Back Button - Fixed */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-gradient-to-r from-[#FF6B35] to-[#ff8c42] flex-shrink-0">
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
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 text-sm">Memuat detail...</p>
              </div>
            </div>
          ) : umkmDetail ? (
            <>
              {/* Image Gallery */}
              <div className="relative h-64 bg-gray-200">
                {umkmDetail.media && umkmDetail.media.length > 0 ? (
                  <>
                    <Image
                      src={umkmDetail.media[selectedImageIndex].image_url}
                      alt={umkmDetail.name}
                      fill
                      className="object-cover"
                    />
                    {umkmDetail.media.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {umkmDetail.media.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === selectedImageIndex
                                ? "bg-white w-6"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : umkmDetail.thumbnail ? (
                  <Image
                    src={umkmDetail.thumbnail}
                    alt={umkmDetail.name}
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
                  <h3 className="text-2xl font-bold text-gray-900">
                    {umkmDetail.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-sm font-medium">
                      {getCategoryIcon(umkmDetail.category, 16)}
                      {umkmDetail.category}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div>
                    {umkmDetail.average_rating ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-2xl font-bold text-gray-900">
                            {umkmDetail.average_rating.toFixed(1)}
                          </span>
                          <Star
                            className="text-yellow-400 fill-yellow-400"
                            size={20}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          ({umkmDetail.reviews?.length || 0} ulasan)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Star className="text-gray-300" size={20} />
                        <span className="text-sm text-gray-500">
                          Belum ada ulasan
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Add Review Button */}
                  <button
                    onClick={handleOpenReviewModal}
                    className="flex items-center gap-1 px-3 py-2 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus size={16} />
                    Review
                  </button>
                </div>

                {/* Quick Actions */}
                 <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleStartNavigation}
                    className="flex flex-col items-center gap-1 p-3 bg-[#FF6B35]/10 hover:bg-[#FF6B35]/20 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!userLocation}
                  >
                    <Navigation2 className="text-[#FF6B35]" size={20} />
                    <span className="text-xs font-medium text-[#FF6B35]">
                      Navigasi
                    </span>
                  </button>
                  {umkmDetail?.no_telp && (
                    <a
                      href={`tel:${umkmDetail.no_telp}`}
                      className="flex flex-col items-center gap-1 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      <Phone className="text-blue-600" size={20} />
                      <span className="text-xs font-medium text-blue-600">
                        Telepon
                      </span>
                    </a>
                  )}
                  <button
                    onClick={handleOpenChat}
                    className="flex flex-col items-center gap-1 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                  >
                    <MessageCircle className="text-green-600" size={20} />
                    <span className="text-xs font-medium text-green-600">Chat</span>
                  </button>
                </div>

                {/* Description */}
                {umkmDetail.description && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Deskripsi
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {umkmDetail.description}
                    </p>
                  </div>
                )}

                {/* Distance */}
                {selectedUmkm.distance_km && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                    <Navigation2 className="text-blue-600" size={18} />
                    <div>
                      <p className="text-xs text-gray-600">
                        Jarak dari lokasi Anda
                      </p>
                      <p className="font-semibold text-blue-600">
                        {selectedUmkm.distance_km.toFixed(2)} km
                      </p>
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-3">
                  {umkmDetail.address && (
                    <div className="flex items-start gap-3">
                      <MapPin
                        className="text-gray-400 mt-1 flex-shrink-0"
                        size={18}
                      />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Alamat</p>
                        <p className="text-sm text-gray-900">
                          {umkmDetail.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {umkmDetail.no_telp && (
                    <div className="flex items-start gap-3">
                      <Phone
                        className="text-gray-400 mt-1 flex-shrink-0"
                        size={18}
                      />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Telepon</p>
                        <a
                          href={`tel:${umkmDetail.no_telp}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {umkmDetail.no_telp}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Operational Hours */}
                {umkmDetail.operational_hours &&
                  umkmDetail.operational_hours.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Clock size={18} />
                        Jam Operasional
                      </h4>
                      <div className="space-y-2">
                        {umkmDetail.operational_hours
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

                {/* Social Links */}
                {umkmDetail.links && umkmDetail.links.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Media Sosial
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {umkmDetail.links.map((link) => (
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

                {/* Catalog */}
                {umkmDetail.catalog && umkmDetail.catalog.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ShoppingBag size={18} />
                      Produk & Layanan
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {umkmDetail.catalog.map((item) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="relative h-32 bg-gray-100">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag
                                  className="text-gray-400"
                                  size={32}
                                />
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <h5 className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </h5>
                            <p className="text-sm font-bold text-[#FF6B35] mt-1">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {umkmDetail.reviews && umkmDetail.reviews.length > 0 ? (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Ulasan</h4>
                    <div className="space-y-3">
                      {umkmDetail.reviews.slice(0, 3).map((review) => (
                        <div
                          key={review.id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          {review.full_name && (
                            <h3 className="text-sm font-medium text-gray-900 mb-1">
                              {review.full_name}
                            </h3>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={
                                    i < review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDate(review.created_at)}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-gray-700">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      ))}
                      {umkmDetail.reviews.length > 3 && (
                        <button className="text-sm text-[#FF6B35] font-medium hover:underline">
                          Lihat semua ulasan ({umkmDetail.reviews.length})
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 rounded-xl text-center">
                    <Star className="text-gray-300 mx-auto mb-2" size={32} />
                    <p className="text-sm text-gray-600 mb-3">
                      Belum ada ulasan untuk UMKM ini
                    </p>
                    <button
                      onClick={handleOpenReviewModal}
                      className="text-sm text-[#FF6B35] font-medium hover:underline"
                    >
                      Jadilah yang pertama memberikan ulasan
                    </button>
                  </div>
                )}

                {/* Photo Gallery */}
                {umkmDetail.media && umkmDetail.media.length > 1 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Galeri Foto
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {umkmDetail.media.map((media, index) => (
                        <div
                          key={media.id}
                          onClick={() => setSelectedImageIndex(index)}
                          className="relative h-24 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                        >
                          <Image
                            src={media.image_url}
                            alt={`Gallery ${index + 1}`}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600">Data tidak ditemukan</p>
            </div>
          )}
        </div>

        {/* Bottom Action Button - Fixed */}
        {umkmDetail && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button className="w-full bg-[#FF6B35] hover:bg-[#ff5722] text-white font-semibold py-3 rounded-xl transition-colors">
              Pesan Online
            </button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal />
    </>
  );
}