"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMapStore } from "@/lib/store/useMapStore";

const Maps = dynamic(() => import("./map-view"), {
  ssr: false,
});

const NearbySidebar = dynamic(() => import("./nearby-sidebar"), {
  ssr: false,
});

const UmkmDetailSidebar = dynamic(() => import("./umkm-detail-sidebar"), {
  ssr: false,
});

export const MapsLayout = () => {
  const [isClient, setIsClient] = useState(false);
  const sidebarView = useMapStore((state) => state.sidebarView);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  return (
    <>
      <Maps />
      {sidebarView === "nearby" ? <NearbySidebar /> : <UmkmDetailSidebar />}
    </>
  );
};