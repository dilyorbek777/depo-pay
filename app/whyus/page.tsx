'use client'

import PaymentData from '@/components/site/payment-data'
import Pros from '@/components/site/pros'
import Whypp from '@/components/site/whypp'
import React from 'react'
import ScrollAnimation from '@/components/ui/scroll-animation'

export default function Whyus() {
  return (
    <div className='w-full px-7'>
      <ScrollAnimation direction="up" delay={0.2}>
        <PaymentData />
      </ScrollAnimation>
      <ScrollAnimation direction="up" delay={0.4}>
        <Whypp />
      </ScrollAnimation>
      <ScrollAnimation direction="up" delay={0.6}>
        <Pros/>
      </ScrollAnimation>
    </div>
  )
}
