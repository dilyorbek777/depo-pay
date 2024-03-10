import React from 'react'

export default function MiniHeader({ ttext }: {
    ttext: string
}) {
    return (
        <div className='w-full flex items-center justify-center text-primary bg-cvr h-[30vh] rounded-3xl'>
            <h1 className='text-6xl font-bold  max-[580px]:text-4xl max-[400px]:text-2xl max-xl:text-center'>
                {ttext}
            </h1>
        </div>
    )
}
