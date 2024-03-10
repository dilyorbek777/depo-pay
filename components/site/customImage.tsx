"use client"

import Image from 'next/image'
import React, { useState } from 'react'

export default function CustomImage({
    img,
    title,
    nameclass, }: {
        img: string,
        title: string,
        nameclass: string,
    }) {

    const [isLoading, setIsLoading] = useState(true)
    return (
        <Image src={img} alt={title} className={nameclass + ` object-contain rounded-2xl duration-700 ease-in-out group-hover:opacity-75 ${isLoading
            ? 'scale-110 blur-2xl grayscale'
            : 'scale-100 blur-0 grayscale-0'
            }}`}
            onLoad={() => setIsLoading(false)} width={1000} height={100} />

    )
}
