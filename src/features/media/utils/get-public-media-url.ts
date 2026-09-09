const BUCKET = "wedding-media";

export function getPublicMediaUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const encodedPath = path
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return `${baseUrl}/storage/v1/object/public/${BUCKET}/${encodedPath}`;
}