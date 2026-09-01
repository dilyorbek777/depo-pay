'use client'

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function UserSync() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const syncUser = useMutation(api.users.syncUser);
  const existingUser = useQuery(api.users.getUserByClerkId, 
    userId ? { user_id: userId } : "skip"
  );

  useEffect(() => {
    if (isLoaded && isSignedIn && userId && user) {
      // Get user data from Clerk
      const email = user?.emailAddresses[0]?.emailAddress || "";
      const firstName = user?.firstName || "";
      const lastName = user?.lastName || "";
      const name = `${firstName} ${lastName}`.trim() || undefined;
      const profileImg = user?.imageUrl || undefined;

      // Always sync to ensure latest data from Clerk
      syncUser({
        user_id: userId,
        name: name,
        email: email,
        profileImg: profileImg,
        registeredAt: existingUser?.registeredAt || Math.floor(Date.now() / 1000),
      });
    }
  }, [isLoaded, isSignedIn, userId, existingUser, syncUser, user]);

  return null;
}
