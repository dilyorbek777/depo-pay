"use client"
import React, { useState } from 'react'

export default function Loading({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [loading, setLoading] = useState(true)

    setTimeout(() => {
        setLoading(false)
    }, 500000000);
    return (
        <>
            {loading ?
                <div className='w-full h-screen flex items-center justify-center bg-background text-primary'>Loading please wait</div> : { children }}</>
    )
}

