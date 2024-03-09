"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Menu, X } from 'lucide-react'


const links = [
    { title: "Blog", href: "/blog" },
    { title: "Licenses", href: "/licenses" },
    { title: "Changelog", href: "/changelog" }
]
export default function Navbar() {
    const [toggle, setToggle] = useState(false)
    return (
        <div className='w-full bg-white shadow-md '>
            <div className='flex items-center justify-between max-w-[1440px] mx-auto  h-16 py-10 px-7'>
                <Link href='/' className="flex ">
                    <Image src={'/Logo.svg'} alt='Logo' width={1000} className='w-40 h-10' height={0} />
                </Link>
                <Button onClick={() => setToggle(!toggle)} variant={'outline'} className='hidden max-lg:block'>
                    <Menu />
                </Button>
                <div className={toggle ? "flex fixed w-full h-screen items-center justify-center top-0 left-0 flex-col bg-primary-foreground gap-16 z-50" : "flex items-center justify-between gap-16 max-lg:hidden"}>
                    <div className={toggle ? "flex flex-col items-center justify-center gap-16 font-bold text-primary" : "flex items-center justify-center gap-16 font-bold text-primary"}>
                        {links.map((link) => (
                            <Link href={link.href} onClick={() => setToggle(!toggle)} key={link.title} className="text-gray-800">{link.title}</Link>
                        ))}
                    </div>
                    <Button variant={'default'} className='bg-primary'>Login</Button>
                    <div className={toggle ? "flex absolute top-5 justify-between  px-7 w-full left-0" : "hidden"}>
                        <Link href='/' className="flex ">
                            <Image src={'/Logo.svg'} alt='Logo' width={1000} className='w-40 h-10' height={0} />
                        </Link>
                        <Button onClick={() => setToggle(!toggle)} variant={'outline'} className={toggle ? "hidden max-lg:block " : "hidden"}>
                            <X />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
