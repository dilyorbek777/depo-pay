'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/context/CartContext";
import { useUserId } from "@/lib/useUserId";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag,
  Search,
  Loader2,
  ShoppingCart,
  Check,
  Package,
  Filter,
  Plus,
  PackageCheck,
  X,
  Trash2,
} from "lucide-react";

export default function ItemsStorePage() {
  const router = useRouter();
  const { userId } = useAuth();
  const localStorageUserId = useUserId();
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, totalCartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !userId) {
      router.push("/sign-in");
    }
  }, [isMounted, userId, router]);

  const allProducts = useQuery(api.products.getAllProducts) ?? [];
  const purchasedProductIds = useQuery(api.orders.getPurchasedProductIds, { userId: userId || localStorageUserId }) ?? [];

  // Exclude purchased items and sold out items from store display
  const availableProducts = allProducts.filter(
    (product) => !purchasedProductIds.includes(product._id) && product.quantity > 0
  );

  const categories = ["All", ...Array.from(new Set(availableProducts.map((p) => p.category)))];

  const filteredProducts = availableProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
    });
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex items-center gap-3 text-muted-foreground font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          Loading Store...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary text-primary-foreground rounded-xl shadow-md shadow-primary/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="font-black text-lg text-foreground tracking-tight block">
              Store & Marketplace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/items/bought")}
              className="flex items-center gap-2 bg-secondary hover:bg-accent text-secondary-foreground px-4 py-2 rounded-2xl text-xs font-bold transition-all border border-border"
            >
              <PackageCheck className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">My Purchases</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-secondary hover:bg-accent text-secondary-foreground px-4 py-2 rounded-2xl text-xs font-bold transition-all border border-border"
            >
              <ShoppingCart className="w-4 h-4 text-primary" />
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] rounded-full font-black">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <section className="bg-primary text-primary-foreground rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl shadow-primary/10 border border-primary/20">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 rounded-full text-[11px] font-extrabold tracking-wide uppercase">
              <Package className="w-3.5 h-3.5" /> Digital Marketplace
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-primary-foreground leading-tight">
              Explore Digital Items & Services
            </h1>
            <p className="text-primary-foreground/80 text-xs sm:text-sm font-medium leading-relaxed">
              Discover, purchase, and manage software upgrades, subscriptions, and digital assets directly from your unified hub.
            </p>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-3xl border border-border shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products by title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-background border-border rounded-2xl text-xs font-medium focus:bg-card focus-visible:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0 ml-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                    : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border shadow-sm">
            <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-extrabold text-foreground mb-1">No products available</h3>
            <p className="text-muted-foreground text-xs font-medium">
              {purchasedProductIds.length > 0 && availableProducts.length === 0
                ? "You have purchased all available items in the store!"
                : "No items listed in the store yet. Check back soon!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const cartItem = cart.find((i) => i.id === product._id);
              const inCartCount = cartItem?.quantity || 0;

              return (
                <Link
                  key={product._id}
                  href={`/items/${product._id}`}
                  className="bg-card rounded-3xl border border-border shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group hover:border-primary/30"
                >
                  <div>
                    <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-md text-card-foreground border border-border font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-xl shadow-sm">
                        {product.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-1.5">
                      <h3 className="font-extrabold text-base text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-border/60 mt-4 flex items-center justify-between pt-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Price
                      </span>
                      <div className="text-lg font-black text-foreground">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                        inCartCount > 0
                          ? "bg-secondary text-secondary-foreground border border-border"
                          : "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/10"
                      }`}
                    >
                      {inCartCount > 0 ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-primary" />
                          <span>Added ({inCartCount})</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-card border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-extrabold text-foreground">Shopping Cart</h2>
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] rounded-full font-black">
                    {totalCartCount}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-secondary rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-muted/40 border border-border rounded-2xl"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-foreground truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center bg-secondary hover:bg-accent rounded-lg text-xs font-bold transition-colors"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center bg-secondary hover:bg-accent rounded-lg text-xs font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-border space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-muted-foreground">Subtotal</span>
                    <span className="text-lg font-extrabold text-foreground">
                      ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      router.push("/items/cart");
                      setIsCartOpen(false);
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-2xl transition-all shadow-md shadow-primary/10"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => clearCart()}
                    className="w-full bg-secondary hover:bg-accent text-secondary-foreground font-bold py-3 px-6 rounded-2xl transition-all"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}