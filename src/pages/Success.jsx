import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cart on success
    localStorage.removeItem('cart');

    // Redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '1rem',
      backgroundColor: '#f0fff0' // light greenish background
    }}>
      <div style={{
        fontSize: '4rem',
        color: 'green',
        marginBottom: '1rem'
      }}>
        &#10004; {/* This is a ✓ checkmark */}
      </div>
      <h1 style={{ color: 'green', marginBottom: '0.5rem' }}>Success!</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
        Thank you for your purchase.
      </p>
      <p style={{ color: '#555' }}>
        You will be redirected to the homepage in 5 seconds...
      </p>
    </div>
  );
}

export default SuccessPage;
