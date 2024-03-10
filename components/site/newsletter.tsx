import React from 'react'
import { Button } from '../ui/button'

export default function Newsletter() {
    return (
        <div>
            <section className=" max-w-[1440px] mx-auto text-gray-600 body-font bg-background px-7 py-16 rounded-xl">

                <div className="flex items-center justify-between max-xl:flex-col gap-10">
                    <h1 className="text-6xl font-bold text-gray-300 max-[580px]:text-4xl max-[400px]:text-2xl max-xl:text-center">Take control of your <br />
                        personal <span className='text-primary'>finances today</span>
                    </h1>
                    <div className="flex items-center justify-center  max-md:w-full gap-5 w-1/3 max-md:flex-col">
                        <input type="text" placeholder="Enter your email" className="max-md:w-full w-96 outline-none h-14 rounded-lg px-5 bg-white" />
                        <Button className="flex-shrink-0 text-white bg-primary border-0 py-2 px-8 max-md:w-full focus:outline-none hover:bg-primary/50 h-14  rounded-lg text-lg mt-10 sm:mt-0">Send</Button>
                    </div>
                </div>

            </section>
        </div>
    )
}
