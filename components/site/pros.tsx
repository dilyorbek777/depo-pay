import Image from 'next/image'
import React from 'react'
import Star from '../providers/star'

let crds = [
    { stat: "4.5/5", title: "On the iOS App Store", rate: 5 },
    { stat: "4.8/5", title: "On the Android Play Store.", rate: 5 }
]

export default function Pros() {
    return (
        <div className='max-w-[1440px] mx-auto   py-20  flex justify-center  gap-20  max-lg:flex-col items-center'>
            <div className="flex items-center gap-16 px-20 py-7 bg-background rounded-xl w-1/2 justify-center max-lg:w-2/3 max-md:w-full max-md:flex-col">
                <Image src={'/pros1.png'} alt="pros" width={1000} height={100} className="max-w-40 max-md:w11/12  object-cover rounded-md" />
                <Image src={'/pros2.png'} alt="pros" width={1000} height={100} className="max-w-40 max-md:w11/12  object-cover rounded-md" />
            </div>
            <div className="flex items-center gap-16 px-20 py-7 ">
                <div className="flex items-center justify-center gap-10 flex-wrap">
                    {crds.map((crd, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                            <h1 className="text-4xl font-bold text-primary">{crd.stat}</h1>
                            <Star rate={crd.rate} />
                            <h1 className="text-primary">{crd.title}</h1>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
