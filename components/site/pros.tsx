'use client'

import Image from 'next/image'
import React from 'react'
import Star from '../providers/star'
import CustomImage from './customImage'
import { motion } from 'framer-motion'

let crds = [
    { stat: "4.5/5", title: "On the iOS App Store", rate: 5 },
    { stat: "4.8/5", title: "On the Android Play Store.", rate: 5 }
]

export default function Pros() {
    return (
        <div className='max-w-[1440px] mx-auto   py-20  flex justify-center  gap-20  max-lg:flex-col items-center'>
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-16 px-20 py-7 bg-background rounded-xl w-1/2 justify-center max-lg:w-2/3 max-md:w-full max-md:flex-col"
            >
                <CustomImage img={'/pros1.png'} title={'pros'} nameclass="max-w-40 max-md:w11/12  object-cover rounded-md" />
                <CustomImage img={'/pros2.png'} title={'pros'} nameclass="max-w-40 max-md:w11/12  object-cover rounded-md" />

            </motion.div>
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-16 px-20 py-7 "
            >
                <div className="flex items-center justify-center gap-10 flex-wrap">
                    {crds.map((crd, index) => (
                        <motion.div 
                            key={index} 
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <h1 className="text-4xl font-bold text-primary">{crd.stat}</h1>
                            <Star rate={crd.rate} />
                            <h1 className="text-primary">{crd.title}</h1>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
