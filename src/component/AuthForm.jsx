import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import "./Form.css"

const AuthForm = ({
  type,
  email, password, confirmPassword,
  firstName, lastName,
  setEmail, setPassword, setConfirmPassword,
  setFirstName, setLastName,
  handleSubmit,loading,error,success
}) => {
  return (
    <>
    <Helmet>
  <title>{type === 'register' ? 'Register – My Shop' : 'Log In – My Shop'}</title>
  <meta
    name="description"
    content={type === 'register'
      ? 'Create an account to shop the best electronics, fashion, and home products at My Shop.'
      : 'Login to My Shop and access your cart, profile, and order history easily.'}
  />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content={type === 'register' ? 'Register – My Shop' : 'Log In – My Shop'} />
  <meta property="og:description" content={type === 'register'
    ? 'Create an account to shop the best electronics, fashion, and home products at My Shop.'
    : 'Login to My Shop and access your cart, profile, and order history easily.'} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://yourshopdomain.com/login-or-register" />
  <meta property="og:image" content="https://yourshopdomain.com/images/banner.jpg" />
</Helmet>

<form onSubmit={handleSubmit} className="auth-form-wrapper">
  <div className="auth-form">
    <h2>{type === 'register' ? "Sign Up" : "Sign In"}</h2>
 {error &&
  <p className="message error" aria-live="polite">{error}</p>}
      {success && <p className="message success" aria-live="polite">{success}</p>}
    {type === "register" && (
      <>
        <div className="input-group">
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder=" "
          />
          <label htmlFor="firstName">First Name</label>
        </div>

        <div className="input-group">
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder=" "
          />
          <label htmlFor="lastName">Last Name</label>
        </div>
      </>
    )}

    <div className="input-group">
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder=" "
      />
      <label htmlFor="email">Email</label>
    </div>

    <div className="input-group">
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder=" "
      />
      <label htmlFor="password">Password</label>
    </div>

    {type === "register" && (
      <div className="input-group">
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder=" "
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
      </div>
    )}

    {type === "login" && (
      <p><Link to="/forgetpassword">Forgot Password?</Link></p>
    )}

    <button type="submit" disabled={loading}>
      {loading ? "Processing..." : type === "register" ? "Sign Up" : "Sign In"}
    </button>

    <p>
      {type === "login" ? (
        <>Don't have an account? <Link to="/signin">Register</Link></>
      ) : (
        <>Already have an account? <Link to="/login">Log In</Link></>
      )}
    </p>
  </div>
</form>

    </>
  );
};

export default AuthForm;
