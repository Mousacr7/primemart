import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../component/Loader";

const GlobalContext = createContext();

// Helper to generate local images for each product
const localImages = (category, id) => {
  const images = [];
  if (category === "tech") {
    for (let i = 1; i <= 4; i++) {
      images.push(`/primemart/${category}/${id}/${id}-${i}.jpg`);
    }
  } else {
    images.push(`/primemart/${category}/${id}.jpg`);
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
        // Fetch products
        const productsQuery = query(collection(db, "products"), orderBy("id"));
        const productsSnapshot = await getDocs(productsQuery);

        const productsList = productsSnapshot.docs.map((doc) => {
          const data = doc.data();
          const images = localImages(data.category, data.id); // generate images locally

          return {
            id: doc.id,
            ...data,
            image: images[0], // first image as main
            images,           // full images array
          };
        });

        // Fetch reviews
        const reviewsSnapshot = await getDocs(collection(db, "reviews"));
        const reviewsList = reviewsSnapshot.docs.map((doc) => ({
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

export function useGlobal() {
  return useContext(GlobalContext);
}
