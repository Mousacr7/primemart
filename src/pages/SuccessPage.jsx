import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../component/Loader';
import { auth } from "../firebase";

const SuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');

      if (!sessionId) {
        setError("Missing session ID");
        setLoading(false);
        return;
      }

      try {
        const user = auth.currentUser;
        if (!user) throw new Error("You must be logged in");

        const token = await user.getIdToken();

        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/verify-checkout-session?sessionId=${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await res.json();
        if (data.paid) {
          setPaid(true);
          localStorage.removeItem('cart'); // clear cart after success
        } else {
          setError("Payment not completed");
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to verify payment");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search]);

  if (loading) return <Loader />;

  return (
    <div className="payment-page">
      <div className="payment-indicator">
    <span className="payment-success">✔</span>
</div>

      {paid ? (
        <h2>✅ Payment successful! Thank you for your order.</h2>
      ) : (
        <h2 className="">❌ Payment failed: {error}</h2>
      )}
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div> 
  );
};

export default SuccessPage;
