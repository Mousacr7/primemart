import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";


const ProtectedRoute = ({ children }) => {
const { currentUser, loading } = useAuth();

if (loading) return <Loader />;

return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
