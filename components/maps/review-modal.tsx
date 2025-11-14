"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Send } from "lucide-react";
import { useReviewStore } from "@/lib/store/useReviewStore";
import { createClient } from "@/lib/supabase/client";
import { useMapStore } from "@/lib/store/useMapStore";

export default function ReviewModal() {
  const { isReviewModalOpen, selectedUmkmId, closeReviewModal } =
    useReviewStore();
  const { selectedUmkm } = useMapStore();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Silakan pilih rating");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const supabase = createClient();

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Anda harus login untuk memberikan ulasan");
        setIsSubmitting(false);
        return;
      }

      // Insert review
      const { error: insertError } = await supabase.from("review").insert({
        umkm_id: selectedUmkmId,
        user_id: user.id,
        rating: rating,
        comment: comment.trim() || null,
      });

      if (insertError) {
        console.error("Error inserting review:", insertError);
        setError("Gagal mengirim ulasan. Silakan coba lagi.");
        return;
      }

      // Reset form and close modal
      setRating(0);
      setComment("");
      closeReviewModal();

      // Reload page to show new review
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setComment("");
      setError("");
      closeReviewModal();
    }
  };

  return (
    <AnimatePresence>
      {isReviewModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#FF6B35] to-[#ff8c42]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    Tulis Ulasan
                  </h3>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
                  >
                    <X className="text-white" size={24} />
                  </button>
                </div>
                {selectedUmkm && (
                  <p className="text-white/90 text-sm mt-2">
                    {selectedUmkm.name}
                  </p>
                )}
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Rating Stars */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Berikan Rating
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="focus:outline-none"
                      >
                        <Star
                          size={40}
                          className={`transition-colors ${
                            star <= (hoveredRating || rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-sm text-gray-600 mt-2"
                    >
                      {rating === 1 && "Sangat Buruk"}
                      {rating === 2 && "Buruk"}
                      {rating === 3 && "Cukup"}
                      {rating === 4 && "Baik"}
                      {rating === 5 && "Sangat Baik"}
                    </motion.p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Komentar (Opsional)
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ceritakan pengalaman Anda..."
                    rows={4}
                    maxLength={500}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {comment.length}/500
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-sm text-red-600">{error}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#FF6B35] hover:bg-[#ff5722] text-white font-semibold py-3 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Kirim Ulasan</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}