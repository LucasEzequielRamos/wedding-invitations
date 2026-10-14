export function normalizeGuestName(value: string): string {
  return value
    .normalize("NFD")
    // Ignora tildes, pero conserva la ñ como letra diferente.
    .replace(/[\u0300-\u0302\u0304-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("es");
}