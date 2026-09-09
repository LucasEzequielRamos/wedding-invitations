import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import type { ImportGuestRow } from "../schemas/import-guests.schema";

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function importGuests(
  weddingId: string,
  rows: ImportGuestRow[],
) {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    throw new Error("No autenticado");
  }

  if (rows.length === 0) {
    throw new Error("No hay invitados para importar");
  }

  const wedding = await prisma.wedding.findFirst({
    where: {
      id: weddingId,
      members: {
        some: {
          userId: authUser.id,
        },
      },
    },
  });

  if (!wedding) {
    throw new Error("Boda no encontrada");
  }

  if (wedding.status === "COMPLETED") {
    throw new Error("La boda está completada");
  }

  return prisma.$transaction(async (tx) => {
    /*
     * ---------------------------------------------------------
     * 1. Buscar invitados existentes
     * ---------------------------------------------------------
     */

    const existingGuests = await tx.guest.findMany({
      where: {
        weddingId,
      },
      select: {
        firstName: true,
        lastName: true,
      },
    });

    const existingGuestKeys = new Set(
      existingGuests.map(
        (guest) =>
          `${normalize(guest.firstName)}|${normalize(guest.lastName)}`,
      ),
    );

    /*
     * ---------------------------------------------------------
     * 2. Detectar duplicados dentro del Excel
     * ---------------------------------------------------------
     */

    const importedGuestKeys = new Set<string>();

    for (const row of rows) {
      const firstName = normalize(row.Nombre);
      const lastName = normalize(row.Apellido);

      const key = `${firstName}|${lastName}`;

      if (existingGuestKeys.has(key)) {
        throw new Error(
          `El invitado ${row.Nombre} ${row.Apellido} ya existe`,
        );
      }

      if (importedGuestKeys.has(key)) {
        throw new Error(
          `El invitado ${row.Nombre} ${row.Apellido} está repetido en el archivo`,
        );
      }

      importedGuestKeys.add(key);
    }

    /*
     * ---------------------------------------------------------
     * 3. Buscar grupos existentes de la boda
     * ---------------------------------------------------------
     */

    const existingGroups = await tx.guestGroup.findMany({
      where: {
        weddingId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    const groups = new Map<string, string>();

    for (const group of existingGroups) {
      groups.set(normalize(group.name), group.id);
    }

    /*
     * ---------------------------------------------------------
     * 4. Crear grupos nuevos cuando sea necesario
     * ---------------------------------------------------------
     */

    for (const row of rows) {
      const groupName = row.Grupo.trim();

      if (!groupName) {
        continue;
      }

      const normalizedGroupName = normalize(groupName);

      if (groups.has(normalizedGroupName)) {
        continue;
      }

      const group = await tx.guestGroup.create({
        data: {
          weddingId,
          name: groupName,
        },
      });

      groups.set(normalizedGroupName, group.id);
    }

    /*
     * ---------------------------------------------------------
     * 5. Crear invitados
     * ---------------------------------------------------------
     */

    const guests = await Promise.all(
      rows.map((row) => {
        const groupName = row.Grupo.trim();

        const groupId = groupName
          ? groups.get(normalize(groupName)) ?? null
          : null;

        return tx.guest.create({
          data: {
            weddingId,
            firstName: row.Nombre.trim(),
            lastName: row.Apellido.trim(),
            groupId,
          },
        });
      }),
    );

    return guests;
  });
}