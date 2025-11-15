"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { renderToString } from "react-dom/server";
import { getCategoryIcon, getCategoryColor } from "@/lib/utils/category-icons";

interface UMKM {
  id: string;
  name: string;
  category: string;
  description?: string;
  rating?: number;
  image?: string;
  lat: number;
  lon: number;
}

interface LandingMiniMapProps {
  umkmList: UMKM[];
  onMarkerClick?: (umkmId: string) => void;
  activeUmkm?: string | null;
}

export default function LandingMiniMap({
  umkmList,
  onMarkerClick,
  activeUmkm,
}: LandingMiniMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<Map<string, maplibregl.Marker>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Calculate center point from UMKM locations
    const avgLat =
      umkmList.reduce((sum, u) => sum + u.lat, 0) / umkmList.length || -6.2088;
    const avgLon =
      umkmList.reduce((sum, u) => sum + u.lon, 0) / umkmList.length || 106.8456;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [avgLon, avgLat],
      zoom: 12,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Enable scroll zoom when mouse is over map
    const mapElement = mapContainer.current;
    let isMouseOver = false;

    const handleMouseEnter = () => {
      isMouseOver = true;
      if (map.current) {
        map.current.scrollZoom.enable();
      }
    };

    const handleMouseLeave = () => {
      isMouseOver = false;
      if (map.current) {
        map.current.scrollZoom.disable();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isMouseOver) {
        e.preventDefault();
      }
    };

    mapElement.addEventListener("mouseenter", handleMouseEnter);
    mapElement.addEventListener("mouseleave", handleMouseLeave);
    mapElement.addEventListener("wheel", handleWheel, { passive: false });

    // Disable scroll zoom initially
    if (map.current) {
      map.current.scrollZoom.disable();
    }

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      const mapElement = mapContainer.current;
      if (mapElement) {
        mapElement.removeEventListener("mouseenter", handleMouseEnter);
        mapElement.removeEventListener("mouseleave", handleMouseLeave);
        mapElement.removeEventListener("wheel", handleWheel);
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [umkmList]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current.clear();

    // Add markers for each UMKM
    umkmList.forEach((umkm) => {
      const el = document.createElement("div");
      el.className = "umkm-marker";
      const color = getCategoryColor(umkm.category);
      const isActive = activeUmkm === umkm.id;

      // Marker pin (tegak, tidak miring)
      el.innerHTML = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="
            background-color: ${color};
            width: 40px;
            height: 40px;
            border-radius: 50%;
            transform: ${isActive ? "scale(1.2)" : "scale(1)"};
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            border: 3px solid white;
            transition: transform 0.2s;
          ">
            <div style="color: white; display: flex; align-items: center; justify-content: center;">
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

      // Create popup element
      const popup = document.createElement("div");
      popup.className = "umkm-popup";
      popup.style.cssText = `
        position: absolute;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%) translateY(10px) scale(0.95);
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 0;
        width: 200px;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
        pointer-events: auto;
        transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
      `;

      const rating = umkm.rating || 0;
      const stars = "⭐".repeat(Math.floor(rating));

      popup.innerHTML = `
        <div style="position: relative;">
          <img 
            src="${umkm.image || "/placeholder-umkm.jpg"}" 
            alt="${umkm.name}"
            style="width: 100%; height: 100px; object-fit: cover; border-radius: 12px 12px 0 0;"
          />
          <div style="padding: 12px;">
            <h3 style="font-size: 14px; font-weight: 700; color: #1C160C; margin: 0 0 4px 0; line-height: 1.3;">
              ${umkm.name}
            </h3>
            <p style="font-size: 12px; color: #60584C; margin: 0 0 8px 0;">
              ${umkm.category}
            </p>
            ${
              rating > 0
                ? `
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="font-size: 12px;">${stars}</span>
                <span style="font-size: 12px; color: #1C160C; font-weight: 600;">(${rating.toFixed(
                  1
                )})</span>
              </div>
            `
                : ""
            }
          </div>
        </div>
      `;

      el.appendChild(popup);

      let hideTimeout: NodeJS.Timeout | null = null;

      const showPopup = () => {
        if (hideTimeout) {
          clearTimeout(hideTimeout);
          hideTimeout = null;
        }
        popup.style.opacity = "1";
        popup.style.visibility = "visible";
        popup.style.transform = "translateX(-50%) translateY(0) scale(1)";
        const markerPin = el.querySelector("div > div") as HTMLElement;
        if (markerPin && activeUmkm !== umkm.id) {
          markerPin.style.transform = "scale(1.1)";
        }
      };

      const hidePopup = () => {
        hideTimeout = setTimeout(() => {
          popup.style.opacity = "0";
          popup.style.visibility = "hidden";
          popup.style.transform =
            "translateX(-50%) translateY(10px) scale(0.95)";
          const markerPin = el.querySelector("div > div") as HTMLElement;
          if (markerPin && activeUmkm !== umkm.id) {
            markerPin.style.transform = "scale(1)";
          }
        }, 200);
      };

      el.addEventListener("mouseenter", showPopup);
      el.addEventListener("mouseleave", hidePopup);
      popup.addEventListener("mouseenter", showPopup);
      popup.addEventListener("mouseleave", hidePopup);

      el.addEventListener("click", () => {
        if (onMarkerClick) {
          onMarkerClick(umkm.id);
        }
      });

      const marker = new maplibregl.Marker({
        element: el,
        anchor: "center",
        offset: [0, 0],
      })
        .setLngLat([umkm.lon, umkm.lat])
        .addTo(map.current!);

      markers.current.set(umkm.id, marker);
    });
  }, [umkmList, mapLoaded, activeUmkm, onMarkerClick]);

  // Update marker styles when activeUmkm changes
  useEffect(() => {
    if (!mapLoaded) return;

    markers.current.forEach((marker, id) => {
      const el = marker.getElement();
      const markerPin = el.querySelector("div > div") as HTMLElement;
      const isActive = activeUmkm === id;

      if (markerPin) {
        markerPin.style.transform = isActive ? "scale(1.2)" : "scale(1)";
      }
    });
  }, [activeUmkm, mapLoaded]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-xl"
      style={{ minHeight: "400px" }}
    />
  );
}
