import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { Play } from 'lucide-react'
import CustomImage from './customImage'

export default function PaymentData() {
    return (
        <div className='max-w-[1440px] mx-auto  py-20  flex justify-center  gap-20 min-h-screen max-lg:flex-col items-center'>
            <div className="w-1/2 max-lg:w-full flex flex-col justify-center items-start gap-10 h-full">
                <h1 className="text-6xl font-bold text-gray-300 max-[580px]:text-4xl max-[400px]:text-2xl">Send and receive <br /> <span className='text-primary'>payments</span> easily</h1>
                <p className="text-2xl text-gray-800 max-[580px]:text-lg ">DEPOPAY e-wallet is a modern payment tool that allows you to conveniently and safely use Payme to pay for goods and services and make transfers. </p>
                <div className="flex items-center gap-9 font-bold text-primary">
                    <Button className="bg-primary text-white px-5 py-8  rounded-full flex gap-2 items-center"><Play /> </Button>
                    Watch demo</div>
            </div>
            <div className="w-1/2 max-lg:w-full flex justify-center items-center">
                <CustomImage img={'/mbimg.png'} title={'payment-data'} nameclass="w-1/2 max-md:w-2/3"  /> 

            </div>
        </div>
    )
}
