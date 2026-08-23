/**
 * Utilidades de hashing SHA-256 en cliente (Web Crypto API), usadas para no
 * guardar contraseñas en texto plano dentro de gymkanaConfig.ts.
 *
 * La comparación es un hash de un mensaje corto, no un secreto de alto valor:
 * esto disuade el "view-source" casual, no sustituye a un backend real.
 */

/**
 * Normaliza la entrada antes de hashear. El objetivo es que acertar el acertijo
 * baste, sin pelearse con el teclado del móvil:
 *
 *   "  Móvil "  →  "movil"
 *   "EL MÓVIL"  →  "el movil"
 *
 * Pasos: minúsculas → sin acentos → sin espacios de sobra (extremos y dobles).
 *
 * Ojo con la "ñ": al descomponer en NFD se separa en `n` + virgulilla, y la
 * virgulilla se elimina, así que "niña" y "nina" valen igual. Es intencionado:
 * en una gymkana interesa ser generoso, y el script de hashes aplica esta misma
 * función, así que ambos lados coinciden siempre.
 *
 * ⚠️ Si cambias esta función, cambia también su gemela en
 * `scripts/generate-hash.mjs` o los hashes generados dejarán de validar.
 */
export function normalizePassword(raw: string): string {
  return raw
    .normalize("NFD")
    // Rango de marcas diacríticas combinantes. Se usa el rango explícito en vez
    // de \p{Diacritic} por compatibilidad con navegadores más antiguos.
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Calcula el SHA-256 en hexadecimal de un texto ya normalizado. */
export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Compara la contraseña introducida contra la lista de hashes válidos del día.
 *
 * Un día puede tener varias respuestas correctas (p. ej. "movil" e "iphone"):
 * basta con que coincida una. Sin hashes configurados, el día se considera
 * abierto.
 */
export async function verifyPassword(
  input: string,
  expectedHashes: string[] | undefined,
): Promise<boolean> {
  if (!expectedHashes || expectedHashes.length === 0) return true;
  const hash = await sha256Hex(normalizePassword(input));
  return expectedHashes.includes(hash);
}
