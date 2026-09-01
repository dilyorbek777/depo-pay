import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Subscribe a user email to the newsletter
export const subscribeEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscribers")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      throw new Error("This email is already subscribed!");
    }

    return await ctx.db.insert("subscribers", {
      email: args.email,
      subscribedAt: Date.now(),
      status: "active",
    });
  },
});

// Fetch all subscribers for the admin panel
export const getSubscribers = query({
  handler: async (ctx) => {
    return await ctx.db.query("subscribers").order("desc").collect();
  },
});