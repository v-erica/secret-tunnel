import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [location, setLocation] = useState("GATE");

  // TODO: signup

  async function signup(username) {
    try {
      const response = await fetch(API + "/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result?.message || "Signup failed");

      setToken(result.token);
      setLocation("TABLET");
    } catch (e) {
      console.error("Signup error:" + e);
      throw e;
    }
  }

  // TODO: authenticate

  async function authenticate() {
    try {
      if (!token) {
        throw new Error("No token.");
      }

      const response = await fetch(API + "/authenticate", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw Error(result?.message || "Auth failed");
      }
      setLocation("TUNNEL");
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  const value = {
    token,
    location,
    signup,
    authenticate,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
