'use client'

import React, { useState } from 'react'
import { Check, Copy, Trash2 } from 'lucide-react'
import ScrollAnimation from '../ui/scroll-animation'
import { motion } from 'framer-motion'

// Sample card data matching your interactive card component structure
const sampleCards = [
    {
        _id: 'card-1',
        color: '#1e1e1e', // Dark sleek background for back card
        balance: 6240.00,
        number16digit: '4532891043219087',
        holderName: 'ALIEN PIXELS',
        expiresAt: Math.floor(Date.now() / 1000) + 94608000,
        brand: 'PrimPay',
        chipColor: 'bg-amber-400/80',
    },
    {
        _id: 'card-2',
        color: 'linear-gradient(135deg, #d946ef 0%, #ec4899 50%, #f43f5e 100%)', // Vibrant pink gradient for front card
        balance: 5345.90,
        number16digit: '4532891043215542',
        holderName: 'ALIEN PIXELS',
        expiresAt: Math.floor(Date.now() / 1000) + 126144000,
        brand: 'PrimPay',
        chipColor: 'bg-white/30',
    },
]

const debitObj = {
    options: [
        'All your transaction',
        'Receipts transaction',
        'Experience Smart App',
        'Control your Budget',
        'Find your expenses',
    ],
}

export default function Debit() {
    const [flippedCard, setFlippedCard] = useState<string | null>(null)
    const [copiedCard, setCopiedCard] = useState<string | null>(null)

    const handleCopyCardNumber = (number: string, id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        navigator.clipboard.writeText(number)
        setCopiedCard(id)
        setTimeout(() => setCopiedCard(null), 2000)
    }

    const handleDeleteCard = (id: string) => {
        // Action handler
    }

    return (
        <div className="w-full h-full overflow-x-hidden bg-[#181818] px-7 py-20">
            <div className="max-w-[1440px] mx-auto flex justify-between gap-20 max-lg:flex-col items-center">
                {/* Left Section: Content & Options */}
                <ScrollAnimation direction="left" className="w-1/2 max-lg:w-2/3 max-md:w-full">
                    <motion.h1
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-6xl font-bold text-gray-400 max-[580px]:text-4xl max-[400px]:text-2xl"
                    >
                        Credit is the Fastest <br /> Mobile{' '}
                        <span className="text-white">Banking Solution</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-300 mt-5 max-w-[512px]"
                    >
                        Feels great in low-light Mood for your eye Protection. Your newest online account to
                        do instant cash transactions easily and securely!
                    </motion.p>

                    <div className="grid grid-cols-2 gap-5 mt-10 max-sm:grid-cols-1">
                        {debitObj.options.map((option, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="flex items-center gap-4"
                            >
                                <div className="w-9 h-9 bg-[#FFB545] rounded-full flex items-center justify-center shrink-0">
                                    <Check className="w-5 h-5 text-black stroke-[3]" />
                                </div>
                                <p className="text-white font-medium">{option}</p>
                            </motion.div>
                        ))}
                    </div>
                </ScrollAnimation>

                {/* Right Section: Code-Rendered Card Stack */}


                <ScrollAnimation
                    direction="right"
                    className="w-full lg:w-1/2 flex items-center justify-center py-6 sm:py-12"
                >
                    {/* Fluid Container with Max Constraints */}
                    <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[460px] aspect-[1.3/1] flex items-center justify-center group/container my-4">
                        {sampleCards.map((card, index) => {
                            const isFront = index === 1;

                            return (
                                <div
                                    key={card._id}
                                    onClick={() => setFlippedCard(flippedCard === card._id ? null : card._id)}
                                    className={`absolute w-full aspect-[1.58/1] cursor-pointer transition-all duration-500 ease-out ${isFront
                                            ? 'top-8 sm:top-10 left-4 sm:left-8 z-20 rotate-3 sm:rotate-4 group-hover/container:translate-x-3 sm:group-hover/container:translate-x-6 group-hover/container:translate-y-3 sm:group-hover/container:translate-y-6 group-hover/container:rotate-6 hover:!scale-105'
                                            : '-top-4 sm:-top-6 -left-2 sm:-left-6 z-10 -rotate-4 sm:-rotate-6 opacity-95 group-hover/container:-translate-x-3 sm:group-hover/container:-translate-x-6 group-hover/container:-translate-y-3 sm:group-hover/container:-translate-y-6 group-hover/container:-rotate-12 hover:!scale-105'
                                        }`}
                                    style={{ perspective: '1000px' }}
                                >
                                    <div
                                        className="relative w-full h-full transition-transform duration-700 ease-in-out shadow-2xl rounded-2xl sm:rounded-3xl"
                                        style={{
                                            transformStyle: 'preserve-3d',
                                            transform: flippedCard === card._id ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        }}
                                    >
                                        {/* Front of Card */}
                                        <div
                                            className="absolute inset-0 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-2xl flex flex-col justify-between overflow-hidden border border-white/20"
                                            style={{
                                                background: card.color,
                                                backfaceVisibility: 'hidden',
                                            }}
                                        >
                                            {/* Gloss Gradient */}
                                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                                            <div className="absolute -top-12 -right-12 sm:-top-16 sm:-right-16 w-32 sm:w-48 h-32 sm:h-48 bg-white/20 rounded-full blur-xl sm:blur-2xl pointer-events-none" />

                                            {/* Header: Logo & Chip */}
                                            <div className="flex justify-between items-center z-10">
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg border border-white/60 flex items-center justify-center font-bold text-sm sm:text-lg bg-white/10 backdrop-blur-md">
                                                        $
                                                    </div>
                                                    <span className="font-bold text-base sm:text-xl tracking-tight">{card.brand}</span>
                                                </div>

                                                <div className={`w-8 h-6 sm:w-10 sm:h-8 rounded-md sm:rounded-lg ${card.chipColor} border border-white/40 grid grid-cols-2 gap-0.5 p-0.5 sm:p-1 backdrop-blur-sm shadow-inner`}>
                                                    <div className="bg-white/40 rounded-[1px]" />
                                                    <div className="bg-white/40 rounded-[1px]" />
                                                    <div className="bg-white/40 rounded-[1px]" />
                                                    <div className="bg-white/40 rounded-[1px]" />
                                                </div>
                                            </div>

                                            {/* Balance */}
                                            <div className="z-10 my-auto">
                                                <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm">
                                                    ${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex justify-between items-end z-10">
                                                <div>
                                                    <p className="text-[8px] sm:text-[10px] uppercase font-bold text-white/70 tracking-widest">
                                                        Card Holder
                                                    </p>
                                                    <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                                                        {card.holderName}
                                                    </p>
                                                </div>

                                                <span className="text-base sm:text-xl font-extrabold italic tracking-tighter opacity-90">
                                                    VISA
                                                </span>
                                            </div>
                                        </div>

                                        {/* Back of Card */}
                                        <div
                                            className="absolute inset-0 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-2xl flex flex-col justify-between overflow-hidden border border-white/20"
                                            style={{
                                                background: card.color,
                                                backfaceVisibility: 'hidden',
                                                transform: 'rotateY(180deg)',
                                            }}
                                        >
                                            <div className="w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] -mx-4 sm:-mx-6 h-8 sm:h-11 bg-black/90 mt-1" />

                                            <div className="bg-white/15 backdrop-blur-md p-2 sm:p-3 rounded-lg sm:rounded-xl border border-white/20 flex justify-between items-center my-auto">
                                                <div>
                                                    <p className="text-[8px] sm:text-[10px] uppercase font-semibold text-white/80">Expires</p>
                                                    <p className="text-xs sm:text-sm font-bold font-mono">
                                                        {new Date(card.expiresAt * 1000).toLocaleDateString('en-US', {
                                                            month: '2-digit',
                                                            year: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <button
                                                        onClick={(e) => handleCopyCardNumber(card.number16digit, card._id, e)}
                                                        className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all"
                                                        title="Copy card number"
                                                    >
                                                        {copiedCard === card._id ? (
                                                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-300" />
                                                        ) : (
                                                            <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                        )}
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] sm:text-[10px] uppercase font-semibold text-white/80">CVC</p>
                                                    <p className="text-xs sm:text-sm font-bold font-mono tracking-widest">***</p>
                                                </div>
                                            </div>

                                            <p className="text-[9px] sm:text-[11px] text-center text-white/70 font-medium">
                                                Tap card again to flip back
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollAnimation>
            </div>
        </div>
    )
}