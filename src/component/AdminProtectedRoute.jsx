import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";


const AdminProtectedRoute = ({ children }) => {
const { isAdmin , loading } = useAuth();

if (loading) return <Loader />;

return isAdmin ? children : <Navigate to="/login" />;
};

export default AdminProtectedRoute;
