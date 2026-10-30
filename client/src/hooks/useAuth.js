import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api.js";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState("");

  const checkSession = useCallback(async () => {
    try {
      const data = await api("/auth/me");
      setUser(data.user);
      setConnectionError("");
      return data.user;
    } catch (err) {
      setUser(null);
      // 401 just means "not logged in"; anything else is a connection/config problem.
      setConnectionError(err.status === 401 ? "" : err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { checkSession(); }, [checkSession]);

  const login = useCallback(async (credentials) => {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setUser(data.user);
    setConnectionError("");
    return data.user;
  }, []);

  const updateCredentials = useCallback(async (payload) => {
    const data = await api("/auth/credentials", { method: "PUT", body: JSON.stringify(payload) });
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await api("/auth/logout", { method: "POST", body: "{}" }); } catch (err) { console.warn("Logout request failed:", err.message); }
    setUser(null);
  }, []);

  return { user, loading, connectionError, login, logout, updateCredentials, refreshSession: checkSession };
}
