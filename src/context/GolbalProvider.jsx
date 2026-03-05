import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../component/Loader";

const GlobalContext = createContext();

// Supabase URL prefix to remove
const SUPABASE_PREFIX = "https://lkdcpkdsyznswcdohwvs.supabase.co/storage/v1/object";

const convertToLocalPath = (imageField) => {
  if (!imageField) return null;

  if (Array.isArray(imageField)) {
    // map over array
    return imageField.map((img) =>
      img.startsWith(SUPABASE_PREFIX) ? img.replace(SUPABASE_PREFIX, "") : img
    );
  } else {
    // single string
    return imageField.startsWith(SUPABASE_PREFIX)
      ? imageField.replace(SUPABASE_PREFIX, "")
      : imageField;
  }
};

export function GlobalProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsQuery = query(collection(db, "products"), orderBy("id"));
        const productsSnapshot = await getDocs(productsQuery);

        const productsList = productsSnapshot.docs.map((doc) => {
          const data = doc.data();

          // convert image field(s) to local paths
          const images = convertToLocalPath(data.image);
          const mainImage = Array.isArray(images) ? images[0] : images;

          return {
            id: doc.id,
            ...data,
            image: mainImage, // first image string
            images: Array.isArray(images) ? images : [images], // full array
          };
        });

        // fetch reviews
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

export function useGlobal() {
  return useContext(GlobalContext);
}
