"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Map as MapIcon,
  Layers,
  Globe,
  Plus,
  Minus,
  Navigation,
  Sparkles,
  MapPin,
  X,
  MessageCircle,
} from "lucide-react";
import { renderToString } from "react-dom/server";
import Dropdown from "@/components/common/dropdown";
import { createClient } from "@/lib/supabase/client";
import { useMapStore } from "@/lib/store/useMapStore";
import { getCategoryIcon, getCategoryColor } from "@/lib/utils/category-icons";
import { useNavigationStore } from "@/lib/store/useNavigation";
import { useChatStore } from "@/lib/store/useChatStore";
import ChatPopup from "./chat-popup";
import AIChatbot from "./ai-chatbot";

interface MapViewProps {
  initialCenter?: [number, number];
  initialZoom?: number;
}

type MapMode = "default" | "3d" | "satellite";

interface UMKM {
  id: string;
  name: string;
  category: string;
  lon: number;
  lat: number;
}

export default function MapView({
  initialCenter = [106.8456, -6.2088],
  initialZoom = 12,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const userMarker = useRef<maplibregl.Marker | null>(null);
  const destinationMarker = useRef<maplibregl.Marker | null>(null);
  const umkmMarkers = useRef<Map<string, maplibregl.Marker>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [mapMode, setMapMode] = useState<MapMode>("default");
  const [umkmList, setUmkmList] = useState<UMKM[]>([]);
  const [locationRequested, setLocationRequested] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const userLocation = useMapStore((state) => state.userLocation);
  const setUserLocation = useMapStore((state) => state.setUserLocation);
  const selectedUmkm = useMapStore((state) => state.selectedUmkm);
  const setSelectedUmkm = useMapStore((state) => state.setSelectedUmkm);
  const selectedCategory = useMapStore((state) => state.selectedCategory);
  const searchQuery = useMapStore((state) => state.searchQuery);
  const { isChatOpen, toggleChatView } = useChatStore();
  const handleOpenChat = () => {
    console.log("Toggle chat view, current state:", isChatOpen);
    // Buka chat list view
    toggleChatView();
  };
  

  const {
    isNavigating,
    destination,
    routeData,
    stopNavigation,
    setRouteData,
  } = useNavigationStore();

  const mapStyles = {
    default: "https://tiles.openfreemap.org/styles/bright",
    "3d": "https://tiles.openfreemap.org/styles/liberty",
    satellite: {
      version: 8,
      sources: {
        satellite: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: "satellite",
          type: "raster",
          source: "satellite",
        },
      ],
    },
  };

  // Filter UMKM based on search query and category
  const filteredUmkmList = useMemo(() => {
    let filtered = umkmList;

    // Filter by category
    if (selectedCategory !== "Semua") {
      filtered = filtered.filter((umkm) => umkm.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((umkm) =>
        umkm.name.toLowerCase().includes(query) ||
        umkm.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [umkmList, selectedCategory, searchQuery]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const requestLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) return;

    setLocationRequested(true);
    setShowLocationPrompt(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation: [number, number] = [longitude, latitude];
        setUserLocation(newLocation);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationRequested(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    const checkPermission = async () => {
      try {
        if (navigator.permissions) {
          const result = await navigator.permissions.query({
            name: "geolocation",
          });

          if (result.state === "granted") {
            requestLocation();
          } else if (result.state === "prompt") {
            setTimeout(() => {
              setShowLocationPrompt(true);
            }, 1000);
          }
        } else {
          setTimeout(() => {
            setShowLocationPrompt(true);
          }, 1000);
        }
      } catch (error) {
        setTimeout(() => {
          setShowLocationPrompt(true);
        }, 1000);
      }
    };

    checkPermission();
  }, [isMounted]);

  const handleDismissLocationPrompt = () => {
    setShowLocationPrompt(false);
  };

  // Fetch UMKM only once
  useEffect(() => {
    if (!isMounted) return;

    const fetchUMKM = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("umkm")
        .select("id, name, category, lon, lat");

      if (error) {
        console.error("Error fetching UMKM:", error);
        return;
      }

      if (data) {
        setUmkmList(data);
      }
    };

    fetchUMKM();
  }, [isMounted]);

  // Initialize map once
  useEffect(() => {
    if (!isMounted || !mapContainer.current || map.current) return;

    const center = userLocation ? userLocation : initialCenter;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.default,
      center: center as [number, number],
      zoom: userLocation ? 15 : initialZoom,
    });

    map.current.on("load", () => {
      setIsLoading(false);
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        umkmMarkers.current.forEach((marker) => marker.remove());
        umkmMarkers.current.clear();
        if (userMarker.current) {
          userMarker.current.remove();
        }
        if (destinationMarker.current) {
          destinationMarker.current.remove();
        }
        map.current.remove();
        map.current = null;
      }
    };
  }, [isMounted]);

  // Add user location marker
  useEffect(() => {
    if (!map.current || !userLocation || !mapLoaded) return;

    if (userMarker.current) {
      userMarker.current.remove();
    }

    const el = document.createElement("div");
    el.className = "user-location-marker";
    el.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #3b82f6;
      border: 3px solid white;
      box-shadow: 0 0 0 rgba(59, 130, 246, 0.4);
      animation: pulse 2s infinite;
    `;

    if (!document.getElementById("pulse-animation")) {
      const style = document.createElement("style");
      style.id = "pulse-animation";
      style.textContent = `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `;
      document.head.appendChild(style);
    }

    userMarker.current = new maplibregl.Marker({ element: el })
      .setLngLat(userLocation)
      .addTo(map.current);

    if (!isNavigating) {
      map.current.flyTo({
        center: userLocation,
        zoom: 15,
        duration: 2000,
      });
    }
  }, [userLocation, mapLoaded, isNavigating]);

  // Update markers based on filtered list
  useEffect(() => {
    if (!map.current || !mapLoaded || umkmList.length === 0) return;

    console.log("Updating markers based on filters...");
    console.log("Filtered UMKM count:", filteredUmkmList.length);

    // Remove all existing markers
    umkmMarkers.current.forEach((marker) => marker.remove());
    umkmMarkers.current.clear();

    // Add markers for filtered UMKM
    filteredUmkmList.forEach((umkm) => {
      const el = document.createElement("div");
      el.className = "umkm-marker";
      const color = getCategoryColor(umkm.category);

      el.innerHTML = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="
            background-color: ${color};
            width: 40px;
            height: 40px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            border: 3px solid white;
          ">
            <div style="transform: rotate(45deg); color: white; display: flex; align-items: center; justify-content: center;">
              ${renderToString(getCategoryIcon(umkm.category, 20))}
            </div>
          </div>
          <div style="
            background-color: white;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            color: #1f2937;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            margin-top: 4px;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
          ">
            ${umkm.name}
          </div>
        </div>
      `;

      el.addEventListener("click", () => {
        setSelectedUmkm(umkm);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([umkm.lon, umkm.lat])
        .addTo(map.current!);

      umkmMarkers.current.set(umkm.id, marker);
    });

    console.log(`Updated to ${umkmMarkers.current.size} markers`);

    // Fit bounds to show all filtered markers
    if (filteredUmkmList.length > 0 && !isNavigating && !selectedUmkm) {
      const bounds = new maplibregl.LngLatBounds();
      
      filteredUmkmList.forEach((umkm) => {
        bounds.extend([umkm.lon, umkm.lat]);
      });

      // Include user location if available
      if (userLocation) {
        bounds.extend(userLocation);
      }

      map.current.fitBounds(bounds, {
        padding: { top: 100, bottom: 100, left: 450, right: 100 },
        maxZoom: 15,
        duration: 1000,
      });
    }
  }, [filteredUmkmList, mapLoaded, isNavigating, selectedUmkm]);

  // Focus on selected UMKM
  useEffect(() => {
    if (!map.current || !selectedUmkm || !mapLoaded || isNavigating) return;

    const umkm = umkmList.find((u) => u.id === selectedUmkm.id);
    if (umkm) {
      console.log("Flying to:", umkm.name);
      map.current.flyTo({
        center: [umkm.lon, umkm.lat],
        zoom: 16,
        duration: 1500,
        essential: true,
      });
    }
  }, [selectedUmkm, isNavigating]);

  // Handle navigation routing
  useEffect(() => {
    if (!map.current || !mapLoaded || !isNavigating || !destination || !userLocation)
      return;

    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${userLocation[0]},${userLocation[1]};${destination.coordinates[0]},${destination.coordinates[1]}?overview=full&geometries=geojson&steps=true`
        );

        const data = await response.json();

        if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
          console.error("No route found");
          return;
        }

        const route = data.routes[0];
        setRouteData({
          distance: route.distance,
          duration: route.duration,
          geometry: route.geometry,
        });

        // Remove existing route layer and source
        if (map.current!.getLayer("route")) {
          map.current!.removeLayer("route");
        }
        if (map.current!.getSource("route")) {
          map.current!.removeSource("route");
        }

        // Add route to map
        map.current!.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: route.geometry,
          },
        });

        map.current!.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#FF6B35",
            "line-width": 6,
            "line-opacity": 0.8,
          },
        });

        // Add destination marker
        if (destinationMarker.current) {
          destinationMarker.current.remove();
        }

        const destEl = document.createElement("div");
        destEl.className = "destination-marker";
        destEl.style.cssText = `
          width: 40px;
          height: 40px;
          background-color: #FF6B35;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          border: 3px solid white;
        `;
        destEl.innerHTML = `
          <div style="transform: rotate(45deg); color: white;">
            ${renderToString(<MapPin size={20} />)}
          </div>
        `;

        destinationMarker.current = new maplibregl.Marker({ element: destEl })
          .setLngLat(destination.coordinates)
          .addTo(map.current!);

        // Fit map to show entire route
        const coordinates = route.geometry.coordinates;
        const bounds = coordinates.reduce(
          (bounds: maplibregl.LngLatBounds, coord: [number, number]) => {
            return bounds.extend(coord as [number, number]);
          },
          new maplibregl.LngLatBounds(
            coordinates[0],
            coordinates[0]
          )
        );

        map.current!.fitBounds(bounds, {
          padding: { top: 100, bottom: 100, left: 100, right: 100 },
          duration: 1500,
        });
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, [isNavigating, destination, userLocation, mapLoaded]);

  // Clean up navigation
  useEffect(() => {
    if (!isNavigating && map.current && mapLoaded) {
      // Remove route layer and source
      if (map.current.getLayer("route")) {
        map.current.removeLayer("route");
      }
      if (map.current.getSource("route")) {
        map.current.removeSource("route");
      }

      // Remove destination marker
      if (destinationMarker.current) {
        destinationMarker.current.remove();
        destinationMarker.current = null;
      }
    }
  }, [isNavigating, mapLoaded]);

  // Handle map mode change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const style =
      mapMode === "satellite" ? mapStyles.satellite : mapStyles[mapMode];

    console.log("Changing map style to:", mapMode);

    map.current.once("styledata", () => {
      console.log("Style loaded, re-adding markers...");

      setTimeout(() => {
        // Re-add user marker
        if (userMarker.current && userLocation) {
          const el = userMarker.current.getElement();
          userMarker.current.remove();
          userMarker.current = new maplibregl.Marker({ element: el })
            .setLngLat(userLocation)
            .addTo(map.current!);
        }

        // Re-add UMKM markers for filtered list
        const existingMarkers = Array.from(umkmMarkers.current.entries());
        umkmMarkers.current.clear();

        existingMarkers.forEach(([id, marker]) => {
          const umkm = filteredUmkmList.find((u) => u.id === id);
          if (umkm) {
            const el = marker.getElement();
            marker.remove();
            const newMarker = new maplibregl.Marker({ element: el })
              .setLngLat([umkm.lon, umkm.lat])
              .addTo(map.current!);
            umkmMarkers.current.set(id, newMarker);
          }
        });

        // Re-add destination marker if navigating
        if (isNavigating && destination && destinationMarker.current) {
          const el = destinationMarker.current.getElement();
          destinationMarker.current.remove();
          destinationMarker.current = new maplibregl.Marker({ element: el })
            .setLngLat(destination.coordinates)
            .addTo(map.current!);
        }

        console.log("Markers re-added:", umkmMarkers.current.size);
      }, 100);
    });

    map.current.setStyle(style as any);
  }, [mapMode]);

  const handleModeChange = (mode: MapMode) => {
    setMapMode(mode);
  };

  const handleZoomIn = () => {
    map.current?.zoomIn();
  };

  const handleZoomOut = () => {
    map.current?.zoomOut();
  };

  const handleGoToUserLocation = () => {
    if (userLocation && map.current) {
      map.current.flyTo({
        center: userLocation,
        zoom: 15,
        duration: 2000,
      });
    } else if (!locationRequested) {
      requestLocation();
    }
  };

  const handleCancelNavigation = () => {
    stopNavigation();
  };

  const handleOpenInGoogleMaps = () => {
    if (!destination || !userLocation) return;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[1]},${userLocation[0]}&destination=${destination.coordinates[1]},${destination.coordinates[0]}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} menit`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} jam ${remainingMinutes} menit`;
  };

  const modeDropdownItems = [
    {
      id: "default",
      label: "Default",
      icon: <MapIcon size={18} />,
      onClick: () => handleModeChange("default"),
    },
    {
      id: "3d",
      label: "3D",
      icon: <Layers size={18} />,
      onClick: () => handleModeChange("3d"),
    },
    {
      id: "satellite",
      label: "Satelit",
      icon: <Globe size={18} />,
      onClick: () => handleModeChange("satellite"),
    },
  ];

  if (!isMounted) {
    return (
      <div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Memuat peta...</p>
          </div>
        </div>
      )}

      {/* Navigation Info Card */}
      {isNavigating && destination && routeData && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl p-4 w-80 border border-gray-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">
                Navigasi ke {destination.name}
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Navigation size={16} className="text-[#FF6B35]" />
                  <span className="font-semibold text-gray-900">
                    {formatDistance(routeData.distance)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">
                    {formatDuration(routeData.duration)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCancelNavigation}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCancelNavigation}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Batal
            </button>
            <button
              onClick={handleOpenInGoogleMaps}
              className="flex-1 bg-[#FF6B35] hover:bg-[#ff5722] text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Globe size={16} />
              Google Maps
            </button>
          </div>
        </div>
      )}

      {showLocationPrompt && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-2xl p-4 max-w-sm border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Aktifkan Lokasi
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Izinkan akses lokasi untuk melihat UMKM terdekat.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={requestLocation}
                  className="flex-1 bg-[#FF6B35] hover:bg-[#ff5722] text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Izinkan
                </button>
                <button
                  onClick={handleDismissLocationPrompt}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Nanti Saja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Info Badge */}
      {(selectedCategory !== "Semua" || searchQuery) && (
        <div className="absolute top-20 left-6 z-50 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <p className="text-sm text-gray-600">
            Menampilkan <span className="font-bold text-[#FF6B35]">{filteredUmkmList.length}</span> UMKM
            {selectedCategory !== "Semua" && (
              <> dari kategori <span className="font-semibold">{selectedCategory}</span></>
            )}
            {searchQuery && (
              <> untuk pencarian <span className="font-semibold">"{searchQuery}"</span></>
            )}
          </p>
        </div>
      )}

      {!isNavigating && (
        <div className="absolute bottom-10 right-6 z-40 flex flex-col gap-2">
          <button
            onClick={handleOpenChat}
            className={`bg-white hover:bg-gray-50 shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all border-2 ${
              isChatOpen ? "border-green-500" : "border-gray-200"
            }`}
            title="Chat"
          >
            <MessageCircle
              size={20}
              className={isChatOpen ? "text-green-600" : "text-gray-700"}
            />
            {isChatOpen && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </button>
          <Dropdown
            trigger={
              <button className="w-full bg-white hover:bg-gray-50 shadow-lg rounded-full p-3 flex items-center justify-center transition-all border border-gray-200">
                {mapMode === "default" && (
                  <MapIcon size={20} className="text-gray-700" />
                )}
                {mapMode === "3d" && (
                  <Layers size={20} className="text-gray-700" />
                )}
                {mapMode === "satellite" && (
                  <Globe size={20} className="text-gray-700" />
                )}
              </button>
            }
            items={modeDropdownItems}
            position="left"
          />

          <AIChatbot map={map} umkmMarkers={umkmMarkers} />

          <button
            onClick={handleGoToUserLocation}
            className={`bg-white hover:bg-gray-50 shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all border border-gray-200 ${
              !userLocation && !locationRequested ? "animate-pulse" : ""
            }`}
            title="Lokasi Saya"
          >
            <Navigation
              size={20}
              className={userLocation ? "text-blue-600" : "text-gray-700"}
            />
          </button>

          <button
            onClick={handleZoomIn}
            className="bg-white hover:bg-gray-50 shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all border border-gray-200"
            title="Zoom In"
          >
            <Plus size={20} className="text-gray-700" />
          </button>

          <button
            onClick={handleZoomOut}
            className="bg-white hover:bg-gray-50 shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all border border-gray-200"
            title="Zoom Out"
          >
            <Minus size={20} className="text-gray-700" />
          </button>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full" />
      <ChatPopup />
    </div>
  );
}