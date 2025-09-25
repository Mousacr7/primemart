import { useState } from "react";
import { useOrders } from "../../context/OrdersContext";
import { useGlobal } from "../../context/GolbalProvider";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const OrdersPage = () => {
  const { orders = [] } = useOrders();
  const { reviews = [] } = useGlobal();
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const getStatusBadge = (status) => {
    let styles = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status?.toLowerCase()) {
      case "delivered":
        return <span className={`${styles} bg-green-100 text-green-700`}>Delivered</span>;
      case "shipped":
        return <span className={`${styles} bg-blue-100 text-blue-700`}>Shipped</span>;
      case "pending":
        return <span className={`${styles} bg-yellow-100 text-yellow-700`}>Pending</span>;
      case "canceled":
        return <span className={`${styles} bg-red-100 text-red-700`}>Canceled</span>;
      default:
        return <span className={`${styles} bg-gray-100 text-gray-600`}>{status}</span>;
    }
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === statusFilter);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  return (
    <section className="p-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">Orders</h2>
          <select
            className="border rounded-lg px-3 py-1 text-sm bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs uppercase border-b">
              <th className="py-3 text-left">Order ID</th>
              <th className="py-3 text-left">Client</th>
              <th className="py-3 text-left">Amount</th>
              <th className="py-3 text-left">Status</th>
              <th className="py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => {
              const client = reviews.find((r) => r.id === o.clientId);
              return (
                <tr key={o.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 font-medium text-gray-700">#{o.id}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={client?.clientImage}
                        alt={client?.clientName}
                        className="w-8 h-8 rounded-full object-cover"
                        loading="lazy"
                      />
                      <span>{client?.clientName || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-700">${o.total}</td>
                  <td className="py-3">{getStatusBadge(o.status)}</td>
                  <td className="py-3">
                    <select
                      value={o.status}
                      disabled={updatingOrder === o.id}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <p className="text-center text-gray-500 py-6">No orders found</p>
        )}
      </div>
    </section>
  );
};

export default OrdersPage;
