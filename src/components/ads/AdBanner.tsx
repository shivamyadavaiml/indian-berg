"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface AdBannerProps {
  type: "leaderboard" | "sidebar" | "in-feed"
  className?: string
}

export function AdBanner({ type, className }: AdBannerProps) {
  // Define dimensions and styles based on type
  const styles = {
    leaderboard: "w-full max-w-[970px] h-[90px] md:h-[250px]",
    sidebar: "w-full h-[600px] max-w-[300px]",
    "in-feed": "w-full h-[150px] md:h-[200px]"
  }

  // Predefined mock ad content
  const ads = {
    leaderboard: {
      title: "Experience Pure Luxury",
      subtitle: "The New 2026 Continental Series",
      cta: "Book Test Drive",
      color: "from-zinc-900 to-zinc-800",
      textColor: "text-white"
    },
    sidebar: {
      title: "Unlock Global Markets",
      subtitle: "The #1 Platform for Intelligent Trading",
      cta: "Get Started",
      color: "from-blue-900 to-indigo-900",
      textColor: "text-white"
    },
    "in-feed": {
      title: "Stream Seamlessly",
      subtitle: "The Highest Quality 8K Resolution",
      cta: "Learn More",
      color: "from-red-900 to-red-800",
      textColor: "text-white"
    }
  }

  const currentAd = ads[type]

  return (
    <div className={cn("flex flex-col items-center justify-center my-8", className)}>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Advertisement</span>
      <div 
        className={`${styles[type]} bg-gradient-to-br ${currentAd.color} relative overflow-hidden group cursor-pointer border border-zinc-200 dark:border-zinc-800 shadow-sm`}
      >
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 group-hover:scale-110 transition-transform duration-700" />

        <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center ${currentAd.textColor}`}>
          <h5 className="font-serif italic text-xl md:text-2xl font-black mb-2 leading-tight">
            {currentAd.title}
          </h5>
          <p className="text-xs md:text-sm mb-4 opacity-80 max-w-[200px] md:max-w-none">
            {currentAd.subtitle}
          </p>
          <button className="bg-white text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-colors">
            {currentAd.cta}
          </button>
        </div>

        {/* Realistic Ad Tag */}
        <div className="absolute bottom-1 right-1 px-1 bg-black/20 text-[6px] text-white/50 rounded pointer-events-none">
          AdChoices
        </div>
      </div>
    </div>
  )
}
