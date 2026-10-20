import { ImageResponse } from "next/og";
import sharp from "sharp";

import { getPublicInvitation } from "@/features/invitations/services/get-public-invitation";
import { getPublicMediaUrl } from "@/features/media/utils/get-public-media-url";

export const alt = "Invitación de boda";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const invitation = await getPublicInvitation(slug);
  const coverPath = invitation?.media?.[0]?.path;

  let photo: string | null = null;

  if (coverPath) {
    // ImageResponse no lee .webp, así que se convierte a PNG
    const res = await fetch(getPublicMediaUrl(coverPath));
    const buffer = Buffer.from(await res.arrayBuffer());
    const png = await sharp(buffer).png().toBuffer();
    photo = `data:image/png;base64,${png.toString("base64")}`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f0e6",
        }}
      >
        {photo ? (
          <img
            src={photo}
            width={480}
            height={480}
            style={{ objectFit: "contain" }}
          />
        ) : (
          <div style={{ fontSize: 80, color: "#283517" }}>
            {invitation?.name ?? "Invitación"}
          </div>
        )}
      </div>
    ),
    { ...size },
  );
}