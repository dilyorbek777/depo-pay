'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Globe2, Smartphone, ArrowUpRight } from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Bank-Grade Security',
    description: 'End-to-end encryption and multi-factor authentication protect every transaction.',
    cardBg: 'bg-emerald-500/[0.03]',
    hoverBg: 'hover:border-emerald-500/40',
    iconBg: 'bg-emerald-100/80 border-emerald-200',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Zap,
    title: 'Instant Transfers',
    description: 'Send and receive funds anywhere in the world within seconds without delay.',
    cardBg: 'bg-amber-500/[0.03]',
    hoverBg: 'hover:border-amber-500/40',
    iconBg: 'bg-amber-100/80 border-amber-200',
    iconColor: 'text-amber-600',
  },
  {
    icon: Globe2,
    title: 'Global Coverage',
    description: 'Seamless multi-currency support tailored for cross-border digital payments.',
    cardBg: 'bg-purple-500/[0.03]',
    hoverBg: 'hover:border-purple-500/40',
    iconBg: 'bg-purple-100/80 border-purple-200',
    iconColor: 'text-purple-600',
  },
  {
    icon: Smartphone,
    title: 'Smart Mobile Control',
    description: 'Manage cards, set spending limits, and track expenses effortlessly from your phone.',
    cardBg: 'bg-pink-500/[0.03]',
    hoverBg: 'hover:border-pink-500/40',
    iconBg: 'bg-pink-100/80 border-pink-200',
    iconColor: 'text-pink-600',
  },
]

export default function WhyUs() {
  return (
    <div className="w-full h-full px-6 py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Soft Ambient Background Lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-purple-200/40 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[250px] bg-amber-200/40 blur-[110px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="max-w-[1440px] mx-auto text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight leading-tight"
        >
          Designed for the next <br />
          <span className="bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            generation of payments
          </span>
        </motion.h1>
      </div>

      {/* Grid */}
      <div className="max-w-[1440px] mx-auto pt-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative rounded-3xl p-7 bg-white/80 border border-gray-200/80 backdrop-blur-md flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 ${feature.hoverBg}`}
              >
                {/* Subtle Card Tint */}
                <div className={`absolute inset-0 ${feature.cardBg} pointer-events-none`} />

                <div>
                  {/* Icon & Arrow Bar */}
                  <div className="flex items-center justify-between mb-6 z-10 relative">
                    <div className={`w-12 h-12 rounded-2xl ${feature.iconBg} border flex items-center justify-center shadow-sm`}>
                      <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shadow-sm">
                      <ArrowUpRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-primary mb-2 z-10 relative">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed z-10 relative">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}