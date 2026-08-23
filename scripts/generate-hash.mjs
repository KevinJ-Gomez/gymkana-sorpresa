#!/usr/bin/env node
// Genera el hash SHA-256 (hex) que hay que pegar en `passwordHash` dentro de
// src/config/gymkanaConfig.ts. Usa el mismo algoritmo de normalización
// (trim + minúsculas) que src/lib/hash.ts para que el resultado coincida
// exactamente con lo que el navegador calculará al validar la contraseña.
//
// Uso:
//   node scripts/generate-hash.mjs "mi-clave-secreta"

import { createHash } from "node:crypto";

const raw = process.argv.slice(2).join(" ");

if (!raw) {
  console.error('Uso: node scripts/generate-hash.mjs "mi-clave-secreta"');
  process.exit(1);
}

const normalized = raw.trim().toLowerCase();
const hash = createHash("sha256").update(normalized).digest("hex");

console.log(`Contraseña normalizada: "${normalized}"`);
console.log(`passwordHash: "${hash}"`);
