import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { AdBanner } from "@/components/ads/AdBanner"

export const revalidate = 0;

// ─── Divider line used throughout ───
function HRule({ className = "" }: { className?: string }) {
  return <hr className={`border-t border-zinc-200 dark:border-zinc-800 ${className}`} />
}

// ─── Section header matching WaPo "Opinions >" style ───
function SectionHeader({
  label,
  href = "#",
  className = "",
}: {
  label: string
  href?: string
  className?: string
}) {
  return (
    <div className={`flex items-center gap-1 mb-3 ${className}`}>
      <Link
        href={href}
        className="font-sans font-bold text-[15px] text-zinc-900 dark:text-white hover:underline"
      >
        {label}
      </Link>
      <ChevronRight className="w-4 h-4 text-zinc-900 dark:text-white" strokeWidth={2.5} />
    </div>
  )
}

export default async function Home() {
  await connectToDatabase();

  const dbPosts = await Post.find({}).sort({ order: 1, createdAt: -1 }).lean();
  const allPosts = dbPosts.map((post: any) => ({
    ...post,
    _id: post._id.toString(),
  }));

  const sections = {
    news_flash: allPosts.filter((p: any) => p.section === 'news_flash'),
    main_feed: allPosts.filter((p: any) => p.section === 'main_feed'),
    featured: allPosts.filter((p: any) => p.section === 'featured'),
    opinions: allPosts.filter((p: any) => p.section === 'opinions'),
    ledger: allPosts.filter((p: any) => p.section === 'ledger'),
    visual: allPosts.filter((p: any) => p.section === 'visual'),
    politics: allPosts.filter((p: any) => p.section === 'politics'),
    style: allPosts.filter((p: any) => p.section === 'style'),
  };

  const topStory = sections.main_feed.find((p: any) => p.subType === 'top');
  const mainSubStories = sections.main_feed.filter((p: any) => p.subType !== 'top').slice(0, 4);

  const mainFeatured = sections.featured.find((p: any) => p.subType === 'main');
  const secondaryFeatured = sections.featured.filter((p: any) => p.subType !== 'main').slice(0, 2);

  const mainPolitics = sections.politics.find((p: any) => p.subType === 'main');
  const sidePolitics = sections.politics.filter((p: any) => p.subType !== 'main').slice(0, 4);

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="w-full min-h-screen bg-white dark:bg-black font-sans">
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── TOP AD LEADERBOARD ── */}
        <div className="flex items-center justify-center py-3">
          <AdBanner type="leaderboard" className="my-0" />
        </div>

        <HRule />

        {/* ══════════════════════════════════════════════════════
            MAIN 3-COLUMN GRID  (matches WaPo exactly)
        ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_280px] gap-0 pt-4">

          {/* ── LEFT COLUMN: Text-heavy news feed ── */}
          <section className="lg:border-r lg:border-zinc-200 lg:dark:border-zinc-800 lg:pr-6">

            {/* Top / Lead story */}
            {topStory && (
              <article className="mb-5 pb-5 border-b border-zinc-200 dark:border-zinc-800">
                <Link href={`/article/${topStory._id}`} className="block group">
                  {topStory.tag && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 dark:text-red-500 mb-1 block">
                      {topStory.tag}
                    </span>
                  )}
                  <h2 className="font-serif text-[26px] leading-[1.15] font-bold text-zinc-950 dark:text-white mb-3 group-hover:underline decoration-1 underline-offset-2">
                    {topStory.title}
                  </h2>
                  {topStory.excerpt && (
                    <p className="font-sans text-[14px] leading-[1.6] text-zinc-600 dark:text-zinc-400 mb-3">
                      {topStory.excerpt}
                    </p>
                  )}
                  {topStory.author && (
                    <p className="text-[12px] text-zinc-500 dark:text-zinc-500">
                      By <span className="font-semibold">{topStory.author}</span>
                    </p>
                  )}
                </Link>
              </article>
            )}

            {/* Sub stories — text only, WaPo style */}
            {mainSubStories.map((story: any, idx: number) => (
              <article
                key={story._id}
                className={`${idx < mainSubStories.length - 1 ? 'mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800' : 'mb-4 pb-4'} group`}
              >
                <Link href={`/article/${story._id}`} className="block">
                  {story.tag && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-1 block">
                      {story.tag}
                    </span>
                  )}
                  <h3 className="font-serif text-[18px] leading-[1.25] font-bold text-zinc-900 dark:text-white group-hover:underline decoration-1 underline-offset-2 mb-1">
                    {story.title}
                  </h3>
                  {story.timeAgo && (
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-sans">
                      {story.timeAgo}
                    </span>
                  )}
                </Link>
              </article>
            ))}

            {/* Inline ad in left col */}
            <div className="mt-4 hidden lg:block">
              <AdBanner type="sidebar" className="my-0 mx-0 max-w-full" />
            </div>
          </section>

          {/* ── CENTER COLUMN: Hero image + 2-up stories ── */}
          <section className="lg:px-6 mt-6 lg:mt-0">
            {mainFeatured && (
              <Link href={`/article/${mainFeatured._id}`} className="block group mb-2">
                {/* Hero image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-2">
                  <Image
                    src={mainFeatured.imageUrl || FALLBACK_IMAGE}
                    alt={mainFeatured.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 640px"
                  />
                </div>

                {/* Caption */}
                {mainFeatured.excerpt && (
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-500 font-sans mb-3 leading-snug italic">
                    {mainFeatured.excerpt}
                  </p>
                )}
              </Link>
            )}

            {/* Hero headline below image */}
            {mainFeatured && (
              <Link href={`/article/${mainFeatured._id}`} className="group block mb-5 pb-5 border-b border-zinc-200 dark:border-zinc-800">
                {mainFeatured.tag && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 dark:text-red-500 mb-1 block">
                    {mainFeatured.tag}
                  </span>
                )}
                <h2 className="font-serif text-[28px] md:text-[32px] leading-[1.1] font-bold text-zinc-950 dark:text-white group-hover:underline decoration-1 underline-offset-2 mb-2">
                  {mainFeatured.title}
                </h2>
                {mainFeatured.author && (
                  <p className="text-[12px] text-zinc-500 dark:text-zinc-500">
                    By <span className="font-semibold">{mainFeatured.author}</span>
                    {mainFeatured.timeAgo && <> &bull; {mainFeatured.timeAgo}</>}
                  </p>
                )}
              </Link>
            )}

            {/* 2-column story grid below hero */}
            {secondaryFeatured.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {secondaryFeatured.map((item: any) => (
                  <article key={item._id} className="group">
                    <Link href={`/article/${item._id}`} className="block">
                      <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-2">
                        <Image
                          src={item.imageUrl || FALLBACK_IMAGE}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:brightness-95 transition-all duration-300"
                          sizes="300px"
                        />
                      </div>
                      {item.tag && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-1 block">
                          {item.tag}
                        </span>
                      )}
                      <h4 className="font-serif text-[17px] leading-[1.25] font-bold text-zinc-900 dark:text-white group-hover:underline decoration-1 underline-offset-1">
                        {item.title}
                      </h4>
                      {item.timeAgo && (
                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1 block">
                          {item.timeAgo}
                        </span>
                      )}
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* ── RIGHT COLUMN: Opinions sidebar ── */}
          <aside className="lg:border-l lg:border-zinc-200 lg:dark:border-zinc-800 lg:pl-6 mt-8 lg:mt-0">

            <SectionHeader label="Opinions" href="/category/opinions" className="border-b border-zinc-200 dark:border-zinc-800 pb-2" />

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {sections.opinions.slice(0, 6).map((opinion: any) => (
                <Link
                  key={opinion._id}
                  href={`/article/${opinion._id}`}
                  className="flex items-start gap-3 py-4 group"
                >
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    {opinion.author && (
                      <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                        {opinion.author}
                      </p>
                    )}
                    <h4 className="font-serif text-[16px] leading-[1.25] font-bold text-zinc-900 dark:text-white group-hover:underline decoration-1 underline-offset-1">
                      {opinion.title}
                    </h4>
                  </div>

                  {/* Author thumbnail */}
                  {opinion.authorImageUrl ? (
                    <div className="flex-shrink-0 w-[52px] h-[52px] rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-700 mt-0.5">
                      <Image
                        src={opinion.authorImageUrl}
                        alt={opinion.author || 'Author'}
                        width={52}
                        height={52}
                        className="object-cover w-full h-full grayscale"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-[52px] h-[52px] rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 mt-0.5 flex items-center justify-center">
                      <span className="text-[11px] font-bold text-zinc-400">
                        {opinion.author?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>

            <Link
              href="#"
              className="mt-3 block text-center text-[12px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white uppercase tracking-widest py-2 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-white transition-colors"
            >
              All Opinions
            </Link>
          </aside>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION BREAK + IN-FEED AD
        ══════════════════════════════════════════════════════ */}
        <HRule className="mt-10 mb-6" />
        <AdBanner type="leaderboard" className="my-0 py-0" />
        <HRule className="mt-6 mb-10" />

        {/* ══════════════════════════════════════════════════════
            POLITICS FOCUS  (2-column: big image left, text list right)
        ══════════════════════════════════════════════════════ */}
        <section className="mb-12">
          <SectionHeader label="Politics" href="/category/politics" className="border-b-2 border-zinc-900 dark:border-white pb-2 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Big story */}
            {mainPolitics ? (
              <article className="group">
                <Link href={`/article/${mainPolitics._id}`} className="block">
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-3">
                    <Image
                      src={mainPolitics.imageUrl || FALLBACK_IMAGE}
                      alt={mainPolitics.title}
                      fill
                      className="object-cover group-hover:brightness-95 transition-all duration-300"
                      sizes="(max-width: 1024px) 100vw, 580px"
                    />
                  </div>
                  <h3 className="font-serif text-[24px] leading-[1.2] font-bold text-zinc-950 dark:text-white group-hover:underline decoration-1 underline-offset-2 mb-2">
                    {mainPolitics.title}
                  </h3>
                  {mainPolitics.excerpt && (
                    <p className="text-[14px] font-sans text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">
                      {mainPolitics.excerpt}
                    </p>
                  )}
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    {mainPolitics.author && <span className="font-semibold">{mainPolitics.author}</span>}
                    {mainPolitics.author && mainPolitics.timeAgo && <> &bull; </>}
                    {mainPolitics.timeAgo}
                  </p>
                </Link>
              </article>
            ) : <div />}

            {/* Side list */}
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {sidePolitics.map((sub: any) => (
                <article key={sub._id} className="py-4 group">
                  <Link href={`/article/${sub._id}`} className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {sub.tag && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-1 block">
                          {sub.tag}
                        </span>
                      )}
                      <h4 className="font-serif text-[18px] leading-[1.25] font-bold text-zinc-900 dark:text-white group-hover:underline decoration-1 underline-offset-1 mb-1">
                        {sub.title}
                      </h4>
                      {sub.timeAgo && (
                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                          {sub.timeAgo}
                        </span>
                      )}
                    </div>
                    {sub.imageUrl && (
                      <div className="flex-shrink-0 w-[90px] h-[65px] relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                        <Image
                          src={sub.imageUrl}
                          alt={sub.title}
                          fill
                          className="object-cover"
                          sizes="90px"
                        />
                      </div>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <HRule className="mb-12" />

        {/* ══════════════════════════════════════════════════════
            THE LEDGER  (4-column article grid)
        ══════════════════════════════════════════════════════ */}
        {sections.ledger.length > 0 && (
          <section className="mb-12">
            <SectionHeader label="The Ledger" href="/category/ledger" className="border-b-2 border-zinc-900 dark:border-white pb-2 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sections.ledger.slice(0, 4).map((article: any) => (
                <article key={article._id} className="group">
                  <Link href={`/article/${article._id}`} className="block">
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-3">
                      <Image
                        src={article.imageUrl || FALLBACK_IMAGE}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:brightness-95 transition-all duration-300"
                        sizes="280px"
                      />
                    </div>
                    {article.tag && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-500 mb-1 block">
                        {article.tag}
                      </span>
                    )}
                    <h4 className="font-serif text-[17px] leading-[1.25] font-bold text-zinc-900 dark:text-white group-hover:underline decoration-1 underline-offset-1 mb-2">
                      {article.title}
                    </h4>
                    {article.timeAgo && (
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-sans">
                        {article.timeAgo}
                      </span>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════
            VISUAL INVESTIGATIONS  (full-width dark band)
        ══════════════════════════════════════════════════════ */}
        {sections.visual.length > 0 && (
          <>
            <HRule className="mb-12" />
            <section className="mb-12 bg-zinc-950 text-white p-8 md:p-12">
              <div className="flex items-center gap-2 mb-8">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-sm flex-shrink-0" />
                <span className="font-sans text-[11px] font-black uppercase tracking-[0.25em] text-white">
                  Visual Investigations
                </span>
              </div>
              <Link href={`/article/${sections.visual[0]._id}`} className="block group">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div>
                    <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.05] font-bold text-white mb-5 group-hover:text-zinc-300 transition-colors">
                      {sections.visual[0].title}
                    </h2>
                    <p className="font-sans text-[15px] text-zinc-400 leading-relaxed mb-8 max-w-lg">
                      {sections.visual[0].description || sections.visual[0].excerpt}
                    </p>
                    <span className="inline-block bg-red-600 hover:bg-red-700 text-white text-[11px] font-black uppercase tracking-widest px-6 py-3 transition-colors">
                      Explore The Analysis
                    </span>
                  </div>
                  {sections.visual[0].imageUrl && (
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-900">
                      <Image
                        src={sections.visual[0].imageUrl}
                        alt={sections.visual[0].title}
                        fill
                        className="object-cover group-hover:brightness-90 transition-all duration-700"
                        sizes="(max-width: 1024px) 100vw, 580px"
                      />
                    </div>
                  )}
                </div>
              </Link>
            </section>
          </>
        )}

        {/* ══════════════════════════════════════════════════════
            STYLE SECTION  (3-column portrait grid)
        ══════════════════════════════════════════════════════ */}
        {sections.style.length > 0 && (
          <>
            <HRule className="mb-12" />
            <section className="mb-12">
              <SectionHeader label="Style" href="/category/style" className="border-b-2 border-zinc-900 dark:border-white pb-2 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sections.style.slice(0, 3).map((item: any) => (
                  <article key={item._id} className="group">
                    <Link href={`/article/${item._id}`} className="block">
                      <div className="relative w-full aspect-[4/5] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-3">
                        <Image
                          src={item.imageUrl || FALLBACK_IMAGE}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:brightness-95 transition-all duration-500"
                          sizes="(max-width: 768px) 100vw, 380px"
                        />
                      </div>
                      {item.tag && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-500 mb-1 block">
                          {item.tag}
                        </span>
                      )}
                      <h4 className="font-serif text-[20px] leading-[1.25] font-bold text-zinc-900 dark:text-white group-hover:underline decoration-1 underline-offset-1">
                        {item.title}
                      </h4>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ══════════════════════════════════════════════════════
            NEWSLETTER CTA
        ══════════════════════════════════════════════════════ */}
        <HRule className="mb-12" />
        <section className="mb-16 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 md:p-14 text-center">
          <h3 className="font-serif text-3xl md:text-5xl font-bold text-zinc-950 dark:text-white mb-3 tracking-tight">
            The Morning Briefing
          </h3>
          <p className="font-sans text-[16px] text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Start your day with the stories that matter. Expert curation delivered to your inbox every morning.
          </p>
          <form className="max-w-md mx-auto flex gap-0" action="#">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600 dark:focus:border-zinc-400 text-[14px]"
            />
            <button
              type="submit"
              className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black text-[11px] uppercase tracking-widest px-6 py-3 hover:bg-red-700 dark:hover:bg-zinc-200 transition-colors whitespace-nowrap"
            >
              Sign Up
            </button>
          </form>
        </section>

      </main>
    </div>
  )
}