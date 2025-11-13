import NavbarMap from "@/components/common/navbar";
import MapView from "@/components/maps/map-view";

export default function MapPage() {
  return (
    <div className="flex flex-col h-screen">
      <NavbarMap />
      <div className="flex-1 w-full">
        <MapView />
      </div>
    </div>
  );
}
