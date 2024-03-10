import Articles from '@/components/site/articles'
import MiniHeader from '@/components/site/miniHeader'
import React from 'react'

export const metadata = {
  title: 'Blogs DEPOPAY | prime pay',
  description: 'The new articles in Depopay',
}

export default function page() {
  return (
    <div className="w-full bg-white">
      <div className='max-w-[1440px] mx-auto px-7 py-16'>
        <MiniHeader ttext={"Blogs"} />
        <Articles />
      </div>
    </div>
  )
}
