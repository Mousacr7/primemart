import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase"; // your Firebase config
import Loader from "../component/Loader";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
       const productsQuery = query(collection(db, "products"), orderBy("id"));
      const productsSnapshot = await getDocs(productsQuery);
      const productsList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
        // Fetch reviews
        const reviewsSnapshot = await getDocs(collection(db, "reviews"));
        const reviewsList = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsList);
        setReviews(reviewsList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <GlobalContext.Provider value={{ products, reviews }}>
      {loading ? <Loader /> : children}
    </GlobalContext.Provider>
  );
}

// Custom hook
export function useGlobal() {
  return useContext(GlobalContext);
}
