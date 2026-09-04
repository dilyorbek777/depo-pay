'use client'

import { SignUp } from "@clerk/nextjs";
import { Check } from 'lucide-react'
import CustomImage from '@/components/site/customImage'
import ScrollAnimation from '@/components/ui/scroll-animation'
import { motion } from 'framer-motion'

const signUpFeatures = [
    'Secure Account Creation',
    'Instant Dashboard Access',
    'Add Multiple Cards',
    'Track All Transactions',
    '24/7 Customer Support',
]

export default function SignUpPage() {
  return (
    <div className="w-full h-full bg-[#303030] px-7 min-h-screen">
      <div className='max-w-[1440px] mx-auto py-20 flex justify-between gap-20 max-lg:flex-col items-center min-h-screen'>
        <ScrollAnimation direction="left" className="w-1/2 max-lg:w-2/3 max-md:w-full">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-6xl font-bold text-gray-400 max-[580px]:text-4xl max-[400px]:text-2xl "
          >
            Create Your <br /> <span className='text-white'>PrimePay Account</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-primary text-xl text-white mt-5 max-w-[512px]'
          >
            Join thousands of users managing their finances securely. Get instant access to your dashboard and start managing your cards today.
          </motion.p>
          <div className="grid grid-cols-2 gap-5 mt-10 max-sm:grid-cols-1">
            {signUpFeatures.map((feature, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-5"
              >
                <div className="w-10 h-10 bg-[#FFB545] rounded-full flex items-center justify-center">
                  <Check />
                </div>
                <p className="text-white">{feature}</p>
              </motion.div>
            ))}
          </div>
        </ScrollAnimation>
        <ScrollAnimation direction="right" className="w-1/2 max-lg:w-2/3 max-md:w-full">
          <div className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-center mb-6 text-primary">Get Started</h2>
            <SignUp />
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
}
