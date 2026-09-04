'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 4000)
      setEmail('')
    }
  }

  return (
    <div className="w-full px-4 sm:px-7 py-12 sm:py-20  relative overflow-hidden">
      {/* Background Lighting & Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-gradient-to-r from-purple-600/20 via-pink-500/15 to-amber-500/15 blur-[140px] rounded-full pointer-events-none" />

      <section className="max-w-[1440px] mx-auto relative z-10 backdrop-blur-xl bg-background border border-ring/20 p-8 sm:p-12 md:p-16 rounded-3xl shadow-2xl overflow-hidden">
        {/* Subtle Inner Highlight Overlay */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex items-center justify-between max-xl:flex-col gap-10">
          {/* Headline Text */}
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary max-xl:text-center leading-tight tracking-tight"
          >
            Take control of your <br className="hidden sm:inline" />
            personal{' '}
            <span className="bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              finances today
            </span>
          </motion.h1>

          {/* Form / Interactive Area */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full xl:w-auto min-w-[320px] sm:min-w-[480px]"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 py-4 px-6 rounded-2xl backdrop-blur-md text-base sm:text-lg font-medium"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <span>Thank you! You&apos;ve successfully subscribed.</span>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex items-center max-md:flex-col gap-3 sm:gap-4 p-2 bg-white/[0.05] border border-ring/15 rounded-2xl backdrop-blur-md shadow-inner"
              >
                {/* Email Input Field */}
                <div className="relative w-full flex items-center ">
                  <Mail className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-12 sm:h-14 pl-12 pr-4 bg-transparent text-black placeholder-gray-400 outline-none text-base sm:text-lg font-medium"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  id="send"
                  type="submit"
                  className="w-full md:w-auto flex-shrink-0 h-12 sm:h-14 px-8 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold text-base sm:text-lg rounded-xl transition-all duration-300 shadow-lg shadow-purple-600/25 active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <span>Send</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}