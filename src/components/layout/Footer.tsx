import Link from 'next/link'
import Image from 'next/image'
import { Globe, MessageSquare, Rss } from 'lucide-react'

const footerLinks = {
  sections: [
    {
      title: "News",
      links: ["Politics", "Technology", "Science", "Health", "World"]
    },
    {
      title: "Markets",
      links: ["Stocks", "Commodities", "Currencies", "Crypto", "Analysis"]
    },
    {
      title: "Opinion",
      links: ["Editorials", "Columnists", "Guest Essays", "Letters"]
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Contact", "Advertise", "Press"]
    }
  ],
  legal: ["Terms of Service", "Privacy Policy", "Cookie Policy", "Accessibility"]
}

export function Footer() {
  return (
    <footer className="w-full bg-zinc-950 text-white mt-auto border-t border-zinc-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex flex-col items-start mb-6 no-underline">
              <Image 
                src="/logo.png" 
                alt="The Indian Berg" 
                width={200} 
                height={50} 
                className="h-9 w-auto invert" 
              />
              <span className="text-xs font-sans tracking-[0.2em] text-zinc-400 uppercase mt-2">
                Breaking barriers, shaping narrative
              </span>
            </Link>
            <p className="text-zinc-400 text-sm max-w-sm mb-6 leading-relaxed">
              Premium journalism and rigorous financial analysis. Stay informed with our daily brief on global markets and breaking news.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
                <MessageSquare className="w-5 h-5 text-zinc-300" />
              </Link>
              <Link href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
                <Globe className="w-5 h-5 text-zinc-300" />
              </Link>
              <Link href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
                <Rss className="w-5 h-5 text-zinc-300" />
              </Link>
            </div>
          </div>

          {footerLinks.sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-sans font-bold text-lg mb-4 text-zinc-100">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-zinc-800 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold font-serif mb-2">Subscribe to our Newsletter</h3>
            <p className="text-zinc-400 text-sm">Get the latest investigative reports delivered to your inbox.</p>
          </div>
          <form className="flex w-full md:w-auto gap-2" action="#">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-zinc-900 border border-zinc-800 px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 rounded flex-1 md:w-72"
            />
            <button type="button" className="bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-zinc-200 transition-colors rounded">
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-8 mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} The Indian Berg. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link key={link} href="#" className="text-zinc-500 hover:text-zinc-300 text-xs">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
