"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  ArrowLeft,
  X,
  Clock,
  Link as LinkIcon,
  Package,
  MapPin,
  Trash2,
  Star,
  Navigation,
} from "lucide-react";
import axios from "axios";
import Image from "next/image";
import { useUserStore } from "@/lib/store/user-store";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";

const CoordinatePicker = dynamic(
  () => import("../common/coordinat-picker"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Memuat peta...</p>
        </div>
      </div>
    )
  }
);

interface FormData {
  name: string;
  description: string;
  category: string;
  lat: number;
  lon: number;
  address: string;
  media: File[];
  thumbnail: number;
  operational_hours: {
    day: string;
    dayNumber: number;
    open: string;
    close: string;
    status: string;
  }[];
  links: {
    platform: string;
    url: string;
  }[];
  catalog: {
    name: string;
    price: number;
    image: File | null;
  }[];
}

const AddventureForm = () => {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    lat: -6.9175,
    lon: 107.6191,
    address: "",
    media: [],
    thumbnail: 0,
    operational_hours: [
      {
        day: "Senin",
        dayNumber: 1,
        open: "09:00",
        close: "17:00",
        status: "open",
      },
      {
        day: "Selasa",
        dayNumber: 2,
        open: "09:00",
        close: "17:00",
        status: "open",
      },
      {
        day: "Rabu",
        dayNumber: 3,
        open: "09:00",
        close: "17:00",
        status: "open",
      },
      {
        day: "Kamis",
        dayNumber: 4,
        open: "09:00",
        close: "17:00",
        status: "open",
      },
      {
        day: "Jumat",
        dayNumber: 5,
        open: "09:00",
        close: "17:00",
        status: "open",
      },
      {
        day: "Sabtu",
        dayNumber: 6,
        open: "09:00",
        close: "17:00",
        status: "open",
      },
      {
        day: "Minggu",
        dayNumber: 7,
        open: "09:00",
        close: "17:00",
        status: "close",
      },
    ],
    links: [],
    catalog: [],
  });

  const categories = ["Kuliner", "Fashion", "Jasa", "Lainnya"];

  // Get current location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          setFormData((prev) => ({ ...prev, lat, lon }));
          
          // Fetch address
          try {
            const response = await axios.get(
              `/api/geocoding?lat=${lat}&lon=${lon}`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.data && response.data.display_name) {
              setFormData((prev) => ({
                ...prev,
                address: response.data.display_name,
              }));
            }
          } catch (error) {
            console.error("Error fetching address:", error);
          } finally {
            setIsGettingLocation(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsGettingLocation(false);
        }
      );
    } else {
      setIsGettingLocation(false);
    }
  };

  const handleCoordinateChange = async (coords: [number, number]) => {
    const [lat, lon] = coords;
    setFormData((prev) => ({ ...prev, lat, lon }));

    try {
      const response = await axios.get(`/api/geocoding?lat=${lat}&lon=${lon}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.display_name) {
        setFormData((prev) => ({
          ...prev,
          address: response.data.display_name,
        }));
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (formData.media.length + files.length > 3) {
      alert("Maksimal 3 media");
      return;
    }
    setFormData((prev) => ({ ...prev, media: [...prev.media, ...files] }));
  };

  const removeMedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
      thumbnail:
        prev.thumbnail === index
          ? 0
          : prev.thumbnail > index
          ? prev.thumbnail - 1
          : prev.thumbnail,
    }));
  };

  const updateOperationalHour = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      operational_hours: prev.operational_hours.map((hour, i) =>
        i === index ? { ...hour, [field]: value } : hour
      ),
    }));
  };

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { platform: "", url: "" }],
    }));
  };

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const updateLink = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const addCatalog = () => {
    setFormData((prev) => ({
      ...prev,
      catalog: [...prev.catalog, { name: "", price: 0, image: null }],
    }));
  };

  const removeCatalog = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      catalog: prev.catalog.filter((_, i) => i !== index),
    }));
  };

  const updateCatalog = (
    index: number,
    field: string,
    value: string | number | File
  ) => {
    setFormData((prev) => ({
      ...prev,
      catalog: prev.catalog.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleCatalogImageUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      updateCatalog(index, "image", file);
    }
  };

  // Validation functions
  const isStep1Valid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.category !== "" &&
      formData.address.trim() !== "" &&
      formData.media.length > 0
    );
  };

  const isStep2Valid = () => {
    return true; // Operational hours always have default values
  };

  const isStep3Valid = () => {
    // Links are optional, or all must be complete if any exist
    if (formData.links.length === 0) return true;
    return formData.links.every(
      (link) => link.platform.trim() !== "" && link.url.trim() !== ""
    );
  };

  const isStep4Valid = () => {
    // Catalog is optional, or all must be complete if any exist
    if (formData.catalog.length === 0) return true;
    return formData.catalog.every(
      (item) => item.name.trim() !== "" && item.price > 0
    );
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return isStep3Valid();
      case 4:
        return isStep4Valid();
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      // 1. Upload media UMKM ke storage
      const mediaUrls: string[] = [];
      let thumbnailFile: File | null = null;

      for (let i = 0; i < formData.media.length; i++) {
        const file = formData.media[i];
        const fileName = `${Date.now()}_${i}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("umkm-media")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("umkm-media").getPublicUrl(fileName);

        mediaUrls.push(publicUrl);

        if (i === formData.thumbnail) {
          thumbnailFile = file;
        }
      }

      // 2. Generate embeddings
      let textEmbedding = null;
      let imageEmbedding = null;

      try {
        let imageBase64 = undefined;
        if (thumbnailFile) {
          const reader = new FileReader();
          imageBase64 = await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => {
              const base64String = reader.result as string;
              const base64Data = base64String.split(",")[1];
              resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(thumbnailFile);
          });
        }

        const combinedText = [
          formData.name,
          formData.category,
          formData.description,
          formData.address,
        ]
          .filter(Boolean)
          .join(" ");

        const embeddingResponse = await fetch("/api/embeddings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: combinedText,
            imageBase64: imageBase64,
          }),
        });

        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json();
          textEmbedding = embeddingData.textEmbedding;
          imageEmbedding = embeddingData.imageEmbedding;
        }
      } catch (embeddingError) {
        console.error("Error generating embeddings:", embeddingError);
      }

      // 3. Insert data UMKM with embeddings
      const { data: umkmData, error: umkmError } = await supabase
        .from("umkm")
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          address: formData.address,
          lat: formData.lat,
          lon: formData.lon,
          category: formData.category,
          text_embedding: textEmbedding,
          image_embedding: imageEmbedding,
        })
        .select()
        .single();

      if (umkmError) throw umkmError;

      const umkmId = umkmData.id;

      // 4. Insert media UMKM
      const mediaInserts = mediaUrls.map((url, index) => ({
        umkm_id: umkmId,
        image_url: url,
        is_thumbnail: index === formData.thumbnail,
      }));

      const { error: mediaError } = await supabase
        .from("media")
        .insert(mediaInserts);

      if (mediaError) throw mediaError;

      // 5. Insert operational hours
      const operationalInserts = formData.operational_hours.map((hour) => ({
        umkm_id: umkmId,
        day: hour.dayNumber,
        open: hour.status === "open" ? hour.open : null,
        close: hour.status === "open" ? hour.close : null,
        status: hour.status,
      }));

      const { error: operationalError } = await supabase
        .from("operational_hours")
        .insert(operationalInserts);

      if (operationalError) throw operationalError;

      // 6. Insert links
      if (formData.links.length > 0) {
        const linkInserts = formData.links
          .filter((link) => link.platform && link.url)
          .map((link) => ({
            umkm_id: umkmId,
            platform: link.platform,
            url: link.url,
          }));

        if (linkInserts.length > 0) {
          const { error: linkError } = await supabase
            .from("umkm_links")
            .insert(linkInserts);

          if (linkError) throw linkError;
        }
      }

      // 7. Upload product images dan insert catalog
      if (formData.catalog.length > 0) {
        for (const item of formData.catalog) {
          if (!item.name || item.price <= 0) continue;

          let imageUrl = "";

          if (item.image) {
            const fileName = `${Date.now()}_${item.image.name}`;
            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from("product-images")
                .upload(fileName, item.image);

            if (uploadError) throw uploadError;

            const {
              data: { publicUrl },
            } = supabase.storage.from("product-images").getPublicUrl(fileName);

            imageUrl = publicUrl;
          }

          const { error: catalogError } = await supabase
            .from("catalog")
            .insert({
              umkm_id: umkmId,
              name: item.name,
              price: item.price,
              image_url: imageUrl,
            });

          if (catalogError) throw catalogError;
        }
      }

      router.push("/map");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat menyimpan data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Informasi Dasar
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Bisnis <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-[#FF6B35] focus:bg-white transition-all"
                placeholder="Masukkan nama bisnis"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-[#FF6B35] focus:bg-white transition-all text-left"
                >
                  {formData.category || "Pilih kategori"}
                </button>
                <ChevronRight
                  className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform duration-300 ${
                    categoryDropdownOpen ? "rotate-[-90deg]" : "rotate-90"
                  }`}
                  size={20}
                />

                <motion.div
                  initial={false}
                  animate={{
                    height: categoryDropdownOpen ? "auto" : 0,
                    opacity: categoryDropdownOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute z-10 w-full mt-2 overflow-hidden"
                >
                  <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, category: cat }));
                          setCategoryDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-[#FF6B35] focus:bg-white transition-all resize-none"
                placeholder="Ceritakan tentang bisnis Anda..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi <span className="text-red-500">*</span>
              </label>
              <div className="mb-2">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="mb-3 flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Navigation size={16} />
                  {isGettingLocation ? "Mendapatkan lokasi..." : "Gunakan Lokasi Saat Ini"}
                </button>
                <CoordinatePicker
                  value={[formData.lat, formData.lon]}
                  onChange={handleCoordinateChange}
                />
              </div>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-[#FF6B35] focus:bg-white transition-all"
                placeholder="Alamat lengkap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Foto <span className="text-red-500">*</span>
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="media-upload"
              />

              <div className="flex gap-4 items-start flex-wrap">
                {formData.media.slice(0, 2).map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-32 h-32 rounded-3xl overflow-hidden border border-gray-200 bg-gray-50">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {formData.thumbnail !== index && (
                          <button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                thumbnail: index,
                              }))
                            }
                            className="p-2 bg-white rounded-lg hover:bg-gray-100"
                            type="button"
                          >
                            <Star size={14} className="text-gray-700" />
                          </button>
                        )}
                        <button
                          onClick={() => removeMedia(index)}
                          className="p-2 bg-white rounded-lg hover:bg-red-50"
                          type="button"
                        >
                          <Trash2 size={14} className="text-red-600" />
                        </button>
                      </div>
                      {formData.thumbnail === index && (
                        <div className="absolute top-2 left-2 bg-[#FF6B35] text-white text-xs px-2 py-1 rounded-md">
                          Main
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <label
                  htmlFor="media-upload"
                  className="w-32 h-32 rounded-3xl border-2 border-dashed border-gray-300 hover:border-[#FF6B35] transition-colors cursor-pointer flex flex-col items-center justify-center bg-gray-50/50 group"
                >
                  <Upload
                    size={24}
                    className="text-gray-400 group-hover:text-[#FF6B35] transition-colors"
                  />
                  <span className="text-xs text-gray-500 mt-2">
                    Upload disini
                  </span>
                </label>
              </div>
              {formData.media.length > 2 && (
                <p className="text-sm text-gray-500 mt-3">
                  +{formData.media.length - 2} foto lagi
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Jam Operasional
            </h2>

            <div className="space-y-3">
              {formData.operational_hours.map((hour, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-28">
                    <span className="text-sm font-medium text-gray-700">
                      {hour.day}
                    </span>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hour.status === "open"}
                      onChange={(e) =>
                        updateOperationalHour(
                          index,
                          "status",
                          e.target.checked ? "open" : "close"
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]"></div>
                  </label>

                  {hour.status === "open" && (
                    <>
                      <input
                        type="time"
                        value={hour.open}
                        onChange={(e) =>
                          updateOperationalHour(index, "open", e.target.value)
                        }
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-[#FF6B35] transition-all"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="time"
                        value={hour.close}
                        onChange={(e) =>
                          updateOperationalHour(index, "close", e.target.value)
                        }
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-[#FF6B35] transition-all"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Media Sosial
              </h2>
              <button
                onClick={addLink}
                type="button"
                className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#ff5722] transition-colors text-sm"
              >
                + Tambah Link
              </button>
            </div>

            {formData.links.length === 0 ? (
              <div className="text-center py-12">
                <LinkIcon size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada link media sosial</p>
                <p className="text-sm text-gray-400 mt-1">
                  Klik "Tambah Link" untuk menambahkan
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.links.map((link, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-4 bg-gray-50 rounded-xl"
                  >
                    <input
                      type="text"
                      value={link.platform}
                      onChange={(e) =>
                        updateLink(index, "platform", e.target.value)
                      }
                      placeholder="Nama Platform (contoh: Instagram)"
                      className="w-48 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-[#FF6B35] transition-all"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(index, "url", e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-[#FF6B35] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Produk & Layanan
              </h2>
              <button
                onClick={addCatalog}
                type="button"
                className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#ff5722] transition-colors text-sm"
              >
                + Tambah Produk
              </button>
            </div>

            {formData.catalog.length === 0 ? (
              <div className="text-center py-12">
                <Package size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada produk</p>
                <p className="text-sm text-gray-400 mt-1">
                  Klik "Tambah Produk" untuk menambahkan
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.catalog.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-xl space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-700">
                        Produk {index + 1}
                      </h3>
                      <button
                        onClick={() => removeCatalog(index)}
                        type="button"
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updateCatalog(index, "name", e.target.value)
                        }
                        placeholder="Nama produk"
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-[#FF6B35] transition-all"
                      />
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          updateCatalog(index, "price", Number(e.target.value))
                        }
                        placeholder="Harga"
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-[#FF6B35] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Foto Produk
                      </label>
                      {item.image && (
                        <div className="relative h-32 w-32 mb-2 rounded-lg overflow-hidden">
                          <Image
                            src={URL.createObjectURL(item.image)}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCatalogImageUpload(index, e)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href={"/map"}>
              <button className="flex items-center gap-2 text-gray-700 hover:text-[#FF6B35] font-medium transition-all">
                <ArrowLeft size={20} />
                Kembali
              </button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Tambah UMKM</h1>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <div className="flex items-start justify-between relative">
              {[
                { num: 1, label: "Informasi Dasar" },
                { num: 2, label: "Jam Operasional" },
                { num: 3, label: "Media Sosial" },
                { num: 4, label: "Produk" },
              ].map((step, index) => (
                <React.Fragment key={step.num}>
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        step.num === currentStep
                          ? "bg-[#FF6B35] text-white scale-110 border-2 border-[#FF6B35]"
                          : step.num < currentStep
                          ? "bg-[#FF6B35] text-white border-2 border-[#FF6B35]"
                          : "bg-white border-2 border-gray-300 text-gray-400"
                      }`}
                    >
                      {step.num}
                    </div>

                    <span
                      className={`mt-2 text-xs font-medium transition-colors whitespace-nowrap ${
                        step.num <= currentStep
                          ? "text-[#FF6B35]"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < 3 && (
                    <div
                      className="flex-1 flex items-center relative"
                      style={{ marginTop: "20px" }}
                    >
                      <div
                        className={`w-full h-0.5 bg-gray-200 ${
                          index === 2 ? "mr-5" : ""
                        }`}
                      >
                        <div
                          className={`h-full bg-[#FF6B35] transition-all duration-300 ${
                            currentStep > step.num ? "w-full" : "w-0"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6"
        >
          {renderStepContent()}

          <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
              Sebelumnya
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                disabled={!canProceedToNextStep()}
                className="flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-white rounded-xl hover:bg-[#ff5722] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !canProceedToNextStep()}
                className="flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-white rounded-xl hover:bg-[#ff5722] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddventureForm;