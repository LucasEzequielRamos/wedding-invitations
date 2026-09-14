"use client";

import { useState } from "react";

type Question = {
  id: string;
  question: string;
  type: "TEXT" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "BOOLEAN";
  required: boolean;
  options: unknown;
};

type RsvpData = {
  weddingId: string;
  guestId: string;
  guestName: string;
  status: "PENDING" | "ATTENDING" | "NOT_ATTENDING";
  answers: {
    questionId: string;
    answer: unknown;
  }[];
  questions: Question[];
};

type Props = {
  slug: string;
};

export function PublicRsvpForm({ slug }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [rsvp, setRsvp] = useState<RsvpData | null>(null);

  const [status, setStatus] = useState<"ATTENDING" | "NOT_ATTENDING">(
    "ATTENDING",
  );

  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function searchGuest() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/invitacion/${slug}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setRsvp(data);

      setStatus(
        data.status === "NOT_ATTENDING" ? "NOT_ATTENDING" : "ATTENDING",
      );

      const initialAnswers: Record<string, unknown> = {};

      for (const answer of data.answers ?? []) {
        initialAnswers[answer.questionId] = answer.answer;
      }

      setAnswers(initialAnswers);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo encontrar la invitación",
      );
    } finally {
      setLoading(false);
    }
  }

  function updateAnswer(questionId: string, answer: unknown) {
    setAnswers(current => ({
      ...current,
      [questionId]: answer,
    }));
  }

  async function submit() {
    if (!rsvp) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/invitacion/${slug}/rsvp/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weddingId: rsvp.weddingId,
          guestId: rsvp.guestId,
          status,
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setMessage(
        status === "ATTENDING"
          ? "¡Tu asistencia fue confirmada!"
          : "Registramos que no vas a poder asistir.",
      );

      setRsvp(current =>
        current
          ? {
              ...current,
              status,
            }
          : current,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo enviar la confirmación",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!rsvp) {
    return (
      <div className="space-y-4">
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          placeholder="Nombre"
          className="w-full rounded border p-3"
        />

        <input
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          placeholder="Apellido"
          className="w-full rounded border p-3"
        />

        <button
          type="button"
          onClick={searchGuest}
          disabled={loading}
          className="w-full rounded bg-black p-3 text-white disabled:opacity-50"
        >
          {loading ? "Buscando..." : "Buscar invitación"}
        </button>

        {message && <p className="text-red-600">{message}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">¡Hola, {rsvp.guestName}!</h2>

        <p className="mt-2 text-gray-600">
          Queremos saber si vas a poder acompañarnos.
        </p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setStatus("ATTENDING")}
          className={`w-full rounded border p-4 ${
            status === "ATTENDING" ? "border-black bg-black text-white" : ""
          }`}
        >
          Sí, voy a asistir
        </button>

        <button
          type="button"
          onClick={() => setStatus("NOT_ATTENDING")}
          className={`w-full rounded border p-4 ${
            status === "NOT_ATTENDING" ? "border-black bg-black text-white" : ""
          }`}
        >
          No voy a poder asistir
        </button>
      </div>

      {rsvp.questions.map(question => {
        const options = Array.isArray(question.options) ? question.options : [];

        return (
          <div key={question.id} className="space-y-3">
            <label className="block font-medium">
              {question.question}

              {question.required && <span className="ml-1">*</span>}
            </label>

            {question.type === "TEXT" && (
              <input
                value={
                  typeof answers[question.id] === "string"
                    ? String(answers[question.id])
                    : ""
                }
                onChange={e => updateAnswer(question.id, e.target.value)}
                className="w-full rounded border p-3"
              />
            )}

            {question.type === "BOOLEAN" && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => updateAnswer(question.id, true)}
                  className="rounded border px-4 py-2"
                >
                  Sí
                </button>

                <button
                  type="button"
                  onClick={() => updateAnswer(question.id, false)}
                  className="rounded border px-4 py-2"
                >
                  No
                </button>
              </div>
            )}

            {question.type === "SINGLE_CHOICE" && (
              <div className="space-y-2">
                {options.map(option => (
                  <label key={String(option)} className="flex gap-2">
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === option}
                      onChange={() => updateAnswer(question.id, option)}
                    />

                    {String(option)}
                  </label>
                ))}
              </div>
            )}

            {question.type === "MULTIPLE_CHOICE" && (
              <div className="space-y-2">
                {options.map(option => {
                  const current = Array.isArray(answers[question.id])
                    ? (answers[question.id] as unknown[])
                    : [];

                  const checked = current.includes(option);

                  return (
                    <label key={String(option)} className="flex gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const next = checked
                            ? current.filter(item => item !== option)
                            : [...current, option];

                          updateAnswer(question.id, next);
                        }}
                      />

                      {String(option)}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="w-full rounded bg-black p-4 text-white disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Confirmar asistencia"}
      </button>

      {message && <p className="rounded border p-4">{message}</p>}
    </div>
  );
}
