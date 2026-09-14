import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";

export async function getMyWeddings() {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    return [];
  }

  return prisma.wedding.findMany({
    where: {
      members: {
        some: {
          userId: authUser.id,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}