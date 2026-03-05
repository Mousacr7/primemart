import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Loader from "../component/Loader";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to remove the base URL
  const formatImagePath = (path) => {
    const baseUrl = "https://lkdcpkdsyznswcdohwvs.supabase.co/storage/v1/object/public";
    if (Array.isArray(path)) {
      return path.map(p => typeof p === 'string' ? p.replace(baseUrl, "") : p);
    }
    if (typeof path === 'string') {
      return path.replace(baseUrl, "");
    }
    return path;
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), snapshot => {
      const fetchedOrders = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Clean images inside the cart/items array if it exists
        const cleanedCart = data.cart?.map(item => ({
          ...item,
          image: formatImagePath(item.image),
          images: item.images ? formatImagePath(item.images) : undefined
        }));

        return { 
          id: doc.id, 
          ...data, 
          cart: cleanedCart 
        };
      });

      setOrders(fetchedOrders);
      setLoading(false);
    }, error => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsub(); // cleanup on unmount
  }, []);

  return (
    <OrdersContext.Provider value={{ orders }}>
      {loading ? <Loader /> : children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
