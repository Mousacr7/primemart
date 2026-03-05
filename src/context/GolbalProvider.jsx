import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../component/Loader";

const GlobalContext = createContext();

// Helper: generate local images for a product
const generateLocalImages = (category, id) => {
  const images = [];
  if (category === "tech") {
    // tech products have multiple images
    for (let i = 1; i <= 4; i++) {
      images.push(`/primemart/${category}/${id}/${id}-${i}.webp`);
    }
  } else {
    // other products have a single image
    images.push(`/primemart/${category}/${id}.webp`);
  }
  return images;
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
          const images = generateLocalImages(data.category, data.id);

          return {
            id: doc.id,          // Firebase doc id
            ...data,             // all other product fields
            image: images[0],    // main image string
            images,              // full images array for gallery
          };
        });

        // --- Fetch reviews from Firebase
        const reviewsSnapshot = await getDocs(collection(db, "reviews"));
        const reviewsList = reviewsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsList);
        setReviews(reviewsList);
      } catch (error) {
        console.error("Error fetching data:", error);
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

// Custom hook to use the global context
export function useGlobal() {
  return useContext(GlobalContext);
}
