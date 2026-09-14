import { notFound } from "next/navigation";

import { getPublicInvitation } from "@/features/invitations/services/get-public-invitation";
import { InvitationSectionRenderer } from "@/features/invitations/components/invitation-section-renderer";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const invitation = await getPublicInvitation(slug);

  if (!invitation) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {invitation.invitationSections.map(section => (
        <InvitationSectionRenderer
          key={section.id}
          section={section}
          invitation={invitation}
        />
      ))}
    </main>
  );
}
