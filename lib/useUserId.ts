import { useState, useEffect } from "react";

export function useUserId() {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    let id = localStorage.getItem("app_user_id");
    if (!id) {
      id = "user_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("app_user_id", id);
    }
    setUserId(id);
  }, []);

  return userId;
}