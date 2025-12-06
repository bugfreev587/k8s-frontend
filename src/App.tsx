import React from "react";
import Login from "./components/Login"
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import { useAuth } from "./context/AuthContext";
import Signup from "./components/Signup";


export default function App() {
  const { user } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h1>JWT Auth App</h1>
      {!user ? 
      <>
      <Login /> 
      <Signup />
      </>
      : <>
        <Profile />
        <Logout />
      </>}
    </div>
  );
}