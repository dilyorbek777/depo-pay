import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import CustomImage from './customImage'

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
            <h1 className="text-6xl font-bold text-gray-300 max-[580px]:text-4xl max-[400px]:text-2xl text-center">Our payment services <br /><span className='text-primary'>worldwide</span></h1>
            <div className='max-w-[1440px] mx-auto   py-20  flex justify-between  gap-20  max-lg:flex-col items-center'>
                <div className="grid grid-cols-3 w-full items-center justify-between gap-10 max-lg:grid-cols-1 max-lg:gap-5">
                    {prices.map((price, index) => (
                        <div key={index} className="w-full h-full bg-gray-200 rounded-lg p-11 flex items-center justify-center flex-col gap-7">
                            <div className="flex w-full items-center gap-5">
                                <CustomImage img={price.img} title={price.features.join(' ')} nameclass="w-full"  /> 

                            </div>
                            <div className="flex w-full items-center justify-between">
                                <p className="text-primary text-3xl font-bold ">{price.price}</p>
                                <p className='text-xl'>Month</p>
                            </div>
                            <ul className="bg-white w-full py-4 px-9 rounded-lg">
                                {price.features.map((feature, index) => (
                                    <li key={index} className='text-lg text-gray-500 my-4'>{feature}</li>
                                ))}
                            </ul>
                            <Button area-label={'Get Started'} className='w-full'>
                                Get Started
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
