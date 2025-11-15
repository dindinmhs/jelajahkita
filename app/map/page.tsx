import NavbarMap from "@/components/common/navbar";
import { MapsLayoutWithParams } from "@/components/maps/map-layout-with-params";

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ lat?: string; lng?: string; umkm?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex flex-col h-screen">
      <NavbarMap />
      <div className="flex-1 w-full">
        <MapsLayoutWithParams
          lat={params.lat}
          lng={params.lng}
          umkmId={params.umkm}
        />
      </div>
    </div>
  );
}
