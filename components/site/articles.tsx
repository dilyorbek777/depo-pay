import { BlogsType } from '@/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import CustomImage from './customImage';

import React from 'react'



export default async function Articles() {
    const data: BlogsType[] = await fetch('https://depo-pay.vercel.app/api/blogs').then(res => res.json())
    console.log(data);
    const drat = []

    for (let index = 0; index < 3; index++) {
        const element = data[index];
        drat.push(element)
    }

    console.log(drat);

    return (
        <div className='w-full px-16 py-16 flex max-xl:flex-col  items-center justify-center gap-10'>
            <div className="flex w-1/2 max-xl:w-2/3 max-md:w-full">
                {data.map((l) => (
                    <Link href={'/blog/' + l.id} key={l.id}>
                        {l.id === data.length && <div className="w-full flex flex-col items-center gap-5">
                            <CustomImage img={l.img} title={l.title} nameclass='w-full ' />
                            <p className='text-[#7D5FFF] bg-[#E5DFF4] px-3 py-1 rounded-full'>{l.category}</p>
                            <p className='text-2xl text-center font-bold'>{l.title}</p>

                        </div>}
                    </Link>
                ))}
            </div>
            <div className="flex w-1/2 max-xl:w-2/3 max-md:w-full flex-col items-center justify-center gap-10">

                {drat.map((item) => (
                    <Link href={'/blog/' + item.id} key={item.id} className="w-full flex  max-sm:flex-col justify-between items-center gap-5">
                        <CustomImage nameclass="ounded-3xl w-52 h-52 object-cover" img={item.img} title={item.title} />
                        <div className="flex flex-col items-center justify-between w-full gap-5">

                            <p className='text-[#7D5FFF] bg-[#E5DFF4] px-3 py-1 rounded-full'>{item.category}</p>
                            <p className='text-2xl text-center font-bold'>{item.title.slice(0, 100)}..</p>
                        </div>

                    </Link>
                ))}
            </div>
        </div>
    )
}
