
import * as XLSX from "xlsx";
import {
  importGuestRowSchema,
  type ImportGuestRow,
} from "../schemas/import-guests.schema";

export type ParsedGuestRow = {
  row: number;
  data?: ImportGuestRow;
  error?: string;
};

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es");
}

function getFriendlyErrors(
  row: Record<string, unknown>,
  issues: { path: PropertyKey[] }[],
) {
  const messages = new Set<string>();

  for (const issue of issues) {
    const field = String(issue.path[0] ?? "");

    if (field === "Nombre") {
      messages.add(
        typeof row.Nombre === "string" && row.Nombre.trim()
          ? "Revisá el nombre ingresado."
          : "Falta el nombre.",
      );
    } else if (field === "Apellido") {
      messages.add(
        typeof row.Apellido === "string" && row.Apellido.trim()
          ? "Revisá el apellido ingresado."
          : "Falta el apellido.",
      );
    } else if (field === "Grupo") {
      messages.add("El grupo debe ser un texto válido.");
    } else {
      messages.add("Revisá los datos de esta fila.");
    }
  }

  return [...messages].join(" ");
}

export function parseGuestsExcel(buffer: Buffer): ParsedGuestRow[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = firstSheetName ? workbook.Sheets[firstSheetName] : undefined;

  if (!sheet) {
    throw new Error("El Excel no contiene hojas.");
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  const parsed: ParsedGuestRow[] = rows.map((row, index) => {
    const result = importGuestRowSchema.safeParse(row);

    if (!result.success) {
      return {
        row: index + 2,
        error: getFriendlyErrors(row, result.error.issues),
      };
    }

    return {
      row: index + 2,
      data: result.data,
    };
  });

  const seen = new Map<string, number>();

  for (const item of parsed) {
    if (!item.data) continue;

    const key = normalizeName(
      `${item.data.Nombre} ${item.data.Apellido}`,
    );

    if (seen.has(key)) {
      item.error = `Este invitado está duplicado. También aparece en la fila ${seen.get(key)}.`;
    } else {
      seen.set(key, item.row);
    }
  }

  return parsed;
}
