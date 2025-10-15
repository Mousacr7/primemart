import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import Nav from '../component/Nav'
import "./profile.css"
import { FaPencilAlt, FaUser } from "react-icons/fa";
import Footer from "../component/Footer";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = doc(db, "users", currentUser.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUser(userData);
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEmail(userData.email);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      firstName,
      lastName,
    });
    alert("Name updated!");
    setEditMode(false);
    setUser((prev) => ({ ...prev, firstName, lastName }));
  };
const handleSignOut =async (auth) => {
  await signOut(auth)
   setMessage("you've loged out")
} 

  return (
    <div >
      <Nav />
      <section className='profile'>
      <div className="profile-page ">

      <h1>Welcome Home!</h1>
      <div className="image"><FaUser /></div>
      <p>{email}</p>
      {editMode ? (
        <>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <button onClick={handleUpdate}>Save</button>
        </>
      ) : (
        <>
          <p className="user">{user?.firstName} {user?.lastName}
          {message && <div className={`message `}>{message}</div>}
          <button className="edit" onClick={() => setEditMode(true)}><FaPencilAlt /></button>
          </p>
      <button className="logout" onClick={() => handleSignOut(auth)}>signOut</button>
        </>
      )}
      </div>
      </section>
      <Footer />
    </div>
  );
};

export default Profile;
