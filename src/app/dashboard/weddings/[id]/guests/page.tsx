/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { ToastViewport, useToast } from "@/components/ui/toast";
import Link from "next/link";

type Group = {
  id: string;
  name: string;
  guests?: { id: string }[];
};

type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  group: Group | null;
  rsvp: { status: string } | null;
};

type PreviewRow = {
  row: number;
  data?: {
    Grupo: string;
    Nombre: string;
    Apellido: string;
  };
  error?: string;
};

type Preview = {
  rows: PreviewRow[];
  validRows: { Grupo: string; Nombre: string; Apellido: string }[];
  total: number;
  valid: number;
  invalid: number;
};

type Confirmation = {
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
};

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

export default function GuestsPage() {
  const params = useParams<{ id: string }>();
  const weddingId = params.id;
  const { toast, showToast, dismissToast } = useToast();

  const [guests, setGuests] = useState<Guest[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");

  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editGroupId, setEditGroupId] = useState("");
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [working, setWorking] = useState(false);
  const [confirmation, setConfirmation] =  useState<Confirmation | null>(null);

 const loadData = useCallback(
  async (initial = false) => {
    if (initial) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const [guestsResponse, groupsResponse] = await Promise.all([
        fetch(`/api/dashboard/weddings/${weddingId}/guests`),
        fetch(`/api/dashboard/weddings/${weddingId}/groups`),
      ]);

      const [guestsData, groupsData] = await Promise.all([
        guestsResponse.json(),
        groupsResponse.json(),
      ]);

      if (!guestsResponse.ok) {
        throw new Error(
          guestsData.error || "No se pudieron cargar los invitados.",
        );
      }

      if (!groupsResponse.ok) {
        throw new Error(
          groupsData.error || "No se pudieron cargar los grupos.",
        );
      }

      setGuests(guestsData);
      setGroups(groupsData);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los datos.",
        "error",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  },
  [weddingId, showToast],
);

  useEffect(() => {
  void loadData(true);
}, [loadData]);

  function startEditing(guest: Guest) {
    setEditingGuestId(guest.id);
    setEditFirstName(guest.firstName);
    setEditLastName(guest.lastName);
    setEditGroupId(guest.group?.id ?? "");
    dismissToast();
  }

  function cancelEditing() {
    setEditingGuestId(null);
    setEditFirstName("");
    setEditLastName("");
    setEditGroupId("");
  }

  async function createGuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      showToast("Ingresá el nombre y el apellido.", "warning");
      return;
    }

    setWorking(true);

    try {
      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/guests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            groupId: groupId || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo crear el invitado.");
      }

      setFirstName("");
      setLastName("");
      setGroupId("");

      await loadData();
      showToast("Invitado creado correctamente.", "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Error al crear el invitado.",
        "error",
      );
    } finally {
      setWorking(false);
    }
  }

  async function saveGuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingGuestId) return;

    if (!editFirstName.trim() || !editLastName.trim()) {
      showToast("Ingresá el nombre y el apellido.", "warning");
      return;
    }

    setWorking(true);

    try {
      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/guests/${editingGuestId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: editFirstName.trim(),
            lastName: editLastName.trim(),
            groupId: editGroupId || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo actualizar el invitado.");
      }

      cancelEditing();
      await loadData();
      showToast("Invitado actualizado correctamente.", "success");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Error al actualizar el invitado.",
        "error",
      );
    } finally {
      setWorking(false);
    }
  }

  async function removeGuest(guest: Guest) {
    const fullName = `${guest.firstName} ${guest.lastName}`;


    setWorking(true);

    try {
      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/guests/${guest.id}`,
        { method: "DELETE" },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo eliminar el invitado.");
      }

      if (editingGuestId === guest.id) cancelEditing();

      await loadData();
      showToast(`${fullName} fue eliminado correctamente.`, "success");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Error al eliminar el invitado.",
        "error",
      );
    } finally {
      setWorking(false);
    }
  }

  function askRemoveGuest(guest: Guest) {
  const fullName = `${guest.firstName} ${guest.lastName}`;

  setConfirmation({
    title: "Eliminar invitado",
    message:
      `¿Querés eliminar a ${fullName}? También se borrarán su confirmación de asistencia y sus respuestas. Esta acción no se puede deshacer.`,
    confirmLabel: "Eliminar invitado",
    destructive: true,
    onConfirm: () => removeGuest(guest),
  });
}

  async function createGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!groupName.trim()) {
      showToast("Ingresá el nombre del grupo.", "warning");
      return;
    }

    setWorking(true);

    try {
      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/groups`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: groupName.trim() }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo crear el grupo.");
      }

      setGroupName("");
      await loadData();
      showToast("Grupo creado correctamente.", "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Error al crear el grupo.",
        "error",
      );
    } finally {
      setWorking(false);
    }
  }

  
function startEditingGroup(group: Group) {
  setEditingGroupId(group.id);
  setEditGroupName(group.name);
  dismissToast();
}

function cancelEditingGroup() {
  setEditingGroupId(null);
  setEditGroupName("");
}

async function saveGroup(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!editingGroupId) return;

  const name = editGroupName.trim();

  if (!name || name.length > 100) {
    showToast("El nombre debe tener entre 1 y 100 caracteres.", "warning");
    return;
  }

  setWorking(true);

  try {
    const response = await fetch(
      `/api/dashboard/weddings/${weddingId}/groups/${editingGroupId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo actualizar el grupo.");
    }

    cancelEditingGroup();
    await loadData();
    showToast("Grupo actualizado correctamente.", "success");
  } catch (error) {
    showToast(
      error instanceof Error ? error.message : "Error al actualizar el grupo.",
      "error",
    );
  } finally {
    setWorking(false);
  }
}

async function removeGroup(group: Group) {

  setWorking(true);

  try {
      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/groups/${group.id}`,
        { method: "DELETE" },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo eliminar el grupo.");
      }

      if (editingGroupId === group.id) {
        cancelEditingGroup();
      }

      await loadData();
      showToast("Grupo eliminado correctamente.", "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Error al eliminar el grupo.",
        "error",
      );
    } finally {
      setWorking(false);
    }
}

function askRemoveGroup(group: Group) {
  const guestCount = group.guests?.length ?? 0;

  setConfirmation({
    title: "Eliminar grupo",
    message:
      `¿Querés eliminar el grupo "${group.name}"? ` +
      `${guestCount} invitado(s) quedarán sin grupo. ` +
      "Sus datos y confirmaciones se conservarán.",
    confirmLabel: "Eliminar grupo",
    destructive: true,
    onConfirm: () => removeGroup(group),
  });
}


  async function previewExcel() {
    if (!file) {
      showToast("Seleccioná un archivo Excel.", "warning");
      return;
    }

    setWorking(true);
    setPreview(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/guests/import/preview`,
        { method: "POST", body: formData },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo leer el Excel.");
      }

      setPreview(data);
      showToast("Archivo procesado. Revisá la vista previa.", "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Error al previsualizar.",
        "error",
      );
    } finally {
      setWorking(false);
    }
  }

  async function importExcel() {
    if (!preview || preview.valid === 0) {
      showToast("No hay invitados válidos para importar.", "warning");
      return;
    }

    if (preview.invalid > 0) {
      showToast("Corregí los errores del Excel antes de importar.", "warning");
      return;
    }


    setWorking(true);

    try {
      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/guests/import`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rows: preview.validRows }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo importar el archivo.");
      }

      setFile(null);
      setPreview(null);

      const input = document.getElementById(
        "excel-file",
      ) as HTMLInputElement | null;

      if (input) input.value = "";

      await loadData();
      showToast(`Se importaron ${data.imported} invitados.`, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Error al importar.",
        "error",
      );
    } finally {
      setWorking(false);
    }
  }

  function askImportExcel() {
  if (!preview || preview.valid === 0 || preview.invalid > 0) return;

  setConfirmation({
    title: "Confirmar importación",
    message:
      `Vas a importar ${preview.valid} invitados. ` +
      "Revisá la vista previa antes de continuar.",
    confirmLabel: "Importar invitados",
    onConfirm: importExcel,
  });
}

 const normalizedSearch = normalizeSearch(search.trim());

const filteredGuests = guests.filter((guest) =>
  normalizeSearch(
    `${guest.firstName} ${guest.lastName} ${guest.group?.name ?? ""}`,
  ).includes(normalizedSearch),
);

  if (loading) {
    return (
      <main className="p-6">
        <p className="text-sm text-gray-500">Cargando invitados...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      <Link
            href={`/dashboard/weddings/${weddingId}`}
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Volver a mi boda
          </Link>
      <ToastViewport toast={toast} onClose={dismissToast} />

      {confirmation && (
  <div
    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
    onClick={() => {
      if (!working) setConfirmation(null);
    }}
  >
    <section
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-message"
      className="w-full max-w-md space-y-5 rounded-2xl border bg-white p-6 shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div>
        <h2 id="confirmation-title" className="text-lg font-semibold">
          {confirmation.title}
        </h2>

        <p
          id="confirmation-message"
          className="mt-2 text-sm leading-6 text-gray-600"
        >
          {confirmation.message}
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          disabled={working}
          onClick={() => setConfirmation(null)}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="button"
          disabled={working}
          onClick={() => {
            const action = confirmation.onConfirm;
            setConfirmation(null);
            void action();
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${
            confirmation.destructive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-900 hover:bg-gray-700"
          }`}
        >
          {working ? "Procesando..." : confirmation.confirmLabel}
        </button>
      </div>
    </section>
  </div>
)}

      <header>
        <h1 className="text-3xl font-bold">Invitados</h1>
        <p className="mt-2 text-sm text-gray-500">
          Administrá la lista, los grupos y las importaciones.
        </p>

        {refreshing && (
          <p className="mt-2 text-xs text-gray-500" role="status">
            Actualizando invitados...
          </p>
        )}
      </header>

      {editingGuestId && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-guest-title"
      className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl border bg-white p-6 shadow-2xl"
    >
          <div>
            <h2 id="edit-guest-title" className="text-lg font-semibold">
  Editar invitado
</h2>
            <p className="mt-1 text-sm text-gray-500">
              Modificá sus datos y guardá los cambios.
            </p>
          </div>

          <form onSubmit={saveGuest} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label
                htmlFor="edit-first-name"
                className="text-sm font-medium"
              >
                Nombre
              </label>
              <input
                id="edit-first-name"
                required
                maxLength={100}
                value={editFirstName}
                onChange={(event) => setEditFirstName(event.target.value)}
                className="w-full rounded-md border bg-white px-3 py-2"
                placeholder="Nombre"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="edit-last-name"
                className="text-sm font-medium"
              >
                Apellido
              </label>
              <input
                id="edit-last-name"
                required
                maxLength={100}
                value={editLastName}
                onChange={(event) => setEditLastName(event.target.value)}
                className="w-full rounded-md border bg-white px-3 py-2"
                placeholder="Apellido"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label htmlFor="edit-group" className="text-sm font-medium">
                Grupo
              </label>
              <select
                id="edit-group"
                value={editGroupId}
                onChange={(event) => setEditGroupId(event.target.value)}
                className="w-full rounded-md border bg-white px-3 py-2"
              >
                <option value="">Sin grupo</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-2 md:col-span-2">
              <button
                type="submit"
                disabled={working}
                className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
              >
                {working ? "Guardando..." : "Guardar cambios"}
              </button>

              <button
                type="button"
                onClick={cancelEditing}
                disabled={working}
                className="rounded-md border bg-white px-4 py-2 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </form>
            </section>
  </div>
)}

      <section className="grid items-start gap-6 md:grid-cols-2">
        <form onSubmit={createGuest} className="space-y-4 rounded-xl border p-5">
          <h2 className="text-lg font-semibold">Agregar invitado</h2>

          <input
            required
            maxLength={100}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Nombre"
            aria-label="Nombre del invitado"
            className="w-full rounded-md border px-3 py-2"
          />

          <input
            required
            maxLength={100}
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Apellido"
            aria-label="Apellido del invitado"
            className="w-full rounded-md border px-3 py-2"
          />

          <select
            value={groupId}
            onChange={(event) => setGroupId(event.target.value)}
            aria-label="Grupo del invitado"
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Sin grupo</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={working}
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {working ? "Procesando..." : "Crear invitado"}
          </button>
        </form>

        <section className="space-y-4 rounded-xl border p-5">
          <h2 className="text-lg font-semibold">Crear grupo</h2>

          <p className="text-sm text-gray-500">
            Por ejemplo: Familia Pérez o Amigos de Agus.
          </p>
          
          <form onSubmit={createGroup} className="space-y-4">
          <input
            required
            maxLength={100}
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            placeholder="Nombre del grupo"
            aria-label="Nombre del grupo"
            className="w-full rounded-md border px-3 py-2"
          />

          <button
            type="submit"
            disabled={working}
            className="rounded-md border px-4 py-2 disabled:opacity-50"
          >
            Crear grupo
          </button>
        </form>
            
  <div className="max-h-75 space-y-3 overflow-y-auto pr-2">
  {groups.map((group) => (
    <div key={group.id} className="rounded-lg border p-3">
      {editingGroupId === group.id ? (
        <form onSubmit={saveGroup} className="flex flex-wrap gap-2">
          <input
            autoFocus
            required
            maxLength={100}
            value={editGroupName}
            onChange={(event) => setEditGroupName(event.target.value)}
            aria-label="Nombre del grupo"
            className="min-w-0 flex-1 rounded-md border px-3 py-2"
          />

          <button
            type="submit"
            disabled={working}
            className="rounded-md bg-black px-3 py-2 text-white disabled:opacity-50"
          >
            Guardar
          </button>

          <button
            type="button"
            onClick={cancelEditingGroup}
            disabled={working}
            className="rounded-md border px-3 py-2 disabled:opacity-50"
          >
            Cancelar
          </button>
        </form>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-medium">{group.name}</p>
            <p className="text-xs text-gray-500">
              {group.guests?.length ?? 0} invitado(s)
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => startEditingGroup(group)}
              disabled={working}
              className="rounded-md border px-3 py-1.5 disabled:opacity-50"
            >
              Editar
            </button>

            <button
              type="button"
              onClick={() => askRemoveGroup(group)}
              disabled={working}
              className="rounded-md border border-red-300 px-3 py-1.5 text-red-700 disabled:opacity-50"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  ))}

  {groups.length === 0 && (
    <p className="text-sm text-gray-500">
      Todavía no hay grupos creados.
    </p>
  )}
</div>

        </section>
      </section>

      <section className="space-y-4 rounded-xl border p-5">
        <div>
          <h2 className="text-lg font-semibold">Importar desde Excel</h2>
          <p className="mt-2 text-sm text-gray-500">
            Columnas requeridas: Grupo, Nombre y Apellido. Dejá Grupo vacío
            si el invitado no pertenece a ningún grupo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
  <input
    id="excel-file"
    type="file"
    accept=".xlsx,.xls"
    onChange={(event) => {
      setFile(event.target.files?.[0] ?? null);
      setPreview(null);
    }}
    className="sr-only"
  />

  <label
    htmlFor="excel-file"
    className="inline-flex shrink-0 cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
  >
    Seleccionar archivo
  </label>

  <span
    className="min-w-0 flex-1 truncate rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
    title={file?.name ?? "Ningún archivo seleccionado"}
  >
    {file?.name ?? "Ningún archivo seleccionado"}
  </span>
</div>

          <button
            type="button"
            onClick={previewExcel}
            disabled={working || !file}
            className="rounded-md border px-4 py-2 disabled:opacity-50"
          >
            {working ? "Procesando..." : "Previsualizar"}
          </button>
        </div>

        {preview && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <span>
                Total: <strong>{preview.total}</strong>
              </span>
              <span className="text-green-700">
                Válidos: <strong>{preview.valid}</strong>
              </span>
              <span className="text-red-700">
                Con errores: <strong>{preview.invalid}</strong>
              </span>
            </div>

            <div className="max-h-72 overflow-auto rounded-md border">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    <th className="p-3">Fila</th>
                    <th className="p-3">Invitado</th>
                    <th className="p-3">Grupo</th>
                    <th className="p-3">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row) => (
                    <tr key={row.row} className="border-t">
                      <td className="p-3">{row.row}</td>
                      <td className="p-3">
                        {row.data
                          ? `${row.data.Nombre} ${row.data.Apellido}`
                          : "—"}
                      </td>
                      <td className="p-3">{row.data?.Grupo || "Sin grupo"}</td>
                      <td
                        className={`p-3 ${
                          row.error ? "text-red-700" : "text-green-700"
                        }`}
                      >
                        {row.error || "Correcto"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={askImportExcel}
              disabled={working || preview.valid === 0 || preview.invalid > 0}
              className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {working ? "Importando..." : "Confirmar importación"}
            </button>

            {preview.invalid > 0 && (
              <p className="text-sm text-red-700">
                Corregí las filas con errores y volvé a previsualizar el archivo.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">
            Lista de invitados ({guests.length})
          </h2>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre o grupo..."
            aria-label="Buscar invitados"
            className="w-full rounded-md border px-3 py-2 sm:max-w-xs"
          />
        </div>

        
        {/* Desktop: tabla */}
        <div className="hidden overflow-hidden rounded-xl border md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Grupo</th>
                <th className="p-3">Confirmación</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="border-t">
                  <td className="p-3 font-medium">
                    {guest.firstName} {guest.lastName}
                  </td>
                  <td className="p-3">
                    {guest.group?.name ?? "Sin grupo"}
                  </td>
                  <td className="p-3">
                    {guest.rsvp?.status === "ATTENDING"
                      ? "Asiste"
                      : guest.rsvp?.status === "NOT_ATTENDING"
                        ? "No asiste"
                        : "Pendiente"}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(guest)}
                        disabled={working}
                        className="rounded-md border px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => askRemoveGuest(guest)}
                        disabled={working}
                        className="rounded-md border border-red-300 px-3 py-1.5 text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    {search
                      ? "No encontramos invitados con esa búsqueda."
                      : "Todavía no hay invitados cargados."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile: lista compacta */}
        <div className="divide-y rounded-xl border md:hidden">
          {filteredGuests.map((guest) => {
            const status = guest.rsvp?.status;
            const statusLabel =
              status === "ATTENDING"
                ? "Asiste"
                : status === "NOT_ATTENDING"
                  ? "No asiste"
                  : "Pendiente";

            const statusStyle =
              status === "ATTENDING"
                ? "bg-green-50 text-green-700"
                : status === "NOT_ATTENDING"
                  ? "bg-red-50 text-red-700"
                  : "bg-amber-50 text-amber-700";

            return (
              <div
                key={guest.id}
                className="min-w-0 space-y-3 bg-white p-4"
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="break-words font-semibold text-gray-900">
                      {guest.firstName} {guest.lastName}
                    </p>
                    <p className="mt-1 break-words text-sm text-gray-500">
                      {guest.group?.name ?? "Sin grupo"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle}`}
                  >
                    {statusLabel}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 border-t pt-3">
                  <button
                    type="button"
                    onClick={() => startEditing(guest)}
                    disabled={working}
                    className="min-h-10 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => askRemoveGuest(guest)}
                    disabled={working}
                    className="min-h-10 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}

          {filteredGuests.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              {search
                ? "No encontramos invitados con esa búsqueda."
                : "Todavía no hay invitados cargados."}
            </div>
          )}
        </div>

      </section>
    </main>
  );
}
