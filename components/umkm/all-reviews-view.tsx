"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  full_name: string;
  review_media?: { image_url: string }[];
}

interface AllReviewsViewProps {
  umkmData: {
    id: string;
    name: string;
  };
  reviews: Review[];
}

export default function AllReviewsView({
  umkmData,
  reviews,
}: AllReviewsViewProps) {
  const [activeFilter, setActiveFilter] = useState<string | number>("all");

  // Calculate rating statistics
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  // Filter reviews based on active filter
  const filteredReviews =
    activeFilter === "all"
      ? reviews
      : reviews.filter((r) => r.rating === activeFilter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffDays < 7) {
      return `${diffDays} hari lalu`;
    } else if (diffWeeks < 4) {
      return `${diffWeeks} minggu lalu`;
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Link href={`/umkm/${umkmData.id}`}>
              <button className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={24} />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Semua Ulasan</h1>
              <p className="text-sm text-gray-500">
                Ulasan untuk {umkmData.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Rating Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-6xl font-bold text-gray-900 mb-2">
                {avgRating.toFixed(1)}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.round(avgRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                berdasarkan {totalReviews.toLocaleString("id-ID")} ulasan
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingCounts[star as keyof typeof ratingCounts];
                const percentage =
                  totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-12">
                      {star} Bintang
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF6B35] rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
              activeFilter === "all"
                ? "bg-[#FF6B35] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Semua
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setActiveFilter(star)}
              className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                activeFilter === star
                  ? "bg-[#FF6B35] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {star} Bintang
            </button>
          ))}
        </div>

        {/* Sort Option */}
        <div className="flex justify-end mb-4">
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent">
            <option value="recent">Terbaru</option>
            <option value="highest">Rating Tertinggi</option>
            <option value="lowest">Rating Terendah</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFA62B] flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {review.full_name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    {/* Name and Date */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {review.full_name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        {review.comment}
                      </p>
                    )}

                    {/* Images */}
                    {review.review_media && review.review_media.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {review.review_media.slice(0, 4).map((media, idx) => (
                          <div
                            key={idx}
                            className="relative w-20 h-20 rounded-lg overflow-hidden"
                          >
                            <Image
                              src={media.image_url}
                              alt={`Review image ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                            {idx === 3 &&
                              review.review_media &&
                              review.review_media.length > 4 && (
                                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                  <span className="text-white font-semibold">
                                    +{review.review_media.length - 4} lainnya
                                  </span>
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-gray-500">
                Tidak ada ulasan dengan filter yang dipilih
              </p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredReviews.length > 10 && (
          <div className="flex justify-center mt-6">
            <button className="px-8 py-3 bg-[#FF6B35] hover:bg-[#ff5722] text-white font-medium rounded-full transition-colors">
              Muat Lebih Banyak Ulasan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
