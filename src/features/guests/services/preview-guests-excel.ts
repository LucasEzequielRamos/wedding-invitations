import { parseGuestsExcel } from "./parse-guests-excel";

export function previewGuestsExcel(buffer: Buffer) {
  const rows = parseGuestsExcel(buffer);

  const errors = rows.filter((row) => row.error);

  const validRows = rows
    .filter((row) => !row.error)
    .map((row) => row.data!);

  return {
    rows,
    validRows,
    errors,
    isValid: errors.length === 0 && validRows.length > 0,
    total: rows.length,
    valid: validRows.length,
    invalid: errors.length,
  };
}