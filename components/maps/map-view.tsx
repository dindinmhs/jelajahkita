"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Map,
  Layers,
  Globe,
  Plus,
  Minus,
  Navigation,
  Sparkles,
} from "lucide-react";
import Dropdown from "@/components/common/dropdown";

interface MapViewProps {
  initialCenter?: [number, number];
  initialZoom?: number;
}

type MapMode = "default" | "3d" | "satellite";

export default function MapView({
  initialCenter = [106.8456, -6.2088], // Jakarta coordinates
  initialZoom = 12,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapMode, setMapMode] = useState<MapMode>("default");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  // Map style configurations
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

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.default,
      center: initialCenter,
      zoom: initialZoom,
    });

    // Handle loading state
    map.current.on("load", () => {
      setIsLoading(false);
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialCenter, initialZoom]);

  // Handle map mode change
  useEffect(() => {
    if (!map.current) return;

    const style =
      mapMode === "satellite" ? mapStyles.satellite : mapStyles[mapMode];

    map.current.setStyle(style as any);
  }, [mapMode]);

  const handleModeChange = (mode: MapMode) => {
    setMapMode(mode);
  };

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  const handleGoToUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation: [number, number] = [longitude, latitude];
          setUserLocation(newLocation);

          if (map.current) {
            map.current.flyTo({
              center: newLocation,
              zoom: 15,
              duration: 2000,
            });

            // Add marker for user location
            new maplibregl.Marker({ color: "#FF6B35" })
              .setLngLat(newLocation)
              .addTo(map.current);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Tidak dapat mengakses lokasi Anda. Pastikan GPS aktif.");
        }
      );
    } else {
      alert("Browser Anda tidak mendukung Geolocation.");
    }
  };

  const handleOpenAIAssistant = () => {
    // TODO: Implement AI Assistant
    console.log("AI Assistant clicked");
  };

  // Map mode dropdown items
  const modeDropdownItems = [
    {
      id: "default",
      label: "Default",
      icon: <Map size={18} />,
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

  return (
    <div className="relative w-full h-full">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Memuat peta...</p>
          </div>
        </div>
      )}

      {/* Map Controls - Right Side */}
      <div className="absolute bottom-10 right-6 z-40 flex flex-col gap-2">
        {/* Map Mode Selector with Dropdown */}
        <Dropdown
          trigger={
            <button className="w-full bg-white hover:bg-gray-50 shadow-lg rounded-full p-3 flex items-center justify-center transition-all border border-gray-200">
              {mapMode === "default" && (
                <Map size={20} className="text-gray-700" />
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

        {/* AI Assistant Button */}
        <button
          onClick={handleOpenAIAssistant}
          className="bg-white hover:bg-gray-50 shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all"
          title="AI Assistant"
        >
          <Sparkles size={20} className="text-gray-700" />
        </button>

        {/* Go to User Location Button */}
        <button
          onClick={handleGoToUserLocation}
          className="bg-white hover:bg-gray-50 shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all border border-gray-200"
          title="Lokasi Saya"
        >
          <Navigation size={20} className="text-gray-700" />
        </button>

        {/* Zoom In Button */}
        <button
          onClick={handleZoomIn}
          className="bg-white hover:bg-gray-50 shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all border border-gray-200"
          title="Zoom In"
        >
          <Plus size={20} className="text-gray-700" />
        </button>

        {/* Zoom Out Button */}
        <button
          onClick={handleZoomOut}
          className="bg-white hover:bg-gray-50 shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all border border-gray-200"
          title="Zoom Out"
        >
          <Minus size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
