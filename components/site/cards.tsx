'use client';

import React from 'react';
import CustomImage from './customImage';
import { motion } from 'framer-motion';

const cards = [
  {
    step: '01',
    img: '/create-acc.png',
    title: 'Create an account',
    desc: 'Aspernatur sit adipisci quaerat unde Redug Lagre dolor sit amets consectetus. Agencies define their new business.',
  },
  {
    step: '02',
    img: '/att-ba.png',
    title: 'Attach bank accounts',
    desc: 'Aspernatur sit adipisci quaerat unde Redug Lagre dolor sit amets consectetus. Agencies define their new business.',
  },
  {
    step: '03',
    img: '/Icon-2.png',
    title: 'Send money',
    desc: 'Aspernatur sit adipisci quaerat unde Redug Lagre dolor sit amets consectetus. Agencies define their new business.',
  },
];

export default function Cards() {
  return (
    <section className="w-full px-6 max-md:px-2 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch justify-center">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
            className="group relative flex flex-col items-center justify-between p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
          >
            {/* Ambient Background Accent Blur on Hover */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
            
            {/* Top Bar: Step Indicator */}
            <div className="w-full flex justify-end mb-2">
              <span className="text-xs font-extrabold tracking-widest text-[#7D5FFF] bg-[#7D5FFF]/10 px-3 py-1 rounded-full border border-[#7D5FFF]/20">
                STEP {card.step}
              </span>
            </div>

            {/* Icon Container with Glass Glow */}
            <div className="relative my-4 flex items-center justify-center w-28 h-28 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-100 shadow-md group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
              <CustomImage 
                img={card.img} 
                title={card.title} 
                {...({ nameclass: 'w-16 h-16 object-contain drop-shadow-sm' } as any)} 
              />
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-center text-center gap-3 mt-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-[#7D5FFF] transition-colors duration-200">
                {card.title}
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
                {card.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}