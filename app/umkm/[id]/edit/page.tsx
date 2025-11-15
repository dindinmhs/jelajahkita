import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditForm from "@/components/umkm/edit-form";

export default async function EditUmkmPage({
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

  // Get UMKM detail with all related data
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

  return <EditForm umkmData={umkmData} />;
}
