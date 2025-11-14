import NavbarMap from "@/components/common/navbar";
import { MapsLayout } from "@/components/maps/map-layout";

export default function MapPage() {
  return (
    <div className="flex flex-col h-screen">
      <NavbarMap />
      <div className="flex-1 w-full">
        <MapsLayout />
      </div>
    </div>
  );
}
