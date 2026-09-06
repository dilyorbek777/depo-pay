'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Loader2,
  ShoppingBag,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

export default function CartPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart, totalCartCount } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const userCards = useQuery(
    api.users.getUserCards,
    userId ? { user_id: userId } : "skip"
  );
  const purchaseWithCard = useMutation(api.orders.purchaseWithCard);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !userId) {
      router.push("/sign-in");
    }
  }, [isMounted, userId, router]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      if (!selectedCardId) {
        setErrorMsg("Please select a card to complete the purchase.");
        setIsCheckingOut(false);
        return;
      }

      // Get or create persistent user ID from localStorage
      let localStorageUserId = localStorage.getItem("app_user_id");
      if (!localStorageUserId) {
        localStorageUserId = "user_" + Math.random().toString(36).substring(2, 9);
        localStorage.setItem("app_user_id", localStorageUserId);
      }

      // Purchase with card
      await purchaseWithCard({
        cardId: selectedCardId as any,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        userId: localStorageUserId,
        totalAmount: subtotal,
      });

      // Clear cart and show success
      clearCart();
      setSuccessMsg("Purchase successful! Your items have been added to your library.");
      setIsCheckingOut(false);

      // Redirect to bought page after 2 seconds
      setTimeout(() => {
        router.push("/items/bought");
      }, 2000);
    } catch (err: any) {
      console.error("Checkout Error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setIsCheckingOut(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex items-center gap-3 text-muted-foreground font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          Loading Cart...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push("/items")}
            className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>

          <div className="flex items-center gap-2 font-black text-base text-foreground">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <span>Shopping Cart ({totalCartCount})</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {errorMsg && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold rounded-2xl flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-muted-foreground hover:text-foreground ml-4"
            >
              ✕
            </button>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-2xl flex items-center justify-between">
            <span>{successMsg}</span>
            <button
              onClick={() => setSuccessMsg(null)}
              className="text-muted-foreground hover:text-foreground ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border shadow-sm max-w-xl mx-auto">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-extrabold text-foreground mb-1">Your cart is empty</h3>
            <p className="text-muted-foreground text-xs font-medium mb-6">
              Looks like you haven&apos;t added any digital items to your cart yet.
            </p>
            <button
              onClick={() => router.push("/items")}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-2xl text-xs font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Selected Items ({cart.length})
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs font-bold text-destructive hover:underline"
                >
                  Clear Cart
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-3xl border border-border p-4 sm:p-5 shadow-sm flex items-center gap-4 justify-between"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-2xl overflow-hidden shrink-0 border border-border">
                      <Image
                        width={500}
                        height={500}
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary block">
                        {item.category}
                      </span>
                      <h4 className="font-extrabold text-sm sm:text-base text-foreground truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs font-black text-foreground">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center bg-secondary rounded-xl border border-border p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-extrabold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-6 sticky top-24">
              <h3 className="font-extrabold text-base text-foreground border-b border-border/60 pb-3">
                Order Summary
              </h3>

              {/* Card Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Select Payment Card
                </label>
                {userCards && userCards.length > 0 ? (
                  <div className="space-y-2">
                    {userCards.map((card: any) => (
                      <div
                        key={card._id}
                        onClick={() => setSelectedCardId(card._id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedCardId === card._id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-border/80"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-6 rounded-md"
                              style={{ backgroundColor: card.color }}
                            />
                            <div>
                              <p className="text-xs font-bold text-foreground">
                                {card.holderName}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-mono">
                                •••• {card.number16digit.slice(-4)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">
                              ${card.balance.toFixed(2)}
                            </span>
                            {selectedCardId === card._id && (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-muted/40 border border-border rounded-2xl text-center">
                    <p className="text-xs text-muted-foreground mb-2">No cards available</p>
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Go to Dashboard to add a card
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-xs font-medium">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="border-t border-border/60 pt-3 flex items-center justify-between text-sm font-black text-foreground">
                  <span>Total</span>
                  <span className="text-lg text-primary">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              {selectedCardId && userCards && (
                <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                  <AlertCircle className="w-3 h-3" />
                  <span>
                    Payment will be deducted from selected card balance
                  </span>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || !selectedCardId}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-2xl text-xs font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay with Selected Card</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}