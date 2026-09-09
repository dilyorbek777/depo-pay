import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAllCategories = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("desc").collect();
  },
});

export const createCategory = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if category with same slug already exists
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error("Category with this slug already exists");
    }

    return await ctx.db.insert("categories", {
      name: args.name,
      slug: args.slug,
      createdAt: Date.now(),
    });
  },
});

export const deleteCategory = mutation({
  args: {
    id: v.id("categories"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
