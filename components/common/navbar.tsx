"use client";
import {
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Filter,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthButton } from "../auth-button";
import Image from "next/image";
import { useMapStore } from "@/lib/store/useMapStore";
import UmkmDropdown from "@/components/maps/umkm-dropdown";
import SearchResultsDropdown from "../maps/search-result";
import { useState, useRef, useEffect } from "react";

const NavbarMap = () => {
  const router = useRouter();
  const {
    selectedCategory,
    setSelectedCategory,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    isSidebarOpen,
  } = useMapStore();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const categories = [
    "Semua",
    "Kuliner",
    "Fashion",
    "Kerajinan",
    "Jasa",
    "Pertanian",
    "Teknologi",
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsFilterOpen(false);
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="px-3 sm:px-6 py-4">
        <div className="flex flex-col gap-3">
          {/* Top Row */}
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Left Section - Menu & Logo (Logo hidden on mobile) */}
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md shadow-lg rounded-full px-2 sm:px-4 py-2">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                {isSidebarOpen ? (
                  <PanelLeftClose size={20} className="text-[#FF6B35]" />
                ) : (
                  <PanelLeftOpen size={20} className="text-gray-700" />
                )}
              </button>
              {/* Logo - Hidden on mobile */}
              <div
                className="hidden sm:flex items-center gap-2 cursor-pointer"
                onClick={() => router.push("/")}
              >
                <div className="relative">
                  <Image
                    src="/logo.png"
                    alt="Jelajahkita Logo"
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Center Section - Search Bar with Filter */}
            <div className="relative flex-1 max-w-md sm:max-w-lg md:max-w-xl">
              <div className="relative bg-white shadow-lg rounded-full flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Cari UMKM..."
                  className="w-full pl-10 sm:pl-11 pr-16 sm:pr-20 py-2.5 bg-transparent hover:bg-gray-50 focus:bg-white border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition-colors text-gray-700 placeholder-gray-400 text-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
                  {/* Clear Search Button */}
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  )}

                  {/* Filter Button - Only visible on mobile/tablet (when category bar is hidden) */}
                  <div className="relative lg:hidden" ref={filterRef}>
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className={`p-1.5 rounded-full transition-colors ${
                        isFilterOpen || selectedCategory !== "Semua"
                          ? "bg-[#FF6B35] text-white"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Filter size={16} />
                    </button>

                    {/* Filter Dropdown */}
                    {isFilterOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in">
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Kategori
                          </p>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {categories.map((category) => (
                            <button
                              key={category}
                              onClick={() => handleCategorySelect(category)}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                selectedCategory === category
                                  ? "bg-[#FF6B35]/10 text-[#FF6B35] font-medium"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {category}
                              {selectedCategory === category && (
                                <span className="float-right">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Results Dropdown */}
              <SearchResultsDropdown />
            </div>

            {/* Right Section - UMKM Saya & Profile (Always visible) */}
            <div className="flex items-center gap-2 rounded-full px-1.5 sm:px-3 py-2 flex-shrink-0">
              <UmkmDropdown />
              <AuthButton />
            </div>
          </div>

          {/* Categories Row - Desktop Only */}
          <div className="hidden lg:flex items-center justify-center gap-2 px-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-[#FF6B35] text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
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
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default NavbarMap;