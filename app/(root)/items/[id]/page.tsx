'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCart } from "@/context/CartContext";
import { useUserId } from "@/lib/useUserId";
import {
  ArrowLeft,
  ShoppingBag,
  ShoppingCart,
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  Plus,
  Minus,
  Check,
  Loader2,
  PackageCheck,
  CheckCircle2,
} from "lucide-react";

export default function ItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = useUserId();
  const productId = params?.id as Id<"products">;

  const [isMounted, setIsMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart, totalCartCount } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const product = useQuery(api.products.getProductById, { id: productId });
  const purchasedProductIds = useQuery(api.orders.getPurchasedProductIds, { userId }) ?? [];

  const isPurchased = product ? purchasedProductIds.includes(product._id) : false;

  if (!isMounted || product === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="flex items-center gap-3 text-muted-foreground font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          Loading Item Details...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground text-xs mb-6">
          The requested item does not exist or has been removed.
        </p>
        <button
          onClick={() => router.push("/items")}
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-2xl text-xs font-bold"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (isPurchased) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
      });
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/items/bought")}
              className="flex items-center gap-2 bg-secondary hover:bg-accent text-secondary-foreground px-4 py-2 rounded-2xl text-xs font-bold transition-all border border-border"
            >
              <PackageCheck className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">My Purchases</span>
            </button>

            <button
              onClick={() => router.push("/items/cart")}
              className="relative flex items-center gap-2 bg-secondary hover:bg-accent text-secondary-foreground px-4 py-2 rounded-2xl text-xs font-bold transition-all border border-border"
            >
              <ShoppingCart className="w-4 h-4 text-primary" />
              <span>View Cart</span>
              {totalCartCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] rounded-full font-black">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-card p-6 sm:p-10 rounded-3xl border border-border shadow-sm">
          {/* Media Preview */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl bg-muted overflow-hidden border border-border">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-card/90 backdrop-blur-md text-card-foreground border border-border font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-xl shadow-sm">
                {product.category}
              </span>

              {isPurchased && (
                <span className="absolute top-4 right-4 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-xl shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Owned
                </span>
              )}
            </div>
          </div>

          {/* Product Specifications & Details */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-500 text-xs font-bold">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-foreground">4.9</span>
                <span className="text-muted-foreground font-medium">(128 Reviews)</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {product.name}
              </h1>

              <div className="text-3xl font-black text-primary">
                ${product.price.toFixed(2)}
              </div>

              <p className="text-muted-foreground text-xs sm:text-sm font-medium leading-relaxed pt-2">
                {product.description}
              </p>
            </div>

            {/* Actions & Controls */}
            <div className="space-y-6 pt-6 border-t border-border">
              {!isPurchased && (
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Quantity
                  </span>
                  <div className="flex items-center gap-3 bg-secondary p-1 rounded-xl border border-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 rounded-lg hover:bg-background text-foreground transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold px-2">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1.5 rounded-lg hover:bg-background text-foreground transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                {isPurchased ? (
                  <button
                    onClick={() => router.push("/items/bought")}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-xs font-bold bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 transition-all"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>View in Purchased Library</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
                      isAdded
                        ? "bg-secondary text-secondary-foreground border border-border"
                        : "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-primary" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart - ${(product.price * quantity).toFixed(2)}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 text-center border-t border-border/60">
                <div className="p-3 bg-background rounded-2xl border border-border flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground">Fast Access</span>
                </div>
                <div className="p-3 bg-background rounded-2xl border border-border flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground">Verified Item</span>
                </div>
                <div className="p-3 bg-background rounded-2xl border border-border flex flex-col items-center gap-1">
                  <RefreshCw className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground">Easy Refund</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}