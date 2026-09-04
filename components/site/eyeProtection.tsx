'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Info, Eye, EyeOff, Fingerprint, User } from 'lucide-react'

// Phone Frame Shell Wrapper
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[300px] h-[580px] bg-white rounded-[44px] p-3 shadow-xl border border-gray-200/90 ring-1 ring-black/5 flex flex-col justify-between select-none">
      {/* Top Earpiece Grill & Dynamic Notch */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-100 rounded-full border border-gray-200/60 flex items-center justify-center gap-2 z-20">
        <div className="w-8 h-1 bg-gray-300 rounded-full" />
        <div className="w-2 h-2 bg-gray-800 rounded-full" />
      </div>

      {/* Screen Inner Display */}
      <div className="w-full h-full bg-white rounded-[34px] pt-8 px-5 pb-6 flex flex-col justify-between text-primary font-sans border border-gray-100 overflow-hidden relative">
        {children}
      </div>

      {/* Bottom Home Bar */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-300 rounded-full z-20" />
    </div>
  )
}

// Screen 1: Forgot Password View
function ScreenForgotPassword() {
  return (
    <PhoneFrame>
      <div className="flex items-center justify-between text-gray-500">
        <ArrowLeft className="w-4 h-4 cursor-pointer" />
        <Info className="w-4 h-4 cursor-pointer" />
      </div>

      <div className="flex flex-col items-center gap-3 my-auto">
        {/* Arch Logo Container */}
        <div className="w-36 h-36 rounded-t-full bg-gradient-to-tr from-sky-400 via-purple-500 to-amber-400 p-0.5 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-md mb-2">
            <span className="text-xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              P
            </span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            PrimePay
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 mt-2">
          Forgot Password?
        </h3>
        <p className="text-[11px] text-gray-400 text-center leading-tight px-1">
          Please enter your <span className="text-amber-500">phone number</span>{' '}
          or <span className="text-amber-500">email address</span> to reset
          the password
        </p>

        <div className="w-full mt-2">
          <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-400">
            Phone
          </div>
        </div>

        <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md shadow-indigo-200 transition-colors">
          Continue
        </button>

        <span className="text-[10px] text-gray-400 text-center mt-1">
          We sent a verification code to your phone number
        </span>
      </div>
    </PhoneFrame>
  )
}

// Screen 2: Code Verification View
function ScreenEnterCode() {
  return (
    <PhoneFrame>
      <div className="flex items-center justify-between text-gray-500">
        <ArrowLeft className="w-4 h-4 cursor-pointer" />
        <Info className="w-4 h-4 cursor-pointer" />
      </div>

      <div className="flex flex-col items-center gap-3 my-auto">
        {/* Arch Logo Container */}
        <div className="w-36 h-36 rounded-t-full bg-gradient-to-tr from-sky-400 via-purple-500 to-amber-400 p-0.5 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-md mb-2">
            <span className="text-xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              P
            </span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            PrimePay
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 mt-2">Enter a Code</h3>
        <p className="text-[11px] text-gray-400 text-center leading-tight">
          We sent a verification code to <br />
          your phone number{' '}
          <span className="text-amber-500 font-medium">(+22) 123 546...</span>
        </p>

        {/* 4 Digit Input Boxes */}
        <div className="flex gap-2 my-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-10 h-10 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center text-sm font-semibold text-gray-700"
            />
          ))}
        </div>

        <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md shadow-indigo-200 transition-colors">
          Change Password
        </button>

        <button className="text-[11px] text-amber-500 font-medium hover:underline mt-1">
          Resend Code
        </button>
      </div>
    </PhoneFrame>
  )
}

// Screen 3: Signup View
function ScreenSignup() {
  return (
    <PhoneFrame>
      <div className="flex items-center justify-between text-gray-500">
        <ArrowLeft className="w-4 h-4 cursor-pointer" />
        <Info className="w-4 h-4 cursor-pointer" />
      </div>

      <div className="flex flex-col items-center gap-2.5 my-auto">
        {/* User Avatar Circle */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-purple-500 to-sky-400 p-0.5 flex items-center justify-center shadow-sm">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            <User className="w-7 h-7 text-indigo-500" />
          </div>
        </div>

        <h3 className="text-base font-bold text-gray-900">Signup</h3>
        <p className="text-[11px] text-gray-400 text-center leading-tight max-w-[200px]">
          Create an account so you can manage your financial status
        </p>

        {/* Input Fields */}
        <div className="w-full space-y-2 mt-1">
          <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[11px] text-gray-400">
            Username
          </div>
          <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[11px] text-gray-400">
            Email id
          </div>
          <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Password</span>
            <div className="flex items-center gap-1.5 text-gray-400">
              <EyeOff className="w-3.5 h-3.5 cursor-pointer" />
              <Fingerprint className="w-3.5 h-3.5 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2 w-full text-[10px] text-gray-400 my-1">
          <div className="w-3 h-3 rounded bg-gray-900 mt-0.5 flex-shrink-0" />
          <span className="leading-tight">
            I hereby agree to the{' '}
            <span className="text-amber-500">terms of services</span> and{' '}
            <span className="text-amber-500">privacy policy</span>
          </span>
        </div>

        <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md shadow-indigo-200 transition-colors">
          Create an Account
        </button>

        <span className="text-[10px] text-gray-400">
          Already have an account?{' '}
          <span className="text-amber-500 font-semibold cursor-pointer">
            Sign in
          </span>
        </span>
      </div>
    </PhoneFrame>
  )
}

export default function EyeProtection() {
  return (
    <div className="w-full bg-gradient-to-b from-gray-50 via-white to-gray-50 py-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col justify-center gap-16 items-center">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight text-center leading-tight"
        >
          Feels great in low-light Mode <br />
          for your{' '}
          <span className="bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Eye Protection
          </span>
        </motion.h1>

        {/* Interactive Responsive Mobile UI Mockups */}
        <div className="flex items-center justify-center flex-wrap gap-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ScreenForgotPassword />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ScreenEnterCode />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <ScreenSignup />
          </motion.div>
        </div>
      </div>
    </div>
  )
}