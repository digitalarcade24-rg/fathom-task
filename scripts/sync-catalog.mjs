#!/usr/bin/env node
/**
 * Copies the storefront catalogue into the backend so the Medusa seed can
 * import it without reaching across package boundaries (which Medusa's build
 * does not resolve).
 *
 * The storefront file is the source of truth. This runs automatically before
 * `npm run backend:seed`.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const source = join(root, "apps/storefront/src/lib/data/catalog.ts")
const target = join(root, "apps/backend/src/lib/catalog.ts")

const banner = `/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Copied from apps/storefront/src/lib/data/catalog.ts by scripts/sync-catalog.mjs.
 * Edit the storefront copy and re-run \`npm run backend:seed\` (or
 * \`node scripts/sync-catalog.mjs\`) to refresh this one.
 */

`

mkdirSync(dirname(target), { recursive: true })
writeFileSync(target, banner + readFileSync(source, "utf8"))
console.log("catalog synced → apps/backend/src/lib/catalog.ts")
