'use client'

import Image from "next/image"
import CustomImage from "./customImage"
import { motion } from "framer-motion"

const cards = [
    {
        img: '/create-acc.png',
        title: 'Create an account',
        desc: 'Aspernatur sit adipisci quaerat unde Redug Lagre dolor sit amets consectetus. Agencies define their new business'
    },
    {
        img: '/att-ba.png',
        title: 'Attach bank accounts',
        desc: 'Aspernatur sit adipisci quaerat unde Redug Lagre dolor sit amets consectetus. Agencies define their new business'
    },
    {
        img: '/Icon-2.png',
        title: 'Send money',
        desc: 'Aspernatur sit adipisci quaerat unde Redug Lagre dolor sit amets consectetus. Agencies define their new business'
    },
]

export default function Cards() {
    return (
        <div className="flex items-center justify-center w-full flex-wrap gap-10">
            {cards.map((card, index) => (
                <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="max-w-96 flex flex-col items-center justify-center gap-8 "
                >
                    <CustomImage img={card.img} title={card.title} nameclass="w-24"  /> 
                    <div className="flex flex-col items-center justify-center gap-1">
                        <h1 className="text-2xl text-center font-bold">{card.title}</h1>
                        <p className="text-center">{card.desc}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
