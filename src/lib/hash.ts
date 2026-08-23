/**
 * Utilidades de hashing SHA-256 en cliente (Web Crypto API), usadas para no
 * guardar contraseñas en texto plano dentro de gymkanaConfig.ts.
 *
 * La comparación es un hash de un mensaje corto, no un secreto de alto valor:
 * esto disuade el "view-source" casual, no sustituye a un backend real.
 */

/** Normaliza la entrada del usuario antes de hashear: sin espacios, minúsculas. */
export function normalizePassword(raw: string): string {
  return raw.trim().toLowerCase();
}

/** Calcula el SHA-256 en hexadecimal de un texto ya normalizado. */
export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Compara la contraseña introducida por el usuario contra el hash esperado. */
export async function verifyPassword(
  input: string,
  expectedHash: string | undefined,
): Promise<boolean> {
  if (!expectedHash) return true;
  const hash = await sha256Hex(normalizePassword(input));
  return hash === expectedHash;
}
