import Link from 'next/link'
import Image from 'next/image'
import { getPostsByTag } from '@/lib/posts'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const posts = await getPostsByTag(decodedSlug);

  if (posts.length === 0) {
    // We could either show an empty state or 404. Let's show empty state first but if it's completely unknown maybe notFound()
  }

  const categoryName = decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1).replace(/_/g, ' ');

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="w-full bg-[#FCFBF9] dark:bg-black font-sans min-h-screen">
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 w-full py-12">
        
        {/* Category Header */}
        <header className="mb-12 border-b-2 border-black dark:border-white pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-6xl font-black uppercase tracking-tighter text-zinc-900 dark:text-zinc-100 mb-2">
              {categoryName}
            </h1>
            <p className="text-zinc-500 font-sans tracking-widest uppercase text-xs font-black">
              Deep Intelligence & Investigative Coverage
            </p>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-red-700 text-white px-2 py-1">Archive {new Date().getFullYear()}</span>
          </div>
        </header>

        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">No stories found in this section.</h2>
            <p className="text-zinc-500">Check back later for updates or explore our other sections.</p>
            <Link href="/" className="inline-block mt-8 bg-black text-white px-8 py-3 font-bold uppercase tracking-widest text-xs">Return Home</Link>
          </div>
        ) : (
          <>
            {/* Top Featured Post in Category */}
            {featuredPost && (
              <Link href={`/article/${featuredPost._id}`} className="group grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 border-b border-zinc-200 dark:border-zinc-800 pb-16">
                <div className="lg:col-span-8 relative aspect-[16/9] bg-zinc-100 overflow-hidden">
                   <Image 
                     src={featuredPost.imageUrl || `https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1500&auto=format&fit=crop`} 
                     alt={featuredPost.title} 
                     fill 
                     className="object-cover group-hover:scale-105 transition-transform duration-[3s]" 
                   />
                </div>
                <div className="lg:col-span-4 flex flex-col justify-center">
                  <span className="text-red-700 dark:text-red-500 font-black uppercase tracking-[0.2em] text-xs mb-4">Featured Story</span>
                  <h2 className="font-serif text-4xl md:text-5xl font-black leading-[1.05] tracking-tighter mb-6 group-hover:text-red-700 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 leading-relaxed font-serif italic">
                    {featuredPost.excerpt || featuredPost.description}
                  </p>
                  <div className="flex items-center text-xs font-bold text-zinc-500 uppercase tracking-widest gap-3">
                    <span>By {featuredPost.author || "Editorial Board"}</span>
                    <span>•</span>
                    <span>{featuredPost.timeAgo || "Just now"}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
              {otherPosts.map((post: any) => (
                <Link href={`/article/${post._id}`} key={post._id} className="group flex flex-col border-t border-zinc-200 dark:border-zinc-800 pt-8">
                  <div className="relative aspect-[16/9] mb-6 overflow-hidden bg-zinc-100 grayscale group-hover:grayscale-0 transition-all duration-500">
                     <Image src={post.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400&auto=format&fit=crop"} fill alt="" className="object-cover" />
                  </div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">
                    {post.tag || categoryName} • {post.timeAgo || "2 hours ago"}
                  </span>
                  <h3 className="font-serif text-2xl font-black leading-tight mb-4 group-hover:text-red-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                    {post.excerpt || post.description}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  )
}

