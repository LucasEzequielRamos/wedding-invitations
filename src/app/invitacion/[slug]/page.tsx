import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublicInvitation } from "@/features/invitations/services/get-public-invitation";
import { InvitationSectionRenderer } from "@/features/invitations/components/invitation-section-renderer";

const siteUrl = "https://invitacionesberacah.vercel.app";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getPublicInvitation(slug);

  if (!invitation) {
    return {
      title: "Invitación no encontrada | Invitaciones Beracah",
    };
  }

  const title = `${invitation.name} | Invitación de boda`;
 const date = invitation.weddingDate
  ? new Intl.DateTimeFormat("es-AR", {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(invitation.weddingDate)
  : null;

const description = date
  ? `Te invitamos a celebrar nuestra boda. ${invitation.name} · ${date}. Conocé todos los detalles de este día especial.`
  : `Te invitamos a celebrar nuestra boda. ${invitation.name}. Conocé todos los detalles de este día especial.`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: "Invitaciones Beracah",
      title,
      description,
      url: `${siteUrl}/invitacion/${encodeURIComponent(slug)}`,
      // Agregaremos la imagen cuando subas el logo.
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params;
  const invitation = await getPublicInvitation(slug);

  if (!invitation) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {invitation.invitationSections.map((section) => (
        <InvitationSectionRenderer
          key={section.id}
          section={section}
          invitation={invitation}
        />
      ))}
    </main>
  );
}