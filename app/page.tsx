import Debit from '@/components/site/debit'
import Hero from '@/components/site/hero'
import Pricing from '@/components/site/pricing'
import React from 'react'
import ScrollAnimation from '@/components/ui/scroll-animation'

export default function Home() {
  return (
    <div>
      <ScrollAnimation direction="fade">
        <Hero />
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
