'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Twitter, Linkedin, Send } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { label: 'Facebook', href: '#', icon: Facebook },
    { label: 'Instagram', href: '#', icon: Instagram },
    { label: 'Twitter', href: '#', icon: Twitter },
    { label: 'LinkedIn', href: '#', icon: Linkedin },
  ]

  return (
    <footer className="w-full bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200/80 text-gray-700">
      <div className="max-w-[1440px] mx-auto px-7 py-10">
        <div className="flex items-center justify-between max-sm:flex-col gap-6">
          {/* Left: Brand & Copyright */}
          <div className="flex items-center gap-4 max-sm:flex-col max-sm:text-center">
            <Link
              aria-label="Home Page"
              href="/"
              className="flex items-center gap-3 transition-transform hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl bg-white p-1.5 shadow-sm border border-gray-200/80 flex items-center justify-center">
                <Image
                  src="/favicon.png"
                  alt="PrimePay Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                PrimePay
              </span>
            </Link>

            <div className="hidden sm:block w-px h-6 bg-gray-300" />

            <p className="text-sm font-medium text-gray-500">
              © {currentYear} DEPO —{' '}
              <Link
                aria-label="Telegram"
                href="https://t.me/leader_developer"
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-semibold transition-colors group"
              >
                <span>@leader_developer</span>
                <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </p>
          </div>

          {/* Right: Social Icon Bar */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <motion.div
                  key={social.label}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    aria-label={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-200/80 shadow-sm flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/40 hover:shadow-md transition-all duration-200"
                  >
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}