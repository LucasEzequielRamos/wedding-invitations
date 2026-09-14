import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "wedding-media";

export function getMediaUrl(path: string) {
  const supabase = createAdminClient();

  const {
    data: { publicUrl },
  } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return publicUrl;
}