/**
 * Seeds a fresh Medusa v2 instance with the FATHOM catalogue.
 *
 *   npm run backend:seed
 *
 * The product data comes from src/lib/catalog.ts, which is a generated copy of
 * the storefront's catalogue — so a seeded backend and a standalone storefront
 * serve exactly the same thirteen products.
 *
 * Everything that makes FATHOM what it is (altitude, process, cupping score,
 * roast depth, lot number) is written to product `metadata`, which is what the
 * storefront reads back in lib/data/index.ts.
 *
 * Safe to re-run: it reuses the existing sales channel, region and stock
 * location rather than creating duplicates, and skips products already present.
 */
import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

import { COLLECTIONS, PRODUCTS, type Product } from "../lib/catalog"

const CURRENCY = "gbp"

/** Regions we ship to. Countries must not overlap between regions. */
const REGIONS = [
  { name: "United Kingdom", countries: ["gb"] },
  { name: "Europe", countries: ["de", "fr", "es", "it", "nl", "ie", "be", "pt", "dk", "se"] },
  { name: "Rest of world", countries: ["us", "ca", "au", "nz", "jp", "sg"] },
]

const ALL_COUNTRIES = REGIONS.flatMap((r) => r.countries)

/** Medusa needs one option per product; ours vary only by size or finish. */
function optionTitle(product: Product): string {
  if (product.kind === "gear") return "Finish"
  if (product.kind === "subscription") return "Plan"
  return "Size"
}

export default async function seedFathom({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const storeModule = container.resolve(Modules.STORE)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)

  logger.info("Seeding FATHOM…")

  // ── sales channel ────────────────────────────────────────────────────────
  let [salesChannel] = await salesChannelModule.listSalesChannels({
    name: "FATHOM storefront",
  })
  if (!salesChannel) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "FATHOM storefront" }] },
    })
    salesChannel = result[0]
    logger.info("Created sales channel")
  }

  // ── store ────────────────────────────────────────────────────────────────
  const [store] = await storeModule.listStores()
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "FATHOM Coffee Roasters",
        supported_currencies: [{ currency_code: CURRENCY, is_default: true }],
        default_sales_channel_id: salesChannel.id,
      },
    },
  })

  // ── regions ──────────────────────────────────────────────────────────────
  const regionModule = container.resolve(Modules.REGION)
  const existingRegions = await regionModule.listRegions({})
  const missingRegions = REGIONS.filter(
    (r) => !existingRegions.some((e) => e.name === r.name),
  )

  if (missingRegions.length > 0) {
    await createRegionsWorkflow(container).run({
      input: {
        regions: missingRegions.map((r) => ({
          name: r.name,
          currency_code: CURRENCY,
          countries: r.countries,
          payment_providers: ["pp_system_default"],
        })),
      },
    })
    logger.info(`Created ${missingRegions.length} region(s)`)
  }

  // ── tax regions ──────────────────────────────────────────────────────────
  const taxModule = container.resolve(Modules.TAX)
  const existingTax = await taxModule.listTaxRegions({})
  const missingTax = ALL_COUNTRIES.filter(
    (c) => !existingTax.some((t) => t.country_code === c),
  )
  if (missingTax.length > 0) {
    await createTaxRegionsWorkflow(container).run({
      input: missingTax.map((country_code) => ({ country_code })),
    })
    logger.info(`Created ${missingTax.length} tax region(s)`)
  }

  // ── stock location ───────────────────────────────────────────────────────
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION)
  let [stockLocation] = await stockLocationModule.listStockLocations({
    name: "Arch 7, Bermondsey",
  })
  if (!stockLocation) {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Arch 7, Bermondsey",
            address: {
              address_1: "Arch 7, Enid Street",
              city: "London",
              postal_code: "SE16 3RA",
              country_code: "GB",
            },
          },
        ],
      },
    })
    stockLocation = result[0]

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    })
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: stockLocation.id, add: [salesChannel.id] },
    })
    logger.info("Created stock location")
  }

  // ── shipping ─────────────────────────────────────────────────────────────
  let [shippingProfile] = await fulfillmentModule.listShippingProfiles({
    type: "default",
  })
  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Default", type: "default" }] },
    })
    shippingProfile = result[0]
  }

  const existingFulfillmentSets = await fulfillmentModule.listFulfillmentSets({
    name: "Royal Mail",
  })
  if (existingFulfillmentSets.length === 0) {
    const fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
      name: "Royal Mail",
      type: "shipping",
      service_zones: [
        {
          name: "United Kingdom & Europe",
          geo_zones: ALL_COUNTRIES.map((country_code) => ({
            country_code,
            type: "country" as const,
          })),
        },
      ],
    })

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    })

    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Tracked 48",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Tracked 48",
            description: "Two working days, tracked. Free over £45.",
            code: "tracked-48",
          },
          prices: [{ currency_code: CURRENCY, amount: 550 }],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
        {
          name: "Tracked 24",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Tracked 24",
            description: "Next working day if ordered before 11am on a roast day.",
            code: "tracked-24",
          },
          prices: [{ currency_code: CURRENCY, amount: 895 }],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    })
    logger.info("Created shipping options")
  }

  // ── publishable API key ──────────────────────────────────────────────────
  const apiKeyModule = container.resolve(Modules.API_KEY)
  let [publishableKey] = await apiKeyModule.listApiKeys({
    title: "FATHOM storefront",
    type: "publishable",
  })
  if (!publishableKey) {
    const { result } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          { title: "FATHOM storefront", type: "publishable", created_by: "seed" },
        ],
      },
    })
    publishableKey = result[0]
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: { id: publishableKey.id, add: [salesChannel.id] },
    })
  }

  // ── collections ──────────────────────────────────────────────────────────
  const productModule = container.resolve(Modules.PRODUCT)
  const seedableCollections = COLLECTIONS.filter((c) => c.handle !== "all")
  const existingCollections = await productModule.listProductCollections({})
  const missingCollections = seedableCollections.filter(
    (c) => !existingCollections.some((e) => e.handle === c.handle),
  )

  if (missingCollections.length > 0) {
    await createCollectionsWorkflow(container).run({
      input: {
        collections: missingCollections.map((c) => ({
          title: c.title,
          handle: c.handle,
          metadata: { blurb: c.blurb },
        })),
      },
    })
    logger.info(`Created ${missingCollections.length} collection(s)`)
  }

  const collections = await productModule.listProductCollections({})
  const collectionByHandle = new Map(collections.map((c) => [c.handle, c.id]))

  // ── products ─────────────────────────────────────────────────────────────
  const existingProducts = await productModule.listProducts({})
  const existingHandles = new Set(existingProducts.map((p) => p.handle))
  const toCreate = PRODUCTS.filter((p) => !existingHandles.has(p.handle))

  if (toCreate.length === 0) {
    logger.info("All products already present — nothing to create")
  } else {
    await createProductsWorkflow(container).run({
      input: {
        products: toCreate.map((product) => {
          const option = optionTitle(product)

          return {
            title: product.name,
            handle: product.handle,
            subtitle: product.tagline,
            description: product.description.join("\n\n"),
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            // Primary collection; the rest ride along as tags so the storefront
            // filter still works for every collection a product belongs to.
            collection_id: collectionByHandle.get(product.collections[0]),
            tags: product.collections.map((value) => ({ value })),
            sales_channels: [{ id: salesChannel.id }],
            options: [
              { title: option, values: product.variants.map((v) => v.label) },
            ],
            variants: product.variants.map((variant) => ({
              title: `${product.name} — ${variant.label}`,
              sku: variant.id,
              manage_inventory: true,
              options: { [option]: variant.label },
              prices: [{ currency_code: CURRENCY, amount: variant.price }],
              metadata: variant.grams ? { grams: variant.grams } : {},
            })),
            // Everything the storefront reads back out of Medusa.
            metadata: {
              kind: product.kind,
              lot: product.lot,
              ...(product.country ? { country: product.country } : {}),
              ...(product.region ? { region: product.region } : {}),
              ...(product.producer ? { producer: product.producer } : {}),
              ...(product.varietal ? { varietal: product.varietal } : {}),
              ...(product.process ? { process: product.process } : {}),
              ...(product.altitude ? { altitude: product.altitude } : {}),
              ...(product.harvest ? { harvest: product.harvest } : {}),
              ...(product.score ? { score: product.score } : {}),
              ...(typeof product.depth === "number" ? { depth: product.depth } : {}),
              ...(product.notes ? { notes: product.notes.join("|") } : {}),
              ...(product.brewNote ? { brewNote: product.brewNote } : {}),
            },
          }
        }),
      },
    })
    logger.info(`Created ${toCreate.length} product(s)`)
  }

  // ── inventory ────────────────────────────────────────────────────────────
  // Stock lives on our catalogue per variant, keyed by SKU.
  const stockBySku = new Map(
    PRODUCTS.flatMap((p) => p.variants.map((v) => [v.id, v.stock] as const)),
  )

  const { data: variants } = await query.graph({
    entity: "variant",
    fields: ["id", "sku", "inventory_items.inventory_item_id"],
  })

  const levels = variants.flatMap((variant: any) =>
    (variant.inventory_items ?? []).map((item: any) => ({
      location_id: stockLocation.id,
      inventory_item_id: item.inventory_item_id,
      stocked_quantity: stockBySku.get(variant.sku) ?? 100,
    })),
  )

  if (levels.length > 0) {
    await createInventoryLevelsWorkflow(container).run({ input: { inventory_levels: levels } })
    logger.info(`Set stock on ${levels.length} inventory item(s)`)
  }

  logger.info("")
  logger.info("─────────────────────────────────────────────────────────────")
  logger.info("FATHOM seeded.")
  logger.info("")
  logger.info("Put these in apps/storefront/.env.local:")
  logger.info(`  NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000`)
  logger.info(`  NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableKey.token}`)
  logger.info("─────────────────────────────────────────────────────────────")
}
