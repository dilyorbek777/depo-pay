'use client'

import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { Play } from 'lucide-react'
import CustomImage from './customImage'
import { motion } from 'framer-motion'
import WalletCardComponent from './miniPhone'

export default function PaymentData() {
    return (
        <div className='max-w-[1440px] mx-auto  py-20  flex justify-center  gap-20 min-h-screen max-lg:flex-col items-center'>
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-1/2 max-lg:w-full flex flex-col justify-center items-start gap-10 h-full"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-6xl font-bold text-gray-300 max-[580px]:text-4xl max-[400px]:text-2xl"
                >
                    Send and receive <br /> <span className='text-primary'>payments</span> easily
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-2xl text-gray-800 max-[580px]:text-lg "
                >
                    DEPOPAY e-wallet is a modern payment tool that allows you to conveniently and safely use Payme to pay for goods and services and make transfers.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center gap-9 font-bold text-primary"
                >
                    <Button id='watch-demo' role="none" className="bg-primary text-white px-5 py-8  rounded-full flex gap-2 items-center"><Play /> </Button>
                    Watch demo
                </motion.div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-1/2 max-lg:w-full flex justify-center items-center"
            >
                <WalletCardComponent />
            </motion.div>
        </div>
    )
}
