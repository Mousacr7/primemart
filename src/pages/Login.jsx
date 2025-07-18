// pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import AuthForm from "../component/AuthForm";
import Loader from "../component/Loader";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
useEffect(() => {
  if(error || success) {
    const timer = setTimeout(() => setError(null) || setSuccess(null), 5000);
    return () => clearTimeout(timer);
  }
}, [error,success])
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true)
    // Simple client-side validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if(success){
      setLoading(true);}
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Login successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setLoading(false)
      if (err.code === "auth/user-not-found") {
        setError("User not found.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError("Login failed. Please try again.");
      }
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {loading && <Loader />}
      <AuthForm
        type="login"
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        error={error}
        success={success}
        loading={loading}
      />
    </>
  );
};

export default Login;
