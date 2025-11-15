import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DetailView from "@/components/umkm/detail-view";

export default async function UmkmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // Get UMKM detail with all related data including reviews
  const { data: umkmData, error } = await supabase
    .from("umkm")
    .select(
      `
      *,
      media (
        id,
        image_url,
        is_thumbnail
      ),
      operational_hours (
        id,
        day,
        open,
        close,
        status
      ),
      umkm_links (
        id,
        platform,
        url
      ),
      catalog (
        id,
        name,
        price,
        image_url
      )
    `
    )
    .eq("id", id)
    .eq("user_id", user.id) // Ensure user owns this UMKM
    .single();

  if (error || !umkmData) {
    return redirect("/umkm");
  }

  // Get reviews with user information from auth metadata
  const { data: reviews } = await supabase
    .from("review")
    .select("*")
    .eq("umkm_id", id)
    .order("created_at", { ascending: false });

  // Add full_name from auth users
  const reviewsWithUsers = await Promise.all(
    (reviews || []).map(async (review: any) => {
      // Try to get user metadata
      const {
        data: { users },
      } = await supabase.auth.admin.listUsers();
      const reviewUser = users?.find((u) => u.id === review.user_id);

      return {
        ...review,
        full_name: reviewUser?.user_metadata?.full_name || "Pengguna",
      };
    })
  );

  const umkmDataWithReviews = {
    ...umkmData,
    review: reviewsWithUsers,
  };

  return <DetailView umkmData={umkmDataWithReviews} />;
}
