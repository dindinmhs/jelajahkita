"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Link as LinkIcon,
  Package,
  ArrowLeft,
  Trash2,
  Star,
} from "lucide-react";
import CoordinatePicker from "../common/coordinat-picker";
import axios from "axios";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

interface Media {
  id: string;
  image_url: string;
  is_thumbnail: boolean;
}

interface OperationalHour {
  id: string;
  day: number;
  open: string;
  close: string;
  status: string;
}

interface UmkmLink {
  id: string;
  platform: string;
  url: string;
}

interface Catalog {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

interface UmkmData {
  id: string;
  name: string;
  description: string;
  address: string;
  no_telp: string;
  category: string;
  lat: number;
  lon: number;
  media: Media[];
  operational_hours: OperationalHour[];
  umkm_links: UmkmLink[];
  catalog: Catalog[];
}

interface FormData {
  name: string;
  description: string;
  category: string;
  lat: number;
  lon: number;
  address: string;
  no_telp: string;
  media: (File | { id: string; url: string })[];
  thumbnail: number;
  operational_hours: {
    id?: string;
    day: string;
    dayNumber: number;
    open: string;
    close: string;
    status: string;
  }[];
  links: {
    id?: string;
    platform: string;
    url: string;
  }[];
  catalog: {
    id?: string;
    name: string;
    price: number;
    image: File | string | null;
  }[];
  deletedMedia: string[];
  deletedLinks: string[];
  deletedCatalog: string[];
}

interface EditFormProps {
  umkmData: UmkmData;
}

export default function EditForm({ umkmData }: EditFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: umkmData.name,
    description: umkmData.description,
    category: umkmData.category,
    lat: umkmData.lat,
    lon: umkmData.lon,
    address: umkmData.address,
    no_telp: umkmData.no_telp || "",
    media: umkmData.media.map((m) => ({ id: m.id, url: m.image_url })),
    thumbnail: umkmData.media.findIndex((m) => m.is_thumbnail) || 0,
    operational_hours: umkmData.operational_hours.map((oh) => ({
      id: oh.id,
      day: getDayName(oh.day),
      dayNumber: oh.day,
      open: oh.open || "09:00",
      close: oh.close || "17:00",
      status: oh.status,
    })),
    links: umkmData.umkm_links.map((link) => ({
      id: link.id,
      platform: link.platform,
      url: link.url,
    })),
    catalog: umkmData.catalog.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image_url,
    })),
    deletedMedia: [],
    deletedLinks: [],
    deletedCatalog: [],
  });

  const categories = ["Kuliner", "Fashion", "Jasa", "Lainnya"];

  function getDayName(day: number) {
    const days: { [key: number]: string } = {
      1: "Senin",
      2: "Selasa",
      3: "Rabu",
      4: "Kamis",
      5: "Jumat",
      6: "Sabtu",
      7: "Minggu",
    };
    return days[day] || "";
  }

  // Ensure all days are present
  useEffect(() => {
    const allDays = [
      { day: "Senin", dayNumber: 1 },
      { day: "Selasa", dayNumber: 2 },
      { day: "Rabu", dayNumber: 3 },
      { day: "Kamis", dayNumber: 4 },
      { day: "Jumat", dayNumber: 5 },
      { day: "Sabtu", dayNumber: 6 },
      { day: "Minggu", dayNumber: 7 },
    ];

    const existingDays = formData.operational_hours.map((oh) => oh.dayNumber);
    const missingDays = allDays.filter(
      (day) => !existingDays.includes(day.dayNumber)
    );

    if (missingDays.length > 0) {
      setFormData((prev) => ({
        ...prev,
        operational_hours: [
          ...prev.operational_hours,
          ...missingDays.map((day) => ({
            day: day.day,
            dayNumber: day.dayNumber,
            open: "09:00",
            close: "17:00",
            status: "close",
          })),
        ].sort((a, b) => a.dayNumber - b.dayNumber),
      }));
    }
  }, []);

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
    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, ...files],
    }));
  };

  const removeMedia = (index: number) => {
    const mediaItem = formData.media[index];
    const newMedia = formData.media.filter((_, i) => i !== index);
    const newThumbnail =
      formData.thumbnail === index
        ? 0
        : formData.thumbnail > index
        ? formData.thumbnail - 1
        : formData.thumbnail;

    setFormData((prev) => ({
      ...prev,
      media: newMedia,
      thumbnail: newThumbnail,
      deletedMedia:
        typeof mediaItem === "object" && "id" in mediaItem
          ? [...prev.deletedMedia, mediaItem.id]
          : prev.deletedMedia,
    }));
  };

  const setThumbnail = (index: number) => {
    setFormData((prev) => ({ ...prev, thumbnail: index }));
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
    const link = formData.links[index];
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
      deletedLinks: link.id
        ? [...prev.deletedLinks, link.id]
        : prev.deletedLinks,
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
    const item = formData.catalog[index];
    setFormData((prev) => ({
      ...prev,
      catalog: prev.catalog.filter((_, i) => i !== index),
      deletedCatalog: item.id
        ? [...prev.deletedCatalog, item.id]
        : prev.deletedCatalog,
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

  const handleCatalogImage = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      updateCatalog(index, "image", file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      // 1. Delete removed items
      if (formData.deletedMedia.length > 0) {
        await supabase.from("media").delete().in("id", formData.deletedMedia);
      }
      if (formData.deletedLinks.length > 0) {
        await supabase
          .from("umkm_links")
          .delete()
          .in("id", formData.deletedLinks);
      }
      if (formData.deletedCatalog.length > 0) {
        await supabase
          .from("catalog")
          .delete()
          .in("id", formData.deletedCatalog);
      }

      // 2. Update UMKM basic info
      const { error: umkmError } = await supabase
        .from("umkm")
        .update({
          name: formData.name,
          description: formData.description,
          address: formData.address,
          lat: formData.lat,
          lon: formData.lon,
          category: formData.category,
          no_telp: formData.no_telp,
        })
        .eq("id", umkmData.id);

      if (umkmError) throw umkmError;

      // 3. Handle media uploads
      const newMediaFiles = formData.media.filter((m) => m instanceof File);
      const existingMedia = formData.media.filter(
        (m): m is { id: string; url: string } =>
          typeof m === "object" && "id" in m
      );

      const mediaUrls: string[] = existingMedia.map((m) => m.url);

      for (let i = 0; i < newMediaFiles.length; i++) {
        const file = newMediaFiles[i] as File;
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

      // Update thumbnail status for all media
      await supabase
        .from("media")
        .update({ is_thumbnail: false })
        .eq("umkm_id", umkmData.id);

      // Insert new media
      if (newMediaFiles.length > 0) {
        const mediaInserts = mediaUrls
          .slice(existingMedia.length)
          .map((url, index) => ({
            umkm_id: umkmData.id,
            image_url: url,
            is_thumbnail: index + existingMedia.length === formData.thumbnail,
          }));

        await supabase.from("media").insert(mediaInserts);
      }

      // Update thumbnail for existing media
      if (formData.thumbnail < existingMedia.length) {
        await supabase
          .from("media")
          .update({ is_thumbnail: true })
          .eq("id", existingMedia[formData.thumbnail].id);
      }

      // 4. Update operational hours
      await supabase
        .from("operational_hours")
        .delete()
        .eq("umkm_id", umkmData.id);

      const operationalInserts = formData.operational_hours.map((hour) => ({
        umkm_id: umkmData.id,
        day: hour.dayNumber,
        open: hour.status === "open" ? hour.open : null,
        close: hour.status === "open" ? hour.close : null,
        status: hour.status,
      }));

      await supabase.from("operational_hours").insert(operationalInserts);

      // 5. Handle links
      const newLinks = formData.links.filter(
        (link) => !link.id && link.platform && link.url
      );
      const updatedLinks = formData.links.filter((link) => link.id);

      if (newLinks.length > 0) {
        const linkInserts = newLinks.map((link) => ({
          umkm_id: umkmData.id,
          platform: link.platform,
          url: link.url,
        }));
        await supabase.from("umkm_links").insert(linkInserts);
      }

      for (const link of updatedLinks) {
        if (link.id) {
          await supabase
            .from("umkm_links")
            .update({ platform: link.platform, url: link.url })
            .eq("id", link.id);
        }
      }

      // 6. Handle catalog
      for (const item of formData.catalog) {
        let imageUrl = typeof item.image === "string" ? item.image : "";

        if (item.image instanceof File) {
          const fileName = `${Date.now()}_${item.image.name}`;
          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(fileName, item.image);

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("product-images").getPublicUrl(fileName);

          imageUrl = publicUrl;
        }

        if (item.id) {
          // Update existing
          await supabase
            .from("catalog")
            .update({
              name: item.name,
              price: item.price,
              image_url: imageUrl,
            })
            .eq("id", item.id);
        } else {
          // Insert new
          await supabase.from("catalog").insert({
            umkm_id: umkmData.id,
            name: item.name,
            price: item.price,
            image_url: imageUrl,
          });
        }
      }

      alert("UMKM berhasil diperbarui!");
      router.push(`/umkm/${umkmData.id}`);
    } catch (error) {
      console.error("Error updating UMKM:", error);
      alert("Gagal memperbarui UMKM. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.name &&
          formData.description &&
          formData.category &&
          formData.media.length > 0
        );
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/umkm`}>
              <button className="flex items-center gap-2 text-gray-700 hover:text-[#FF6B35] font-medium transition-all">
                <ArrowLeft size={20} />
                Kembali
              </button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Edit Bisnis</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="relative">
            {/* Steps Container */}
            <div className="flex items-start justify-between relative">
              {/* Steps */}
              {[
                { num: 1, label: "Informasi Dasar" },
                { num: 2, label: "Jam Operasional" },
                { num: 3, label: "Media Sosial" },
                { num: 4, label: "Produk" },
              ].map((step, index) => (
                <React.Fragment key={step.num}>
                  <div className="flex flex-col items-center relative z-10">
                    {/* Circle */}
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

                    {/* Label */}
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

                  {/* Line after circle (except for last step) */}
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

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6"
        >
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Informasi Dasar
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Bisnis
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-[#FF6B35] focus:bg-white transition-all"
                  placeholder="Masukkan nama bisnis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setCategoryDropdownOpen(!categoryDropdownOpen)
                    }
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

                  {/* Dropdown Menu */}
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
                            setFormData({ ...formData, category: cat });
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
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-[#FF6B35] focus:bg-white transition-all resize-none"
                  placeholder="Ceritakan tentang bisnis Anda..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={formData.no_telp}
                  onChange={(e) =>
                    setFormData({ ...formData, no_telp: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-[#FF6B35] focus:bg-white transition-all"
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi
                </label>
                <div className="mb-2">
                  <CoordinatePicker
                    value={[formData.lat, formData.lon]}
                    onChange={handleCoordinateChange}
                  />
                </div>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-[#FF6B35] focus:bg-white transition-all"
                  placeholder="Alamat lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Foto
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="media-upload"
                />

                <div className="flex gap-4 items-start">
                  {formData.media.slice(0, 2).map((media, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-32 h-32 rounded-3xl overflow-hidden border border-gray-200 bg-gray-50">
                        <Image
                          src={
                            media instanceof File
                              ? URL.createObjectURL(media)
                              : media.url
                          }
                          alt={`Preview ${index}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {formData.thumbnail !== index && (
                            <button
                              onClick={() => setThumbnail(index)}
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
          )}

          {/* Step 2: Operational Hours */}
          {currentStep === 2 && (
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]"></div>
                    </label>
                    {hour.status === "open" && (
                      <>
                        <input
                          type="time"
                          value={hour.open}
                          onChange={(e) =>
                            updateOperationalHour(index, "open", e.target.value)
                          }
                          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                          type="time"
                          value={hour.close}
                          onChange={(e) =>
                            updateOperationalHour(
                              index,
                              "close",
                              e.target.value
                            )
                          }
                          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Social Media Links */}
          {currentStep === 3 && (
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
                        onChange={(e) =>
                          updateLink(index, "url", e.target.value)
                        }
                        placeholder="https://..."
                        className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-[#FF6B35] transition-all"
                      />
                      <button
                        onClick={() => removeLink(index)}
                        type="button"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Catalog/Products */}
          {currentStep === 4 && (
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
                            updateCatalog(
                              index,
                              "price",
                              Number(e.target.value)
                            )
                          }
                          placeholder="Harga"
                          className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-[#FF6B35] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Foto Produk
                        </label>
                        {typeof item.image === "string" && item.image && (
                          <div className="relative h-32 w-32 mb-2 rounded-lg overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleCatalogImage(index, e)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons - Inside Card */}
          <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              type="button"
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
              Sebelumnya
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                type="button"
                className="flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-white rounded-full hover:bg-[#ff5722] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Selanjutnya
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !isStepValid()}
                type="button"
                className="flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-white rounded-full hover:bg-[#ff5722] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>Simpan Perubahan</>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
