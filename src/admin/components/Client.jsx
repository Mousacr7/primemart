import { useState } from "react";
import { useGlobal } from "../../context/GolbalProvider";
import { useOrders } from "../../context/OrdersContext";

export const Client = () => {
  const { orders = [] } = useOrders();
  const { products = [], reviews = [] } = useGlobal() || {};

  const [showAllClients, setShowAllClients] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Count orders for a given client
  const getOrderCount = (clientId) =>
    orders?.filter((o) => o.clientId === clientId).length || 0;

  // Sort clients by number of orders
  const sortedClients = [...reviews].sort(
    (a, b) => getOrderCount(b.id) - getOrderCount(a.id)
  );

  // Slice / show more toggle
  const clientsToShow = showAllClients
    ? sortedClients
    : sortedClients.slice(0, 3);

  // ✅ Filter only featured products
  const featuredProducts = products.filter((p) => p.featured);
  const productsToShow = showAllProducts
    ? featuredProducts
    : featuredProducts.slice(0, 3);

  return (
    <div className="flex p-6 flex-col md:flex-row flex-wrap gap-8">
      {/* Top Clients */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 min-w-[320px]">
        <div className="p-4 border-b border-gray-100">
          <h1 className="font-semibold text-gray-800 text-lg">Top Clients</h1>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="p-3 text-left font-medium">Client</th>
                <th className="p-3 text-left font-medium">Rating</th>
                <th className="p-3 text-left font-medium">Orders</th>
              </tr>
            </thead>
            <tbody>
              {clientsToShow.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={r.clientImage}
                      alt={r.clientName}
                      className="w-10 h-10 rounded-full object-cover shadow-sm"
                    />
                    <span className="font-medium text-gray-800">{r.clientName}</span>
                  </td>
                  <td className="p-3 text-yellow-500">⭐ {r.rating}</td>
                  <td className="p-3 text-blue-600 font-medium">
                    {getOrderCount(r.id)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedClients.length > 3 && (
          <div className="p-4">
            <button
              onClick={() => setShowAllClients(!showAllClients)}
              className="w-full py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
            >
              {showAllClients ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>

      {/* Best Products */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 min-w-[320px]">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-lg">Best Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="p-3 text-left font-medium">Product</th>
                <th className="p-3 text-left font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {productsToShow.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={Array.isArray(p.image) ? p.image[0] : p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover shadow-sm"
                    />
                    <span className="font-medium text-gray-800">{p.name}</span>
                  </td>
                  <td className="p-3 text-yellow-500">
                    {p.rating && `⭐ ${p.rating}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {featuredProducts.length > 3 && (
          <div className="p-4">
            <button
              onClick={() => setShowAllProducts(!showAllProducts)}
              className="w-full py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
            >
              {showAllProducts ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
