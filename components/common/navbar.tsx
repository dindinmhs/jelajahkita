"use client";
import { Search, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthButton } from "../auth-button";
import Image from "next/image";
import { useMapStore } from "@/lib/store/useMapStore";
import UmkmDropdown from "@/components/maps/umkm-dropdown";

const NavbarMap = () => {
  const router = useRouter();
  const { selectedCategory, setSelectedCategory, toggleSidebar } = useMapStore();

  const categories = [
    "Semua",
    "Kuliner",
    "Fashion",
    "Kerajinan",
    "Jasa",
    "Pertanian",
    "Teknologi",
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-3">
          {/* Top Row */}
          <div className="flex items-center justify-between gap-3">
            {/* Left Section - Menu & Logo in rounded container */}
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md shadow-lg rounded-full px-5 py-2">
              <button 
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Menu size={20} className="text-gray-700" />
              </button>
              <div
                className="flex items-center gap-2 cursor-pointer pl-1"
                onClick={() => router.push("/")}
              >
                <div className="relative">
                  <Image
                    src="/logo.png"
                    alt="Jelajahkita Logo"
                    width={110}
                    height={110}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Center Section - Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative bg-white/95 backdrop-blur-md shadow-lg rounded-full">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Cari UMKM, kategori, atau lokasi"
                  className="w-full pl-12 pr-4 py-3 bg-transparent hover:bg-white/50 focus:bg-white border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition-colors text-gray-700 placeholder-gray-500 text-sm"
                />
              </div>
            </div>

            {/* Categories Row */}
            <div className="flex items-center gap-2 rounded-full px-4 py-2 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-[#FF6B35] text-white shadow-md"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Right Section - Add Business Button & Avatar */}
            <div className="flex items-center gap-2 rounded-full px-3 py-2">
              <UmkmDropdown />
              <div className="">
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
};

export default NavbarMap;