import { defineConfig, loadEnv } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

/**
 * FATHOM commerce backend.
 *
 * Deliberately close to stock Medusa v2 — the interesting part of this project
 * is the seed (apps/backend/src/scripts/seed.ts), which loads the same
 * catalogue the storefront ships with, so a seeded backend and a standalone
 * storefront show identical products.
 *
 * This does NOT run on Vercel. It is a long-lived Node server and it needs
 * Postgres and Redis. Railway, Render or Fly are the usual homes for it.
 */
module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    // The admin dashboard is served from the backend, not from Vercel.
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
  },
  modules: [
    ...(process.env.STRIPE_API_KEY
      ? [
          {
            resolve: "@medusajs/medusa/payment",
            options: {
              providers: [
                {
                  resolve: "@medusajs/medusa/payment-stripe",
                  id: "stripe",
                  options: { apiKey: process.env.STRIPE_API_KEY },
                },
              ],
            },
          },
        ]
      : []),
  ],
})
