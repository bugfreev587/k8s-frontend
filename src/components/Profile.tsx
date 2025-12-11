import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div>
      <h2>Profile</h2>
      <p>User ID: {user.userId}</p>
      <p>Tenant ID: {user.tenantId}</p>
    </div>
  );
}