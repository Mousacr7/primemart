import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import { AdminHome } from "./AdminHome";
import { OrdersProvider } from "../../context/OrdersContext";
import { Storage } from "./Storage";
import OrdersPage from "./OrdersPage";

export const AdminRoute = () => {

  return (
    <OrdersProvider>
    <Routes>
      {/* NOTE: Added "*" at the end */}
      <Route path="" element={<AdminLayout />}>
        {/* empty string or "" path = default child */}
        <Route index element={<AdminHome />} />
        {/* you can add more nested routes */}
        <Route path="storage" element={<Storage />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>
    </Routes>
    </OrdersProvider>
  );
};
