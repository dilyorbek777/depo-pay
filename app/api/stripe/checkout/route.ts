import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-08-26.dahlia',
});

export async function POST(req: NextRequest) {
  try {
    const { cardId, amount } = await req.json();

    if (!cardId || !amount) {
      return NextResponse.json(
        { error: 'Card ID and amount are required' },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(parseFloat(amount) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Card Top-up',
              description: `Top-up card ending in ${cardId.slice(-4)}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?canceled=true`,
      metadata: {
        cardId: cardId,
        amount: amount,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
