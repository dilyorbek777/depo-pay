import { Loader2 } from 'lucide-react'
import React from 'react'

export default function Loading() {
    return (
        <div className='w-full h-screen flex items-center justify-center bg-background text-primary'>
            <Loader2 className='animate-spin ' size={40} />
        </div>
    )
}
