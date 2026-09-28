"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

/**
 * Client-side cart.
 *
 * Lines are keyed by variant + grind, so "Kochere Halo 250 g, whole bean" and
 * "Kochere Halo 250 g, espresso" are separate lines — which is how a roaster
 * actually has to pick and pack them.
 *
 * When a Medusa backend is connected this is the layer to swap for the real
 * cart endpoints; every component below reads through the hook, not the store.
 */

export type CartLine = {
  key: string
  handle: string
  name: string
  variantId: string
  variantLabel: string
  grind?: string
  /** unit price in GBP pence */
  price: number
  qty: number
}

type CartState = {
  lines: CartLine[]
  count: number
  subtotal: number
  isOpen: boolean
  add: (line: Omit<CartLine, "key" | "qty">, qty?: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  open: () => void
  close: () => void
}

const STORAGE_KEY = "fathom.cart.v1"
const CartContext = createContext<CartState | null>(null)

function lineKey(variantId: string, grind?: string): string {
  return grind ? `${variantId}::${grind}` : variantId
}

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false
  const l = value as Record<string, unknown>
  return (
    typeof l.key === "string" &&
    typeof l.handle === "string" &&
    typeof l.name === "string" &&
    typeof l.variantId === "string" &&
    typeof l.variantLabel === "string" &&
    typeof l.price === "number" &&
    typeof l.qty === "number"
  )
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Restore once on mount. Anything malformed is dropped rather than trusted.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (Array.isArray(parsed)) setLines(parsed.filter(isCartLine))
      }
    } catch {
      // corrupt or unavailable storage — start empty
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // storage full or blocked; the cart still works for this session
    }
  }, [lines, hydrated])

  // Close the drawer on Escape.
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const add = useCallback((line: Omit<CartLine, "key" | "qty">, qty = 1) => {
    const key = lineKey(line.variantId, line.grind)
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key)
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + qty, 99) } : l))
      }
      return [...prev, { ...line, key, qty }]
    })
    setIsOpen(true)
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 99) } : l)),
    )
  }, [])

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key))
  }, [])

  const value = useMemo<CartState>(() => {
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.price, 0),
      isOpen,
      add,
      setQty,
      remove,
      clear: () => setLines([]),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }
  }, [lines, isOpen, add, setQty, remove])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartState {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>")
  return ctx
}

/** Free shipping threshold, in cents. */
export const FREE_SHIPPING_AT = 4500
