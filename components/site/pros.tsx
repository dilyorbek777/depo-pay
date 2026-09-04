'use client'

import React from 'react'
import Star from '../providers/star'
import { motion } from 'framer-motion'
import { Apple } from 'lucide-react'

// Custom Store Badges matching classic app store CTA visuals
function AppStoreBadge() {
  return (
    <div className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer border border-gray-800 group">
      <Apple className="w-8 h-8 text-white fill-current group-hover:scale-105 transition-transform" />
      <div className="flex flex-col text-left leading-tight">
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
          Download on the
        </span>
        <span className="text-base font-semibold tracking-tight text-white">
          App Store
        </span>
      </div>
    </div>
  )
}

function GooglePlayBadge() {
  return (
    <div className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer border border-gray-800 group">
      <svg
        className="w-7 h-7 text-white fill-current group-hover:scale-105 transition-transform"
        viewBox="0 0 24 24"
      >
        <path d="M3.609 1.814L13.792 12 3.61 22.186a2.37 2.37 0 0 1-.61-.983V2.797c.13-.377.34-.72.609-.983zm11.298 11.298l2.43 2.43-11.83 6.842 9.4-9.272zm0-2.224L5.507 1.616l11.83 6.842-2.43 2.43zm2.54 1.428l3.197-1.85a1.27 1.27 0 0 0 0-2.18l-3.197-1.85-2.26 2.26 2.26 2.26z" />
      </svg>
      <div className="flex flex-col text-left leading-tight">
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
          Get it on
        </span>
        <span className="text-base font-semibold tracking-tight text-white">
          Google Play
        </span>
      </div>
    </div>
  )
}

let crds = [
  { stat: "4.5/5", title: "On the iOS App Store", rate: 5 },
  { stat: "4.8/5", title: "On the Android Play Store", rate: 5 }
]

export default function Pros() {
  return (
    <div className="w-full bg-slate-50/60 py-16">
      <div className="max-w-[1440px] mx-auto px-6 flex justify-around items-center gap-12 max-lg:flex-col">
        {/* Code-based App Badges Block */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-6 px-10 py-8 bg-white border border-gray-200/80 shadow-sm rounded-2xl justify-center max-lg:w-full max-sm:flex-col"
        >
          <AppStoreBadge />
          <GooglePlayBadge />
        </motion.div>

        {/* Store Ratings Section */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-12"
        >
          <div className="flex items-center justify-center gap-12 sm:gap-16 flex-wrap">
            {crds.map((crd, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                  {crd.stat}
                </h1>
                <div className="py-1">
                  <Star rate={crd.rate} />
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  {crd.title}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}