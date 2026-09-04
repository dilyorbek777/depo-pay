'use client'

import React from 'react'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'
import { Check, ChevronDown, Sparkles } from 'lucide-react'

const prices = [
  {
    title: 'Basic',
    cardGradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
    headerGradient: 'from-[#FFB545] via-[#FFC675] to-[#F3AC42]',
    textColor: 'text-[#2D2353]',
    checkCount: 1,
    checkColor: 'text-[#D88D22]',
    price: '$10.00',
    popular: false,
    features: [
      'Modern Design',
      'Easy to Customize',
      'Quickly Set Up A Website',
      'Another Feature',
      'Unlimited products',
    ],
  },
  {
    title: 'Standard',
    cardGradient: 'from-purple-600/30 via-pink-500/10 to-transparent',
    headerGradient: 'from-[#8257FF] via-[#916BFF] to-[#6C3CFF]',
    textColor: 'text-white',
    checkCount: 2,
    checkColor: 'text-[#4D1EDB]',
    price: '$19.00',
    popular: true,
    badgeText: 'Most Popular',
    features: [
      'Modern Design & APP',
      'Easy to Customize',
      'Quickly Set Up A Website',
      'Another Feature',
      '24/7 Customer Support',
    ],
  },
  {
    title: 'Premium',
    cardGradient: 'from-amber-500/20 via-orange-500/5 to-transparent',
    headerGradient: 'from-[#FFC675] via-[#FFB545] to-[#E59828]',
    textColor: 'text-[#2D2353]',
    checkCount: 3,
    checkColor: 'text-[#FFE1B5]',
    price: '$35.00',
    popular: false,
    features: [
      'Unlimited products',
      'Unlimited orders',
      'Unlimited customers',
      'Unlimited products',
      'Unlimited orders',
    ],
  },
]

export default function Pricing() {
  return (
    <div className="w-full h-full px-6 py-20 bg-[#181818] relative overflow-hidden">
      {/* Background Lighting Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Title Section */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-5xl sm:text-6xl font-extrabold text-gray-200 text-center tracking-tight leading-tight"
      >
        Our payment services <br />
        <span className="bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          worldwide
        </span>
      </motion.h1>

      <div className="max-w-[1440px] mx-auto pt-16 pb-12 flex justify-between gap-8 max-lg:flex-col items-center">
        <div className="grid grid-cols-3 w-full items-stretch justify-between gap-8 max-lg:grid-cols-1 max-lg:max-w-md max-lg:mx-auto">
          {prices.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`relative w-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-8 backdrop-blur-xl bg-white/[0.04] border ${
                plan.popular ? 'border-purple-500/50 shadow-2xl shadow-purple-500/10' : 'border-white/10 shadow-xl'
              } overflow-hidden`}
            >
              {/* Radial Backlight Gradient per Card */}
              <div className={`absolute inset-0 bg-gradient-to-b ${plan.cardGradient} pointer-events-none`} />

              {/* Header Banner */}
              <div className="relative pt-2">
                {plan.popular && (
                  <div className="absolute -top-3 left-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-extrabold text-xs px-3.5 py-1 rounded-full z-10 shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-black" />
                    {plan.badgeText}
                  </div>
                )}
                <div
                  className={`w-full h-24 rounded-2xl bg-gradient-to-r ${plan.headerGradient} ${plan.textColor} px-6 flex items-center justify-between relative overflow-hidden shadow-lg`}
                >
                  {/* Glass shimmer overlay */}
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-sm z-10">
                    {plan.title}
                  </span>

                  {/* Icon pattern */}
                  <div className="flex flex-col items-center -space-y-4 opacity-80 pointer-events-none z-10">
                    {Array.from({ length: plan.checkCount }).map((_, i) => (
                      <ChevronDown
                        key={i}
                        className={`w-11 h-11 stroke-[3.5] ${plan.checkColor}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Row */}
              <div className="flex w-full items-baseline justify-between px-2 z-10">
                <p className="text-white text-4xl sm:text-5xl font-black tracking-tight drop-shadow-sm">
                  {plan.price}
                </p>
                <p className="text-lg font-medium text-gray-400">/ Month</p>
              </div>

              {/* Features Container with Frosted Glass styling */}
              <ul className="backdrop-blur-md bg-white/[0.05] border border-white/10 w-full py-6 px-6 rounded-2xl space-y-4 flex-grow z-10">
                {plan.features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: featureIndex * 0.08 }}
                    className="text-sm sm:text-base text-gray-300 flex items-center gap-3 font-medium"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                    </div>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Action Button */}
              <Button
                id={`get-started-pricing-${index}`}
                className={`w-full py-6 text-base sm:text-lg rounded-xl font-bold transition-all duration-300 z-10 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                }`}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}