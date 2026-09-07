import { query, mutation } from "./_generated/server";
import { v } from "convex/values";


export const getAllProducts = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").order("desc").collect();
  },
});

export const createProduct = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    price: v.number(),
    category: v.string(),
    imageUrl: v.string(),
    description: v.string(),
    quantity: v.number(),
    createdAt: v.number(),
    paymentCardId: v.optional(v.id("cards")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});

export const getProductById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    return product;
  },
});

export const updateProduct = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    price: v.number(),
    category: v.string(),
    imageUrl: v.string(),
    description: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_product_id", (q) => q.eq("id", args.id))
      .first();

    if (!product) {
      throw new Error("Product not found");
    }

    await ctx.db.patch(product._id, {
      name: args.name,
      price: args.price,
      category: args.category,
      imageUrl: args.imageUrl,
      description: args.description,
      quantity: args.quantity,
    });
  },
});

export const deleteProduct = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_product_id", (q) => q.eq("id", args.id))
      .first();

    if (product) {
      await ctx.db.delete(product._id);
    }
  },
});