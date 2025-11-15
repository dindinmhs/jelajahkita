"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMapStore } from "@/lib/store/useMapStore";
import { createClient } from "@/lib/supabase/client";

const Maps = dynamic(() => import("./map-view"), {
  ssr: false,
});

const NearbySidebar = dynamic(() => import("./nearby-sidebar"), {
  ssr: false,
});

const UmkmDetailSidebar = dynamic(() => import("./umkm-detail-sidebar"), {
  ssr: false,
});

interface MapsLayoutWithParamsProps {
  lat?: string;
  lng?: string;
  umkmId?: string;
}

export const MapsLayoutWithParams = ({
  lat,
  lng,
  umkmId,
}: MapsLayoutWithParamsProps) => {
  const [isClient, setIsClient] = useState(false);
  const sidebarView = useMapStore((state) => state.sidebarView);
  const setSelectedUmkm = useMapStore((state) => state.setSelectedUmkm);
  const setSidebarView = useMapStore((state) => state.setSidebarView);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const loadUmkmData = async () => {
      if (umkmId && isClient) {
        const supabase = createClient();
        const { data: umkmData } = await supabase
          .from("umkm")
          .select("*")
          .eq("id", umkmId)
          .single();

        if (umkmData) {
          setSelectedUmkm(umkmData);
          setSidebarView("detail");
        }
      }
    };

    loadUmkmData();
  }, [umkmId, isClient, setSelectedUmkm, setSidebarView]);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat peta...</p>
        </div>
      </div>
    );
  }

  const initialCenter =
    lat && lng
      ? ([parseFloat(lng), parseFloat(lat)] as [number, number])
      : undefined;

  return (
    <>
      <Maps
        initialCenter={initialCenter}
        initialZoom={initialCenter ? 16 : 12}
      />
      {sidebarView === "nearby" ? <NearbySidebar /> : <UmkmDetailSidebar />}
    </>
  );
};
