"use client";

import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { User } from "../types/models";
import { useSession } from "next-auth/react"

export const UserContext = createContext<{
  user: User | null;
  loading: boolean;
  updateUser: () => void;
}>({
  user: null,
  loading: true,
  updateUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const token = session ? session.accessToken : null;

  const updateUser = useCallback(async () => {
    try {
      const url = process.env.NEXT_PUBLIC_SYNAPSE_API + "/me";
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      })
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (e) {
      console.error("Erreur de mise à jour de l'utilisateur :", e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    updateUser()
  }, [updateUser]);

  return (
    <UserContext.Provider value={{ user, loading, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}