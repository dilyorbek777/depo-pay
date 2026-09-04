'use client'

import React from "react";
import Cards from "./cards";
import ScrollAnimation from "../ui/scroll-animation";


import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button'; // Adjust import based on your project structure
import { Sparkles, ArrowRight } from 'lucide-react';
import PhoneComponent from './phoneComponent';

export default function Hero() {
  return (
    <div className="w-full min-h-screen bg-white px-7">


      <HeroSection />
      <ScrollAnimation direction="up" delay={0.2}>
        <div className="max-w-[1440px] backdrop-blur-md shadow-sm shadow-background mt-8 h-fit mx-auto rounded-2xl bg-background py-20  flex justify-center items-end max-md:items-center max-md:h-fit max-xl:h-[130vh] max-lg:min-h-screen">
          <Cards />
        </div>
      </ScrollAnimation>
      
    </div>
  );
}




function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative max-w-[1440px] mx-auto min-h-[90vh] overflow-hidden max-md:min-h-fit flex flex-col justify-start items-center rounded-3xl pt-16 pb-32 px-6 shadow-2xl border border-white/40 bg-[#f8f5ff] isolate"
    >
      {/* 1. Base Layer Gradient Mesh (Prevents white flash) */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-[#d3c5ff] via-[#ffd6e0] to-[#fef3c7]" />

      {/* 2. Top-Left Purple Glow */}
      <div className="absolute -top-10 -left-10 -z-20 h-[500px] w-[500px] rounded-full bg-purple-400/60 blur-3xl" />

      {/* 3. Top-Right Sky Blue Glow */}
      <div className="absolute -top-20 -right-20 -z-20 h-[550px] w-[600px] rounded-full bg-sky-300/70 blur-3xl" />

      {/* 4. Bottom Peach Glow */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 -z-20 h-[450px] w-[90%] rounded-full bg-amber-200/60 blur-3xl" />

      {/* 5. Subtle Glass Overlay (Replaced washed-out white gradient) */}
      <div className="absolute inset-0 -z-10 bg-white/10 backdrop-blur-[1px]" />

      {/* Floating Geometry Shapes */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 left-16 w-8 h-8 rounded-lg border-2 border-white/70 rotate-12 backdrop-blur-sm pointer-events-none max-md:hidden"
      />
      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-28 w-6 h-6 rounded-full border-2 border-white/60 backdrop-blur-sm pointer-events-none max-md:hidden"
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 right-20 w-7 h-7 rounded-full border-2 border-white/70 backdrop-blur-sm pointer-events-none max-md:hidden"
      />
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 right-24 w-8 h-8 rounded-lg border-2 border-white/60 rotate-45 backdrop-blur-sm pointer-events-none max-md:hidden"
      />

      {/* Content Container */}
      <div className="flex flex-col justify-center items-center text-center gap-8 z-10 max-w-4xl mx-auto">
        {/* Glass Tag Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 border border-white/60 backdrop-blur-md shadow-sm text-primary text-sm font-semibold tracking-wide"
        >
          <Sparkles className="w-4 h-4 text-purple-700" />
          <span>Next-Gen Payment Experience</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold text-primary leading-[1.15] tracking-tight drop-shadow-sm"
        >
          Ready To Launch Your <br className="hidden sm:inline" />
          Online <span className="text-white drop-shadow-[0_2px_10px_rgba(125,95,255,0.5)]">Payment</span> App
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-2xl font-medium text-primary/90 max-w-2xl leading-relaxed"
        >
          A simple yet modern solution to showcase your application, streamline transactions, and scale fast.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pt-2"
        >
          <Button
            id="get-started"
            aria-label="Get Started"
            className="group relative inline-flex items-center gap-3 bg-primary hover:bg-slate-800 text-white font-semibold text-lg px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>

      {/* Floating Phone Wrapper */}
      <div
        style={{ transformOrigin: 'center' }}
        className="absolute -bottom-80 left-1/2 -translate-x-1/2 translate-y-56 z-40 drop-shadow-2xl pointer-events-auto"
      >
        <PhoneComponent />
      </div>
    </motion.div>
  );
}