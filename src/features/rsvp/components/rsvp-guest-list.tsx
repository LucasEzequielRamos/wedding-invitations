
"use client";

import { useMemo, useState } from "react";

type RsvpStatusValue = "PENDING" | "ATTENDING" | "NOT_ATTENDING";

type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  group: {
    id: string;
    name: string;
  } | null;
  rsvp: {
    status: RsvpStatusValue;
    respondedAt: Date | string | null;
    needsBus: boolean;
    busPhone: string | null;
    busStop: {
      id: string;
      name: string;
      bus: { name: string };
    } | null;
    answers: {
      questionId: string;
      answer: unknown;
      question: { question: string };
    }[];
  } | null;
};

type Props = {
  guests: Guest[];
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u0302\u0304-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

function StatusBadge({ status }: { status: RsvpStatusValue }) {
  const styles: Record<RsvpStatusValue, string> = {
    ATTENDING: "bg-green-100 text-green-800",
    NOT_ATTENDING: "bg-red-100 text-red-800",
    PENDING: "bg-amber-100 text-amber-800",
  };

  const labels: Record<RsvpStatusValue, string> = {
    ATTENDING: "Confirmado",
    NOT_ATTENDING: "No asiste",
    PENDING: "Pendiente",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function formatAnswer(answer: unknown) {
  if (Array.isArray(answer)) return answer.join(", ");
  if (typeof answer === "boolean") return answer ? "Sí" : "No";
  if (answer === null || answer === undefined || answer === "") return "—";
  return String(answer);
}

export function RsvpGuestList({ guests }: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | RsvpStatusValue>("ALL");
  const [group, setGroup] = useState("ALL");
  const [busFilter, setBusFilter] = useState<"ALL" | "YES" | "NO">("ALL");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const groups = useMemo(() => {
    const map = new Map<string, string>();

    guests.forEach((guest) => {
      if (guest.group) map.set(guest.group.id, guest.group.name);
    });

    return Array.from(map.entries()).sort((a, b) =>
      a[1].localeCompare(b[1], "es"),
    );
  }, [guests]);

  const filteredGuests = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return guests.filter((guest) => {
      const fullName = normalizeText(
        `${guest.firstName} ${guest.lastName}`,
      );

      const matchesSearch = fullName.includes(normalizedSearch);
      const guestStatus = guest.rsvp?.status ?? "PENDING";
      const matchesStatus = status === "ALL" || guestStatus === status;

      const matchesGroup =
        group === "ALL"
          ? true
          : group === "NONE"
            ? !guest.group
            : guest.group?.id === group;

      const needsBus = guest.rsvp?.needsBus ?? false;
      const matchesBus =
        busFilter === "ALL" ||
        (busFilter === "YES" && needsBus) ||
        (busFilter === "NO" && !needsBus);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesGroup &&
        matchesBus
      );
    });
  }, [guests, search, status, group, busFilter]);

  const stats = useMemo(() => {
    return {
      attending: guests.filter(
        (guest) => guest.rsvp?.status === "ATTENDING",
      ).length,
      notAttending: guests.filter(
        (guest) => guest.rsvp?.status === "NOT_ATTENDING",
      ).length,
      pending: guests.filter(
        (guest) =>
          !guest.rsvp || guest.rsvp.status === "PENDING",
      ).length,
      busRequests: guests.filter(
        (guest) => guest.rsvp?.needsBus,
      ).length,
    };
  }, [guests]);

  const hasFilters =
    search.trim() !== "" ||
    status !== "ALL" ||
    group !== "ALL" ||
    busFilter !== "ALL";

  function resetFilters() {
    setSearch("");
    setStatus("ALL");
    setGroup("ALL");
    setBusFilter("ALL");
  }

  return (
    <section className="mt-8 space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Confirmados</p>
          <p className="mt-1 text-2xl font-semibold">{stats.attending}</p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">No asisten</p>
          <p className="mt-1 text-2xl font-semibold">{stats.notAttending}</p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Pendientes</p>
          <p className="mt-1 text-2xl font-semibold">{stats.pending}</p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Solicitudes de micro</p>
          <p className="mt-1 text-2xl font-semibold">{stats.busRequests}</p>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border p-4">
        <div>
          <h2 className="font-semibold">Buscar y filtrar</h2>
          <p className="mt-1 text-sm text-gray-500">
            La búsqueda no distingue mayúsculas ni tildes.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nombre o apellido..."
            aria-label="Buscar invitado por nombre o apellido"
            className="min-w-0 rounded-lg border px-3 py-2.5"
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "ALL" | RsvpStatusValue)
            }
            aria-label="Filtrar por confirmación"
            className="min-w-0 rounded-lg border px-3 py-2.5"
          >
            <option value="ALL">Todos los estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="ATTENDING">Confirmados</option>
            <option value="NOT_ATTENDING">No asisten</option>
          </select>

          <select
            value={group}
            onChange={(event) => setGroup(event.target.value)}
            aria-label="Filtrar por grupo"
            className="min-w-0 rounded-lg border px-3 py-2.5"
          >
            <option value="ALL">Todos los grupos</option>
            <option value="NONE">Sin grupo</option>
            {groups.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={busFilter}
            onChange={(event) =>
              setBusFilter(event.target.value as "ALL" | "YES" | "NO")
            }
            aria-label="Filtrar por solicitud de micro"
            className="min-w-0 rounded-lg border px-3 py-2.5"
          >
            <option value="ALL">Todos los viajes</option>
            <option value="YES">Solicitaron micro</option>
            <option value="NO">No solicitaron micro</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500" aria-live="polite">
            Mostrando <strong>{filteredGuests.length}</strong> de{" "}
            <strong>{guests.length}</strong> invitados
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="whitespace-nowrap p-3 font-medium">Invitado</th>
              <th className="whitespace-nowrap p-3 font-medium">Grupo</th>
              <th className="whitespace-nowrap p-3 font-medium">Estado</th>
              <th className="whitespace-nowrap p-3 font-medium">Respondió</th>
              <th className="whitespace-nowrap p-3 font-medium">Micro</th>
              <th className="whitespace-nowrap p-3 font-medium">Parada</th>
              <th className="whitespace-nowrap p-3 font-medium">Teléfono</th>
            </tr>
          </thead>

          <tbody>
            {filteredGuests.map((guest) => (
              <tr
                key={guest.id}
                tabIndex={0}
                role="button"
                aria-label={`Ver respuestas de ${guest.firstName} ${guest.lastName}`}
                className="cursor-pointer border-t hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
                onClick={() => setSelectedGuest(guest)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedGuest(guest);
                  }
                }}
              >
                <td className="whitespace-nowrap p-3 font-medium">
                  {guest.firstName} {guest.lastName}
                </td>

                <td className="p-3">{guest.group?.name ?? "—"}</td>

                <td className="p-3">
                  <StatusBadge status={guest.rsvp?.status ?? "PENDING"} />
                </td>

                <td className="whitespace-nowrap p-3">
                  {guest.rsvp?.respondedAt
                    ? new Date(guest.rsvp.respondedAt).toLocaleDateString("es-AR")
                    : "—"}
                </td>

                <td className="p-3">
                  {guest.rsvp?.needsBus ? (
                    <span className="font-medium text-green-700">Sí</span>
                  ) : (
                    "No"
                  )}
                </td>

                <td className="p-3">
                  {guest.rsvp?.needsBus
                    ? guest.rsvp.busStop?.name ?? "Sin parada"
                    : "—"}
                </td>

                <td className="whitespace-nowrap p-3">
                  {guest.rsvp?.needsBus
                    ? guest.rsvp.busPhone ?? "Sin teléfono"
                    : "—"}
                </td>
              </tr>
            ))}

            {filteredGuests.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center">
                  <p className="font-medium">
                    {guests.length === 0
                      ? "Todavía no hay invitados cargados."
                      : "No encontramos invitados con esos filtros."}
                  </p>

                  {guests.length > 0 && hasFilters && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-3 text-sm underline"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedGuest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedGuest(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="rsvp-detail-title"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="rsvp-detail-title" className="text-xl font-bold">
                  {selectedGuest.firstName} {selectedGuest.lastName}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Detalle de confirmación
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedGuest(null)}
                aria-label="Cerrar detalles"
                className="rounded-lg border px-3 py-1.5 hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <div className="mt-1">
                  <StatusBadge
                    status={selectedGuest.rsvp?.status ?? "PENDING"}
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Grupo</p>
                <p className="font-medium">
                  {selectedGuest.group?.name ?? "Sin grupo"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Fecha de respuesta</p>
                <p className="font-medium">
                  {selectedGuest.rsvp?.respondedAt
                    ? new Date(
                        selectedGuest.rsvp.respondedAt,
                      ).toLocaleString("es-AR")
                    : "Todavía no respondió"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold">Solicitud de micro</h3>

                <p className="mt-2 text-sm">
                  {selectedGuest.rsvp?.needsBus
                    ? "Solicitó micro"
                    : "No solicitó micro"}
                </p>

                {selectedGuest.rsvp?.needsBus && (
                  <div className="mt-3 space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Micro: </span>
                      {selectedGuest.rsvp.busStop?.bus.name ?? "—"}
                    </p>
                    <p>
                      <span className="text-gray-500">Parada: </span>
                      {selectedGuest.rsvp.busStop?.name ?? "Sin parada asignada"}
                    </p>
                    <p>
                      <span className="text-gray-500">Teléfono: </span>
                      {selectedGuest.rsvp.busPhone ?? "Sin teléfono"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold">Respuestas adicionales</h3>

                {!selectedGuest.rsvp?.answers.length ? (
                  <p className="mt-2 text-sm text-gray-500">
                    No hay respuestas adicionales.
                  </p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {selectedGuest.rsvp.answers.map((answer) => (
                      <div
                        key={answer.questionId}
                        className="rounded-lg border p-3"
                      >
                        <p className="text-sm text-gray-500">
                          {answer.question.question}
                        </p>
                        <p className="mt-1 font-medium">
                          {formatAnswer(answer.answer)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
