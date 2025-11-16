"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MiniMapProps {
  lat: number;
  lon: number;
  name: string;
}

export default function MiniMap({ lat, lon, name }: MiniMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [lon, lat],
      zoom: 14,
      interactive: false, // Disable interactions on mini map
      attributionControl: false,
    });

    // Add marker
    const el = document.createElement("div");
    el.className = "mini-map-marker";
    el.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%23FF6B35'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E\")";
    el.style.width = "32px";
    el.style.height = "32px";
    el.style.backgroundSize = "100%";
    el.style.cursor = "pointer";

    new maplibregl.Marker({ element: el })
      .setLngLat([lon, lat])
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lat, lon, name]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-xl"
      style={{ minHeight: "192px" }}
    />
  );
}
