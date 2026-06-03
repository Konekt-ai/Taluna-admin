// Convierte "Bolsa Tauú" -> "bolsa-tauu". Quita acentos, espacios y símbolos.
// Usamos ̀-ͯ (marcas diacríticas combinantes) construido por código
// para evitar problemas de codificación en el archivo.
const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g');

export function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(DIACRITICS, '') // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // todo lo que no sea letra/número -> guion
    .replace(/^-+|-+$/g, ''); // sin guiones al inicio/fin
}

export const LOW_STOCK_THRESHOLD = 3;
