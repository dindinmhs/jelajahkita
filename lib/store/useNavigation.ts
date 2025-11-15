import { create } from "zustand";

interface NavigationStore {
  isNavigating: boolean;
  destination: {
    name: string;
    coordinates: [number, number];
  } | null;
  routeData: any | null;
  startNavigation: (name: string, coordinates: [number, number]) => void;
  stopNavigation: () => void;
  setRouteData: (data: any) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  isNavigating: false,
  destination: null,
  routeData: null,
  startNavigation: (name, coordinates) =>
    set({ isNavigating: true, destination: { name, coordinates } }),
  stopNavigation: () =>
    set({ isNavigating: false, destination: null, routeData: null }),
  setRouteData: (data) => set({ routeData: data }),
}));