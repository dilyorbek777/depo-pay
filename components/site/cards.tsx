import Image from "next/image"

const cards = [
    {
        img: '/create-acc.png',
        title: 'Create an account',
        desc: 'Aspernatur sit adipisci quaerat unde Redug Lagre dolor sit amets consectetus. Agencies define their new business'
    },
    {
        img: '/att-ba.png',
        title: 'Attach bank accounts',
        desc: 'Aspernatur sit adipisci quaerat unde Redug Lagre dolor sit amets consectetus. Agencies define their new business'
    },
    {
        img: '/Icon-2.png',
        title: 'Send money',
        desc: 'Aspernatur sit adipisci quaerat unde Redug Lagre dolor sit amets consectetus. Agencies define their new business'
    },
]

export default function Cards() {
    return (
        <div className="flex items-center justify-center w-full flex-wrap gap-10">
            {cards.map((card, index) => (
                <div key={index} className="max-w-96 flex flex-col items-center justify-center gap-8">
                    <Image src={card.img} alt={card.title} width={100} height={100} />
                    <div className="flex flex-col items-center justify-center gap-1">
                        <h1 className="text-2xl text-center font-bold">{card.title}</h1>
                        <p className="text-center">{card.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
