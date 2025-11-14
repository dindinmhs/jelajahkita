import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardWrapper from "@/components/umkm/dashboard-wrapper";

export default async function UmkmPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // Get user data
  const fullName = user.user_metadata?.full_name || "";
  const email = user.email || "";
  const phone = user.user_metadata?.phone || "";
  const createdAt = user.created_at || new Date().toISOString();

  // Get user's UMKM
  const { data: umkmData } = await supabase
    .from("umkm")
    .select(
      `
      id,
      name,
      description,
      category,
      address,
      created_at,
      media (
        image_url,
        is_thumbnail
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Transform UMKM data with thumbnails
  const umkmList = (umkmData || []).map((umkm: any) => ({
    id: umkm.id,
    name: umkm.name,
    description: umkm.description,
    category: umkm.category,
    address: umkm.address,
    status: "published", // You can add status field to database
    rating: 4.5, // You can calculate from reviews
    reviewCount: 0, // You can count from reviews
    thumbnail:
      umkm.media?.find((m: any) => m.is_thumbnail)?.image_url ||
      umkm.media?.[0]?.image_url,
  }));

  // Calculate category distribution
  const categoryCount: Record<string, number> = {};
  umkmList.forEach((umkm) => {
    categoryCount[umkm.category] = (categoryCount[umkm.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCount).map(
    ([category, count]) => ({
      category,
      count,
    })
  );

  // Calculate review rating distribution (1-5 stars)
  const ratingCount: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  // Count ratings from all businesses
  umkmList.forEach((umkm) => {
    if (umkm.rating && umkm.rating >= 1 && umkm.rating <= 5) {
      const roundedRating = Math.round(umkm.rating);
      ratingCount[roundedRating]++;
    }
  });

  // Create array sorted by rating (5 to 1 for better visualization)
  const reviewRatingData = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: ratingCount[rating],
  }));

  // Get stats
  const stats = {
    savedPlaces: 0, // Implement saved places feature
    myBusinesses: umkmList.length,
    reviews: 0, // Implement reviews count
    trips: 0, // Implement trips feature
  };

  return (
    <DashboardWrapper
      userData={{
        fullName,
        email,
        phone,
        createdAt,
      }}
      stats={stats}
      umkmList={umkmList}
      categoryData={categoryData}
      reviewRatingData={reviewRatingData}
    />
  );
}
