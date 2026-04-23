import Link from "next/link";
import Image from "next/image";
import { getPostsBySection } from "@/lib/posts";
import { ArrowRight, Play, Eye, Flame } from "lucide-react";
import { AdBanner } from "@/components/ads/AdBanner";

export default async function Home() {
  // Fetch all sections in parallel
  const [
    newsFlash,
    mainFeed,
    featured,
    opinions,
    ledger,
    visual,
    politics,
    style
  ] = await Promise.all([
    getPostsBySection('news_flash'),
    getPostsBySection('main_feed'),
    getPostsBySection('featured'),
    getPostsBySection('opinions'),
    getPostsBySection('ledger'),
    getPostsBySection('visual'),
    getPostsBySection('politics'),
    getPostsBySection('style')
  ]);

  const hero = mainFeed[0];
  const secondaryHero = mainFeed[1];
  const sideStories = mainFeed.slice(2, 7);
  const ledgerStories = ledger.slice(0, 4);

  return (
    <div className="w-full bg-white dark:bg-black font-sans pb-20 selection:bg-red-100 selection:text-red-900">

      {/* 1. NEWS FLASH (RED TICKER) */}
      {newsFlash.length > 0 && (
        <div className="bg-[#B00000] text-white py-1.5 overflow-hidden border-b border-red-900">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center gap-4">
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap bg-white text-[#B00000] px-2 py-0.5 rounded-sm">
              <Flame className="w-2.5 h-2.5" /> Live
            </span>
            <div className="flex gap-12 animate-marquee whitespace-nowrap">
              {newsFlash.map((post: any, i: number) => (
                <Link key={i} href={`/article/${post._id}`} className="text-[13px] font-bold hover:underline underline-offset-4 decoration-2">
                  {post.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 pt-6">
        <AdBanner type="leaderboard" className="mb-12" />



        {/* 2. MAIN EDITORIAL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-zinc-200 dark:border-zinc-800 pb-16">

          {/* LEFT: LATEST (Clean, minimalist list) */}
          <div className="lg:col-span-3 space-y-10 order-2 lg:order-1 border-r border-zinc-100 dark:border-zinc-900 pr-8">
            <div className="flex items-center justify-between border-b border-black dark:border-white pb-2 mb-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100">Latest Coverage</h3>
            </div>
            {sideStories.map((post: any, i: number) => (
              <article key={i} className="group pb-8 border-b border-zinc-50 dark:border-zinc-900 last:border-0 last:pb-0 flex flex-row lg:flex-col gap-4">
                <Link href={`/article/${post._id}`} className="flex-1">
                  <span className="text-[10px] font-bold uppercase text-red-700 dark:text-red-500 tracking-widest mb-2 block">{post.tag || "Archive"}</span>
                  <h4 className="font-serif font-bold text-[18px] leading-[1.15] tracking-tight group-hover:text-zinc-500 transition-colors mb-2">
                    {post.title}
                  </h4>
                </Link>
                {post.imageUrl && (
                  <div className="relative w-24 h-24 lg:w-full lg:aspect-[3/2] overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex-shrink-0">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* CENTER: HERO (Dominant visual & typography) */}
          <div className="lg:col-span-6 order-1 lg:order-2 px-2">
            {hero && (
              <article className="group mb-16 border-b border-zinc-100 dark:border-zinc-900 pb-12">
                <Link href={`/article/${hero._id}`}>
                  {hero.imageUrl && (
                    <div className="relative aspect-[16/9] mb-8 overflow-hidden bg-zinc-100 dark:bg-zinc-900 group-hover:brightness-95 transition-all">
                      <Image
                        src={hero.imageUrl}
                        alt={hero.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                    </div>
                  )}
                  <h2 className="font-serif text-[42px] md:text-[56px] font-black leading-[0.95] tracking-tighter mb-6 group-hover:text-red-700 transition-colors">
                    {hero.title}
                  </h2>
                  <p className="font-serif italic text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-8 leading-tight">
                    {hero.excerpt || hero.description}
                  </p>
                  <div className="flex items-center gap-4 text-[12px] font-bold uppercase tracking-widest text-zinc-400 border-t border-zinc-100 dark:border-zinc-900 pt-4">
                    <span className="text-zinc-900 dark:text-zinc-100">By {hero.author || "The Indianberg Staff"}</span>
                    <span>•</span>
                    <span className="italic">{hero.timeAgo || "Updated moments ago"}</span>
                  </div>
                </Link>
              </article>
            )}

            {/* Sub-Hero (Horizontal split) */}
            {secondaryHero && (
              <article className="group pt-10 border-t-2 border-black dark:border-white flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <Link href={`/article/${secondaryHero._id}`}>
                    {secondaryHero.imageUrl && (
                      <div className="relative aspect-[4/3] mb-4 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                        <Image
                          src={secondaryHero.imageUrl}
                          alt={secondaryHero.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <h3 className="font-serif font-black text-[24px] leading-[1.1] mb-4 group-hover:text-red-700 transition-colors">
                      {secondaryHero.title}
                    </h3>
                    <p className="text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-4">
                      {secondaryHero.excerpt || secondaryHero.description}
                    </p>
                  </Link>
                </div>
              </article>
            )}
          </div>

          {/* RIGHT: OPINIONS (Editorial board style) */}
          <div className="lg:col-span-3 space-y-8 order-3 lg:border-l lg:border-zinc-100 dark:lg:border-zinc-900 lg:pl-8">
            <div className="flex items-center justify-between border-b-2 border-red-700 pb-2 mb-8">
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-red-700">Opinions</h3>
            </div>
            {opinions.slice(0, 6).map((post: any, i: number) => (
              <article key={i} className="group border-b border-zinc-100 dark:border-zinc-900 pb-6 last:border-0 flex items-start gap-5">
                <div className="flex-1">
                  <Link href={`/article/${post._id}`}>
                    <div className="mb-2 text-[11px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest border-l-2 border-red-600 pl-2">
                      {post.author || "Editorial Board"}
                    </div>
                    <h4 className="font-serif font-bold text-[18px] leading-[1.2] group-hover:text-red-700 transition-colors tracking-tight">
                      {post.title}
                    </h4>
                  </Link>
                </div>
                {/* Author Portrait */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                  <Image
                    src={post.authorImageUrl || `https://ui-avatars.com/api/?name=${post.author || "EB"}&background=random`}
                    alt={post.author || "Author"}
                    fill
                    className="object-cover"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>



        {/* In-Feed Ad */}
        <AdBanner type="in-feed" className="py-12 border-y border-zinc-100 dark:border-zinc-900" />

        {/* 4. MULTI-SECTION GRID (Ledger & Style) */}
        <section className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-zinc-200 dark:border-zinc-800">

          {/* Ledger Section (Left) */}
          <div className="lg:col-span-8">
            <h3 className="text-[11px] font-black uppercase tracking-widest mb-8 border-b border-black dark:border-white pb-1 inline-block">The Business Ledger</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ledgerStories.map((post: any, i: number) => (
                <article key={i} className="flex gap-5 group border-b border-zinc-100 dark:border-zinc-900 pb-6 last:border-0 last:pb-0">
                  <div className="relative w-28 h-20 overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex-shrink-0">
                    <Image
                      src={post.imageUrl || "https://images.unsplash.com/photo-1444653300305-64906f3922f3?q=80&w=400&auto=format&fit=crop"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1">
                    <Link href={`/article/${post._id}`}>
                      <h4 className="font-serif font-bold text-[17px] leading-snug group-hover:text-red-700 transition-colors mb-2">
                        {post.title}
                      </h4>
                    </Link>
                    <p className="text-[13px] text-zinc-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Style Section (Right) */}
          <div className="lg:col-span-4 lg:pl-8 lg:border-l lg:border-zinc-100 dark:lg:border-zinc-900">
            <h3 className="text-[11px] font-black uppercase tracking-widest mb-8 border-b border-black dark:border-white pb-1 inline-block">The Style Section</h3>
            <div className="space-y-10">
              {style.slice(0, 3).map((post: any, i: number) => (
                <article key={i} className="group">
                  {post.imageUrl && (
                    <div className="relative aspect-[16/9] mb-4 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      <Image src={post.imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <Link href={`/article/${post._id}`}>
                    <h4 className="font-serif font-black text-[20px] leading-tight group-hover:text-red-700 transition-colors tracking-tight">
                      {post.title}
                    </h4>
                  </Link>
                  <p className="mt-2 text-[13px] text-zinc-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 5. POLITICS & MORE TOP STORIES */}
        <section className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-zinc-200 dark:border-zinc-800">
          <div className="lg:col-span-8">
            <h3 className="text-[11px] font-black uppercase tracking-widest mb-8 border-b border-black dark:border-white pb-1 inline-block">Policy & Politics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {politics.slice(0, 6).map((post: any, i: number) => (
                <article key={i} className="group border-b border-zinc-100 dark:border-zinc-900 pb-5 last:border-0 flex gap-4">
                  <div className="flex-1">
                    <Link href={`/article/${post._id}`}>
                      <h4 className="font-serif font-black text-[17px] leading-tight group-hover:text-red-700 transition-colors tracking-tight">
                        {post.title}
                      </h4>
                    </Link>
                    <div className="mt-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{post.timeAgo}</div>
                  </div>
                  <div className="relative w-20 h-20 overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex-shrink-0">
                    <Image
                      src={post.imageUrl || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=400&auto=format&fit=crop"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4 lg:pl-8 lg:border-l lg:border-zinc-100 dark:lg:border-zinc-900">
            <div className="bg-zinc-50 dark:bg-zinc-950 p-6 border border-zinc-100 dark:border-zinc-900 rounded-sm">
              <h4 className="text-lg font-serif font-black mb-3">The Briefing</h4>
              <p className="text-[13px] text-zinc-500 mb-5 leading-relaxed">The only intelligence briefing you need to start your day. Delivered at 6 AM.</p>
              <div className="flex flex-col gap-2">
                <input type="email" placeholder="Email address" className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-red-700 transition-colors" />
                <button className="bg-black dark:bg-white text-white dark:text-black py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-red-700 hover:text-white transition-all">Sign Up</button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. MORE TOP STORIES (WP Style Footer List) */}
        <section className="py-16">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1.5 h-6 bg-black dark:bg-white" />
            <h3 className="text-[14px] font-black uppercase tracking-[0.2em]">More Top Stories</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {[...ledger, ...politics, ...style].slice(4, 12).map((post: any, i: number) => (
              <article key={i} className="group flex flex-col">
                {post.imageUrl && (
                  <div className="relative aspect-[3/2] mb-5 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <Image src={post.imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <Link href={`/article/${post._id}`}>
                  <h4 className="font-serif font-bold text-[18px] leading-tight group-hover:text-red-700 transition-colors mb-3">
                    {post.title}
                  </h4>
                </Link>
                <p className="text-[13px] text-zinc-500 line-clamp-3 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-900 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {post.tag || "World"} • {post.timeAgo || "Updated"}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <button className="border-2 border-black dark:border-white px-10 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
              Load More Stories
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}