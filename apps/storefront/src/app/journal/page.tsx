import type { Metadata } from "next"
import Link from "next/link"

import { CoverArt } from "@/components/cover-art"
import { Reveal } from "@/components/reveal"
import { formatPostDate, sortedPosts } from "@/lib/data/journal"

export const metadata: Metadata = {
  title: "The journal",
  description:
    "Brew recipes, origin dispatches, water chemistry, and why we stopped printing the word 'medium' on our bags.",
}

export default function JournalPage() {
  const posts = sortedPosts()
  const [lead, ...rest] = posts

  return (
    <>
      <section className="shell pt-14 pb-12 md:pt-20">
        <p className="meta text-ink-45">The journal</p>
        <h1 className="display-xl mt-6 max-w-4xl">
          Notes from the arch
        </h1>
        <p className="lede mt-7 max-w-xl text-ink-70">
          Recipes we actually use, dispatches from the farms we buy from, and the occasional
          argument with the rest of the industry.
        </p>
      </section>

      {lead ? (
        <section className="shell pb-16">
          <Link href={`/journal/${lead.slug}`} className="group block">
            <div className="hairline-t grid gap-10 pt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
              <div className="overflow-hidden">
                <CoverArt
                  post={lead}
                  className="aspect-[16/9] w-full transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="meta text-sage-deep">
                  {lead.category} · {formatPostDate(lead.date)} · {lead.readingMinutes} min
                </p>
                <h2 className="display-l mt-5 transition-colors group-hover:text-cherry">
                  {lead.title}
                </h2>
                <p className="prose-body mt-5 max-w-lg">{lead.standfirst}</p>
                <p className="meta mt-8 text-ink-70">Read the piece →</p>
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="shell pb-24 md:pb-32" aria-label="All articles">
        <ul>
          {rest.map((post, i) => (
            <li key={post.slug}>
              <Reveal delay={(i % 3) * 70}>
                <Link
                  href={`/journal/${post.slug}`}
                  className="hairline-t group grid gap-6 py-9 md:grid-cols-[minmax(0,140px)_minmax(0,1fr)_minmax(0,auto)] md:items-start md:gap-10"
                >
                  <div className="overflow-hidden">
                    <CoverArt post={post} className="aspect-[4/3] w-full md:aspect-[3/2]" />
                  </div>

                  <div>
                    <p className="meta text-sage-deep">{post.category}</p>
                    <h2 className="display-s mt-3 max-w-xl transition-colors group-hover:text-cherry">
                      {post.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-[0.93rem] leading-relaxed text-ink-70">
                      {post.standfirst}
                    </p>
                  </div>

                  <p className="meta-sm shrink-0 text-ink-45 md:pt-1 md:text-right">
                    <span className="block">{formatPostDate(post.date)}</span>
                    <span className="mt-2 block">{post.readingMinutes} min</span>
                  </p>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
