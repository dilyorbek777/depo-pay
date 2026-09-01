# PrimePay Authentication Setup Guide

## Setup Instructions

### 1. Install Required Dependencies
```bash
npm install svix
```

### 2. Configure Environment Variables
Create or update your `.env.local` file with the following variables:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
CONVEX_DEPLOYMENT=your-convex-deployment
```

### 3. Start Convex Development Server
```bash
npx convex dev
```
This will:
- Generate the Convex types
- Start the local Convex development server
- Provide you with the Convex URL to add to your environment variables

### 4. Set Up Clerk Webhook
1. Go to your Clerk Dashboard
2. Navigate to "Webhooks" 
3. Create a new webhook
4. Set the endpoint URL to: `https://your-domain.com/api/webhooks/clerk`
5. Select the following events:
   - `user.created`
   - `user.updated`
6. Copy the webhook secret and add it to your `.env.local` as `CLERK_WEBHOOK_SECRET`

### 5. Start the Development Server
```bash
npm run dev
```

## Features Implemented

### User Data Structure
When users sign up or sign in, they are automatically synced to Convex with:
- `user_id`: Clerk user ID
- `name`: User's full name
- `email`: User's email address
- `profileImg`: Profile image URL
- `registeredAt`: Registration timestamp
- `role`: Default "user" (can be changed to "admin")
- `cards`: Empty array `[]` (users can add cards later)

### Card Structure
Users can add cards with the following structure:
```typescript
{
  id: string,
  balance: number,
  number16digit: string,
  holderName: string
}
```

### Available Pages
- `/sign-in`: Sign-in page with Clerk authentication
- `/sign-up`: Sign-up page with Clerk registration

### Convex Functions Available
- `syncUser`: Creates or updates user from Clerk data
- `getUserByClerkId`: Retrieves user by Clerk ID
- `addCard`: Adds a card to user's cards array
- `updateUserRole`: Updates user role (admin function)

## Testing the Integration

1. Start Convex dev server: `npx convex dev`
2. Start Next.js dev server: `npm run dev`
3. Navigate to `/sign-up` to create a new account
4. Check your Convex dashboard to verify the user was created
5. Navigate to `/sign-in` to test login functionality
6. Verify user data is properly synced

## Troubleshooting

### TypeScript Errors
If you see TypeScript errors about missing Convex types, make sure:
1. Convex dev server is running (`npx convex dev`)
2. The types have been generated in `convex/_generated/`

### Webhook Issues
If webhooks aren't working:
1. Verify the webhook secret matches in Clerk and your `.env.local`
2. Check that the webhook endpoint URL is accessible
3. Review Clerk webhook logs for errors

### User Sync Issues
If users aren't syncing to Convex:
1. Check that Convex dev server is running
2. Verify environment variables are set correctly
3. Check browser console for errors
4. Review Convex function logs

## Next Steps

After setup is complete, you can:
1. Add card management UI components
2. Implement admin functionality for role management
3. Add user profile pages
4. Create payment features using the card data
