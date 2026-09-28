import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { CoverArt } from "@/components/cover-art"
import { Newsletter } from "@/components/newsletter"
import { Reveal } from "@/components/reveal"
import {
  POSTS,
  findPost,
  formatPostDate,
  relatedPosts,
  type Block,
} from "@/lib/data/journal"

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) return { title: "Not found" }

  return {
    title: post.title,
    description: post.standfirst,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.standfirst,
      publishedTime: post.date,
      authors: [post.author.name],
    },
  }
}

function BlockView({ block, first }: { block: Block; first: boolean }) {
  switch (block.type) {
    case "p":
      return <p className={`prose-body mt-6 ${first ? "dropcap text-ink" : ""}`}>{block.text}</p>

    case "h2":
      return <h2 className="display-s mt-14 text-ink">{block.text}</h2>

    case "quote":
      return (
        <blockquote className="my-12 border-l-2 border-cherry pl-7">
          <p className="display-s text-ink">{block.text}</p>
          {block.attribution ? (
            <footer className="meta-sm mt-5 text-ink-45">{block.attribution}</footer>
          ) : null}
        </blockquote>
      )

    case "list":
      return (
        <ul className="mt-7 space-y-4">
          {block.items.map((item, i) => (
            <li key={i} className="prose-body flex gap-4">
              <span className="meta-sm mt-1.5 shrink-0 text-cherry">{String(i + 1).padStart(2, "0")}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )

    case "note":
      return (
        <aside className="mt-12 bg-paper-deep px-7 py-6">
          <p className="meta-sm text-sage-deep">Note</p>
          <p className="prose-body mt-3 text-ink">{block.text}</p>
        </aside>
      )

    case "recipe":
      return (
        <figure className="mt-12">
          <figcaption className="meta hairline-b pb-3 text-ink-45">{block.title}</figcaption>
          <dl>
            {block.rows.map((row) => (
              <div key={row.label} className="hairline-b flex flex-wrap justify-between gap-x-8 gap-y-1 py-3.5">
                <dt className="meta-sm text-ink-45">{row.label}</dt>
                <dd className="text-[0.92rem] text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </figure>
      )

    case "steps":
      return (
        <ol className="mt-12">
          {block.items.map((step) => (
            <li
              key={step.time}
              className="hairline-t grid grid-cols-[minmax(0,4.5rem)_minmax(0,1fr)] gap-5 py-5"
            >
              <span className="meta text-cherry">{step.time}</span>
              <span className="prose-body">{step.text}</span>
            </li>
          ))}
        </ol>
      )
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = findPost(slug)
  if (!post) notFound()

  const related = relatedPosts(slug, 2)
  const firstParagraph = post.body.findIndex((b) => b.type === "p")

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.standfirst,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author.name, jobTitle: post.author.role },
    publisher: { "@type": "Organization", name: "FATHOM Coffee Roasters" },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="shell pt-10">
          <nav aria-label="Breadcrumb">
            <ol className="meta-sm flex gap-2 text-ink-45">
              <li>
                <Link href="/journal" className="hover:text-ink">
                  Journal
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink">{post.category}</li>
            </ol>
          </nav>

          <h1 className="display-l mt-8 max-w-4xl">{post.title}</h1>
          <p className="lede mt-7 max-w-2xl text-ink-70">{post.standfirst}</p>

          <div className="hairline-t mt-10 flex flex-wrap gap-x-12 gap-y-4 pt-6">
            <p className="meta-sm text-ink-45">
              <span className="block text-ink">{post.author.name}</span>
              <span className="mt-1.5 block">{post.author.role}</span>
            </p>
            <p className="meta-sm text-ink-45">
              <span className="block text-ink">{formatPostDate(post.date)}</span>
              <span className="mt-1.5 block">{post.readingMinutes} minute read</span>
            </p>
          </div>
        </header>

        <div className="shell mt-12">
          <CoverArt post={post} className="aspect-[21/9] w-full" />
        </div>

        <div className="shell mt-14 pb-20 md:mt-20">
          <div className="mx-auto max-w-[42rem]">
            {post.body.map((block, i) => (
              <BlockView key={i} block={block} first={i === firstParagraph} />
            ))}
          </div>
        </div>
      </article>

      <section className="shell pb-20">
        <div className="mx-auto max-w-[42rem]">
          <div className="hairline-t bg-paper-deep px-7 py-9">
            <Newsletter />
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="shell pb-24 md:pb-32" aria-labelledby="related-heading">
          <h2 id="related-heading" className="display-m hairline-t pt-8">
            Keep reading
          </h2>
          <div className="mt-10 grid gap-12 md:grid-cols-2">
            {related.map((other, i) => (
              <Reveal key={other.slug} delay={i * 90}>
                <Link href={`/journal/${other.slug}`} className="group block">
                  <div className="overflow-hidden">
                    <CoverArt
                      post={other}
                      className="aspect-[16/9] w-full transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="meta mt-6 text-sage-deep">
                    {other.category} · {other.readingMinutes} min
                  </p>
                  <h3 className="display-s mt-3 transition-colors group-hover:text-cherry">
                    {other.title}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
