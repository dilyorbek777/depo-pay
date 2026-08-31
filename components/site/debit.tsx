'use client'

import { Check } from 'lucide-react'
import React from 'react'
import CustomImage from './customImage'
import ScrollAnimation from '../ui/scroll-animation'
import { motion } from 'framer-motion'

const debitObj = {
    
    image: '/cards.png',
    options: ['All your transaction', 'Receipts transaction', 'Experience Smart App', 'Control your Budget', 'Find your expenses'],
}

export default function Debit() {
    return (

        <div className="w-full h-full bg-[#303030] px-7">
            <div className='max-w-[1440px] mx-auto   py-20  flex justify-between  gap-20  max-lg:flex-col items-center'>
                <ScrollAnimation direction="left" className="w-1/2 max-lg:w-2/3 max-md:w-full">
                    <motion.h1 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-6xl font-bold text-gray-400 max-[580px]:text-4xl max-[400px]:text-2xl "
                    >
                        Credit is the Fastest <br /> Mobile  <span className='text-white'>Banking Solution</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className='text-primary text-xl text-white mt-5 max-w-[512px]'
                    >
                        Feels great in low-light Mood for your eye Protection. Your newest online account to do instant cash transactions easily and securely!
                    </motion.p>
                    <div className="grid grid-cols-2 gap-5 mt-10 max-sm:grid-cols-1">
                        {debitObj.options.map((option, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="flex items-center gap-5"
                            >
                                <div className="w-10 h-10 bg-[#FFB545] rounded-full flex items-center justify-center">
                                    <Check  />
                                </div>
                                <p className="text-white">{option}</p>
                            </motion.div>
                        ))}
                    </div>
                </ScrollAnimation>
                <ScrollAnimation direction="right" className="w-1/2 max-lg:w-2/3 max-md:w-full">
                    <CustomImage img={debitObj.image} title={debitObj.options[0]} nameclass="rounded-3xl w-full"  /> 
                </ScrollAnimation>
            </div>
        </div>
    )
}
