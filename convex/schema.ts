import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Clerk user data
    user_id: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    profileImg: v.optional(v.string()),
    registeredAt: v.number(),

    // Additional user data
    role: v.string(), // "user" or "admin"
  })
    .index("by_user_id", ["user_id"])
    .index("by_email", ["email"]),

  posts: defineTable({
    id: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    imageUrl: v.string(),
    type: v.string(), // "news" or "blog"
    createdAt: v.number(),
  }).index("by_post_id", ["id"]),

  products: defineTable({
    id: v.string(),
    name: v.string(),
    price: v.number(),
    category: v.string(),
    imageUrl: v.string(),
    description: v.string(),
    quantity: v.number(),
    createdAt: v.number(),
  }).index("by_product_id", ["id"]),

  orders: defineTable({
    userId: v.optional(v.string()), // <--- Changed to optional
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
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
  })
    .index("by_stripe_session_id", ["stripeSessionId"])
    .index("by_user_id", ["userId"]),
  newsletter: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
    status: v.optional(v.string()), // "active" or "unsubscribed"
  }).index("by_email", ["email"]),

  cards: defineTable({
    // Card details
    number16digit: v.string(), // Unique 16-digit card number
    balance: v.number(),
    color: v.string(), // Card color (hex code or color name)
    holderName: v.string(), // Card holder name from user details

    // Card metadata
    user_id: v.string(), // Reference to user
    createdAt: v.number(), // Creation timestamp
    expiresAt: v.number(), // Expiration timestamp (4 years after creation)
  })
    .index("by_user_id", ["user_id"])
    .index("by_card_number", ["number16digit"]),



  transfers: defineTable({
    // Transfer details
    fromCardId: v.id("cards"),
    toCardId: v.id("cards"),
    fromCardNumber: v.string(),
    toCardNumber: v.string(),
    amount: v.number(),
    fee: v.number(),
    totalDeducted: v.number(),

    // Transfer metadata
    fromUserId: v.string(),
    toUserId: v.string(),
    timestamp: v.number(),
    metadata: v.optional(v.any()),
  })
    .index("by_from_user", ["fromUserId"])
    .index("by_to_user", ["toUserId"])
    .index("by_timestamp", ["timestamp"]),
});


