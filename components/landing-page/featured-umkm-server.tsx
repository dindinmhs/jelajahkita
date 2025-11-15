import { createClient } from "@/lib/supabase/server";
import FeaturedUMKMClient from "./featured-umkm-client";

export async function FeaturedUMKM() {
  const supabase = await createClient();

  // Fetch UMKM data from database
  const { data: umkmList } = await supabase
    .from("umkm")
    .select(
      `
      id,
      name,
      description,
      category,
      address,
      media (
        id,
        image_url,
        is_thumbnail
      )
    `
    )
    .eq("media.is_thumbnail", true)
    .limit(6)
    .order("created_at", { ascending: false });

  // Transform data to match component props
  const featuredBusinesses = (umkmList || []).slice(0, 3).map((umkm) => ({
    id: umkm.id,
    name: umkm.name,
    description: umkm.description || "UMKM berkualitas dengan produk terbaik",
    category: umkm.category || "Lainnya",
    location: umkm.address?.split(",")[0] || "Jakarta",
    image: umkm.media?.[0]?.image_url || "/placeholder-umkm.jpg",
  }));

  return <FeaturedUMKMClient businesses={featuredBusinesses} />;
}
