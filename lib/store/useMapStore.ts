import { create } from 'zustand';

interface UMKM {
  id: string;
  name: string;
  category: string;
  thumbnail_url: string | null;
  distance_km?: number;
  lon?: number;
  lat?: number;
}

type SidebarView = 'nearby' | 'detail';

interface MapStore {
  isSidebarOpen: boolean;
  sidebarView: SidebarView;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarView: (view: SidebarView) => void;

  nearbyUmkm: UMKM[];
  setNearbyUmkm: (umkm: UMKM[]) => void;
  isLoadingNearby: boolean;
  setLoadingNearby: (loading: boolean) => void;

  selectedUmkm: UMKM | null;
  setSelectedUmkm: (umkm: UMKM | null) => void;

  // UBAH: format [lon, lat] untuk konsisten dengan MapLibre
  userLocation: [number, number] | null;
  setUserLocation: (location: [number, number] | null) => void;

  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  isSidebarOpen: true,
  sidebarView: 'nearby',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setSidebarView: (view) => set({ sidebarView: view }),

  nearbyUmkm: [],
  setNearbyUmkm: (umkm) => set({ nearbyUmkm: umkm }),
  isLoadingNearby: false,
  setLoadingNearby: (loading) => set({ isLoadingNearby: loading }),

  selectedUmkm: null,
  setSelectedUmkm: (umkm) => set({ 
    selectedUmkm: umkm,
    sidebarView: umkm ? 'detail' : 'nearby',
    isSidebarOpen: true
  }),

  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),

  selectedCategory: 'Semua',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));