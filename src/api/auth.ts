import axios from "axios";

const API = import.meta.env.PROD ? "https://my-node-app-95cx.onrender.com" : "http://localhost:8080";

export async function login(tenantName: string, email: string, password: string) {
  const res = await axios.post(`${API}/v1/auth/login`, {tenantName, email, password });
  return res.data;
}

export async function signup(tenantName: string, email: string, password: string) {
  const res = await axios.post(`${API}/v1/auth/signup`, { tenantName, email, password });
  return res.data;
}

export async function getProfile(token: string) {
  const res = await axios.get(`${API}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function refreshToken(token: string) {
  const res = await axios.post(`${API}/refresh`, { token });
  return res.data;
}

export async function logout(token: string) {
  const res = await axios.post(`${API}/logout`, { token });
  return res.data;
}