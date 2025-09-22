// pages/Signin.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import AuthForm from "../component/AuthForm";
import Loader from "../component/Loader";

const Signin = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if(error || success) {
    const timer = setTimeout(() => setError(null) || setSuccess(null), 5000);
    return () => clearTimeout(timer);
  }
}, [error,success])

  const validateForm = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return "All fields are required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true)
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false)
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        firstName,
        lastName,
        admin: false,
        createdAt: new Date(),
      });

      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <AuthForm
        type="register"
        firstName={firstName}
        lastName={lastName}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setEmail={setEmail}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
        handleSubmit={handleSubmit}
        loading={loading}
        error={error}
        success={success}
      />
    </>
  );
};

export default Signin;
