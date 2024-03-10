import React from 'react'
import CustomImage from './customImage'
const images = ['/phones1.png', '/phones2.png', '/phones3.png']

export default function EyeProtection() {
    return (

        <div className='max-w-[1440px] mx-auto flex-col  py-20  flex justify-center  gap-20 min-h-screen max-lg:flex-col items-center'>
            <h1 className="text-6xl font-bold text-gray-300 max-[580px]:text-4xl max-[400px]:text-2xl text-center">Feels great in low-light Mood <br /> for your <span className='text-primary'>eye Protection</span></h1>
            <div className="flex items-center flex-wrap justify-center">
                {images.map((image, i) => (
                    <CustomImage img={image} key={i} title={'phone view'} nameclass="w-80   object-cover rounded-md" />

                ))}
            </div>
        </div>
    )
}
