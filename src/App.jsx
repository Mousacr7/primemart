import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import ForgetPassword from "./pages/ForgetaPssword";
import ProtectedRoute from "./component/ProtectedRoute";
import Loader from "./component/Loader";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/Cart";
import { useEffect } from "react";
import SuccessPage from "./pages/Success";



const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll only for product detail pages
    window.scrollTo({ top: 0, behavior: 'instant' }); // or 'smooth'
    
  }, [pathname]);
  return (
    
    <Routes>
      <Route path="/home" element={<Loader />} />
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
       <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/forgetpassword" element={<ForgetPassword/>} />
      <Route path="/loader" element={<Loader/>} />
      <Route path="/success" element={<SuccessPage/>} />
      
      {/* Protected Route */}
    {/* <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} /> */}
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
{/* <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} /> */}

    </Routes>
  );
};

export default App;
