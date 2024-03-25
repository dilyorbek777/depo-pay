import { BlogsType } from '@/interfaces'
import Link from 'next/link'
import React from 'react'
import CustomImage from './customImage'

export default function News({ data }: {
    data: BlogsType[]
}) {
    return (
        <div className='flex items-center justify-center flex-col py-20'>
            <h1 className='text-5xl text-primary max-lg:text-2xl font-bold'><span className='text-gray-300'>Latest</span> News</h1>
            <div className="grid grid-cols-2 items-center justify-center gap-10 py-20 max-lg:grid-cols-1">
                {data.map((l) => (
                    <Link aria-label={'Blog id'} href={'/blog/' + l.id} key={l.id}>
                        <div className="w-full flex flex-col items-center gap-5">
                            <CustomImage img={l.img} title={l.title} nameclass='w-full max-lg:h-auto h-80 object-cover ' />
                            <p className='text-[#7D5FFF] bg-[#E5DFF4] px-3 py-1 rounded-full'>{l.category}</p>
                            <p className='text-2xl text-center font-bold max-lg:text-sm'>{l.title}</p>

                        </div>
                    </Link>
                ))}
            </div>
            
        </div>
    )
}
