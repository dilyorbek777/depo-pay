'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function MiniHeader({ ttext }: { ttext: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full max-w-[1440px] mx-auto h-[32vh] min-h-[220px] overflow-hidden flex flex-col justify-center items-center rounded-3xl px-6 shadow-2xl border border-white/40 bg-[#f8f5ff] isolate"
    >
      {/* 1. Base Layer Gradient Mesh */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-[#d3c5ff] via-[#ffd6e0] to-[#fef3c7]" />

      {/* 2. Ambient Blur Glows */}
      <div className="absolute -top-12 -left-12 -z-20 h-64 w-64 rounded-full bg-purple-400/60 blur-3xl pointer-events-none" />
      <div className="absolute -top-16 -right-16 -z-20 h-72 w-72 rounded-full bg-sky-300/70 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 -z-20 h-48 w-4/5 rounded-full bg-amber-200/60 blur-3xl pointer-events-none" />

      {/* 3. Glass Overlay */}
      <div className="absolute inset-0 -z-10 bg-white/10 backdrop-blur-[1px]" />

      {/* 4. Floating Geometry Shapes */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [12, 22, 12] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 left-12 w-8 h-8 rounded-xl border-2 border-white/80 bg-white/20 backdrop-blur-md shadow-sm pointer-events-none max-md:hidden"
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-24 w-6 h-6 rounded-full border-2 border-white/70 bg-purple-300/30 backdrop-blur-md shadow-sm pointer-events-none max-md:hidden"
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 right-16 w-7 h-7 rounded-full border-2 border-white/80 bg-white/20 backdrop-blur-md shadow-sm pointer-events-none max-md:hidden"
      />
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [45, 60, 45] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-12 right-20 w-8 h-8 rounded-xl border-2 border-white/70 bg-amber-200/30 backdrop-blur-md shadow-sm pointer-events-none max-md:hidden"
      />

      {/* Content Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="z-10 text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight text-center leading-tight drop-shadow-sm capitalize"
      >
        {ttext}
      </motion.h1>
    </motion.div>
  )
}