import React, { useState } from "react";
import { FaCog, FaDoorOpen } from "react-icons/fa";

const Nav = ({ setMobileOpen, mobileOpen }) => {
  const fakeData = [
    "Client: John Doe",
    "Product: iPhone 15",
    "Order #1024",
    "Invoice #556",
    "Client: Sarah Smith",
    "Product: Galaxy S24",
    "Order #2025",
  ];

  const dashBoard = [
    { name: "Settings", icon: <FaCog /> },
    { name: "Sign out", icon: <FaDoorOpen /> },
  ];

  const [active, setActive] = useState(false);
  const [activeDashboard, setActiveDashboard] = useState(false);

  return (
    <div className="flex  z-30 items-center justify-between lg:justify-end fixed top-0 right-0 left-0 bg-white shadow-md px-6 py-3 z-90">
      {/* Mobile Menu Button */}
      {!mobileOpen ? (
        <button
          className="lg:hidden z-50 text-2xl font-bold text-blue-800 rounded hover:text-blue-600"
          onClick={() => setMobileOpen(true)}
        >
          ☰
        </button>
      ): (<div></div>)}

      {/* Overlay for Mobile & Dropdowns */}
      {(mobileOpen || active || activeDashboard) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30 md:hidden"
          onClick={() => {
            setMobileOpen(false);
            setActiveDashboard(false);
            setActive(false);
          }}
        />
      )}

      {/* Actions (Search + Dashboard dropdown) */}
      <div className="flex items-center gap-4">
        {/* Search Toggle */}
        <button
          onClick={() => {
            setActiveDashboard(false);
            setActive(!active);
          }}
          className="text-xl p-0 rounded-full hover:bg-blue-100 transition"
        >
          🔍
        </button>
             <button onClick={()=> {
              ""
             }}>🔔</button>
          
        {/* Dashboard (profile dropdown) */}
        <div
          onClick={() => {
            setActive(false);
            setActiveDashboard(!activeDashboard);
          }}
          className="relative flex items-center gap-2 font-bold text-blue-700 border-l-2 border-blue-800 pl-2 cursor-pointer"
        >
          <span>⚡</span>
          <h3>Dashboard</h3>

          {activeDashboard && (
            <ul className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg w-40 text-sm text-gray-700 z-40">
              {dashBoard.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                >
                  <span className="text-blue-700">{item.icon}</span>
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Search Box */}
      {active && (
        <div className="absolute top-full mt-2 right-4 bg-white shadow-lg rounded-lg p-3 w-72 z-40">
          <input
            type="search"
            placeholder="Search..."
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          />
          <ul className="mt-3 text-sm text-gray-700">
            {fakeData.map((item, index) => (
              <li
                key={index}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Nav;
