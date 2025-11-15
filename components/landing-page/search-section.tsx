"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  { icon: "restaurant", label: "Kuliner", value: "kuliner" },
  { icon: "palette", label: "Kerajinan Tangan", value: "kerajinan" },
  { icon: "checkroom", label: "Fashion", value: "fashion" },
  { icon: "construction", label: "Jasa", value: "jasa" },
  { icon: "agriculture", label: "Produk Agrikultur", value: "agrikultur" },
];

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/map?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/map?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <div className="flex flex-col gap-6 items-center">
        <h2 className="text-[#004E64] text-3xl font-bold leading-tight tracking-tight text-center">
          Cari produk atau toko lokal...
        </h2>

        <form onSubmit={handleSearch} className="w-full max-w-2xl">
          <div className="relative flex items-center w-full h-16 rounded-full bg-[#FFF8E7] border-2 border-[#004E64]/10 focus-within:border-[#FF6B35] focus-within:ring-2 focus-within:ring-[#FF6B35]/20 transition-all shadow-sm">
            <div className="text-[#004E64] flex items-center justify-center pl-6">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#002a35] focus:outline-none border-none bg-transparent h-full placeholder:text-[#004E64]/70 px-4 text-base font-normal leading-normal"
              placeholder="Ketik nama produk, jasa, atau toko..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="mr-2 px-6 py-2 bg-[#004E64] text-white rounded-full font-semibold hover:bg-[#003b4d] transition-colors"
            >
              Cari
            </button>
          </div>
        </form>

        <div className="flex gap-3 pt-2 flex-wrap justify-center">
          {categories.map((category) => (
            <button
              key={category.label}
              onClick={() => handleCategoryClick(category.value)}
              className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full text-[#002a35] bg-[#FFF8E7] px-4 ring-1 ring-inset ring-[#004E64]/20 hover:bg-[#FF6B35] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined !text-xl">
                {category.icon}
              </span>
              <p className="text-sm font-medium leading-normal">
                {category.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
