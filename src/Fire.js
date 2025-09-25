import { products } from "./data/proje";


import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase.js"


const  getImgUrlsAndUpload = async () => {
  for (let product of products) {
   
    // Prepare object for Firestore
    const productData = {
      id: product.id,
      name: product.name || "",
      price: product.price || 0,
      category: product.category || "",
      subcategory: product.subcategory || "",
      description: product.description || "",
      color: product.color || [],
      conect: product.conect || "",
      featured: product.featured || false,
      ram: product.ram || "",
      rating: product.rating || 0,
      images: product.image, // ✅ save array
    };

    try {
      await setDoc(doc(db, "products", product.id.toString()), productData, {
        merge: true, // ✅ don't overwrite, just update
      });

      console.log(
        `✅ Uploaded product ${product.id} with ${product.image.length} images`
      );
    } catch (e) {
      console.error(`🔥 Error uploading product ${product.id}:`, e);
    }
  }

  console.log("🎉 Finished uploading all products to Firebase");
};

export default getImgUrlsAndUpload();
 
