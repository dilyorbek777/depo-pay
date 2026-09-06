import { mutation, query } from "./_generated/server";
import { v } from "convex/values";



export const createPendingOrder = mutation({
    args: {
        userId: v.string(),
        stripeSessionId: v.string(),
        items: v.array(
            v.object({
                productId: v.string(),
                name: v.string(),
                price: v.number(),
                quantity: v.number(),
            })
        ),
        totalAmount: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("orders", {
            userId: args.userId,
            stripeSessionId: args.stripeSessionId,
            items: args.items,
            totalAmount: args.totalAmount,
            status: "pending",
        });
    },
});



// Get list of product IDs purchased by the user
export const getPurchasedProductIds = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        if (!args.userId) return [];

        const paidOrders = await ctx.db
            .query("orders")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("status"), "paid"))
            .collect();

        const purchasedIds = new Set<string>();
        for (const order of paidOrders) {
            for (const item of order.items) {
                purchasedIds.add(item.productId);
            }
        }
        return Array.from(purchasedIds);
    },
});

// Get all details of purchased items for the /items/bought page
export const getPurchasedItems = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        if (!args.userId) return [];

        const paidOrders = await ctx.db
            .query("orders")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("status"), "paid"))
            .collect();

        const productMap = new Map<string, any>();

        for (const order of paidOrders) {
            for (const item of order.items) {
                if (!productMap.has(item.productId)) {
                    // Use ctx.db.get() to look up by Convex _id since orders store _id as productId
                    const product = await ctx.db.get(item.productId as any);
                    if (product) {
                        productMap.set(item.productId, {
                            ...product,
                            purchasedAt: order._creationTime,
                        });
                    }
                }
            }
        }

        return Array.from(productMap.values());
    },
});




export const fulfillOrder = mutation({
    args: {
        stripeSessionId: v.string(),
        userId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const order = await ctx.db
            .query("orders")
            .withIndex("by_stripe_session_id", (q) =>
                q.eq("stripeSessionId", args.stripeSessionId)
            )
            .first();

        if (!order || order.status === "paid") return;

        // Deduct stock for each purchased product
        for (const item of order.items) {
            const product = await ctx.db.get(item.productId as any);
            if (product) {
                const newQuantity = Math.max(0, ((product as any).quantity ?? 0) - item.quantity);
                await ctx.db.patch(product._id, { quantity: newQuantity });
            }
        }

        // Mark order as paid - preserve existing userId or use args.userId if order doesn't have one
        await ctx.db.patch(order._id, {
            status: "paid",
            userId: order.userId || args.userId,
        });
    },
});

export const purchaseWithCard = mutation({
    args: {
        cardId: v.id("cards"),
        items: v.array(
            v.object({
                productId: v.string(),
                name: v.string(),
                price: v.number(),
                quantity: v.number(),
            })
        ),
        userId: v.string(),
        totalAmount: v.number(),
    },
    handler: async (ctx, args) => {
        // Get the card
        const card = await ctx.db.get(args.cardId);
        if (!card) {
            throw new Error("Card not found");
        }

        // Check if card has sufficient balance
        if (card.balance < args.totalAmount) {
            throw new Error("Insufficient card balance");
        }

        // Validate product stock
        for (const item of args.items) {
            const product = await ctx.db.get(item.productId as any);
            if (!product) {
                throw new Error(`Product "${item.name}" not found`);
            }
            if ((product as any).quantity < item.quantity) {
                throw new Error(`Insufficient stock for "${item.name}"`);
            }
        }

        // Deduct from card balance
        await ctx.db.patch(args.cardId, {
            balance: card.balance - args.totalAmount,
        });

        // Update product stock
        for (const item of args.items) {
            const product = await ctx.db.get(item.productId as any);
            if (product) {
                const newQuantity = Math.max(0, ((product as any).quantity ?? 0) - item.quantity);
                await ctx.db.patch(product._id, { quantity: newQuantity });
            }
        }

        // Create paid order
        await ctx.db.insert("orders", {
            userId: args.userId,
            stripeSessionId: `card_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            items: args.items,
            totalAmount: args.totalAmount,
            status: "paid",
        });

        return { success: true };
    },
});