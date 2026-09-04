'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Play, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import WalletCardComponent from './miniPhone'

export default function PaymentData() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
      {/* Background Ambient Glow Accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-72 h-72 sm:w-96 sm:h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 -z-10 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-20 min-h-[600px]">
        
        {/* Left Column: Text & Hero CTA */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex flex-col justify-center items-start gap-6 sm:gap-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200/60 text-purple-700 text-xs font-extrabold uppercase tracking-wider shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seamless E-Wallet</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-5xl xl:text-6xl font-extrabold text-primary leading-[1.15] tracking-tight"
          >
            Send and receive <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              payments
            </span> easily
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-xl font-medium"
          >
            DEPOPAY e-wallet is a modern payment tool that allows you to conveniently and safely use Payme to pay for goods and services and make instant transfers.
          </motion.p>

          {/* CTA Action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-2 flex items-center gap-4 group cursor-pointer"
          >
            <Button 
              id="watch-demo" 
              className="relative bg-primary hover:bg-primary/80 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current ml-0.5 transition-transform group-hover:scale-110" />
            </Button>
            <div className="flex flex-col">
              <span className="font-bold text-primary group-hover:text-primary/80 transition-colors text-base sm:text-lg">
                Watch demo
              </span>
              <span className="text-xs text-slate-400 font-medium">1 min product preview</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Interactive Phone Preview */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex justify-center items-center relative"
        >
          <div className="relative w-full max-w-md flex justify-center items-center">
            {/* Background Decorative Rings */}
            <div className="absolute inset-0 rounded-3xl -rotate-3 scale-95 -z-10" />
            
            <div className="p-4 sm:p-6 w-full flex justify-center items-center">
              <WalletCardComponent />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}