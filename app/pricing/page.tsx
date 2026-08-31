'use client'

import Debit from '@/components/site/debit'
import MiniHeader from '@/components/site/miniHeader'
import Pricing from '@/components/site/pricing'
import React from 'react'
import ScrollAnimation from '@/components/ui/scroll-animation'

export default function PricingPage() {
  return (
    <div>
      <ScrollAnimation direction="fade">
        <div className="flex items-center justify-center max-w-[1440px] mx-auto my-20 px-7">
          <MiniHeader ttext='Pricing'  />
        </div>
      </ScrollAnimation>
      <ScrollAnimation direction="up" delay={0.2}>
        <Debit />
      </ScrollAnimation>
      <ScrollAnimation direction="up" delay={0.4}>
        <Pricing />
      </ScrollAnimation>
    </div>
  )
}
