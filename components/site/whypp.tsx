import React from 'react'
import Image from 'next/image'

const cards = [
    { title: 'Integration other', description: 'Want something now but the sale ends before payday? Choose Pay in 4 at checkout with millions of online stores and split the cost into 4 interest-free payments.' },
    { img: '/adsp.png' },
    { img: '/Image.png', title: 'Safe & Security', description: 'Easily integrate with all your need favorite tools through and APIsing including automatic interest-free payments.' },
    { img: '/Image-1.png', title: 'Integration other', description: 'Access a new way to pay. Sign up for an account and spend crypto at millions of online stores with PayPal. Want something now but the sale ends before payday? ' },
    { img: '/Image-2.png', title: 'Integration other', description: 'Checking out with crypto is a taxable transaction. Fees and exchange rates will apply. Buying and selling cryptocurrency is subject to a number of risks and PayPal does not make any recommendations' },
    { img: '/Image-3.png', title: 'Integration other', description: 'Want something now but the sale Leave the cash and cards at home. When it comes to paying with the app, the only thing you’ll need to reach for is your phone.' },
]

export default function Whypp() {
    return (
        <div className='max-w-[1440px] mx-auto flex-col  py-20  flex justify-center  gap-20 min-h-screen max-lg:flex-col items-center'>
            <h1 className="text-6xl font-bold text-gray-300 max-[580px]:text-4xl max-[400px]:text-2xl text-center">Why it is <br />
                Worth
                Choosing  <span className='text-primary'>PrimePay.</span></h1>

            <div className="grid grid-cols-3 gap-10 max-lg:grid-cols-2 max-md:grid-cols-1">
                {cards.map((card, index) => (
                    <div key={index} className="flex flex-col items-center gap-5  justify-center  min-h-[300px]">
                        {card.img && <Image src={card.img} alt="card" width={500} height={100} className={card.title == undefined ? "w-80 h-auto max-md:w-8/12 max-[500px]:w-11/12" : "max-[500px]:w-11/12 max-md:w-80 max-md:h-36 w-60 h-28 object-cover rounded-md"} />}
                        <h1 className="text-2xl font-bold text-gray-300">{card.title}</h1>
                        <p className="text-gray-500">{card.description}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}
