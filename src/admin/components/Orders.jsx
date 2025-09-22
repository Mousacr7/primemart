import React, { useState } from "react";
import { useOrders } from "../../context/OrdersContext";
import { useGlobal } from "../../context/GolbalProvider";

const Orders = () => {
  const { orders = [] } = useOrders(); // Orders from Firebase
  const { reviews = [] } = useGlobal(); // Clients/reviews
  const [showAll, setShowAll] = useState(false);

  // Map status to color badges
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-indigo-100 text-indigo-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "canceled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const displayedOrders = showAll ? orders : orders.slice(0, 5);

  return (
    <section className="p-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <span className="text-sm text-gray-500">{orders.length} total</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((o) => {
                const client = reviews.find((r) => r.id === o.clientId);
                return (
                  <tr
                    key={o.id}
                    className="hover:bg-gray-50 transition-colors border-t"
                  >
                    <td className="p-3 font-medium text-gray-800">#{o.id}</td>
                    <td className="p-3 flex items-center gap-2">
                      {client?.clientImage && (
                        <img
                          src={client.clientImage}
                          alt={client.clientName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span>{client?.clientName || "Unknown"}</span>
                    </td>
                    <td className="p-3 font-medium text-gray-800">
                      ${o.total}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          o.status
                        )}`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Show More / Show Less */}
        {orders.length > 5 && (
          <div className="p-4 border-t flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;
