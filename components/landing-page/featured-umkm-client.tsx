"use client";

import Image from "next/image";
import Link from "next/link";

interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  image: string;
}

interface FeaturedUMKMClientProps {
  businesses: Business[];
}

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    kuliner: "text-[#FF6B35]",
    kerajinan: "text-[#FFA62B]",
    fashion: "text-purple-600",
    jasa: "text-blue-600",
    agrikultur: "text-green-600",
  };
  return colors[category.toLowerCase()] || "text-[#FF6B35]";
};

export default function FeaturedUMKMClient({
  businesses,
}: FeaturedUMKMClientProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-gray-50">
      <div className="flex flex-col gap-4 mb-8 items-center">
        <h2 className="text-[#004E64] text-3xl font-bold leading-tight tracking-tight text-center">
          UMKM Unggulan Pilihan Kami
        </h2>
        <p className="text-[#004E64] max-w-2xl text-center">
          Jelajahi cerita unik di balik produk dan jasa berkualitas dari para
          pahlawan ekonomi lokal.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {businesses.map((business) => (
          <Link key={business.id} href={`/umkm/${business.id}`}>
            <div className="group flex flex-col overflow-hidden rounded-lg bg-[#FFF8E7] shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
              <div className="overflow-hidden relative h-56">
                <Image
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  alt={business.name}
                  src={business.image}
                  width={400}
                  height={224}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <p
                    className={`text-sm font-medium ${getCategoryColor(
                      business.category
                    )}`}
                  >
                    {business.category}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-[#004E64]">
                    {business.name}
                  </h3>
                  <p className="mt-3 text-base text-[#004E64] line-clamp-3">
                    {business.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-[#004E64]">
                  <span className="material-symbols-outlined !text-lg">
                    location_on
                  </span>
                  <span>{business.location}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
