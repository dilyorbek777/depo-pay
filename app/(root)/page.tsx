import Debit from '@/components/site/debit'
import Hero from '@/components/site/hero'
import Pricing from '@/components/site/pricing'
import React from 'react'
import ScrollAnimation from '@/components/ui/scroll-animation'
import WhyUs from '@/components/site/whyus'

import PaymentData from "@/components/site/payment-data";
import Whypp from "@/components/site/whypp";
import Pros from "@/components/site/pros";
import EyeProtection from "@/components/site/eyeProtection";

export default function Home() {
  return (
    <div>
      <ScrollAnimation direction="fade">
        <Hero />
      </ScrollAnimation>
      <ScrollAnimation direction="up" delay={0.3}>
        <PaymentData />
      </ScrollAnimation>
      <ScrollAnimation direction="up" delay={0.4}>
        <Whypp />
      </ScrollAnimation>
      <ScrollAnimation direction="up" delay={0.2}>
        <WhyUs />
      </ScrollAnimation>

      <ScrollAnimation direction="up" delay={0.6}>
        <EyeProtection />
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
