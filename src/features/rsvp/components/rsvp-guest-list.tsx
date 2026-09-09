"use client";

import { useMemo, useState } from "react";

type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  group: {
    id: string;
    name: string;
  } | null;
  rsvp: {
    status: "PENDING" | "ATTENDING" | "NOT_ATTENDING";
    respondedAt: Date | string | null;
    answers: {
      questionId: string;
      answer: unknown;
      question: {
        question: string;
      };
    }[];
  } | null;
};

type Props = {
  guests: Guest[];
};

export function RsvpGuestList({ guests }: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [group, setGroup] = useState("ALL");

  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const groups = useMemo(() => {
    const map = new Map<string, string>();

    guests.forEach(guest => {
      if (guest.group) {
        map.set(guest.group.id, guest.group.name);
      }
    });

    return Array.from(map.entries());
  }, [guests]);

  const filteredGuests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return guests.filter(guest => {
      const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase();

      const matchesSearch =
        !normalizedSearch || fullName.includes(normalizedSearch);

      const guestStatus = guest.rsvp?.status ?? "PENDING";

      const matchesStatus = status === "ALL" || guestStatus === status;

      const matchesGroup =
        group === "ALL"
          ? true
          : group === "NONE"
            ? !guest.group
            : guest.group?.id === group;

      return matchesSearch && matchesStatus && matchesGroup;
    });
  }, [guests, search, status, group]);

  return (
    <div className="mt-8 space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar invitado..."
          className="rounded border p-3"
        />

        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="rounded border p-3"
        >
          <option value="ALL">Todos los estados</option>

          <option value="PENDING">Pendientes</option>

          <option value="ATTENDING">Confirmados</option>

          <option value="NOT_ATTENDING">No asisten</option>
        </select>

        <select
          value={group}
          onChange={e => setGroup(e.target.value)}
          className="rounded border p-3"
        >
          <option value="ALL">Todos los grupos</option>

          <option value="NONE">Sin grupo</option>

          {groups.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-500">
        Mostrando {filteredGuests.length} de {guests.length} invitados
      </p>

      <div className="overflow-x-auto rounded border">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Invitado</th>
              <th className="p-3">Grupo</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Respondió</th>
            </tr>
          </thead>

          <tbody>
            {filteredGuests.map(guest => (
              <tr
                key={guest.id}
                className="border-b"
                onClick={() => setSelectedGuest(guest)}
              >
                <td className="p-3">
                  {guest.firstName} {guest.lastName}
                </td>

                <td className="p-3">{guest.group?.name ?? "—"}</td>

                <td className="p-3">
                  <RsvpStatus status={guest.rsvp?.status ?? "PENDING"} />
                </td>

                <td className="p-3">
                  {guest.rsvp?.respondedAt
                    ? new Date(guest.rsvp.respondedAt).toLocaleDateString(
                        "es-AR",
                      )
                    : "—"}
                </td>
              </tr>
            ))}

            {filteredGuests.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No encontramos invitados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedGuest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-lg rounded bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {selectedGuest.firstName} {selectedGuest.lastName}
              </h2>

              <button
                type="button"
                onClick={() => setSelectedGuest(null)}
                className="rounded border px-3 py-1"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Estado</p>

                <p className="font-medium">
                  {selectedGuest.rsvp?.status === "ATTENDING" && "Confirmado"}

                  {selectedGuest.rsvp?.status === "NOT_ATTENDING" &&
                    "No asiste"}

                  {(!selectedGuest.rsvp ||
                    selectedGuest.rsvp.status === "PENDING") &&
                    "Pendiente"}
                </p>
              </div>

              {selectedGuest.rsvp?.answers.map(answer => (
                <div key={answer.questionId}>
                  <p className="text-sm text-gray-500">
                    {answer.question.question}
                  </p>

                  <p className="font-medium">
                    {Array.isArray(answer.answer)
                      ? answer.answer.join(", ")
                      : typeof answer.answer === "boolean"
                        ? answer.answer
                          ? "Sí"
                          : "No"
                        : String(answer.answer ?? "—")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RsvpStatus({
  status,
}: {
  status: "PENDING" | "ATTENDING" | "NOT_ATTENDING";
}) {
  const labels = {
    PENDING: "Pendiente",
    ATTENDING: "Confirmado",
    NOT_ATTENDING: "No asiste",
  };

  return <span>{labels[status]}</span>;
}
