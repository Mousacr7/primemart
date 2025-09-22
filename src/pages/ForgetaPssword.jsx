import React, { useEffect, useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import Loader from '../component/Loader';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState('');

  useEffect(()=> {
    if(message) {
      
    const timer = setTimeout(() => setMessage(null), 5000);
    
    return () => clearTimeout(timer);
  }
}, [message])
  

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setLoader(true)
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent!');
      setLoader(false)
    } catch (error) {
      setMessage(error.message);
      setLoader(false)
    }
  };

  return (
    <div className='auth-form-wrapper'>
      {loader && <Loader />}
    <form className='auth-form' onSubmit={handleForgetPassword}>
    {message &&
  <p className="message succes" aria-live="polite">{message}</p>}
   
     <h2>Forget your password</h2>

     <div className='input-group'>
      <input
        id='email'
        type='email'
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete='email'
        placeholder=' '
      />
      <label htmlFor='email'>Enter your email</label>
     </div>
      <button type='submit'>Reset Password</button>
      <>Remember your password <Link to="/login">Log In</Link></>
    </form>
    </div>
  );
};

export default ForgetPassword;
