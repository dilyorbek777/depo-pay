import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const getAllPosts = query({
  handler: async (ctx) => {
    return await ctx.db.query("posts").order("desc").collect();
  },
});

export const createPost = mutation({
  args: {
    id: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    imageUrl: v.string(),
    type: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", args);
  },
});

export const updatePost = mutation({
  args: {
    id: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    imageUrl: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_post_id", (q) => q.eq("id", args.id))
      .first();

    if (!post) {
      throw new Error("Post not found");
    }

    await ctx.db.patch(post._id, {
      title: args.title,
      description: args.description,
      category: args.category,
      imageUrl: args.imageUrl,
      type: args.type,
    });
  },
});

export const deletePost = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_post_id", (q) => q.eq("id", args.id))
      .first();

    if (post) {
      await ctx.db.delete(post._id);
    }
  },
});