'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    Fingerprint,
    Smartphone,
    Coins,
    CreditCard,
    MessageSquare,
    Slack,
    Mail,
    ShoppingBag,
    Folder,
    Zap,
} from 'lucide-react'

// Pure Tailwind UI visuals replacing the static image assets
function IntegrationBanner() {
    return (
        <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden border border-gray-200/80 shadow-inner">
            <div className="relative w-48 h-36">
                {/* Center Main Bubble */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center z-10 border border-gray-100">
                    <ShoppingBag className="w-7 h-7 text-emerald-600" />
                </div>
                {/* Surrounding App Bubbles */}
                <div className="absolute top-1 left-4 w-9 h-9 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
                    <MessageSquare className="w-4 h-4 text-sky-500" />
                </div>
                <div className="absolute top-0 right-6 w-11 h-11 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
                    <Slack className="w-5 h-5 text-purple-600" />
                </div>
                <div className="absolute top-12 left-0 w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
                    <Zap className="w-5 h-5 text-orange-500" />
                </div>
                <div className="absolute top-14 right-1 w-9 h-9 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
                    <Mail className="w-4 h-4 text-red-500" />
                </div>
                <div className="absolute bottom-2 left-6 w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
                    <Folder className="w-5 h-5 text-blue-500" />
                </div>
            </div>
        </div>
    )
}

function SecurityBanner() {
    return (
        <div className="w-full h-32 bg-gradient-to-r from-sky-400 to-sky-500 rounded-2xl p-5 flex items-center justify-between relative overflow-hidden shadow-md">
            {/* Background Fingerprint Watermark */}
            <Fingerprint className="absolute -right-6 -bottom-6 w-40 h-40 text-white/20 pointer-events-none stroke-[1.5]" />
            <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center z-10 shadow-sm">
                <Fingerprint className="w-7 h-7 text-white stroke-[2]" />
            </div>
        </div>
    )
}

function MobileBanner() {
    return (
        <div className="w-full h-32 bg-gradient-to-r from-amber-300 to-amber-400 rounded-2xl p-5 flex items-center justify-between relative overflow-hidden shadow-md">
            {/* Background Device Graphic */}
            <Smartphone className="absolute -right-8 -bottom-8 w-44 h-44 text-amber-600/20 rotate-12 pointer-events-none stroke-[1.5]" />
            <div className="w-12 h-12 rounded-xl bg-white/30 border border-white/40 backdrop-blur-md flex items-center justify-center z-10 shadow-sm">
                <Smartphone className="w-7 h-7 text-indigo-700 stroke-[2]" />
            </div>
        </div>
    )
}

function FastTransferBanner() {
    return (
        <div className="w-full h-32 bg-gradient-to-r from-pink-400 to-pink-500 rounded-2xl p-5 flex items-center justify-between relative overflow-hidden shadow-md">
            {/* Background Coin Graphic */}
            <Coins className="absolute -right-6 -bottom-6 w-40 h-40 text-white/20 pointer-events-none stroke-[1.5]" />
            <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center z-10 shadow-sm">
                <Coins className="w-7 h-7 text-white stroke-[2]" />
            </div>
        </div>
    )
}

function CryptoBanner() {
    return (
        <div className="w-full h-32 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-5 flex items-center justify-between relative overflow-hidden shadow-md">
            <CreditCard className="absolute -right-6 -bottom-6 w-40 h-40 text-white/15 pointer-events-none stroke-[1.5]" />
            <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center z-10 shadow-sm">
                <CreditCard className="w-7 h-7 text-white stroke-[2]" />
            </div>
        </div>
    )
}

const cards = [
    {
        title: 'Pay in 4 Installments',
        description:
            'Want something now but payday is far off? Choose Pay in 4 at checkout with millions of online stores and split the cost into 4 interest-free payments.',
        banner: <FastTransferBanner />,
    },
    {
        banner: <IntegrationBanner />,
        title: 'Integration with platforms',

        description:

            'Easily integrate with all your favorite tools through robust APIs with automatic end-to-end security protection.',

    },
    {
        banner: <SecurityBanner />,
        title: 'Safe & Security',
        description:
            'Easily integrate with all your favorite tools through robust APIs with automatic end-to-end security protection.',
    },
    {
        banner: <CryptoBanner />,
        title: 'Pay with Crypto',
        description:
            'Access a brand-new way to pay. Sign up for an account and spend crypto seamlessly at millions of online stores worldwide.',
    },
    {
        banner: <MobileBanner />,
        title: 'Mobile Commerce',
        description:
            'Leave the cash and cards at home. When it comes to paying in-store or online, the only thing you will need to reach for is your phone.',
    },
    {
        title: 'Transparent Pricing',
        description:
            'Checking out with crypto or foreign currencies is seamless. Clear conversion rates apply with no hidden fee surprises.',
        banner: <FastTransferBanner />,
    },
]

export default function Whypp() {
    return (
        <div className="w-full bg-gradient-to-b from-gray-50 via-white to-gray-50 py-20">
            <div className="max-w-[1440px] mx-auto px-7 flex flex-col justify-center gap-16 min-h-screen items-center">
                {/* Title Header */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight text-center leading-tight"
                >
                    Why it is <br />
                    Worth Choosing{' '}
                    <span className="bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                        PrimePay.
                    </span>
                </motion.h1>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1 w-full">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            className="bg-white/80 border border-gray-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl backdrop-blur-md flex flex-col gap-5 justify-between transition-all duration-300 group"
                        >
                            {/* Banner Graphic */}
                            {card.banner && <div className="w-full">{card.banner}</div>}

                            {/* Title & Description */}
                            {(card.title || card.description) && (
                                <div className="flex flex-col gap-2 flex-grow justify-center">
                                    {card.title && (
                                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                            {card.title}
                                        </h2>
                                    )}
                                    {card.description && (
                                        <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                            {card.description}
                                        </p>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}