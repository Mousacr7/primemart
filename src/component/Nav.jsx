// ✅ Nav.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useGlobal } from "../context/GolbalProvider";
import {  FaChartBar, FaHome, FaShoppingBag, FaShoppingCart, FaUser } from 'react-icons/fa';
import "./nav.css"


const Nav = ({image}) => {
  const {products} = useGlobal()

  const [mobile, setMobile] = useState("");
  const [scroll, setScroll] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
    const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCount(totalCount);
    };

    updateCartCount(); // Run on load

    // Listen for custom event
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);  // ✅ Handle screen resize (for mobile menu)
  useEffect(() => {
    const handleResize = () => setMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  
  
  }, []);
  useEffect(() =>{
    const handleScroll = () => setScroll(window.scrollY >= 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  
  }, []);

 

  // ✅ Debounced search filter (updates suggestions)
  useEffect(() => {
    const debounce = setTimeout(() => {
      const term = searchTerm.trim().toLowerCase();

      if (!term) {
        setSuggestions([]);
        return;
      }

      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term) ||
        p.subcategory?.toLowerCase().includes(term)
      );

      setSuggestions(filtered.slice(0, 5)); // limit to top 5 results
    }, 300); // 300ms debounce

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // ✅ Handle enter key
  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      const term = searchTerm.trim().toLowerCase();

      // Try to find exact or partial subcategory match
      const matchSub = products.find(p =>
        p.subcategory?.toLowerCase() === term
      );

      const matchPartialSub = products.find(p =>
        p.subcategory?.toLowerCase().includes(term)
      );

      if (matchSub || matchPartialSub) {
        navigate('/products', {
          state: { subcategory: (matchSub || matchPartialSub).subcategory }
        });
      } else {
        // Fall back to general search
        navigate('/products', {
          state: { searchTerm: term }
        });
      }

      setSearchTerm('');
      setSuggestions([]);
    }
  };

  return (
    <nav className={scroll && 'scroll'}>
      <div className="container">
        {/* Logo */}
          <div className="logo">
            {image ? 
            <img src="../logo.png" alt="Logo" />
            :
            <img src="./logo.png" alt="Logo" />
            }
            <h1 className="brand">rimeMart</h1>
          </div>
       

        {/* Search Box */}
        <div className="nav-item">
          <input
            type="search"
            placeholder="&#128269; Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleEnter}
            />

              {/* Suggestions */}
            {searchTerm.trim() && (
      suggestions.length > 0 ? (
        <ul className="search">
          {suggestions.map(s => (
            <li
              key={s.id}
              onClick={() => {
                navigate(`/product/${s.id}`);
                setSearchTerm('');
                setSuggestions([]);
              }}
            >
              {s.name}
            </li>
          ))}
        </ul>
      ) : (
        <div className="search found">No results found</div>
      )
    )}

          {/* Navigation Links */}
          <div className={` ${mobile &&"bottom-link"}`}>
            <ul>
            {[
              { name: "Home", link: "", logo: <FaHome /> },
              { name: "Products", link: "Products", logo: <FaShoppingBag /> },
              { name: "Cart", link: "Cart", logo: <FaShoppingCart />, showBadge: true },
            ].map((item) => (
            <li key={item.name}>
              <NavLink
                to={`/${item.link.toLowerCase()}`}
                className={({ isActive }) => (isActive ? "active nav-link" : "nav-link")}
              >
                <span className="icon-wrapper">
                  {item.logo}
               {count > 0 && item.name === "Cart" && (
  <span className="cart-badge">{count}</span>
)}
                </span>
                {item.name}
              </NavLink>
            </li>

            ))}

              {currentUser
                ? <li> {isAdmin ? 
                <NavLink
                    to="/admin"
                    className={({ isActive }) => (isActive ? "active nav-link" : "nav-link")}>
                      <FaChartBar />DashBorad
                      </NavLink> 
                   : <NavLink
                    to="/profile"
                    className={({ isActive }) => (isActive ? "active nav-link" : "nav-link")}>
                      <FaUser />Profile
                      </NavLink> 
                 } 
                 </li>
                : <button> <NavLink
                    to="/login"
                    className="bg-blue-700 p-3 rounded-sm login-btn">
                      login
                      </NavLink>
                      </button>
                  }
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
