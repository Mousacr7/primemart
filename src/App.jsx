import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import ForgetPassword from "./pages/ForgetaPssword";
import ProtectedRoute from "./component/ProtectedRoute";
import AdminProtectedRoute from "./component/AdminProtectedRoute";
import Loader from "./component/Loader";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/Cart";
import { useEffect } from "react";
import SuccessPage from "./pages/Success";
import { GlobalProvider } from "./context/GolbalProvider";
import { AdminRoute } from "./admin/page/AdminRoute";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { pathname } = useLocation();
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <GlobalProvider>
      <Routes>
        <Route path="/home" element={<Loader />} />

        {/* Store always available */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/loader" element={<Loader />} />
        <Route path="/success" element={<SuccessPage />} />

        {/* Admin only */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminRoute />
            </AdminProtectedRoute>
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

        {/* Redirect logged-in admin from `/login` to `/admin` */}
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to={isAdmin ? "/admin" : "/"} replace />
            ) : (
              <Login />
            )
          }
        />
      </Routes>
    </GlobalProvider>
  );
};

export default App;
