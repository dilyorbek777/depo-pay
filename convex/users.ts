import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update user
export const syncUser = mutation({
  args: {
    user_id: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    profileImg: v.optional(v.string()),
    registeredAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .first();

    if (existingUser) {
      // Update existing user - name and email strictly from Clerk auth
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
        profileImg: args.profileImg,
      });
      return existingUser._id;
    } else {
      // Create new user with default values - name and email strictly from Clerk auth
      const newUserId = await ctx.db.insert("users", {
        user_id: args.user_id,
        name: args.name,
        email: args.email,
        profileImg: args.profileImg,
        registeredAt: args.registeredAt,
        role: "user", // Default role
      });
      return newUserId;
    }
  },
});

// Get user by Clerk user_id
export const getUserByClerkId = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .first();
    return user;
  },
});

// Get cards for a user
export const getUserCards = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const cards = await ctx.db
      .query("cards")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .collect();
    return cards;
  },
});

// Get card by number
export const getCardByNumber = query({
  args: { cardNumber: v.string() },
  handler: async (ctx, args) => {
    const card = await ctx.db
      .query("cards")
      .withIndex("by_card_number", (q) => q.eq("number16digit", args.cardNumber))
      .first();
    return card;
  },
});

// Get transfer history for a user
export const getTransferHistory = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const sentTransfers = await ctx.db
      .query("transfers")
      .withIndex("by_from_user", (q) => q.eq("fromUserId", args.user_id))
      .collect();
    
    const receivedTransfers = await ctx.db
      .query("transfers")
      .withIndex("by_to_user", (q) => q.eq("toUserId", args.user_id))
      .collect();
    
    // Combine and sort by timestamp (most recent first)
    const allTransfers = [...sentTransfers, ...receivedTransfers].sort(
      (a, b) => b.timestamp - a.timestamp
    );
    
    return allTransfers;
  },
});

// Top-up card balance (called by Stripe webhook)
export const topUpCard = mutation({
  args: {
    cardId: v.id("cards"),
    amount: v.number(),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const card = await ctx.db.get(args.cardId);

    if (!card) {
      throw new Error("Card not found");
    }

    // Check if this session has already been processed to prevent double updates
    if (args.sessionId) {
      const existingTopUps = await ctx.db
        .query("transfers")
        .withIndex("by_from_user", (q) => q.eq("fromUserId", card.user_id))
        .collect();

      const alreadyProcessed = existingTopUps.some(
        (transfer) => transfer.metadata?.sessionId === args.sessionId
      );

      if (alreadyProcessed) {
        console.log(`Session ${args.sessionId} already processed, skipping`);
        return { newBalance: card.balance, skipped: true };
      }
    }

    const newBalance = card.balance + args.amount;

    await ctx.db.patch(args.cardId, {
      balance: newBalance,
    });

    // Record this top-up as a transfer for tracking
    await ctx.db.insert("transfers", {
      fromUserId: card.user_id,
      toUserId: card.user_id,
      fromCardId: args.cardId,
      toCardId: args.cardId,
      fromCardNumber: card.number16digit,
      toCardNumber: card.number16digit,
      amount: args.amount,
      fee: 0,
      totalDeducted: args.amount,
      timestamp: Date.now() / 1000,
      metadata: { sessionId: args.sessionId, type: "topup" },
    });

    return { newBalance };
  },
});

// Generate unique 16-digit card number
function generateCardNumber(): string {
  // Generate a random 16-digit number
  const cardNumber = Math.floor(Math.random() * 9000000000000000) + 1000000000000000;
  return cardNumber.toString();
}

// Add card to user
export const addCard = mutation({
  args: {
    user_id: v.string(),
    balance: v.number(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Generate unique card number
    let cardNumber: string;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 100) {
      cardNumber = generateCardNumber();
      const existingCard = await ctx.db
        .query("cards")
        .withIndex("by_card_number", (q) => q.eq("number16digit", cardNumber))
        .first();

      if (!existingCard) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error("Could not generate unique card number");
    }

    // Calculate expiration date (4 years from now)
    const now = Date.now();
    const expiresAt = now + (4 * 365 * 24 * 60 * 60 * 1000); // 4 years in milliseconds

    // Create card - holder name from user database with fallbacks for display
    const holderName = user.name || user.email.split('@')[0] || "Card Holder";

    await ctx.db.insert("cards", {
      number16digit: cardNumber!,
      balance: args.balance,
      color: args.color,
      holderName: holderName,
      user_id: args.user_id,
      createdAt: Math.floor(now / 1000),
      expiresAt: Math.floor(expiresAt / 1000),
    });
  },
});

// Delete card
export const deleteCard = mutation({
  args: {
    card_id: v.id("cards"),
  },
  handler: async (ctx, args) => {
    const card = await ctx.db.get(args.card_id);
    if (!card) {
      throw new Error("Card not found");
    }
    await ctx.db.delete(args.card_id);
  },
});

// Update user role (admin only)
export const updateUserRole = mutation({
  args: {
    user_id: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      role: args.role,
    });
  },
});

// Transfer money between cards
export const transferMoney = mutation({
  args: {
    senderCardId: v.id("cards"),
    recipientCardNumber: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    // Validate amount
    if (args.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    // Get sender card
    const senderCard = await ctx.db.get(args.senderCardId);
    if (!senderCard) {
      throw new Error("Sender card not found");
    }

    // Validate recipient card number (must be 16 digits)
    if (args.recipientCardNumber.length !== 16 || !/^\d+$/.test(args.recipientCardNumber)) {
      throw new Error("Invalid card number. Must be 16 digits.");
    }

    // Get recipient card
    const recipientCard = await ctx.db
      .query("cards")
      .withIndex("by_card_number", (q) => q.eq("number16digit", args.recipientCardNumber))
      .first();

    if (!recipientCard) {
      throw new Error("Recipient card not found. Please check the 16-digit card number and try again.");
    }

    // Prevent transfer to same card
    if (senderCard._id === recipientCard._id) {
      throw new Error("Cannot transfer to the same card");
    }

    // Calculate fee (0.7%)
    const fee = args.amount * 0.007;
    const totalDeducted = args.amount + fee;

    // Check sender balance (amount + fee)
    if (senderCard.balance < totalDeducted) {
      throw new Error("Not enough money");
    }

    // Get fee card (9977 8686 1455 0055)
    const feeCardNumber = "9999777754547799";
    const feeCard = await ctx.db
      .query("cards")
      .withIndex("by_card_number", (q) => q.eq("number16digit", feeCardNumber))
      .first();

    // Perform transfers
    await ctx.db.patch(senderCard._id, {
      balance: senderCard.balance - totalDeducted,
    });

    await ctx.db.patch(recipientCard._id, {
      balance: recipientCard.balance + args.amount,
    });

    // Send fee to fee card if it exists
    if (feeCard) {
      await ctx.db.patch(feeCard._id, {
        balance: feeCard.balance + fee,
      });
    }

    // Record transfer
    await ctx.db.insert("transfers", {
      fromCardId: senderCard._id,
      toCardId: recipientCard._id,
      fromCardNumber: senderCard.number16digit,
      toCardNumber: recipientCard.number16digit,
      amount: args.amount,
      fee: fee,
      totalDeducted: totalDeducted,
      fromUserId: senderCard.user_id,
      toUserId: recipientCard.user_id,
      timestamp: Math.floor(Date.now() / 1000),
    });

    return {
      success: true,
      newSenderBalance: senderCard.balance - totalDeducted,
      newRecipientBalance: recipientCard.balance + args.amount,
      fee: fee,
      totalDeducted: totalDeducted,
    };
  },
});
