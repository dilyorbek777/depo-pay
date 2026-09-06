import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-08-26.dahlia",
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  try {
    const { items, userId } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate inventory stock prior to processing
    for (const item of items) {
      const product = await convex.query(api.products.getProductById, {
        id: item.id || item._id,
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.name}" no longer exists.` },
          { status: 400 }
        );
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Only ${product.quantity} unit(s) left in stock for "${product.name}".`,
          },
          { status: 400 }
        );
      }
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      metadata: { userId: userId || "user_anonymous" },
      success_url: `${origin}/items/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/items/cart`,
    });

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    await convex.mutation(api.orders.createPendingOrder, {
      userId: userId || "user_anonymous",
      stripeSessionId: session.id,
      items: items.map((item: any) => ({
        productId: item.id || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}