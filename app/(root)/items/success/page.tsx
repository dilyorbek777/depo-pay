'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/context/CartContext";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const fulfillOrder = useMutation(api.orders.fulfillOrder);

  useEffect(() => {
    async function completeOrder() {
      // Clear cart items upon successful checkout return
      clearCart();

      if (sessionId) {
        try {
          const userId = localStorage.getItem("app_user_id") || undefined;
          await fulfillOrder({
            stripeSessionId: sessionId,
            userId: userId,
          });
        } catch (err) {
          console.error("Fulfill order error:", err);
        }
      }
      setLoading(false);
    }

    completeOrder();
  }, [sessionId, clearCart, fulfillOrder]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-bold text-muted-foreground">Finalizing your order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-xl">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground">Payment Successful!</h1>
          <p className="text-xs font-medium text-muted-foreground">
            Your items have been moved to your purchased digital library.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/items/bought"
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-2xl text-xs font-bold shadow-md shadow-primary/20"
          >
            <span>View Purchased Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/items"
            className="w-full py-3 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}