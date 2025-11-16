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
  ChevronRight,
  ChevronLeft,
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

type TabType = "overview" | "products" | "reviews" | "about";

export default function UmkmDetailSidebar() {
  const [isClient, setIsClient] = useState(false);
  const [umkmDetail, setUmkmDetail] = useState<UmkmDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

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

  const tabs = [
    { id: "overview", label: "Ringkasan" },
    { id: "products", label: "Produk" },
    { id: "reviews", label: "Ulasan" },
    { id: "about", label: "Tentang" },
  ];

  // Gallery Navigation
  const handlePrevImage = () => {
    if (umkmDetail?.media && umkmDetail.media.length > 0) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? umkmDetail.media.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (umkmDetail?.media && umkmDetail.media.length > 0) {
      setSelectedImageIndex((prev) =>
        prev === umkmDetail.media.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Calculate rating distribution
  const getRatingDistribution = () => {
    if (!umkmDetail?.reviews || umkmDetail.reviews.length === 0) {
      return [0, 0, 0, 0, 0];
    }

    const distribution = [0, 0, 0, 0, 0];
    umkmDetail.reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++;
      }
    });

    return distribution;
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

        {/* Tabs Navigation - Sticky at top after header for non-overview tabs */}
        {activeTab !== "overview" && (
          <div className="sticky top-0 bg-white border-b border-gray-200 z-20 flex-shrink-0">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex-1 py-3.5 text-sm font-semibold transition-colors relative ${
                    activeTab === tab.id
                      ? "text-[#FF6B35]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content - Scrollable */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db transparent",
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 text-sm">Memuat detail...</p>
              </div>
            </div>
          ) : umkmDetail ? (
            <>
              {/* Overview Tab - Full Experience */}
              {activeTab === "overview" && (
                <>
                  {/* Image Gallery */}
                  <div className="relative h-64 bg-gray-200 group">
                    {umkmDetail.media && umkmDetail.media.length > 0 ? (
                      <>
                        <Image
                          src={umkmDetail.media[selectedImageIndex].image_url}
                          alt={umkmDetail.name}
                          fill
                          className="object-cover"
                        />

                        {/* Navigation Arrows */}
                        {umkmDetail.media.length > 1 && (
                          <>
                            <button
                              onClick={handlePrevImage}
                              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                            >
                              <ChevronLeft size={20} />
                            </button>
                            <button
                              onClick={handleNextImage}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                            >
                              <ChevronRight size={20} />
                            </button>
                          </>
                        )}

                        {/* Dots Indicator */}
                        {umkmDetail.media.length > 1 && (
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {umkmDetail.media.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedImageIndex(index)}
                                className={`rounded-full transition-all ${
                                  index === selectedImageIndex
                                    ? "bg-white w-6 h-2"
                                    : "bg-white/50 w-2 h-2 hover:bg-white/70"
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
                      <button className="p-2 bg-white/95 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors">
                        <Share2 size={18} className="text-gray-700" />
                      </button>
                      <button className="p-2 bg-white/95 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors">
                        <Heart size={18} className="text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {umkmDetail.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-sm font-medium">
                        {getCategoryIcon(umkmDetail.category, 16)}
                        {umkmDetail.category}
                      </span>
                      {umkmDetail.average_rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star
                            className="text-yellow-400 fill-yellow-400"
                            size={16}
                          />
                          <span className="text-sm font-semibold text-gray-900">
                            {umkmDetail.average_rating.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({umkmDetail.reviews?.length || 0} ulasan)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="px-5 py-4 grid grid-cols-3 gap-3 border-b border-gray-100">
                    <button
                      onClick={handleStartNavigation}
                      className="flex flex-col items-center gap-2 p-3 bg-[#FF6B35]/10 hover:bg-[#FF6B35]/20 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!userLocation}
                    >
                      <Navigation2 className="text-[#FF6B35]" size={22} />
                      <span className="text-xs font-medium text-[#FF6B35]">
                        Navigasi
                      </span>
                    </button>
                    {umkmDetail?.no_telp && (
                      <a
                        href={`tel:${umkmDetail.no_telp}`}
                        className="flex flex-col items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                      >
                        <Phone className="text-blue-600" size={22} />
                        <span className="text-xs font-medium text-blue-600">
                          Telepon
                        </span>
                      </a>
                    )}
                    <button
                      onClick={handleOpenChat}
                      className="flex flex-col items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                    >
                      <MessageCircle className="text-green-600" size={22} />
                      <span className="text-xs font-medium text-green-600">
                        Chat
                      </span>
                    </button>
                  </div>

                  {/* Tabs Navigation for Overview */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                    <div className="flex">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as TabType)}
                          className={`flex-1 py-3.5 text-sm font-semibold transition-colors relative ${
                            activeTab === tab.id
                              ? "text-[#FF6B35]"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          {tab.label}
                          {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Overview Content */}
                  <div className="px-5 py-5 space-y-5">
                    {/* Rating & Review Section */}
                    {umkmDetail.average_rating > 0 && (
                      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="flex items-center gap-1">
                                <span className="text-3xl font-bold text-gray-900">
                                  {umkmDetail.average_rating.toFixed(1)}
                                </span>
                                <Star
                                  className="text-yellow-400 fill-yellow-400"
                                  size={24}
                                />
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {umkmDetail.reviews?.length || 0} ulasan
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handleOpenReviewModal}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-lg text-sm font-medium transition-colors shadow-md"
                          >
                            <Plus size={16} />
                            Tulis Ulasan
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Description Preview */}
                    {umkmDetail.description && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-base">
                          Deskripsi
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                          {umkmDetail.description}
                        </p>
                        <button
                          onClick={() => setActiveTab("about")}
                          className="flex items-center gap-1 text-sm text-[#FF6B35] font-medium mt-3 hover:gap-2 transition-all"
                        >
                          Selengkapnya
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}

                    {/* Address & Phone */}
                    <div className="space-y-4">
                      {umkmDetail.address && (
                        <div className="flex items-start gap-3">
                          <MapPin
                            className="text-gray-400 mt-0.5 flex-shrink-0"
                            size={20}
                          />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Alamat</p>
                            <p className="text-sm text-gray-900 leading-relaxed">
                              {umkmDetail.address}
                            </p>
                          </div>
                        </div>
                      )}

                      {umkmDetail.no_telp && (
                        <div className="flex items-start gap-3">
                          <Phone
                            className="text-gray-400 mt-0.5 flex-shrink-0"
                            size={20}
                          />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Telepon</p>
                            <a
                              href={`tel:${umkmDetail.no_telp}`}
                              className="text-sm text-blue-600 hover:underline font-medium"
                            >
                              {umkmDetail.no_telp}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Operational Hours Preview */}
                    {umkmDetail.operational_hours &&
                      umkmDetail.operational_hours.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-base">
                              <Clock size={18} />
                              Jam Operasional
                            </h4>
                            {umkmDetail.operational_hours.length > 3 && (
                              <button
                                onClick={() => setActiveTab("about")}
                                className="text-[#FF6B35] hover:text-[#ff5722] transition-colors"
                              >
                                <ChevronRight size={20} />
                              </button>
                            )}
                          </div>
                          <div className="space-y-2">
                            {umkmDetail.operational_hours
                              .sort((a, b) => a.day - b.day)
                              .slice(0, 3)
                              .map((hour) => (
                                <div
                                  key={hour.id}
                                  className="flex justify-between items-center py-2"
                                >
                                  <span className="text-sm text-gray-700">
                                    {getDayName(hour.day)}
                                  </span>
                                  <span
                                    className={`text-sm font-medium ${
                                      hour.status === "open"
                                        ? "text-green-600"
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
                          {umkmDetail.operational_hours.length > 3 && (
                            <div className="flex justify-center mt-4">
                              <button
                                onClick={() => setActiveTab("about")}
                                className="px-5 py-2.5 bg-[#FF6B35]/10 hover:bg-[#FF6B35]/20 text-[#FF6B35] rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                              >
                                Lihat Semua Hari
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                    {/* Products Preview */}
                    {umkmDetail.catalog && umkmDetail.catalog.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-base">
                            <ShoppingBag size={18} />
                            Produk & Layanan
                          </h4>
                          <button
                            onClick={() => setActiveTab("products")}
                            className="text-[#FF6B35] hover:text-[#ff5722] transition-colors"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {umkmDetail.catalog.slice(0, 4).map((item) => (
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
                              <div className="p-2.5">
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
                        {umkmDetail.catalog.length > 4 && (
                          <div className="flex justify-center mt-4">
                            <button
                              onClick={() => setActiveTab("products")}
                              className="px-5 py-2.5 bg-[#FF6B35]/10 hover:bg-[#FF6B35]/20 text-[#FF6B35] rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                            >
                              Lihat Semua Produk
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reviews Preview */}
                    {umkmDetail.reviews && umkmDetail.reviews.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 text-base">
                            Ulasan Terbaru
                          </h4>
                          <button
                            onClick={() => setActiveTab("reviews")}
                            className="text-[#FF6B35] hover:text-[#ff5722] transition-colors"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                        <div className="space-y-3">
                          {umkmDetail.reviews.slice(0, 2).map((review) => (
                            <div
                              key={review.id}
                              className="p-3.5 bg-gray-50 rounded-lg border border-gray-100"
                            >
                              {review.full_name && (
                                <h5 className="text-sm font-medium text-gray-900 mb-1.5">
                                  {review.full_name}
                                </h5>
                              )}
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={13}
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
                                <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                                  {review.comment}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                        {umkmDetail.reviews.length > 2 && (
                          <div className="flex justify-center mt-4">
                            <button
                              onClick={() => setActiveTab("reviews")}
                              className="px-5 py-2.5 bg-[#FF6B35]/10 hover:bg-[#FF6B35]/20 text-[#FF6B35] rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                            >
                              Lihat Semua Ulasan
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Social Links */}
                    {umkmDetail.links && umkmDetail.links.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-base">
                          Media Sosial
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {umkmDetail.links.map((link) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                            >
                              {getSocialIcon(link.platform)}
                              <span className="font-medium text-gray-700 capitalize">
                                {link.platform}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Products Tab */}
              {activeTab === "products" && (
                <div className="px-5 py-5">
                  {umkmDetail.catalog && umkmDetail.catalog.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {umkmDetail.catalog.map((item) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="relative h-40 bg-gray-100">
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
                          <div className="p-3">
                            <h5 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1.5 min-h-[40px]">
                              {item.name}
                            </h5>
                            <p className="text-base font-bold text-[#FF6B35]">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <ShoppingBag
                        className="text-gray-300 mx-auto mb-3"
                        size={48}
                      />
                      <p className="text-gray-600 text-sm">
                        Belum ada produk tersedia
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="px-5 py-5">
                  {/* Rating Summary with Bar Chart */}
                  <div className="bg-gradient-to-r from-[#FF6B35]/10 to-orange-50 rounded-xl p-5 mb-5">
                    <div className="flex items-start gap-6">
                      {/* Average Rating */}
                      <div className="text-center flex-shrink-0">
                        <div className="flex items-center gap-2 justify-center mb-1">
                          <span className="text-4xl font-bold text-gray-900">
                            {umkmDetail.average_rating
                              ? umkmDetail.average_rating.toFixed(1)
                              : "0.0"}
                          </span>
                          <Star
                            className="text-yellow-400 fill-yellow-400"
                            size={28}
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          {umkmDetail.reviews?.length || 0} ulasan
                        </p>
                      </div>

                      {/* Rating Distribution Bars */}
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const distribution = getRatingDistribution();
                          const count = distribution[rating - 1];
                          const total = umkmDetail.reviews?.length || 0;
                          const percentage =
                            total > 0 ? (count / total) * 100 : 0;

                          return (
                            <div
                              key={rating}
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-1 w-12">
                                <span className="text-xs font-medium text-gray-700">
                                  {rating}
                                </span>
                                <Star
                                  size={12}
                                  className="text-yellow-400 fill-yellow-400"
                                />
                              </div>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600 w-8 text-right">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Write Review Button */}
                    <div className="mt-4 pt-4 border-t border-orange-200">
                      <button
                        onClick={handleOpenReviewModal}
                        className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-lg text-sm font-medium transition-colors shadow-md"
                      >
                        <Plus size={16} />
                        Tulis Ulasan
                      </button>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {umkmDetail.reviews && umkmDetail.reviews.length > 0 ? (
                    <div className="space-y-3">
                      {umkmDetail.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          {review.full_name && (
                            <h5 className="text-sm font-semibold text-gray-900 mb-2">
                              {review.full_name}
                            </h5>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-0.5">
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
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Star className="text-gray-300 mx-auto mb-3" size={48} />
                      <p className="text-gray-600 text-sm mb-4">
                        Belum ada ulasan
                      </p>
                      <button
                        onClick={handleOpenReviewModal}
                        className="text-[#FF6B35] font-medium text-sm hover:underline"
                      >
                        Jadilah yang pertama memberikan ulasan
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* About Tab */}
              {activeTab === "about" && (
                <div className="px-5 py-5 space-y-6">
                  {/* Full Description */}
                  {umkmDetail.description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-base">
                        Deskripsi Lengkap
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {umkmDetail.description}
                      </p>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 text-base">
                      Informasi Kontak
                    </h4>
                    <div className="space-y-4">
                      {umkmDetail.address && (
                        <div className="flex items-start gap-3">
                          <MapPin
                            className="text-gray-400 mt-0.5 flex-shrink-0"
                            size={20}
                          />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1.5">
                              Alamat
                            </p>
                            <p className="text-sm text-gray-900 leading-relaxed">
                              {umkmDetail.address}
                            </p>
                          </div>
                        </div>
                      )}

                      {umkmDetail.no_telp && (
                        <div className="flex items-start gap-3">
                          <Phone
                            className="text-gray-400 mt-0.5 flex-shrink-0"
                            size={20}
                          />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1.5">
                              Telepon
                            </p>
                            <a
                              href={`tel:${umkmDetail.no_telp}`}
                              className="text-sm text-blue-600 hover:underline font-medium"
                            >
                              {umkmDetail.no_telp}
                            </a>
                          </div>
                        </div>
                      )}

                      {selectedUmkm.distance_km && (
                        <div className="flex items-start gap-3">
                          <Navigation2
                            className="text-gray-400 mt-0.5 flex-shrink-0"
                            size={20}
                          />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1.5">
                              Jarak dari Anda
                            </p>
                            <p className="text-sm font-semibold text-blue-600">
                              {selectedUmkm.distance_km.toFixed(2)} km
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Full Operational Hours */}
                  {umkmDetail.operational_hours &&
                    umkmDetail.operational_hours.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-base">
                          <Clock size={18} />
                          Jam Operasional
                        </h4>
                        <div className="space-y-2">
                          {umkmDetail.operational_hours
                            .sort((a, b) => a.day - b.day)
                            .map((hour) => (
                              <div
                                key={hour.id}
                                className="flex justify-between items-center p-3.5 bg-gray-50 rounded-lg"
                              >
                                <span className="text-sm font-medium text-gray-700">
                                  {getDayName(hour.day)}
                                </span>
                                <span
                                  className={`text-sm font-medium ${
                                    hour.status === "open"
                                      ? "text-green-600"
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

                  {/* Social Media Links */}
                  {umkmDetail.links && umkmDetail.links.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-base">
                        Media Sosial & Website
                      </h4>
                      <div className="space-y-2">
                        {umkmDetail.links.map((link) => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              {getSocialIcon(link.platform)}
                              <span className="text-sm font-medium text-gray-700 capitalize">
                                {link.platform}
                              </span>
                            </div>
                            <ExternalLink
                              size={16}
                              className="text-gray-400 group-hover:text-gray-600 transition-colors"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Photo Gallery */}
                  {umkmDetail.media && umkmDetail.media.length > 1 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-base">
                        Galeri Foto
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {umkmDetail.media.map((media, index) => (
                          <div
                            key={media.id}
                            onClick={() => {
                              setSelectedImageIndex(index);
                              setActiveTab("overview");
                            }}
                            className="relative h-24 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                          >
                            <Image
                              src={media.image_url}
                              alt={`Gallery ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600">Data tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal />

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </>
  );
}