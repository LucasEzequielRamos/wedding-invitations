import { prisma } from "@/lib/db/prisma";

export async function getPublicInvitation(slug: string) {
  const wedding = await prisma.wedding.findFirst({
    where: {
      slug,
      status: {
        in: ["PUBLISHED", "COMPLETED"],
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      weddingDate: true,
      status: true,
      plan: true,

      rsvpEnabled: true,
      rsvpDeadline: true,
      giftsEnabled: true,

      events: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            date: "asc",
          },
        ],
        select: {
          id: true,
          name: true,
          date: true,
          time: true,
          location: true,
          address: true,
          mapsUrl: true,
          sortOrder: true,
        },
      },

      media: {
  orderBy: [
    { sortOrder: "asc" },
    { createdAt: "asc" },
  ],
  select: {
    id: true,
    path: true,
    type: true,
    alt: true,
    sortOrder: true,
    mimeType: true,
    width: true,
    height: true,
  },
},

      gifts: {
        where: {
          isVisible: true,
        },
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          externalUrl: true,
          paymentUrl: true,
          sortOrder: true,
        },
      },

     invitationSections: {
  where: {
    enabled: true,
  },
  orderBy: {
    sortOrder: "asc",
  },
  select: {
    id: true,
    type: true,
    sortOrder: true,
    config: true,
  },
},
    },
  });

  if (!wedding) {
    return null;
  }

  const now = new Date();

  const rsvpAvailable =
    wedding.plan === "FULL" &&
    wedding.status === "PUBLISHED" &&
    wedding.rsvpEnabled &&
    (!wedding.rsvpDeadline ||
      now <= wedding.rsvpDeadline);

  const giftsAvailable =
    wedding.plan === "FULL" &&
    wedding.giftsEnabled;

  return {
    ...wedding,
    rsvpAvailable,
    giftsAvailable,
  };
}