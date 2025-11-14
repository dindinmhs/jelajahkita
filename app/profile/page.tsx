import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileWrapper from "@/components/profile/profile-wrapper";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // Get full name from user metadata
  const fullName = user.user_metadata?.full_name || "";
  const phone = user.user_metadata?.phone || "";
  const address = user.user_metadata?.address || "";
  const dateOfBirth = user.user_metadata?.date_of_birth || "";
  const gender = user.user_metadata?.gender || "";
  const email = user.email || "";
  const createdAt = user.created_at || new Date().toISOString();

  return (
    <ProfileWrapper
      initialFullName={fullName}
      initialPhone={phone}
      initialAddress={address}
      initialDateOfBirth={dateOfBirth}
      initialGender={gender}
      email={email}
      createdAt={createdAt}
    />
  );
}
