import { create } from "zustand";

interface ReviewStore {
  isReviewModalOpen: boolean;
  selectedUmkmId: string | null;
  openReviewModal: (umkmId: string) => void;
  closeReviewModal: () => void;
}

export const useReviewStore = create<ReviewStore>((set) => ({
  isReviewModalOpen: false,
  selectedUmkmId: null,
  openReviewModal: (umkmId) =>
    set({ isReviewModalOpen: true, selectedUmkmId: umkmId }),
  closeReviewModal: () =>
    set({ isReviewModalOpen: false, selectedUmkmId: null }),
}));