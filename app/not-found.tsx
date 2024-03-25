import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function NotFound() {
    return (
        <div className='w-full px-7 h-[70vh] items-center flex justify-center'>
            <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-5 flex-col" >
                <h1 className='text-[200px] max-sm:text-7xl  font-black text-center text-primary'>404 </h1>
                <h2 className='text-3xl font-semibold max-sm:text-xl text-center'>Oops! Page not found</h2>
                <p className='text-xl max-sm:text-sm text-center'>This is not the web page that you are looking for. Click the button below to go to the main web page </p>
                <Link href={'/'} className='max-sm:w-full'>

                    <Button area-label={'Home Page'} variant={'default'} className='w-full px-10'>Home Page</Button>

                </Link>
            </div>
        </div>
    )
}
