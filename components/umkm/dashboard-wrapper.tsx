"use client";

import { useState } from "react";
import Avatar from "@/components/common/avatar";
import {
  MapPin,
  Calendar,
  Mail,
  Phone,
  Edit2,
  Store,
  Star,
  Eye,
  MessageCircle,
  ArrowLeft,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface UMKM {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  status: string;
  rating?: number;
  reviewCount?: number;
  thumbnail?: string;
}

interface DashboardWrapperProps {
  userData: {
    fullName: string;
    email: string;
    phone?: string;
    createdAt: string;
  };
  stats: {
    savedPlaces: number;
    myBusinesses: number;
    reviews: number;
    trips: number;
  };
  umkmList: UMKM[];
  categoryData: { category: string; count: number }[];
  reviewRatingData: { rating: number; count: number }[];
}

export default function DashboardWrapper({
  userData,
  stats,
  umkmList,
  categoryData,
  reviewRatingData,
}: DashboardWrapperProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      published: {
        label: "Dipublikasi",
        className: "bg-green-100 text-green-700",
      },
      pending: {
        label: "Menunggu Review",
        className: "bg-yellow-100 text-yellow-700",
      },
      draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/map">
            <button className="flex items-center gap-2 text-xl text-gray-700 hover:text-[#FF6B35] font-bold transition-all">
              <ArrowLeft size={25} />
              Dashboard UMKM
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <Avatar
                    displayName={userData.fullName || "User"}
                    size="lg"
                    className="w-20 h-20 text-xl"
                  />
                </div>

                {/* Name */}
                <h2 className="text-xl font-bold text-gray-800 mb-1 text-center">
                  {userData.fullName || "Nama Belum Diatur"}
                </h2>

                {/* Username */}
                <p className="text-sm text-gray-500 mb-4">
                  @
                  {userData.fullName?.toLowerCase().replace(/\s+/g, "") ||
                    "username"}
                </p>

                {/* Badge */}
                <div className="mb-6">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#FF6B35] to-[#FFA62B] text-white text-xs font-medium rounded-full">
                    <Store size={12} />
                    Explorer
                  </span>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 text-center mb-6 px-2">
                  Passionate foodie & weekend traveler.
                </p>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 mb-4" />

                {/* Contact Info */}
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} className="text-gray-400" />
                    <span className="truncate">{userData.email}</span>
                  </div>
                  {userData.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} className="text-gray-400" />
                      <span>{userData.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span>
                      Bergabung sejak {formatDate(userData.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 my-4" />

                {/* Profile Button */}
                <Link href="/profile" className="w-full">
                  <button className="w-full bg-[#FF6B35] hover:shadow-lg text-white font-semibold py-2.5 px-4 rounded-xl transition-all">
                    Lihat Profil
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="text-gray-500 text-sm mb-1">
                  Tempat Tersimpan
                </div>
                <div className="text-3xl font-bold text-gray-800">
                  {stats.savedPlaces}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="text-gray-500 text-sm mb-1">Bisnis Saya</div>
                <div className="text-3xl font-bold text-gray-800">
                  {stats.myBusinesses}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="text-gray-500 text-sm mb-1">Ulasan</div>
                <div className="text-3xl font-bold text-gray-800">
                  {stats.reviews}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="text-gray-500 text-sm mb-1">Perjalanan</div>
                <div className="text-3xl font-bold text-gray-800">
                  {stats.trips}
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Distribution Chart */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Bisnis per Kategori
                    </h3>
                    <p className="text-sm text-gray-500">
                      Distribusi bisnis Anda
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {categoryData.map((item, index) => {
                    const maxCount = Math.max(
                      ...categoryData.map((d) => d.count)
                    );
                    const percentage =
                      maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    const colors = [
                      "bg-[#FF6B35]",
                      "bg-[#FFA62B]",
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-purple-500",
                    ];
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {item.category}
                          </span>
                          <span className="text-sm font-bold text-gray-800">
                            {item.count}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className={`${
                              colors[index % colors.length]
                            } h-2.5 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {categoryData.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">Belum ada data</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating Distribution Chart */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Distribusi Rating
                    </h3>
                    <p className="text-sm text-gray-500">
                      Ulasan berdasarkan bintang
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {reviewRatingData.map((item) => {
                    const maxCount = Math.max(
                      ...reviewRatingData.map((d) => d.count)
                    );
                    const percentage =
                      maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    const totalReviews = reviewRatingData.reduce(
                      (sum, d) => sum + d.count,
                      0
                    );
                    const ratingPercentage =
                      totalReviews > 0
                        ? Math.round((item.count / totalReviews) * 100)
                        : 0;

                    return (
                      <div key={item.rating}>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 w-12">
                            <span className="text-sm font-bold text-gray-800">
                              {item.rating}
                            </span>
                            <Star
                              size={14}
                              className="text-yellow-400 fill-yellow-400"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{
                                  duration: 0.8,
                                  ease: "easeOut",
                                  delay: item.rating * 0.1,
                                }}
                                className="absolute inset-y-0 left-0 rounded-lg"
                                style={{
                                  background: `linear-gradient(to right, 
                                    ${
                                      item.rating === 5
                                        ? "#10b981, #34d399"
                                        : item.rating === 4
                                        ? "#3b82f6, #60a5fa"
                                        : item.rating === 3
                                        ? "#f59e0b, #fbbf24"
                                        : item.rating === 2
                                        ? "#f97316, #fb923c"
                                        : "#ef4444, #f87171"
                                    })`,
                                }}
                              >
                                <div className="h-full flex items-center justify-end pr-3">
                                  {item.count > 0 && (
                                    <span className="text-xs font-bold text-white">
                                      {item.count}
                                    </span>
                                  )}
                                </div>
                              </motion.div>
                            </div>
                          </div>
                          <div className="w-12 text-right">
                            <span className="text-xs font-medium text-gray-500">
                              {ratingPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {reviewRatingData.every((d) => d.count === 0) && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">Belum ada ulasan</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* My Businesses Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Bisnis Saya</h2>
                <Link
                  href="/usaha-baru"
                  className="bg-[#FF6B35] hover:bg-[#ff5722] text-white font-medium py-2 px-4 rounded-xl transition-all text-sm"
                >
                  + Tambah Baru
                </Link>
              </div>

              {umkmList.length > 0 ? (
                <div className="space-y-4">
                  {umkmList.map((umkm) => (
                    <div
                      key={umkm.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#FF6B35] transition-all"
                    >
                      {umkm.thumbnail ? (
                        <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={umkm.thumbnail}
                            alt={umkm.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#FFA62B] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Store size={32} className="text-white" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-800 truncate">
                              {umkm.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {umkm.category}
                            </p>
                          </div>
                          {getStatusBadge(umkm.status)}
                        </div>

                        {umkm.rating && (
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Star
                                size={14}
                                className="text-yellow-400 fill-yellow-400"
                              />
                              <span className="font-medium">{umkm.rating}</span>
                              <span className="text-gray-400">
                                ({umkm.reviewCount || 0})
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4">
                          <Link
                            href={`/umkm/${umkm.id}/edit`}
                            className="text-[#FF6B35] hover:text-[#ff5722] text-sm font-medium flex items-center gap-1"
                          >
                            <Edit2 size={14} />
                            Edit
                          </Link>
                          <Link
                            href={`/umkm/${umkm.id}`}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center gap-1"
                          >
                            <Eye size={14} />
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-gray-800 font-semibold mb-2">
                    Mulai Perjalanan Bisnis Anda
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Daftarkan bisnis Anda dan raih lebih banyak pelanggan!
                  </p>
                  <Link href="/usaha-baru">
                    <button className="bg-[#FF6B35] hover:bg-[#ff5722] text-white font-medium py-2 px-6 rounded-xl transition-all">
                      Tambahkan Bisnis Anda
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
