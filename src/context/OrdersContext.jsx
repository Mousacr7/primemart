import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Loader from "../component/Loader";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), snapshot => {
      const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
