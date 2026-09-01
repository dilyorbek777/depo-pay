import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-08-26.dahlia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  console.log('Webhook received');
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  console.log('Signature:', signature);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('Event constructed successfully:', event.type);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Session completed:', session.id);
        console.log('Session metadata:', session.metadata);
        
        if (session.metadata?.cardId && session.metadata?.amount) {
          const cardId = session.metadata.cardId;
          const amount = parseFloat(session.metadata.amount);

          console.log(`Attempting to top-up card ${cardId} with $${amount}`);

          // Update card balance in Convex
          const result = await fetchMutation(api.users.topUpCard, {
            cardId: cardId as any,
            amount: amount,
          });

          console.log(`Card ${cardId} topped up successfully. New balance:`, result);
        } else {
          console.error('Missing metadata in session');
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
