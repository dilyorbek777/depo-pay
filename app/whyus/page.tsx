import PaymentData from '@/components/site/payment-data'
import Pros from '@/components/site/pros'
import Whypp from '@/components/site/whypp'
import React from 'react'

export default function Whyus() {
  return (
    <div className='w-full px-7'>
      <PaymentData />
      <Whypp />
      <Pros/>
    </div>
  )
}
