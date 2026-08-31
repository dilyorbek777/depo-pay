'use client'

import React from 'react'
import CustomImage from './customImage'
import { motion } from 'framer-motion'
const images = ['/phones1.png', '/phones2.png', '/phones3.png']

export default function EyeProtection() {
    return (

        <div className='max-w-[1440px] mx-auto flex-col  py-20  flex justify-center  gap-20 min-h-screen max-lg:flex-col items-center'>
            <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-6xl font-bold text-gray-300 max-[580px]:text-4xl max-[400px]:text-2xl text-center"
            >
                Feels great in low-light Mood <br /> for your <span className='text-primary'>eye Protection</span>
            </motion.h1>
            <div className="flex items-center flex-wrap justify-center">
                {images.map((image, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.2 }}
                    >
                        <CustomImage img={image} title={'phone view'} nameclass="w-80   object-cover rounded-md" />
                    </motion.div>

                ))}
            </div>
        </div>
    )
}
