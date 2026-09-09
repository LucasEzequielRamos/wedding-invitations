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

export function parseGuestsExcel(
  buffer: Buffer,
): ParsedGuestRow[] {
  const workbook = XLSX.read(buffer, {
    type: "buffer",
  });

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  if (!sheet) {
    throw new Error("El Excel no contiene hojas");
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
    sheet,
    {
      defval: "",
    },
  );

  const parsed: ParsedGuestRow[] = rows.map((row, index) => {
    const result = importGuestRowSchema.safeParse(row);

    if (!result.success) {
      return {
        row: index + 2,
        error: result.error.issues
          .map((issue) => issue.message)
          .join(", "),
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

    const key =
      `${item.data.Nombre} ${item.data.Apellido}`
        .trim()
        .toLowerCase();

    if (seen.has(key)) {
      item.error = `Invitado duplicado con la fila ${seen.get(key)}`;
    } else {
      seen.set(key, item.row);
    }
  }

  return parsed;
}