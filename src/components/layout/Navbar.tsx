"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, Search, Moon, Sun, X, Bell, ChevronDown, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { StockTicker } from './StockTicker'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useAuth } from '@/components/auth/AuthProvider'

const STATIC_CATEGORIES = [
  "Cyber Crime", "Forensics", "Investigations", "Dark Web",
  "Policy", "Privacy", "Security", "Intelligence", "Finance",
  "Legal", "Global"
]

const TRENDING = [
  "Trump's tariffs", "Stock market crash", "Iran nuclear deal",
  "AI regulation", "Fed rate decision", "UK election 2026", "Silicon Valley layoffs"
]

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([])
  const { data: session } = useSession()
  const { openSignInModal } = useAuth()
  const { scrollY } = useScroll()

  useEffect(() => {
    setMounted(true)
    // Fetch dynamic categories/tags from CMS
    const fetchTags = async () => {
      try {
        const res = await fetch('/api/seed?tags=true'); // I'll need to create this or use another endpoint
        const data = await res.json();
        if (data.success) {
          setDynamicCategories(data.tags);
        }
      } catch (e) {
        console.error("Failed to fetch tags", e);
      }
    };
    fetchTags();
  }, [])

  const categories = Array.from(new Set([...STATIC_CATEGORIES, ...dynamicCategories]));

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 130)
  })

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  return (
    <>
      {/* ─────────────── MAIN HEADER ─────────────── */}
      <header className="w-full bg-[#FCFBF9] dark:bg-[#0A0A0A] font-sans">

        {/* Top Utility Row */}
        <div className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between px-4 md:px-8 py-2.5 max-w-[1600px] mx-auto">
            <div className="flex items-center gap-3">
              <button
                aria-label="Open menu"
                onClick={() => setIsMenuOpen(true)}
                className="p-1.5 hover:text-red-600 transition-colors group"
              >
                <Menu className="w-[18px] h-[18px]" />
              </button>
              <button aria-label="Search" className="p-1.5 hover:text-red-600 transition-colors hidden md:block">
                <Search className="w-[16px] h-[16px]" />
              </button>
              <button aria-label="Notifications" className="p-1.5 hover:text-red-600 transition-colors hidden md:block">
                <Bell className="w-[16px] h-[16px]" />
              </button>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              {mounted && (
                <button
                  aria-label="Toggle dark mode"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-1.5 hover:text-red-600 transition-colors"
                >
                  {theme === 'dark'
                    ? <Sun className="w-[16px] h-[16px]" />
                    : <Moon className="w-[16px] h-[16px]" />
                    }
                </button>
              )}
              <span className="hidden md:block text-zinc-300 dark:text-zinc-700 text-sm">|</span>
              
              {session?.user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold">
                      {session.user.image
                        ? <Image src={session.user.image} alt="" width={32} height={32} className="object-cover w-full h-full" />
                        : <span>{session.user.name?.charAt(0).toUpperCase()}</span>
                      }
                    </div>
                    <span className="hidden md:block text-[13px] font-bold max-w-[120px] truncate">{session.user.name?.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 shadow-xl z-50"
                      >
                        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                          <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{session.user.name}</p>
                          <p className="text-xs text-zinc-400 truncate">{session.user.email}</p>
                        </div>
                        <button
                          onClick={() => { signOut(); setIsUserMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <button
                    onClick={openSignInModal}
                    className="hidden md:block text-[13px] font-bold text-zinc-700 dark:text-zinc-300 hover:text-red-700 transition-colors"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={openSignInModal}
                    className="bg-black dark:bg-white text-white dark:text-black font-black text-[11px] uppercase tracking-widest px-4 py-1.5 hover:bg-red-700 dark:hover:bg-zinc-200 transition-colors"
                  >
                    Subscribe
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="py-6 md:py-8 text-center border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/" className="inline-block group text-center">
            <h1 className="font-serif text-[42px] md:text-[68px] lg:text-[84px] font-black tracking-tighter leading-none text-zinc-950 dark:text-white group-hover:opacity-80 transition-opacity duration-500 select-none">
              The Indianberg
            </h1>
            <p className="font-serif italic text-[14px] md:text-[18px] text-zinc-500 dark:text-zinc-400 mt-2 tracking-widest uppercase">
              Breaking barriers, shaping narrative
            </p>
          </Link>
        </div>

        {/* Financial Ticker moved here */}
        <StockTicker />

        {/* Category Nav - Now Scrollable */}
        <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
          <div className="flex items-center gap-8 py-4 max-w-[1600px] mx-auto px-4 md:px-8 overflow-x-auto scrollbar-hide no-scrollbar flex-nowrap">
            {categories.map(cat => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase().replace(/ /g, '_')}`}
                className="text-[12px] font-bold text-zinc-900 dark:text-zinc-100 hover:text-red-700 dark:hover:text-red-500 transition-colors whitespace-nowrap flex-shrink-0"
              >
                {cat}
              </Link>
            ))}
          </div>
        </nav>

        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Trending Bar */}
        <div className="hidden md:flex items-center gap-4 px-4 md:px-8 py-3 max-w-[1600px] mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-700 dark:text-red-500 whitespace-nowrap flex-shrink-0">
            Trending
          </span>
          <div className="h-3 w-px bg-zinc-300 dark:bg-zinc-700 flex-shrink-0" />
          <div className="flex items-center gap-5 overflow-hidden">
            {TRENDING.map((trend, i) => (
              <Link
                key={i}
                href="#"
                className="font-serif italic text-[14px] text-zinc-600 dark:text-zinc-400 hover:text-red-700 dark:hover:text-red-400 transition-colors whitespace-nowrap hover:underline"
              >
                {trend}
              </Link>
            ))}
          </div>
        </div>

      </header>

      {/* ─────────────── STICKY MINI HEADER ─────────────── */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 inset-x-0 z-50 bg-[#FCFBF9] dark:bg-[#0A0A0A] border-b-2 border-black dark:border-white shadow-lg"
          >
            <div className="flex items-center justify-between px-4 md:px-8 py-3 max-w-[1600px] mx-auto">
              {/* Left */}
              <div className="flex items-center gap-4">
                <button onClick={() => setIsMenuOpen(true)}>
                  <Menu className="w-5 h-5 hover:text-red-700 transition-colors" />
                </button>
                <Link href="/">
                  <span className="font-serif font-black text-[22px] tracking-tighter hover:opacity-75 transition-opacity">
                    The Indianberg
                  </span>
                </Link>
              </div>

              {/* Center: Category pills on desktop */}
              <nav className="hidden xl:flex items-center gap-5">
                {categories.slice(0, 5).map(cat => (
                  <Link key={cat} href={`/category/${cat.toLowerCase().replace(/ /g, '_')}`} className="text-[12px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-red-700 transition-colors">{cat}</Link>
                ))}
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
              </nav>

              {/* Right */}
              <div className="flex items-center gap-3">
                {mounted && (
                  <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-1 hover:text-red-700 transition-colors">
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                )}
                <button className="bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 hover:bg-red-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────── SLIDE-OUT DRAWER MENU ─────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="fixed inset-y-0 left-0 z-[70] w-[380px] max-w-[90vw] bg-[#FCFBF9] dark:bg-[#0A0A0A] flex flex-col border-r border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-7 py-5 border-b-2 border-black dark:border-white flex-shrink-0">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <span className="font-serif font-black text-2xl tracking-tighter">The Indianberg</span>
                </Link>
                <motion.button
                  onClick={() => setIsMenuOpen(false)}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="p-1.5 hover:text-red-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Drawer Nav Links */}
              <nav className="flex-1 px-7 py-6">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                    hidden: {}
                  }}
                  className="space-y-1"
                >
                  <motion.div variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
                    <Link
                      href="/" onClick={() => setIsMenuOpen(false)}
                      className="block py-3.5 border-b border-zinc-100 dark:border-zinc-900 font-serif font-black text-[20px] text-zinc-950 dark:text-white hover:text-red-700 transition-colors"
                    >
                      Front Page
                    </Link>
                  </motion.div>
                  {categories.map((cat) => (
                    <motion.div key={cat} variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
                      <Link
                        href={`/category/${cat.toLowerCase().replace(/ /g, '_')}`} onClick={() => setIsMenuOpen(false)}
                        className="block py-3.5 border-b border-zinc-100 dark:border-zinc-900 font-sans text-[16px] font-semibold text-zinc-600 dark:text-zinc-400 hover:text-red-700 dark:hover:text-red-500 transition-colors"
                      >
                        {cat}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </nav>

              {/* Drawer Footer */}
              <div className="flex-shrink-0 px-7 py-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                <button 
                  onClick={openSignInModal}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-4 font-black uppercase tracking-widest text-[11px] hover:bg-red-700 dark:hover:bg-zinc-200 transition-colors"
                >
                  Subscribe — Unlimited Access
                </button>
                {!session && (
                  <button 
                    onClick={openSignInModal}
                    className="w-full text-center text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors py-2"
                  >
                    Sign in
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}