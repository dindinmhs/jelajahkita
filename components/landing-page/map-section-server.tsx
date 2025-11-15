import { createClient } from "@/lib/supabase/server";
import MapSectionClient from "./map-section-client";

export async function MapSection() {
  const supabase = await createClient();

  // Fetch UMKM data with location
  const { data: umkmList } = await supabase
    .from("umkm")
    .select(
      `
      id,
      name,
      category,
      description,
      lat,
      lon,
      media (
        id,
        image_url,
        is_thumbnail
      ),
      review (
        rating
      )
    `
    )
    .not("lat", "is", null)
    .not("lon", "is", null)
    .limit(10);

  // Transform data
  const umkmData = (umkmList || []).map((umkm) => {
    const ratings = umkm.review?.map((r: any) => r.rating) || [];
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum: number, r: number) => sum + r, 0) /
          ratings.length
        : 0;

    return {
      id: umkm.id,
      name: umkm.name,
      category: umkm.category || "Lainnya",
      description: umkm.description || "UMKM berkualitas",
      lat: umkm.lat,
      lon: umkm.lon,
      rating: parseFloat(avgRating.toFixed(1)),
      image: umkm.media?.[0]?.image_url || "/placeholder-umkm.jpg",
    };
  });

  return <MapSectionClient umkmList={umkmData} />;
}
