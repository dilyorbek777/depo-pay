'use client'

import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import CustomImage from './customImage'
import ScrollAnimation from '../ui/scroll-animation'
import { motion } from 'framer-motion'

const prices = [
    {
        img: '/pricing1.png',

        price: '$10.00',
        features: [
            'Modern Design',
            'Easy to Customize',
            'Quickly Set Up A Website',
            'Another Feature',
            'Unlimited products',
        ]
    },
    {
        img: '/pricing2.png',

        price: '$19.00',
        features: [

            'Modern Design & APP',
            'Easy to Customize',
            'Quickly Set Up A Website',
            'Another Feature',
            '24/7 Customer Support',
        ]
    },
    {
        img: '/pricing3.png',

        price: '$35.00',
        features: [
            'Unlimited products',
            'Unlimited orders',
            'Unlimited customers',
            'Unlimited products',
            'Unlimited orders',
        ]
    }
]

export default function Pricing() {
    return (

        <div className="w-full h-full  px-7 py-16">
            <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-6xl font-bold text-gray-300 max-[580px]:text-4xl max-[400px]:text-2xl text-center"
            >
                Our payment services <br /><span className='text-primary'>worldwide</span>
            </motion.h1>
            <div className='max-w-[1440px] mx-auto   py-20  flex justify-between  gap-20  max-lg:flex-col items-center'>
                <div className="grid grid-cols-3 w-full items-center justify-between gap-10 max-lg:grid-cols-1 max-lg:gap-5">
                    {prices.map((price, index) => (
                        <motion.div 
                            key={index} 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="w-full h-full bg-gray-200 rounded-lg p-11 flex items-center justify-center flex-col gap-7"
                        >
                            <div className="flex w-full items-center gap-5">
                                <CustomImage img={price.img} title={price.features.join(' ')} nameclass="w-full"  /> 

                            </div>
                            <div className="flex w-full items-center justify-between">
                                <p className="text-primary text-3xl font-bold ">{price.price}</p>
                                <p className='text-xl'>Month</p>
                            </div>
                            <ul className="bg-white w-full py-4 px-9 rounded-lg">
                                {price.features.map((feature, index) => (
                                    <motion.li 
                                        key={index} 
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className='text-lg text-gray-500 my-4'
                                    >
                                        {feature}
                                    </motion.li>
                                ))}
                            </ul>
                            <Button id='get-started-pricing' className='w-full' role="none">
                                Get Started
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
