'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserId } from "@/lib/useUserId";
import {
    ArrowLeft,
    PackageCheck,
    Download,
    Loader2,
    Calendar,
    CheckCircle2,
} from "lucide-react";

export default function BoughtItemsPage() {
    const router = useRouter();
    const userId = useUserId();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const purchasedItems = useQuery(api.orders.getPurchasedItems, { userId }) ?? [];

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

                    <div className="flex items-center gap-2 font-black text-base text-foreground">
                        <PackageCheck className="w-5 h-5 text-primary" />
                        <span>Purchased Items ({purchasedItems.length})</span>
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
                            You haven't purchased any items from the marketplace yet.
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
                                        <img
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

                                <div className="p-5 pt-0 border-t border-border/60 mt-4 flex items-center justify-between pt-4">
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

                                    <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-primary/10 hover:opacity-90">
                                        <Download className="w-3.5 h-3.5" />
                                        <span>Access Asset</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}