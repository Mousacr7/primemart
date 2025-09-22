import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
      <div className='footer-content'>

      </div>
        {/* Logo and Title */}
        <div className="footer-header">
          <img src="/logo.png" alt="Shop Logo"/>
          <h1>rimeMart</h1>
        </div>

        {/* Social Icons */}
        <div className="social">
          <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
          <a href="https://github.com" target="_blank" rel="noreferrer"><FaGithub /></a>
        </div>

        {/* Copyright */}
        <div>
          &copy; {currentYear} Musa’s Shop. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
