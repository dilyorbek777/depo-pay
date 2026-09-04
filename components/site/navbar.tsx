"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Menu, X, ArrowRight } from 'lucide-react'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { title: "About", href: "/about" },
  { title: "Blog", href: "/blog" },
  { title: "Why us", href: "/whyus" },
  { title: "Pricing", href: "/pricing" },
]

export default function Navbar() {
  const [toggle, setToggle] = useState(false)

  return (
    <header className="sticky top-0 z-[999] w-full bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="flex items-center justify-between max-w-[1440px] mx-auto h-16 sm:h-20 px-4 sm:px-8">
        {/* Brand Logo - Responsive Sizing */}
        <Link aria-label="Home Page" href="/" className="flex items-center shrink-0 group">
          <Image 
            src="/Logo.svg" 
            alt="Logo" 
            width={160} 
            height={40} 
            className="w-28 sm:w-36 h-auto transition-transform group-hover:scale-105" 
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors py-1 relative group"
            >
              {link.title}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </Link>
          ))}
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors py-1 relative group"
            >
              Dashboard
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </Link>
          </SignedIn>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button 
                variant="ghost" 
                className="font-semibold text-slate-700 hover:text-primary hover:bg-slate-100/80 rounded-xl px-4 xl:px-5"
              >
                Login
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button 
                className="bg-primary hover:bg-slate-800 text-white font-semibold rounded-xl px-4 xl:px-5 shadow-sm hover:shadow transition-all"
              >
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-slate-800 text-white font-semibold rounded-xl px-4 xl:px-5 gap-2 shadow-sm">
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <div className="pl-2 border-l border-slate-200">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <Button
          aria-label="Toggle Menu"
          onClick={() => setToggle(!toggle)}
          variant="ghost"
          size="icon"
          className="lg:hidden text-slate-700 hover:bg-slate-100 rounded-xl"
        >
          {toggle ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Responsive Mobile Drawer Overlay */}
      <AnimatePresence>
        {toggle && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100vh - 64px)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-x-0 top-[64px] sm:top-[80px] bg-white/95 backdrop-blur-xl z-50 flex flex-col justify-between p-6 lg:hidden border-t border-slate-100 shadow-2xl overflow-y-auto"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-10 right-10 w-36 h-36 sm:w-48 sm:h-48 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-36 h-36 sm:w-48 sm:h-48 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

            {/* Nav Links */}
            <div className="flex flex-col gap-2 sm:gap-4 pt-2 relative z-10">
              {links.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={() => setToggle(false)}
                  className="text-xl sm:text-2xl font-bold text-slate-800 hover:text-purple-600 transition-colors py-2.5 border-b border-slate-100/80"
                >
                  {link.title}
                </Link>
              ))}
              <SignedIn>
                <Link
                  href="/dashboard"
                  onClick={() => setToggle(false)}
                  className="text-xl sm:text-2xl font-bold text-slate-800 hover:text-purple-600 transition-colors py-2.5 border-b border-slate-100/80"
                >
                  Dashboard
                </Link>
              </SignedIn>
            </div>

            {/* Mobile Actions Bottom */}
            <div className="flex flex-col gap-3 pt-6 pb-4 relative z-10">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button 
                    variant="outline" 
                    className="w-full h-11 sm:h-12 text-base font-semibold rounded-2xl border-slate-200 text-slate-800"
                  >
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button 
                    className="w-full h-11 sm:h-12 text-base font-semibold bg-primary hover:bg-slate-800 text-white rounded-2xl shadow-md"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center justify-between bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-sm font-semibold text-slate-700">Account Profile</span>
                  <UserButton afterSignOutUrl="/" />
                </div>
                <Link href="/dashboard" onClick={() => setToggle(false)}>
                  <Button className="w-full h-11 sm:h-12 text-base font-semibold bg-primary text-white rounded-2xl gap-2 shadow-md">
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}