import Debit from '@/components/site/debit'
import MiniHeader from '@/components/site/miniHeader'
import Pricing from '@/components/site/pricing'
import React from 'react'

export default function PricingPage() {
  return (
    <div>
      <div className="flex items-center justify-center max-w-[1440px] mx-auto my-20 px-7">
        <MiniHeader ttext='Pricing'  />


      </div>
      <Debit />
      <Pricing />
    </div>
  )
}
