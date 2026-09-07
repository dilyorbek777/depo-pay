'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserId } from "@/lib/useUserId";
import {
    ArrowLeft,
    ShoppingBag,
    Loader2,
    ShoppingCart,
    Tag,
    User,
    Calendar,
    CheckCircle2,
    CreditCard,
} from "lucide-react";
import Image from "next/image";

export default function MarketplacePage() {
    const router = useRouter();
    const userId = useUserId();
    const [isMounted, setIsMounted] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<string>("");

    const purchaseResaleItem = useMutation(api.resale.purchaseResaleItem);
    const userCards = useQuery(
        api.users.getUserCards,
        userId ? { user_id: userId } : "skip"
    );

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const resaleListings = useQuery(api.resale.getActiveResaleListings) ?? [];

    const handlePurchase = async (listingId: string) => {
        if (!selectedCardId || !userId) {
            alert("Please select a payment card");
            return;
        }

        try {
            await purchaseResaleItem({
                listingId: listingId as any,
                buyerUserId: userId,
                cardId: selectedCardId as any,
            });
            alert("Purchase successful!");
            router.push("/items/bought");
        } catch (error: any) {
            alert(error.message || "Purchase failed");
        }
    };

    if (!isMounted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex items-center gap-3 text-muted-foreground font-medium text-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    Loading Marketplace...
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
                        Back to Store
                    </button>

                    <div className="flex items-center gap-2 font-black text-base text-foreground">
                        <Tag className="w-5 h-5 text-primary" />
                        <span>Resale Marketplace ({resaleListings.length})</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
                <section className="bg-primary text-primary-foreground rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl shadow-primary/10 border border-primary/20">
                    <div className="max-w-2xl space-y-3 relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 rounded-full text-[11px] font-extrabold tracking-wide uppercase">
                            <ShoppingBag className="w-3.5 h-3.5" /> Second-Hand Market
                        </span>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-primary-foreground leading-tight">
                            Buy & Sell Pre-Owned Items
                        </h1>
                        <p className="text-primary-foreground/80 text-xs sm:text-sm font-medium leading-relaxed">
                            Discover great deals on pre-owned digital items from other users, or list your purchased items for resale.
                        </p>
                    </div>
                </section>

                {resaleListings.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border shadow-sm max-w-xl mx-auto">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-lg font-extrabold text-foreground mb-1">No resale listings</h3>
                        <p className="text-muted-foreground text-xs font-medium mb-6">
                            There are no items currently listed for resale. Check back soon!
                        </p>
                        <button
                            onClick={() => router.push("/items")}
                            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-2xl text-xs font-bold shadow-md shadow-primary/20"
                        >
                            Browse Store
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resaleListings.map((listing: any) => (
                            <div
                                key={listing._id}
                                className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col"
                            >
                                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                                    <Image
                                        src={listing.productImageUrl}
                                        alt={listing.productName}
                                        width={400}
                                        height={300}
                                        className="w-full h-full object-cover"
                                    />
                                    <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-md text-card-foreground border border-border font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-xl shadow-sm">
                                        {listing.productCategory}
                                    </span>
                                </div>

                                <div className="p-5 space-y-3">
                                    <h3 className="font-extrabold text-base text-foreground line-clamp-1">
                                        {listing.productName}
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                                        {listing.productDescription}
                                    </p>
                                    
                                    {listing.notes && (
                                        <p className="text-xs text-primary font-medium italic">
                                            "{listing.notes}"
                                        </p>
                                    )}

                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                        <User className="w-3 h-3" />
                                        <span>Seller ID: {listing.sellerUserId.slice(0, 8)}...</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                            Listed {new Date(listing.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 border-t border-border/60 mt-4 pt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                                                Original Price
                                            </span>
                                            <div className="text-sm font-bold text-muted-foreground line-through">
                                                ${listing.productPrice.toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                                                Resale Price
                                            </span>
                                            <div className="text-xl font-black text-foreground">
                                                ${listing.resalePrice.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {userCards && userCards.length > 0 ? (
                                            <select
                                                value={selectedCardId}
                                                onChange={(e) => setSelectedCardId(e.target.value)}
                                                className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="">Select Payment Card</option>
                                                {userCards.map((card: any) => (
                                                    <option key={card._id} value={card._id}>
                                                        {card.holderName} - •••• {card.number16digit.slice(-4)} (${card.balance.toFixed(2)})
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <button
                                                onClick={() => router.push("/dashboard")}
                                                className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs font-bold text-primary"
                                            >
                                                Add Card to Purchase
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handlePurchase(listing._id)}
                                            disabled={!selectedCardId}
                                            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <CreditCard className="w-3.5 h-3.5" />
                                            <span>Buy Now</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
