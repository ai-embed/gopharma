"use client";

import { useEffect, useState } from "react";
import { apiJsonAuth } from "./api";

type UserProfile = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiJsonAuth<UserProfile>("/api/users/me").then((res) => {
      if (!active) return;
      if (res.ok && res.data) {
        setUser(res.data);
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return { user, loading };
}
