import React, { useState } from "react";
import { FaShoppingCart, FaTimes, FaStore, FaChartBar, FaDoorOpen, FaBoxes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

const Aside = ({ setMobileOpen, mobileOpen }) => {
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();

  const asideLinks = [
    { name: "Dashboard", icon: <FaChartBar />, path: "/admin" },
    { name: "Storage", icon: <FaBoxes />, path: "/admin/storage" },
    { name: "Orders", icon: <FaShoppingCart />, path: "/admin/orders" },
    { name: "Store", icon: <FaStore />, path: "/" },
  ];

  const handleSignOut = async () => {
  try {
    await signOut(auth);
    navigate("/");
    window.location.reload(); // ✅ refresh the page so UI resets
  } 
 catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-blue-900 text-white transition-all duration-300 shadow-lg z-40 w-64 py-3
      ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
    >
      {/* Top Section */}
      <div className="flex justify-between items-center text-xl font-bold select-none p-4">
        <div className="uppercase tracking-wide">Logo</div>

        {/* Close button (mobile only) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-2xl hover:text-red-600 hover:rotate-90 duration-200"
        >
          <FaTimes />
        </button>
      </div>

      {/* Pages Title */}
      <h4 className="px-4 text-blue-200 font-semibold">Pages</h4>

      {/* Menu Links */}
      <ul className="flex flex-col mt-2 space-y-2">
        {asideLinks.map((item) => (
          <li
            key={item.name}
            onClick={() => {
              setActive(item.name);
              setMobileOpen(false); // close menu after click on mobile
            }}
          >
            <Link
              className={`flex items-center gap-4 px-6 py-3 cursor-pointer transition-colors duration-200 
                ${
                  active === item.name
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-800 text-blue-200"
                }`}
              to={item.path}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-base lg:text-lg font-medium">
                {item.name}
              </span>
            </Link>
          </li>
        ))}

        {/* ✅ Sign Out */}
        <li onClick={handleSignOut}>
          <button
            className={`w-full text-left flex items-center gap-4 px-6 py-3 cursor-pointer transition-colors duration-200 
              ${
                active === "Sign out"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-800 text-blue-200"
              }`}
          >
            <span className="text-xl"><FaDoorOpen /></span>
            <span className="text-base lg:text-lg font-medium">Sign out</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Aside;
