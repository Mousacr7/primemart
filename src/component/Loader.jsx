import React from "react";
import "../Loader.css";

const Loader = () => {
  return (
    <div id="preloader">
      <div className="logo-wrapper">
        <img src="../loader.webp" alt="Logo" loading="lazy" className="logo-load" />
        <div className="loading-bar"></div>
      </div>
    </div>
  );
};

export default Loader;
