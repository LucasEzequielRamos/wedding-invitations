/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function GuestsPage() {
  const params = useParams<{ id: string }>();
  const weddingId = params.id;

  const [guests, setGuests] = useState<Guest[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [guestsResponse, groupsResponse] = await Promise.all([
        fetch(`/api/dashboard/weddings/${weddingId}/guests`),
        fetch(`/api/dashboard/weddings/${weddingId}/groups`),
      ]);

      const guestsData = await guestsResponse.json();
      const groupsData = await groupsResponse.json();



      
      if (!guestsResponse.ok) {
        throw new Error(guestsData.error || "No se pudieron cargar los invitados");
      }

      if (!groupsResponse.ok) {
        throw new Error(groupsData.error || "No se pudieron cargar los grupos");
      }

      setGuests(guestsData);        
        setGroups(groupsData);
    
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [weddingId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function createGuest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWorking(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/guests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            groupId: groupId || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "No se pudo crear");

      setFirstName("");
      setLastName("");
      setGroupId("");
      setMessage("Invitado creado.");
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear invitado");
    } finally {
      setWorking(false);
    }
  }

  async function createGroup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWorking(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/groups`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: groupName }),
        },
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "No se pudo crear el grupo");

      setGroupName("");
      setMessage("Grupo creado.");
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear grupo");
    } finally {
      setWorking(false);
    }
  }

  async function previewExcel() {
    if (!file) {
      setError("Seleccioná un archivo Excel.");
      return;
    }

    setWorking(true);
    setError("");
    setMessage("");
    setPreview(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/guests/import/preview`,
        { method: "POST", body: formData },
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "No se pudo leer el Excel");

      setPreview(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al previsualizar");
    } finally {
      setWorking(false);
    }
  }

  async function importExcel() {
    if (!preview || preview.valid === 0) return;

    if (preview.invalid > 0) {
      setError("Corregí los errores del Excel antes de importar.");
      return;
    }

    if (!window.confirm(`¿Importar ${preview.valid} invitados?`)) return;

    setWorking(true);
    setError("");
    setMessage("");

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

      if (!response.ok) throw new Error(data.error || "No se pudo importar");

      setMessage(`Se importaron ${data.imported} invitados.`);
      setFile(null);
      setPreview(null);

      const input = document.getElementById("excel-file") as HTMLInputElement | null;
      if (input) input.value = "";

      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al importar");
    } finally {
      setWorking(false);
    }
  }

  const filteredGuests = guests.filter((guest) =>
    `${guest.firstName} ${guest.lastName} ${guest.group?.name ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  if (loading) {
    return <main className="p-6">Cargando invitados...</main>;
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      <header>
        <h1 className="text-3xl font-bold">Invitados</h1>
        <p className="mt-2 text-sm text-gray-500">
          Administrá la lista, los grupos y las importaciones.
        </p>
      </header>

      {error && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {message && (
        <p className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <form onSubmit={createGuest} className="space-y-4 rounded-xl border p-5">
          <h2 className="text-lg font-semibold">Agregar invitado</h2>

          <input
            required
            maxLength={100}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Nombre"
            className="w-full rounded-md border px-3 py-2"
          />

          <input
            required
            maxLength={100}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Apellido"
            className="w-full rounded-md border px-3 py-2"
          />

          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
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
            disabled={working}
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            Crear invitado
          </button>
        </form>

        <form onSubmit={createGroup} className="space-y-4 rounded-xl border p-5">
          <h2 className="text-lg font-semibold">Crear grupo</h2>

          <p className="text-sm text-gray-500">
            Por ejemplo: Familia Pérez o Amigos de Agus.
          </p>

          <input
            required
            maxLength={100}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Nombre del grupo"
            className="w-full rounded-md border px-3 py-2"
          />

          <button
            disabled={working}
            className="rounded-md border px-4 py-2 disabled:opacity-50"
          >
            Crear grupo
          </button>

          <div className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <span key={group.id} className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                {group.name} ({group.guests?.length ?? 0})
              </span>
            ))}
          </div>
        </form>
      </section>

      <section className="space-y-4 rounded-xl border p-5">
        <h2 className="text-lg font-semibold">Importar desde Excel</h2>

        <p className="text-sm text-gray-500">
          Columnas requeridas: Grupo, Nombre y Apellido. Dejá Grupo vacío
          si el invitado no pertenece a ningún grupo.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <input
            id="excel-file"
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setPreview(null);
            }}
            className="block max-w-full text-sm"
          />

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
              <span>Total: <strong>{preview.total}</strong></span>
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
                      <td className={`p-3 ${row.error ? "text-red-700" : "text-green-700"}`}>
                        {row.error || "Correcto"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={importExcel}
              disabled={working || preview.valid === 0 || preview.invalid > 0}
              className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              Confirmar importación
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o grupo..."
            className="w-full rounded-md border px-3 py-2 sm:max-w-xs"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Grupo</th>
                <th className="p-3">Confirmación</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="border-t">
                  <td className="p-3 font-medium">
                    {guest.firstName} {guest.lastName}
                  </td>
                  <td className="p-3">{guest.group?.name ?? "Sin grupo"}</td>
                  <td className="p-3">
                    {guest.rsvp?.status === "ATTENDING"
                      ? "Asiste"
                      : guest.rsvp?.status === "NOT_ATTENDING"
                        ? "No asiste"
                        : "Pendiente"}
                  </td>
                </tr>
              ))}

              {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-500">
                    No hay invitados para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}