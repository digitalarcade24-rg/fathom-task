import Link from "next/link"

export default function NotFound() {
  return (
    <section className="shell flex min-h-[60vh] flex-col justify-center py-24">
      <p className="meta text-ink-45">404 · No reading</p>
      <h1 className="display-xl mt-6 max-w-3xl">
        Nothing at
        <br />
        this depth
      </h1>
      <p className="lede mt-8 max-w-lg text-ink-70">
        The page you were after is not here. The shelf is, though — nine coffees, ordered shallow to
        deep.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-x-9 gap-y-4">
        <Link href="/coffee" className="btn btn-solid">
          <span>Browse the shelf</span>
        </Link>
        <Link href="/" className="meta link-underline text-ink-70 hover:text-ink">
          Back to the homepage →
        </Link>
      </div>
    </section>
  )
}
