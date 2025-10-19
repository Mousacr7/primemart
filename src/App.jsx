import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import ForgetPassword from "./pages/ForgetaPssword";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/Cart";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import { AdminRoute } from "./admin/page/AdminRoute" // make sure this exists
import Loader from "./component/Loader";
import ProtectedRoute from "./component/ProtectedRoute";
import { GlobalProvider } from "./context/GolbalProvider";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { pathname } = useLocation();
  const { currentUser } = useAuth();

  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Fetch user role from backend
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!currentUser) {
        setUserRole(null);
        setLoadingRole(false);
        return;
      }

      try {
        const token = await currentUser.getIdToken();
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/verifyUser`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserRole(data.role); // "admin" or "user"
      } catch (err) {
        console.error("Error fetching user role:", err);
        setUserRole(null);
      } finally {
        setLoadingRole(false);
      }
    };

    fetchUserRole();
  }, [currentUser]);

  if (loadingRole) return <Loader />;

  return (
    <GlobalProvider>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />

        {/* Auth pages */}
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to={userRole === "admin" ? "/admin" : "/"} replace />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />

        {/* Admin only */}
        <Route
          path="/admin/*"
          element={
            userRole === "admin" ? <AdminRoute /> : <Navigate to="/" replace />
          }
        />

        {/* User protected */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </GlobalProvider>
  );
};

export default App;
