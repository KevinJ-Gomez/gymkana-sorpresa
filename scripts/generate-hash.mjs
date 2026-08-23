#!/usr/bin/env node
// Genera los hashes SHA-256 (hex) que se pegan en `passwordHashes` dentro de
// src/config/gymkanaConfig.ts.
//
// Uso:
//   node scripts/generate-hash.mjs "movil"
//   node scripts/generate-hash.mjs "movil" "iphone" "telefono"
//
// Cada argumento es una respuesta VÁLIDA para el mismo día: el día se
// desbloquea si el usuario acierta cualquiera de ellas.

import { createHash } from "node:crypto";

/**
 * ⚠️ Gemela de `normalizePassword` en src/lib/hash.ts. Si cambia una, tiene que
 * cambiar la otra, o los hashes generados aquí no validarán en el navegador.
 * (Al final de este script hay una comprobación que avisa si se desincronizan.)
 */
function normalizePassword(raw) {
  return raw
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const inputs = process.argv.slice(2);

if (inputs.length === 0) {
  console.error("Uso: node scripts/generate-hash.mjs \"respuesta\" [\"otra respuesta\" ...]");
  console.error("");
  console.error("Cada argumento es una respuesta válida para el mismo día.");
  process.exit(1);
}

console.log("");
console.log("No hace falta que escribas en minúsculas ni sin tildes: la entrada");
console.log("se normaliza sola (minúsculas, sin acentos y sin espacios de sobra),");
console.log("y el navegador aplica exactamente la misma normalización al validar.");
console.log("");

const hashes = [];
for (const raw of inputs) {
  const normalized = normalizePassword(raw);
  const hash = createHash("sha256").update(normalized).digest("hex");
  hashes.push(hash);
  console.log(`  "${raw}"  →  normalizada: "${normalized}"`);
}

console.log("");
console.log("Pega esto en el día correspondiente de src/config/gymkanaConfig.ts:");
console.log("");
console.log("    passwordHashes: [");
for (const hash of hashes) {
  console.log(`      "${hash}",`);
}
console.log("    ],");
console.log("");
