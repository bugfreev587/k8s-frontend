import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { logout } = useAuth();
  return <button onClick={logout}>Logout</button>;
}