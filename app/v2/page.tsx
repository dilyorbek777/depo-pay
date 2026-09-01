import Debit from '@/components/site/debit'
import Hero from '@/components/site/hero'
import Pricing from '@/components/site/pricing'
import React from 'react'
import ScrollAnimation from '@/components/ui/scroll-animation'

import { Button } from '@/components/ui/button'
import CustomImage from '@/components/site/customImage'
import Cards from '@/components/site/cards'
import PaymentData from '@/components/site/payment-data'
import Whypp from '@/components/site/whypp'
import Pros from '@/components/site/pros'
import EyeProtection from '@/components/site/eyeProtection'
import { motion } from 'framer-motion'
import PhoneComponent from '@/components/site/phoneComponent'

export default function HomeV2() {
    return (
        <div>

            {/* <div className="w-full min-h-screen bg-white px-7">
                <div

                    className="max-w-[1440px] mx-auto bg-cvr bg-blue-300 rounded-2xl py-20 min-h-[80vh] flex justify-center items-start relative"
                >
                    <div className="flex flex-col justify-center items-center py-5 gap-9">
                        <h1

                            className="text-6xl font-bold text-primary text-center max-sm:text-4xl "
                        >
                            Ready To Launch Your <br /> Online{" "}
                            <span className="text-white">Payment </span>App
                        </h1>
                        <p
                            className="text-2xl text-primary text-center max-sm:text-lg"
                        >
                            A simple yet modern solution to showcase your app
                        </p>
                        <div>
                            <Button id="get-started"
                                area-label={"Get Started"}
                                role="none"
                                className="bg-primary text-white px-5 py-3 rounded-md"
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                   
                    <CustomImage
                        nameclass="absolute top-0 left-1/2 transform -translate-x-[48%] translate-y-[40%] z-30 max-w-[500px] max-lg:max-w-[350px] max-lg:translate-y-[70%] max-[400px]:translate-y-[85%] max-[400px]:w-[300px]"
                        img="/hero.png"
                        title="Ready To Launch Your "
                    />
                </div>
                <ScrollAnimation direction="up" delay={0.2}>
                    <div className="max-w-[1440px] mx-auto rounded-2xl bg-background py-20 h-screen flex justify-center items-end mt-12 max-xl:h-[130vh] max-lg:min-h-screen">
                        <div className="flex flex-col justify-center items-center py-5 gap-9 px-2">
                            <Cards />
                        </div>
                    </div>
                </ScrollAnimation>
                <ScrollAnimation direction="up" delay={0.3}>
                    <PaymentData />
                </ScrollAnimation>
                <ScrollAnimation direction="up" delay={0.4}>
                    <Whypp />
                </ScrollAnimation>
                <ScrollAnimation direction="up" delay={0.5}>
                    <Pros />
                </ScrollAnimation>
                <ScrollAnimation direction="up" delay={0.6}>
                    <EyeProtection />
                </ScrollAnimation>
            </div> */}
<div className="w-full min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Container */}
      <div className="max-w-[1440px] mx-auto bg-cvr rounded-3xl py-16 md:py-24 px-6 min-h-[85vh] flex flex-col justify-between items-center relative overflow-hidden shadow-xl">
        
        {/* Decorative Background Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content */}
        <div 
          className="flex flex-col justify-center items-center text-center max-w-3xl gap-6 z-10"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Ready To Launch Your <br className="hidden sm:block" />
            <span className="text-white bg-clip-text">Online Payment</span> App
          </h1>

          <p className="text-lg sm:text-xl text-blue-50 font-normal max-w-xl">
            A simple, modern, and high-converting solution designed to showcase your payment platform seamlessly.
          </p>

          <div className="pt-2">
            <button
              id="get-started"
              aria-label="Get Started"
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 focus:ring-4 focus:ring-blue-300 active:translate-y-0"
            >
              Get Started Free
            </button>
          </div>
        </div>

        {/* Hero Image Section */}
        
         <PhoneComponent />
      </div>

      {/* Feature Sections */}
      <div className="max-w-[1440px] mx-auto space-y-20 mt-16">
        <ScrollAnimation direction="up" delay={0.2}>
          <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-sm border border-slate-100 flex justify-center items-center">
            <Cards />
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.3}>
          <PaymentData />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.4}>
          <Whypp />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.5}>
          <Pros />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.6}>
          <EyeProtection />
        </ScrollAnimation>
      </div>
    </div>

            <ScrollAnimation direction="up" delay={0.2}>
                <Debit />
            </ScrollAnimation>
            <ScrollAnimation direction="up" delay={0.4}>
                <Pricing />
            </ScrollAnimation>
        </div>
    )
}
