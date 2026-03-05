import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase"; 
import Loader from "../component/Loader";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to remove the base URL and return the local path
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
    const fetchData = async () => {
      try {
        // Fetch products
        const productsQuery = query(collection(db, "products"), orderBy("id"));
        const productsSnapshot = await getDocs(productsQuery);
        
        const productsList = productsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Assuming your field name is 'image' or 'images'
            image: formatImagePath(data.image),
            images: data.images ? formatImagePath(data.images) : undefined
          };
        });

    // Fetch reviews
const reviewsSnapshot = await getDocs(collection(db, "reviews"));
const reviewsList = reviewsSnapshot.docs.map(doc => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    // Applies the path cleaning to 'image' or 'userImage' fields in reviews
    image: data.image ? formatImagePath(data.image) : data.image,
    userImage: data.userImage ? formatImagePath(data.userImage) : data.userImage
  };
});
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

export function useGlobal() {
  return useContext(GlobalContext);
}
