import { Check } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const debitObj = {
    
    image: '/cards.png',
    options: ['All your transaction', 'Receipts transaction', 'Experience Smart App', 'Control your Budget', 'Find your expenses'],
}

export default function Debit() {
    return (

        <div className="w-full h-full bg-[#303030] px-7">
            <div className='max-w-[1440px] mx-auto   py-20  flex justify-between  gap-20  max-lg:flex-col items-center'>
                <div className="w-1/2 max-lg:w-2/3 max-md:w-full">
                    <h1 className="text-6xl font-bold text-gray-400 max-[580px]:text-4xl max-[400px]:text-2xl ">Credit is the Fastest <br /> Mobile  <span className='text-white'>Banking Solution</span></h1>
                    <p className='text-primary text-xl text-white mt-5 max-w-[512px]'>Feels great in low-light Mood for your eye Protection. Your newest online account to do instant cash transactions easily and securely!</p>
                    <div className="grid grid-cols-2 gap-5 mt-10 max-sm:grid-cols-1">
                        {debitObj.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-5">
                                <div className="w-10 h-10 bg-[#FFB545] rounded-full flex items-center justify-center">
                                    <Check  />
                                </div>
                                <p className="text-white">{option}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-1/2 max-lg:w-2/3 max-md:w-full">
                    <Image src={debitObj.image} width={1000}  height={500} alt="cards" className="rounded-3xl w-full" />
                </div>
            </div>
        </div>
    )
}
