// src/pages/CancelPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="cancel-page">
      <h2 className="text-red-500">❌ Payment was canceled.</h2>
      <p>You did not complete the payment. You can try again or continue shopping.</p>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default CancelPage;
