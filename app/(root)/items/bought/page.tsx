'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserId } from "@/lib/useUserId";
import {
    ArrowLeft,
    PackageCheck,
    Download,
    Loader2,
    Calendar,
    CheckCircle2,
    DollarSign,
    X,
} from "lucide-react";
import Image from "next/image";

export default function BoughtItemsPage() {
    const router = useRouter();
    const userId = useUserId();
    const [isMounted, setIsMounted] = useState(false);
    const [showResaleModal, setShowResaleModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [resalePrice, setResalePrice] = useState("");
    const [selectedPaymentCard, setSelectedPaymentCard] = useState("");
    const [notes, setNotes] = useState("");

    const createResaleListing = useMutation(api.resale.createResaleListing);
    const sellerListings = useQuery(api.resale.getSellerResaleListings, { sellerUserId: userId || "" }) ?? [];
    const userCards = useQuery(
        api.users.getUserCards,
        userId ? { user_id: userId } : "skip"
    );

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const purchasedItems = useQuery(api.orders.getPurchasedItems, { userId }) ?? [];

    const handleOpenResaleModal = (product: any) => {
        setSelectedProduct(product);
        setResalePrice((product.price * 0.8).toFixed(2)); // Default to 80% of original price
        setSelectedPaymentCard("");
        setNotes("");
        setShowResaleModal(true);
    };

    const handleSubmitResale = async () => {
        if (!selectedProduct || !userId) return;

        try {
            await createResaleListing({
                originalProductId: selectedProduct._id,
                sellerUserId: userId,
                resalePrice: parseFloat(resalePrice),
                paymentCardId: selectedPaymentCard ? (selectedPaymentCard as any) : undefined,
                notes: notes || undefined,
            });
            setShowResaleModal(false);
            setSelectedProduct(null);
            setSelectedPaymentCard("");
        } catch (error: any) {
            alert(error.message || "Failed to create listing");
        }
    };

    const hasActiveListing = (productId: string) => {
        return sellerListings.some(
            (listing: any) =>
                listing.originalProductId === productId && listing.status === "active"
        );
    };

    if (!isMounted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex items-center gap-3 text-muted-foreground font-medium text-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    Loading Purchases...
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

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push("/items/marketplace")}
                            className="flex items-center gap-2 bg-secondary hover:bg-accent text-secondary-foreground px-4 py-2 rounded-2xl text-xs font-bold transition-all border border-border"
                        >
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className="hidden sm:inline">Marketplace</span>
                        </button>

                        <div className="flex items-center gap-2 font-black text-base text-foreground">
                            <PackageCheck className="w-5 h-5 text-primary" />
                            <span>Purchased Items ({purchasedItems.length})</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
                <section className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
                    <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mb-2">
                        My Digital Library
                    </h1>
                    <p className="text-muted-foreground text-xs sm:text-sm font-medium">
                        Access, download, and manage all your purchased digital products and active subscriptions.
                    </p>
                </section>

                {purchasedItems.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border shadow-sm max-w-xl mx-auto">
                        <PackageCheck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-lg font-extrabold text-foreground mb-1">No purchases found</h3>
                        <p className="text-muted-foreground text-xs font-medium mb-6">
                            You haven&apos;t purchased any items from the marketplace yet.
                        </p>
                        <button
                            onClick={() => router.push("/items")}
                            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-2xl text-xs font-bold shadow-md shadow-primary/20"
                        >
                            Browse Store
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {purchasedItems.map((item) => (
                            <div
                                key={item._id}
                                className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col justify-between"
                            >
                                <div>
                                    <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                                        <Image
                                            width={500}
                                            height={500}
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute top-3 right-3 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Owned
                                        </span>
                                    </div>

                                    <div className="p-5 space-y-2">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                                            {item.category}
                                        </span>
                                        <h3 className="font-extrabold text-base text-foreground line-clamp-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-5 border-t border-border/60 mt-4 flex items-center justify-between pt-4">
                                    <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                                        <Calendar className="w-3.5 h-3.5 text-primary" />
                                        <span>
                                            {new Date(item.purchasedAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {!hasActiveListing(item._id) && (
                                            <button
                                                onClick={() => handleOpenResaleModal(item)}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-secondary hover:bg-accent text-secondary-foreground rounded-xl text-[10px] font-bold transition-all border border-border"
                                            >
                                                <DollarSign className="w-3 h-3" />
                                                <span>Sell</span>
                                            </button>
                                        )}
                                        <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-primary/10 hover:opacity-90">
                                            <Download className="w-3.5 h-3.5" />
                                            <span>Access</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Resale Modal */}
            {showResaleModal && selectedProduct && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={() => setShowResaleModal(false)}
                    />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-3xl shadow-2xl z-50 w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-extrabold text-foreground">List for Resale</h2>
                            <button
                                onClick={() => setShowResaleModal(false)}
                                className="p-2 hover:bg-secondary rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-2xl border border-border">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0">
                                    <Image
                                        src={selectedProduct.imageUrl}
                                        alt={selectedProduct.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-sm text-foreground truncate">{selectedProduct.name}</h3>
                                    <p className="text-xs text-muted-foreground">Original: ${selectedProduct.price.toFixed(2)}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                                    Resale Price ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={resalePrice}
                                    onChange={(e) => setResalePrice(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter resale price"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                                    Payment Card (to receive funds)
                                </label>
                                <select
                                    value={selectedPaymentCard}
                                    onChange={(e) => setSelectedPaymentCard(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="">Select a card</option>
                                    {userCards && userCards.map((card: any) => (
                                        <option key={card._id} value={card._id}>
                                            {card.holderName} - •••• {card.number16digit.slice(-4)} (Balance: ${card.balance.toFixed(2)})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                    rows={3}
                                    placeholder="Add any additional details about the item..."
                                />
                            </div>

                            <button
                                onClick={handleSubmitResale}
                                className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-2xl transition-all shadow-md shadow-primary/10 hover:opacity-90 active:scale-95"
                            >
                                Create Listing
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}