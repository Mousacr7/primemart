// import { db } from "../firebase";
// import { collection, doc, setDoc, getDoc } from "firebase/firestore";

// // fake orders data
// const fakeOrders = [
//   { orderId:"1", clientId: "1", cartItems: [{ productId: "1", qty: 1 }], status: "delivered", createdAt: new Date("2025-01-15T12:30:00Z") },
//   { orderId:"2", clientId: "2", cartItems: [{ productId: "2", qty: 2 }], status: "pending", createdAt: new Date("2025-02-10T09:00:00Z") },
//   { orderId:"3", clientId: "3", cartItems: [{ productId: "3", qty: 1 }], status: "shipped", createdAt: new Date("2025-03-05T14:45:00Z") },
//   { orderId:"4", clientId: "1", cartItems: [{ productId: "16", qty: 3 }], status: "canceled", createdAt: new Date("2025-04-20T17:15:00Z") },
//   { orderId:"5", clientId: "2", cartItems: [{ productId: "10", qty: 1 }, { productId: "2", qty: 1 }], status: "delivered", createdAt: new Date("2025-05-11T11:10:00Z") },
//   { orderId:"6", clientId: "3", cartItems: [{ productId: "35", qty: 2 }], status: "pending", createdAt: new Date("2025-06-08T13:25:00Z") },
//   { orderId:"7", clientId: "1", cartItems: [{ productId: "2", qty: 1 }], status: "shipped", createdAt: new Date("2025-07-22T15:40:00Z") },
//   { orderId:"8", clientId: "2", cartItems: [{ productId: "35", qty: 5 }], status: "delivered", createdAt: new Date("2025-08-19T10:00:00Z") },
//   { orderId:"9", clientId: "3", cartItems: [{ productId: "1", qty: 1 }], status: "canceled", createdAt: new Date("2025-09-12T09:30:00Z") },
// ];

// export const seedOrders = async () => {
//   try {
//     for (const order of fakeOrders) {
//       const itemsWithSnapshot = [];
//       let total = 0;

//       for (const item of order.cartItems) {
//         const productRef = doc(db, "products", item.productId);
//         const productSnap = await getDoc(productRef);

//         if (productSnap.exists()) {
//           const productData = productSnap.data();

//           itemsWithSnapshot.push({
//             productId: item.productId,
//             name: productData.name,
//             price: productData.price,
//             image: productData.image,
//             qty: item.qty,
//           });

//           total += productData.price * item.qty;
//         }
//       }

//       // Use setDoc to assign your own ID
//       await setDoc(doc(db, "orders", order.orderId), {
//         clientId: order.clientId,
//         items: itemsWithSnapshot,
//         total,
//         status: order.status,
//         createdAt: order.createdAt,
//       });

//       console.log(`✅ Seeded order ${order.orderId} for client ${order.clientId}`);
//     }

//     console.log("🎉 Done seeding 9 orders!");
//   } catch (error) {
//     console.error("❌ Error seeding orders:", error);
//   }
// };
