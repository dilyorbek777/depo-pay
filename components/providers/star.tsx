import { StarIcon } from 'lucide-react'
import React from 'react'

export default function Star({ rate }: { rate: number }) {
    return (
        <div className='flex gap-5 items-center justify-center'>
            {Array.from({ length: rate }).map((_, i) => (
                <StarIcon key={i} size={20} className='bg-yellow-400 rounded-md' />
            ))}
        </div>
    )
}
