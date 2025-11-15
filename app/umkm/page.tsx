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

  // Get user's UMKM with reviews
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
      ),
      review (
        rating
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Transform UMKM data with thumbnails and calculate ratings
  const umkmList = (umkmData || []).map((umkm: any) => {
    const reviews = umkm.review || [];
    const reviewCount = reviews.length;
    const avgRating =
      reviewCount > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
          reviewCount
        : 0;

    return {
      id: umkm.id,
      name: umkm.name,
      description: umkm.description,
      category: umkm.category,
      address: umkm.address,
      status: "published",
      rating: avgRating > 0 ? Number(avgRating.toFixed(1)) : undefined,
      reviewCount: reviewCount,
      thumbnail:
        umkm.media?.find((m: any) => m.is_thumbnail)?.image_url ||
        umkm.media?.[0]?.image_url,
    };
  });

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

  // Calculate review rating distribution (1-5 stars) from actual reviews
  const ratingCount: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  // Get all reviews for user's UMKM
  const { data: allReviews } = await supabase
    .from("review")
    .select("rating, umkm_id")
    .in(
      "umkm_id",
      umkmList.map((u) => u.id)
    );

  // Count ratings from actual reviews
  (allReviews || []).forEach((review: any) => {
    const rating = Math.round(review.rating);
    if (rating >= 1 && rating <= 5) {
      ratingCount[rating]++;
    }
  });

  // Create array sorted by rating (5 to 1 for better visualization)
  const reviewRatingData = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: ratingCount[rating],
  }));

  // Get total reviews count
  const totalReviews = allReviews?.length || 0;

  // Get stats
  const stats = {
    savedPlaces: 0, // Implement saved places feature
    myBusinesses: umkmList.length,
    reviews: totalReviews,
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
