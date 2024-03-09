import Debit from '@/components/site/debit'
import Hero from '@/components/site/hero'
import Newsletter from '@/components/site/newsletter'
import Pricing from '@/components/site/pricing'
import React from 'react'

export default function Home() {
  return (
    <div>
      <Hero />
      <Debit />
      <Pricing />
      <Newsletter />
    </div>
  )
}
