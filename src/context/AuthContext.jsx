import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import Loader from "../component/Loader";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // 🔑 check Firestore for role
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);       
if (snap.exists()) {
  const data = snap.data();
  setIsAdmin(!!data.admin); // force boolean
} else {
  setIsAdmin(false);
}
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, loading }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
