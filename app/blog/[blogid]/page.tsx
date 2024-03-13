import CustomImage from '@/components/site/customImage';
import { BlogsType } from '@/interfaces';
import React from 'react'
import { notFound } from 'next/navigation';

import { Metadata } from "next"
import Link from 'next/link';
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
      images: `https://raw.githubusercontent.com/dilyorbek777/depo-pay/main/public${res.img}`,
    },
    creator: 'Dilyorbek Asfandiyorov',
    publisher: 'DEPO ',

  }
}





export default async function DetailBlog({ params }: Props) {

  let pid = params.blogid

  console.log(pid);

  const data: BlogsType[] = await fetch('https://depo-pay.vercel.app/api/blogs', { cache: "no-store" }).then(res => res.json())
  console.log(data);



  
  const ress = await fetch('https://depo-pay.vercel.app/api/blogs/' + pid, { cache: "no-store" }).then(d => d.json())
  console.log(ress.status);



  const res: BlogsType = ress
  console.log(res);
  const drat = []
  const drow = data.slice(3, data.length)
  console.log(drow);
  for (let index = 0; index < 3; index++) {
    const element = data[index];
    drat.push(element)
  }


  return (
    <div className='w-full '>
      <div className="flex max-w-[1440px] items-center justify-center flex-col mx-auto px-7 gap-20 py-16">
        <p className='text-[#7D5FFF] bg-[#E5DFF4] px-3 py-1 rounded-full'>{res.category}</p>
        <p className='max-lg:text-2xl text-center text-4xl font-bold'>{res.title}</p>
        <CustomImage img={res.img} title={res.title} nameclass='w-full ' />
        <p className='text-2xl max-lg:text-sm font-medium w-full border-l-4 rounded-sm border-[#7D5FFF] tracking-wider wsp-5  px-7 text-start'>{res.description.split('. ').join("\n")}</p>
      </div>
      <h1 className='text-2xl font-bold text-center my-7 px-7 lg:text-5xl'>Related News</h1>
      <div className=" px-7 w-1/2 mx-auto grid grid-cols-2 py-7 max-xl:w-2/3 max-md:w-full max-lg:grid-cols-1 items-center justify-center gap-20">

        <>
          {drat.map((item) => (
            <>
              {item.category === res.category && item.id !== res.id && <Link href={'/blog/' + item.id} key={item.id} className="w-full flex flex-col justify-between items-center gap-5">
                <CustomImage nameclass="ounded-3xl w-full h-52 max-sm:h-auto max-lg:h-80 max-lg:w-full object-cover" img={item.img} title={item.title} />
                <div className="flex flex-col items-center justify-between w-full gap-5">

                  <p className='text-[#7D5FFF] bg-[#E5DFF4] px-3 py-1 rounded-full'>{item.category}</p>
                  <p className='text-2xl text-center font-bold max-lg:text-sm'>{item.title.slice(0, 100)}..</p>
                </div>

              </Link>}
            </>
          ))}
        </>

      </div>
    </div>
  )
}
