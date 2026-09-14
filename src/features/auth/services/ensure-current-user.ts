import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "./get-current-user";

export async function ensureCurrentUser() {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    return null;
  }

  const user = await prisma.user.upsert({
    where: {
      id: authUser.id,
    },
    update: {
      email: authUser.email ?? "",
    },
    create: {
      id: authUser.id,
      email: authUser.email ?? "",
      name: authUser.user_metadata?.name ?? authUser.email?.split("@")[0] ?? "Usuario",
      accountType: "COUPLE",
    },
  });

  return user;
}