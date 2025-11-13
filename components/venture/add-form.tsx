"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Upload, X, Clock, Link as LinkIcon, Package } from "lucide-react";
import CoordinatePicker from "../common/coordinat-picker";
import axios from "axios";
import Image from "next/image";
import { useUserStore } from "@/lib/store/user-store";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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
      { day: "Senin", dayNumber: 1, open: "09:00", close: "17:00", status: "open" },
      { day: "Selasa", dayNumber: 2, open: "09:00", close: "17:00", status: "open" },
      { day: "Rabu", dayNumber: 3, open: "09:00", close: "17:00", status: "open" },
      { day: "Kamis", dayNumber: 4, open: "09:00", close: "17:00", status: "open" },
      { day: "Jumat", dayNumber: 5, open: "09:00", close: "17:00", status: "open" },
      { day: "Sabtu", dayNumber: 6, open: "09:00", close: "17:00", status: "open" },
      { day: "Minggu", dayNumber: 7, open: "09:00", close: "17:00", status: "close" },
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
        setFormData((prev) => ({ ...prev, address: response.data.display_name }));
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
      thumbnail: prev.thumbnail === index ? 0 : prev.thumbnail > index ? prev.thumbnail - 1 : prev.thumbnail,
    }));
  };

  // Handle operational hours
  const updateOperationalHour = (index: number, field: string, value: string) => {
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

  const updateCatalog = (index: number, field: string, value: string | number | File) => {
    setFormData((prev) => ({
      ...prev,
      catalog: prev.catalog.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleCatalogImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateCatalog(index, "image", file);
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    console.log(formData)
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

        const { data: { publicUrl } } = supabase.storage
          .from("umkm-media")
          .getPublicUrl(fileName);

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
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("product-images")
              .upload(fileName, item.image);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from("product-images")
              .getPublicUrl(fileName);

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
      router.push('/map');
      
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
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

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
            <h2 className="text-2xl font-bold text-gray-800">Informasi UMKM</h2>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama UMKM *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Contoh: Warung Makan Bu Ani"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ceritakan tentang usaha Anda..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi *
              </label>
              <CoordinatePicker
                value={[formData.lat, formData.lon]}
                onChange={handleCoordinateChange}
              />
              {formData.address && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Alamat:</p>
                  <p className="text-sm font-medium">{formData.address}</p>
                </div>
              )}
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media (Maksimal 3) *
              </label>
              <div className="space-y-4">
                {formData.media.length < 3 && (
                  <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                    <div className="text-center">
                      <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                      <p className="text-sm text-gray-600">
                        Klik untuk upload gambar
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
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, thumbnail: index }))}
                        className={`absolute bottom-2 left-2 px-2 py-1 text-xs rounded ${
                          formData.thumbnail === index
                            ? "bg-orange-500 text-white"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        {formData.thumbnail === index ? "Thumbnail" : "Set Thumbnail"}
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
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Clock size={28} />
              Jam Operasional
            </h2>

            <div className="space-y-3">
              {formData.operational_hours.map((hour, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <span className="w-24 font-medium">{hour.day}</span>
                  
                  <select
                    value={hour.status}
                    onChange={(e) => updateOperationalHour(index, "status", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="open">Buka</option>
                    <option value="close">Tutup</option>
                  </select>

                  {hour.status === "open" && (
                    <>
                      <input
                        type="time"
                        value={hour.open}
                        onChange={(e) => updateOperationalHour(index, "open", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={hour.close}
                        onChange={(e) => updateOperationalHour(index, "close", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <LinkIcon size={28} />
              Link Sosial Media
            </h2>

            <div className="space-y-4">
              {formData.links.map((link, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => updateLink(index, "platform", e.target.value)}
                    placeholder="Platform (Instagram, Facebook, dll)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addLink}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
              >
                + Tambah Link
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Package size={28} />
              Katalog Produk
            </h2>

            <div className="space-y-4">
              {formData.catalog.map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Produk #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeCatalog(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateCatalog(index, "name", e.target.value)}
                    placeholder="Nama Produk"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />

                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateCatalog(index, "price", Number(e.target.value))}
                    placeholder="Harga"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />

                  {/* Image Upload for Product */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Produk
                    </label>
                    {item.image ? (
                      <div className="relative group">
                        <Image
                          width={200}
                          height={200}
                          src={URL.createObjectURL(item.image)}
                          alt={`Product ${index}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => updateCatalog(index, "image", null as unknown as File)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                        <div className="text-center">
                          <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                          <p className="text-sm text-gray-600">Upload gambar produk</p>
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
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= step
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? "bg-orange-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Informasi</span>
          <span>Jam Operasional</span>
          <span>Link</span>
          <span>Katalog</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
          Kembali
        </button>

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Selanjutnya
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddventureForm;