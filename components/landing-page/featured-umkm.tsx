"use client";

import Image from "next/image";

const featuredBusinesses = [
  {
    id: 1,
    category: "Kuliner",
    categoryColor: "text-[#FF6B35]",
    name: "Sate Ayam Pak Budi",
    description:
      "Sate legendaris dengan bumbu kacang rahasia yang diwariskan turun-temurun. Rasa otentik yang tak terlupakan.",
    location: "Jakarta Selatan",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVMQoW2NGGjEYIptlncL1OioMIIp2E1SgAvcvpRJbQ3uvICOa99Sj-akHDa0jL4LFzQDiMje13aTxfq8lpfcz0lnJ9moP9UFv4juDufWLCwobOqPiXYWC3RzAxXL3P2wbm5SkPpcjUXIDHqbRYanCcRT6vO9Rh2rElpHJ3zh6gNp122yowsq9sIQMsB4JK4O5Z4KZ48aPGjsdlSpoNNNRxtNhaWIxL5D7xOnYhyu5mXOIhkEvaDoTsThNTX1ofsuwfp7gh_CJT1snk",
  },
  {
    id: 2,
    category: "Kerajinan Tangan",
    categoryColor: "text-[#FFA62B]",
    name: "Batik Lestari",
    description:
      "Setiap helai kain adalah karya seni. Dibuat dengan cinta menggunakan teknik batik tulis tradisional dari Yogyakarta.",
    location: "Yogyakarta",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3ICXrkzaXkwMRiPZvNgY0IckV4dcQ6-T6NbLP60-UAI6iv6Olm6KUfDlZBiPmBN_xBS4SDaJrPWE3lfQfq0iub8EGEn5YLMzf2rrbtfZLJRIZLDYDYXsn0ePHRJvtpSd_tjtLIuR3jQMvLHQx1es8tOMaMK_nTOAukKPer2EHpAyly-MyJyE6pCDMqJ1Z-4U4NLJv0f5SIbbPhr4LP-_9mjDWfTH-YBhj4nFh4KMxuLbiL6fGCe6Eil6NFH2tvMdBfAOtl2608Hma",
  },
  {
    id: 3,
    category: "Kuliner",
    categoryColor: "text-[#FF6B35]",
    name: "Kopi Senja",
    description:
      "Menyeduh biji kopi arabika terbaik dari petani lokal Gayo. Nikmati secangkir cerita di setiap tegukan.",
    location: "Bandung",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2aKt8FgDAKWSNomHM0fnIPC_Op_gI65FFIFFoVXZe8YaW0gmix68HgPrSKpJEqI35F9NRBK8YdYsjO2_XcRFMtk9fN5S6WXFVqLcA9qw0I8tO0fwffwYEyVtSfZtso2A0_bGeLSqEgF1fOXcZkw99RlbMxSA8V5m9xSQbJUDRDeLGLyTuTC1swG6jRmEZSgOKUeTpzhwgiY4yS6wu6sdUrt6niFhxga8tP69NHuvot54_K19NgOS-lDCFgEMBUosCfTIeGSg_yOdd",
  },
];

export function FeaturedUMKM() {
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
        {featuredBusinesses.map((business) => (
          <div
            key={business.id}
            className="group flex flex-col overflow-hidden rounded-lg bg-[#FFF8E7] shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
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
                <p className={`text-sm font-medium ${business.categoryColor}`}>
                  {business.category}
                </p>
                <h3 className="mt-2 text-xl font-bold text-[#004E64]">
                  {business.name}
                </h3>
                <p className="mt-3 text-base text-[#004E64]">
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
        ))}
      </div>
    </div>
  );
}
