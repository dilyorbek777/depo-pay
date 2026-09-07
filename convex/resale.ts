import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new resale listing
export const createResaleListing = mutation({
  args: {
    originalProductId: v.id("products"),
    sellerUserId: v.string(),
    resalePrice: v.number(),
    paymentCardId: v.optional(v.id("cards")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the original product
    const product = await ctx.db.get(args.originalProductId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Verify the user has purchased this product
    const purchasedOrders = await ctx.db
      .query("orders")
      .withIndex("by_user_id", (q) => q.eq("userId", args.sellerUserId))
      .filter((q) => q.eq(q.field("status"), "paid"))
      .collect();

    const hasPurchased = purchasedOrders.some((order) =>
      order.items.some((item) => item.productId === args.originalProductId)
    );

    if (!hasPurchased) {
      throw new Error("You must purchase this product before reselling it");
    }

    // Verify the payment card belongs to the seller (if provided)
    if (args.paymentCardId) {
      const card = await ctx.db.get(args.paymentCardId);
      if (!card || card.user_id !== args.sellerUserId) {
        throw new Error("Invalid payment card");
      }
    }

    // Check if user already has an active listing for this product
    const existingListing = await ctx.db
      .query("resaleListings")
      .withIndex("by_seller", (q) => q.eq("sellerUserId", args.sellerUserId))
      .filter((q) =>
        q.and(
          q.eq(q.field("originalProductId"), args.originalProductId),
          q.eq(q.field("status"), "active")
        )
      )
      .first();

    if (existingListing) {
      throw new Error("You already have an active listing for this product");
    }

    // Create the resale listing
    const listingId = await ctx.db.insert("resaleListings", {
      originalProductId: args.originalProductId,
      productName: product.name,
      productPrice: product.price,
      productCategory: product.category,
      productImageUrl: product.imageUrl,
      productDescription: product.description,
      sellerUserId: args.sellerUserId,
      resalePrice: args.resalePrice,
      paymentCardId: args.paymentCardId,
      notes: args.notes,
      status: "active",
      createdAt: Date.now(),
    });

    return listingId;
  },
});

// Get all active resale listings
export const getActiveResaleListings = query({
  handler: async (ctx) => {
    const listings = await ctx.db
      .query("resaleListings")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .order("desc")
      .collect();

    return listings;
  },
});

// Get resale listings by seller
export const getSellerResaleListings = query({
  args: { sellerUserId: v.string() },
  handler: async (ctx, args) => {
    const listings = await ctx.db
      .query("resaleListings")
      .withIndex("by_seller", (q) => q.eq("sellerUserId", args.sellerUserId))
      .order("desc")
      .collect();

    return listings;
  },
});

// Get a single resale listing by ID
export const getResaleListingById = query({
  args: { listingId: v.id("resaleListings") },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    return listing;
  },
});

// Update resale listing
export const updateResaleListing = mutation({
  args: {
    listingId: v.id("resaleListings"),
    resalePrice: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.status !== "active") {
      throw new Error("Cannot update a listing that is not active");
    }

    const updates: any = {};
    if (args.resalePrice !== undefined) updates.resalePrice = args.resalePrice;
    if (args.notes !== undefined) updates.notes = args.notes;

    await ctx.db.patch(args.listingId, updates);
  },
});

// Cancel resale listing
export const cancelResaleListing = mutation({
  args: { listingId: v.id("resaleListings"), sellerUserId: v.string() },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.sellerUserId !== args.sellerUserId) {
      throw new Error("You can only cancel your own listings");
    }

    if (listing.status !== "active") {
      throw new Error("Can only cancel active listings");
    }

    await ctx.db.patch(args.listingId, {
      status: "cancelled",
    });
  },
});

// Purchase a resale item
export const purchaseResaleItem = mutation({
  args: {
    listingId: v.id("resaleListings"),
    buyerUserId: v.string(),
    cardId: v.id("cards"),
  },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.status !== "active") {
      throw new Error("This listing is no longer available");
    }

    if (listing.sellerUserId === args.buyerUserId) {
      throw new Error("You cannot purchase your own listing");
    }

    // Get the buyer's card
    const buyerCard = await ctx.db.get(args.cardId);
    if (!buyerCard) {
      throw new Error("Card not found");
    }

    // Check if buyer's card has sufficient balance
    if (buyerCard.balance < listing.resalePrice) {
      throw new Error("Insufficient card balance");
    }

    // Deduct from buyer's card balance
    await ctx.db.patch(args.cardId, {
      balance: buyerCard.balance - listing.resalePrice,
    });

    // Add funds to seller's chosen payment card (if specified)
    if (listing.paymentCardId) {
      const sellerPaymentCard = await ctx.db.get(listing.paymentCardId);
      if (sellerPaymentCard && "balance" in sellerPaymentCard) {
        await ctx.db.patch(listing.paymentCardId, {
          balance: sellerPaymentCard.balance + listing.resalePrice,
        });
      }
    }

    // Update listing status
    await ctx.db.patch(args.listingId, {
      status: "sold",
      buyerUserId: args.buyerUserId,
      soldAt: Date.now(),
    });

    // Create a record of this resale purchase in orders
    await ctx.db.insert("orders", {
      userId: args.buyerUserId,
      stripeSessionId: `resale_${listing._id}_${Date.now()}`,
      items: [
        {
          productId: listing.originalProductId,
          name: listing.productName,
          price: listing.resalePrice,
          quantity: 1,
        },
      ],
      totalAmount: listing.resalePrice,
      status: "paid",
    });

    return { success: true };
  },
});
