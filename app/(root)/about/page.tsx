'use client'

import React from 'react'
import MiniHeader from '@/components/site/miniHeader'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Globe, Users, Award, Sparkles } from 'lucide-react'

// Key Highlights Data
const values = [
  {
    icon: <Zap className="w-6 h-6 text-purple-600" />,
    title: "Instant Transactions",
    description: "Lightning-fast payment processing built on high-performance cloud infrastructure."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
    title: "Bank-Grade Security",
    description: "End-to-end encryption and multi-factor authentication keeping your data safe."
  },
  {
    icon: <Globe className="w-6 h-6 text-amber-500" />,
    title: "Global Reach",
    description: "Support for multi-currency settlement across hundreds of international regions."
  }
]

// Stats Data
const stats = [
  { value: "99.9%", label: "System Uptime" },
  { value: "2M+", label: "Active Users" },
  { value: "$10B+", label: "Processed Yearly" },
  { value: "24/7", label: "Dedicated Support" }
]

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-white px-7 py-6 flex flex-col gap-16">
      {/* 1. Top Section MiniHeader */}
      <MiniHeader ttext="About Our Platform" />

      {/* 2. Main Story Section */}
      <section className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200/60 w-fit text-purple-700 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Our Mission</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-primary leading-tight tracking-tight">
            Empowering the Next Generation of Financial Tech
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed">
            We are building a seamless ecosystem where sending, receiving, and managing money is as effortless as sending a text message. Designed with speed, security, and elegance at its core.
          </p>

          <p className="text-slate-600 leading-relaxed">
            From intuitive mobile experiences to robust developer APIs, our platform bridges traditional financial services with modern digital interfaces—helping businesses and individuals scale without boundaries.
          </p>
        </motion.div>

        {/* Story Visual Box with Mesh Gradient Accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-3xl p-10 bg-gradient-to-br from-[#d3c5ff]/40 via-[#ffd6e0]/40 to-[#fef3c7]/40 border border-white/60 shadow-xl overflow-hidden isolate"
        >
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-400/40 rounded-full blur-2xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-300/40 rounded-full blur-2xl -z-10" />

          <div className="flex flex-col gap-6 text-slate-800">
            <Award className="w-12 h-12 text-purple-700" />
            <h3 className="text-2xl font-bold text-primary">Built for Trust & Transparency</h3>
            <p className="text-slate-700 leading-relaxed">
              Our infrastructure is crafted from the ground up to guarantee real-time clarity over every transaction. Built for scaling teams and individual creators alike.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 3. Stats Banner Section */}
      <section className="max-w-[1440px] mx-auto w-full bg-primary text-white rounded-3xl py-12 px-8 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col gap-1"
            >
              <span className="text-4xl md:text-5xl font-black text-amber-400 tracking-tight">
                {stat.value}
              </span>
              <span className="text-sm md:text-base font-medium text-slate-400">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Core Values Grid */}
      <section className="max-w-[1440px] mx-auto w-full py-10 flex flex-col gap-12">
        <div className="text-center flex flex-col gap-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">
            Why Choose Our Platform
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Everything you need to deliver world-class payment experiences to your customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="p-8 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-purple-300 hover:shadow-lg transition-all duration-300 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-primary">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}