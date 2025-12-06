import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {user.email}</p>
    </div>
  );
}