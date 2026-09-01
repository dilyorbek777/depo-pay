import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new post (Blog or News)
export const createPost = mutation({
  args: {
    id: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    imageUrl: v.string(),
    type: v.union(v.literal("news"), v.literal("blog")),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", args);
  },
});

// Fetch all posts ordered by newest first
export const getAllPosts = query({
  handler: async (ctx) => {
    return await ctx.db.query("posts").order("desc").collect();
  },
});

// Delete a post by custom string ID or Convex ID
export const deletePost = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    if (post) {
      await ctx.db.delete(post._id);
    }
  },
});