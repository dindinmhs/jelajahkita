import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AllReviewsView from "@/components/umkm/all-reviews-view";

export default async function AllReviewsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // Fetch UMKM data
  const { data: umkmData } = await supabase
    .from("umkm")
    .select("id, name")
    .eq("id", id)
    .single();

  if (!umkmData) {
    return redirect("/umkm");
  }

  // Fetch all reviews
  const { data: reviews } = await supabase
    .from("review")
    .select("*")
    .eq("umkm_id", id)
    .order("created_at", { ascending: false });

  // Get user metadata for each review
  const reviewsWithUsers = await Promise.all(
    (reviews || []).map(async (review) => {
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

  return <AllReviewsView umkmData={umkmData} reviews={reviewsWithUsers} />;
}
