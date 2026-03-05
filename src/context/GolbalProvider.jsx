import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../component/Loader";

const GlobalContext = createContext();

// Local fallback images for products
const localImage = (category, id) => {
  if (category === "tech") {
    const images = [];
    for (let i = 1; i <= 4; i++) {
      images.push(`/primemart/${category}/${id}/${id}-${i}.webp`);
    }
    return images;
  } else {
    return [`/primemart/${category}/${id}.webp`];
  }
};

export function GlobalProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- Fetch products from Firebase
        const productsQuery = query(collection(db, "products"), orderBy("id"));
        const productsSnapshot = await getDocs(productsQuery);

        const productsList = productsSnapshot.docs.map((doc) => {
          const data = doc.data();

          // Add images property (using local fallback paths)
          const images = localImage(data.category, data.id);

          return {
            firebaseId: doc.id,
            ...data,
            images,
          };
        });

        // --- Fetch reviews
        const reviewsSnapshot = await getDocs(collection(db, "reviews"));
        const reviewsList = reviewsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsList);
        setReviews(reviewsList);
      } catch (error) {
        console.error("Error fetching data, using fallback images:", error);
        // If Firebase fails, use empty array but keep local images logic
        setProducts([]);
        setReviews([]);
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
