import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../component/Loader";

const GlobalContext = createContext();

// Helper to generate local images
const localImages = (category, id) => {
  if (category === "tech") {
    const images = [];
    for (let i = 1; i <= 4; i++) {
      images.push(`/primemart/${category}/${id}/${id}-${i}.jpg`);
    }
    return images;
  } else {
    return [`/primemart/${category}/${id}.jpg`];
  }
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

          // Overwrite the image field with local paths
          const images = localImages(data.category, data.id);

          return {
            firebaseId: doc.id,
            ...data,
            images,       // now all images come from local public folder
            image: images[0], // the main image is the first local image
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
        console.error("Error fetching data, using fallback images:", error);
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
