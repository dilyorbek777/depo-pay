import CustomImage from '@/components/site/customImage';
import { BlogsType } from '@/interfaces';
import React from 'react'

import { Metadata } from "next"
type Props = {
  params: {
    blogid: string
  }
}
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const res: BlogsType = await fetch('https://depo-pay.vercel.app/api/blogs/' + params.blogid, { cache: "no-store" }).then(d => d.json())

  const title = res.title
  const cte = res.category
  return {
    title: {
      absolute: `${cte}: ${title} ` // absolute applies the only absolute title of page
    },

    metadataBase: new URL(`https://depo-pay.vercel.app/blog/${params.blogid}`),
    description: `${res.description}`, // description
    authors: [
      { name: 'Dilyorbek Asfandiyorov', url: 'https://depo-pay.vercel.app' },
    ],

    icons: { icon: 'https://raw.githubusercontent.com/dilyorbek777/depo-pay/main/public/favicon.png' },
    keywords:
      `dilyorbekdev, depo,  programming, payment, depo pay, depopay, depo-pay, primepay, prime-pay, prime, pay, dilyorbek asfandiyorov, depohub, DEPOPAY, e-wallet, is, a, modern, payment, tool, ${res.description.split(" ").join(', ')} `,
    openGraph: {

      countryName: 'Uzbekistan',
      siteName: `Prime Pay | DEPOPAY `,
      emails: 'dilyorbekdev@gmail.com',
      title: `Prime Pay | DEPOPAY | ${res.title}`,
      description:
        `${res.description}`,
      type: 'website',
      url: `https://depo-pay.vercel.app/blog/${params.blogid}`,
      locale: 'en_EN',
      images: `https://raw.githubusercontent.com/dilyorbek777/depo-pay/main/public/blogs/${res.img}`,
    },
    creator: 'Dilyorbek Asfandiyorov',
    publisher: 'DEPO ',

  }
}





export default async function DetailBlog({ params }: Props) {

  let pid = params.blogid

  console.log(pid);

  const res: BlogsType = await fetch('https://depo-pay.vercel.app/api/blogs/' + pid, { cache: "no-store" }).then(d => d.json())
  console.log(res);



  return (
    <div className='w-full '>
      <div className="flex max-w-[1440px] items-center justify-center flex-col mx-auto px-7 gap-20 py-16">
        <p className='text-[#7D5FFF] bg-[#E5DFF4] px-3 py-1 rounded-full'>{res.category}</p>
        <p className='max-lg:text-2xl text-center text-4xl font-bold'>{res.title}</p>
        <CustomImage img={res.img} title={res.title} nameclass='w-full ' />
        <p className='text-2xl max-lg:text-sm font-medium w-full border-l-4 rounded-sm border-[#7D5FFF] tracking-wider wsp-5  px-7 text-start'>{res.description.split('. ').join("\n")}</p>
      </div>
    </div>
  )
}
