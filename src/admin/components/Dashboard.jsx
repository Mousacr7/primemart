import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaBox, FaMoneyBillWave, FaUsers, FaTasks } from "react-icons/fa";
import { db } from "../../firebase";

const DashboardCards = () => {
  const [stats, setStats] = useState([]); // ✅ fixed

  const fetchOrders = async () => {
    try {
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // 1. Calculate stats
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const pendingTasks = orders.filter(order => order.status === "pending").length;

      setStats([
        { label: "Total Orders", value: totalOrders, bg: "bg-indigo-100", icon: <FaBox className="text-amber-900" /> },
        { label: "Revenue", value: `$${totalRevenue}`, bg: "bg-green-100", icon: <FaMoneyBillWave className="text-green-700" /> },
        { label: "Active Users", value: 5, bg: "bg-yellow-100", icon: <FaUsers className="text-blue-900" /> },
        { label: "Pending Tasks", value: pendingTasks, bg: "bg-red-100", icon: <FaTasks className="text-black" /> },
      ]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 pt-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`flex items-center space-x-4 p-2 md:p-4 rounded-lg shadow-md ${stat.bg} transition-transform`}
        >
          <div className="text-2xl md:text-3xl">{stat.icon}</div> {/* ✅ fixed */}
          <div>
            <h2 className="text-base md:text-xl font-bold">{stat.value}</h2>
            <p className="text-gray-700 text-xs md:text-sm">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
