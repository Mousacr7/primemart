import React from "react";
import "../Loader.css";

const Loader = () => {
  return (
    <div id="preloader">
      <div className="logo-wrapper">
        <img src="../logo.png" alt="Logo" loading="lazy" className="logo-load" />
        <div className="loading-bar"></div>
      </div>
    </div>
  );
};

export default Loader;
