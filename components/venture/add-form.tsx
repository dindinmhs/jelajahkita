"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Clock,
  Link as LinkIcon,
  Package,
  MapPin,
} from "lucide-react";
import CoordinatePicker from "../common/coordinat-picker";
import axios from "axios";
import Image from "next/image";
import { useUserStore } from "@/lib/store/user-store";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface FormData {
  // Step 1
  name: string;
  description: string;
  category: string;
  lat: number;
  lon: number;
  address: string;
  media: File[];
  thumbnail: number;

  // Step 2
  operational_hours: {
    day: string;
    dayNumber: number; // 1-7
    open: string;
    close: string;
    status: string;
  }[];

  // Step 3
  links: {
    platform: string;
    url: string;
  }[];

  // Step 4
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

  // Handle coordinate change
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

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (formData.media.length + files.length > 3) {
      alert("Maksimal 3 media");
      return;
    }
    setFormData((prev) => ({ ...prev, media: [...prev.media, ...files] }));
  };

  // Remove media
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

  // Handle operational hours
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

  // Handle links
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

  // Handle catalog
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

  // Handle submit
  const handleSubmit = async () => {
    console.log(formData);
    if (!user) {
      alert("Anda harus login terlebih dahulu!");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      // 1. Upload media UMKM ke storage
      const mediaUrls: string[] = [];
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
      }

      // 2. Insert data UMKM
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
        })
        .select()
        .single();

      if (umkmError) throw umkmError;

      const umkmId = umkmData.id;

      // 3. Insert media UMKM
      const mediaInserts = mediaUrls.map((url, index) => ({
        umkm_id: umkmId,
        image_url: url,
        is_thumbnail: index === formData.thumbnail,
      }));

      const { error: mediaError } = await supabase
        .from("media")
        .insert(mediaInserts);

      if (mediaError) throw mediaError;

      // 4. Insert operational hours (dengan day sebagai numerik)
      const operationalInserts = formData.operational_hours.map((hour) => ({
        umkm_id: umkmId,
        day: hour.dayNumber, // Simpan sebagai angka 1-7
        open: hour.status === "open" ? hour.open : null,
        close: hour.status === "open" ? hour.close : null,
        status: hour.status,
      }));

      const { error: operationalError } = await supabase
        .from("operational_hours")
        .insert(operationalInserts);

      if (operationalError) throw operationalError;

      // 5. Insert links
      if (formData.links.length > 0) {
        const linkInserts = formData.links.map((link) => ({
          umkm_id: umkmId,
          platform: link.platform,
          url: link.url,
        }));

        const { error: linkError } = await supabase
          .from("umkm_links")
          .insert(linkInserts);

        if (linkError) throw linkError;
      }

      // 6. Upload product images dan insert catalog
      if (formData.catalog.length > 0) {
        for (const item of formData.catalog) {
          let imageUrl = "";

          // Upload image product jika ada
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

          // Insert catalog
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

      alert("Data berhasil disimpan!");
      console.log("UMKM ID:", umkmId);

      // Reset form atau redirect
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

    // Listen perubahan auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser]);

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Informasi UMKM
                </h2>
                <p className="text-gray-500 text-sm">
                  Lengkapi data dasar usaha Anda
                </p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama UMKM <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
                placeholder="Contoh: Warung Makan Bu Ani"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
                placeholder="Ceritakan tentang usaha Anda..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lokasi <span className="text-red-500">*</span>
              </label>
              <CoordinatePicker
                value={[formData.lat, formData.lon]}
                onChange={handleCoordinateChange}
              />
              {formData.address && (
                <div className="mt-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                  <p className="text-sm text-gray-600 mb-1">📍 Alamat:</p>
                  <p className="text-sm font-medium text-gray-800">
                    {formData.address}
                  </p>
                </div>
              )}
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Media (Maksimal 3) <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4">
                {formData.media.length < 3 && (
                  <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#FF6B35] hover:bg-orange-50 transition-all">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-[#FF6B35] to-[#FFA62B] rounded-full flex items-center justify-center">
                        <Upload className="text-white" size={28} />
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        Klik untuk upload gambar
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG hingga 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Preview Images */}
                <div className="grid grid-cols-3 gap-4">
                  {formData.media.map((file, index) => (
                    <div key={index} className="relative group">
                      <Image
                        width={200}
                        height={200}
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="w-full h-40 object-cover rounded-xl border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                      >
                        <X size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, thumbnail: index }))
                        }
                        className={`absolute bottom-2 left-2 px-3 py-1 text-xs font-medium rounded-full transition-all ${
                          formData.thumbnail === index
                            ? "bg-gradient-to-r from-[#FF6B35] to-[#FFA62B] text-white shadow-lg"
                            : "bg-white text-gray-700 border border-gray-300 hover:border-[#FF6B35]"
                        }`}
                      >
                        {formData.thumbnail === index
                          ? "✓ Thumbnail"
                          : "Set Thumbnail"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FFA62B] rounded-xl flex items-center justify-center">
                <Clock className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Jam Operasional
                </h2>
                <p className="text-gray-500 text-sm">
                  Atur jadwal buka usaha Anda
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {formData.operational_hours.map((hour, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-[#FF6B35] transition-all"
                >
                  <span className="w-24 font-semibold text-gray-700">
                    {hour.day}
                  </span>

                  <select
                    value={hour.status}
                    onChange={(e) =>
                      updateOperationalHour(index, "status", e.target.value)
                    }
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  >
                    <option value="open">Buka</option>
                    <option value="close">Tutup</option>
                  </select>

                  {hour.status === "open" && (
                    <>
                      <input
                        type="time"
                        value={hour.open}
                        onChange={(e) =>
                          updateOperationalHour(index, "open", e.target.value)
                        }
                        className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                      />
                      <span className="text-gray-400 font-bold">-</span>
                      <input
                        type="time"
                        value={hour.close}
                        onChange={(e) =>
                          updateOperationalHour(index, "close", e.target.value)
                        }
                        className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FFA62B] rounded-xl flex items-center justify-center">
                <LinkIcon className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Link Sosial Media
                </h2>
                <p className="text-gray-500 text-sm">
                  Tambahkan link media sosial usaha Anda (opsional)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {formData.links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-[#FF6B35] transition-all"
                >
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) =>
                      updateLink(index, "platform", e.target.value)
                    }
                    placeholder="Platform (Instagram, Facebook, dll)"
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addLink}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#FF6B35] hover:text-[#FF6B35] hover:bg-orange-50 transition-all font-medium"
              >
                + Tambah Link Sosial Media
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FFA62B] rounded-xl flex items-center justify-center">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Katalog Produk
                </h2>
                <p className="text-gray-500 text-sm">
                  Tambahkan produk atau layanan yang Anda tawarkan (opsional)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {formData.catalog.map((item, index) => (
                <div
                  key={index}
                  className="p-6 border-2 border-gray-200 rounded-xl space-y-4 hover:border-[#FF6B35] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg text-gray-700">
                      Produk #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCatalog(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      updateCatalog(index, "name", e.target.value)
                    }
                    placeholder="Nama Produk"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />

                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      updateCatalog(index, "price", Number(e.target.value))
                    }
                    placeholder="Harga (Rp)"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />

                  {/* Image Upload for Product */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gambar Produk
                    </label>
                    {item.image ? (
                      <div className="relative group">
                        <Image
                          width={400}
                          height={300}
                          src={URL.createObjectURL(item.image)}
                          alt={`Product ${index}`}
                          className="w-full h-56 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateCatalog(
                              index,
                              "image",
                              null as unknown as File
                            )
                          }
                          className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#FF6B35] hover:bg-orange-50 transition-all">
                        <div className="text-center">
                          <div className="w-14 h-14 mx-auto mb-2 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                            <Upload className="text-white" size={24} />
                          </div>
                          <p className="text-sm font-medium text-gray-600">
                            Upload gambar produk
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleCatalogImageUpload(index, e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addCatalog}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#FF6B35] hover:text-[#FF6B35] hover:bg-orange-50 transition-all font-medium"
              >
                + Tambah Produk
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-5xl mx-auto p-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FFA62B] bg-clip-text text-transparent mb-2">
            Daftarkan UMKM Anda
          </h1>
          <p className="text-gray-600">
            Lengkapi informasi usaha Anda dalam 4 langkah mudah
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="relative">
            {/* Background Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />

            {/* Animated Progress Line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-5 left-0 h-1 bg-gradient-to-r from-[#FF6B35] to-[#FFA62B] rounded-full z-10"
            />

            {/* Steps */}
            <div className="relative flex justify-between">
              {[
                { num: 1, label: "Informasi UMKM", icon: MapPin },
                { num: 2, label: "Jam Operasional", icon: Clock },
                { num: 3, label: "Link Sosial", icon: LinkIcon },
                { num: 4, label: "Katalog Produk", icon: Package },
              ].map((step) => {
                const Icon = step.icon;
                const isActive = currentStep >= step.num;
                const isCurrent = currentStep === step.num;

                return (
                  <div key={step.num} className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isCurrent ? 1.1 : 1,
                        backgroundColor: isActive ? "#FF6B35" : "#E5E7EB",
                      }}
                      transition={{ duration: 0.3 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg z-20 ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    >
                      <Icon size={20} />
                    </motion.div>
                    <motion.span
                      initial={false}
                      animate={{
                        color: isActive ? "#FF6B35" : "#9CA3AF",
                        fontWeight: isCurrent ? 600 : 400,
                      }}
                      className="text-sm mt-2 text-center max-w-[80px]"
                    >
                      {step.label}
                    </motion.span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100"
        >
          {renderStepContent()}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-8 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
          >
            Kembali
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
              className="flex items-center gap-2 px-8 py-3 bg-[#FF6B35] font-semibold text-white rounded-full hover:shadow-lg transition-all"
            >
              Selanjutnya
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {loading ? "Menyimpan..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddventureForm;
