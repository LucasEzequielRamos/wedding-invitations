import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "./get-current-user";

export async function getCurrentUserProfile() {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: authUser.id,
    },
  });
}