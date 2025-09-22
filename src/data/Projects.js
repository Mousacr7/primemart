// src/data/Projects.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";


export let products = []; // exported array

// Function to fill the array
export const loadProducts = async () => {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    products = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        name: data.name ,
        price: data.price ,
        category: data.category ,
        subcategory: data.subcategory ,
        description: data.description ,
        color: data.color ,
        size: data.size ,
        ram: data.ram ,
        conect: data.conect ,
        featured: data.featured ,
        rating: data.rating ,
        image: data.image,

      };
    });
console.log("Products from Firebase:", products);


console.log("✅ Products loaded:", products.length);
  } catch (err) {
    console.error("🔥 Error fetching products:", err);
  }

};
