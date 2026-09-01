import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  // Note: You'll need to install svix: npm install svix
  const wh = new (require("svix").Webhook)(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the event
  const eventType = evt.type;
  
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url, created_at } = evt.data;
    
    const email = email_addresses[0]?.email_address;
    // Name strictly from Clerk auth - no fallbacks
    const name = `${first_name || ""} ${last_name || ""}`.trim() || undefined;
    
    // Sync user to Convex
    try {
      await fetchMutation(api.users.syncUser, {
        user_id: id,
        name: name,
        email: email,
        profileImg: image_url,
        registeredAt: Math.floor(new Date(created_at).getTime() / 1000),
      });
    } catch (error) {
      console.error("Error syncing user to Convex:", error);
      return new Response("Error syncing user", { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    
    const email = email_addresses[0]?.email_address;
    // Name strictly from Clerk auth - no fallbacks
    const name = `${first_name || ""} ${last_name || ""}`.trim() || undefined;
    
    // Update user in Convex
    try {
      await fetchMutation(api.users.syncUser, {
        user_id: id,
        name: name,
        email: email,
        profileImg: image_url,
        registeredAt: Math.floor(Date.now() / 1000),
      });
    } catch (error) {
      console.error("Error updating user in Convex:", error);
      return new Response("Error updating user", { status: 500 });
    }
  }

  return new Response("", { status: 200 });
}
