export function money(cents: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}

export function masl(m: number): string {
  return `${m.toLocaleString("en-US")} masl`
}

export function pad(n: number, width = 2): string {
  return String(n).padStart(width, "0")
}
