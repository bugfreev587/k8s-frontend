import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signup(tenantName, email, password);
    } catch (err) {
      alert("Signup failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input placeholder="TenantName" value={tenantName} onChange={e => setTenantName(e.target.value)} />
      <br/>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <br />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <br />
      <button type="submit">Signup</button>
    </form>
  );
}