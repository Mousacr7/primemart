import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../component/Nav';
import Footer from '../component/Footer';
import Loader from '../component/Loader';
import { auth } from "../firebase";
import "./cart.css";

const getItemKey = (item) =>
  `${item.id}-${item.selectedColor}-${item.selectedSize}-${item.selectedConect}-${item.selectedRam}`;

const getUpdatedPrice = (item) => {
  let basePrice = item.basePrice || item.price;
  let extra = 0;

  if (item.selectedSize === "128GB") extra += 250;
  if (item.selectedSize === "256GB") extra += 500;
  if (item.selectedSize === "32GB") extra -= 200;

  if (item.selectedRam === "16GB") extra += 200;
  if (item.selectedRam === "4GB") extra -= 200;

  return basePrice + extra;
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const withBasePrice = storedCart.map(item => ({
      ...item,
      basePrice: item.basePrice || item.price,
      price: getUpdatedPrice(item)
    }));
    setCartItems(withBasePrice);
    setSelectedItems(withBasePrice.map(getItemKey));
  }, []);

  const updateQuantity = (targetItem, delta) => {
    const updatedCart = cartItems
      .map(item => {
        if (getItemKey(item) === getItemKey(targetItem)) {
          return {
            ...item,
            quantity: Math.max(1, item.quantity + delta),
            price: getUpdatedPrice(item)
          };
        }
        return item;
      });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleSelect = (item) => {
    const key = getItemKey(item);
    setSelectedItems(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const subTotal = cartItems
    .filter(item => selectedItems.includes(getItemKey(item)))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 37.32;
  const tax = 15;
  const total = subTotal + shipping + tax;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoader(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be logged in");

      const token = await user.getIdToken();
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems
            .filter(item => selectedItems.includes(getItemKey(item)))
            .map(item => ({
              id: item.id,
              selectedColor: item.selectedColor,
              selectedSize: item.selectedSize,
              selectedConect: item.selectedConect,
              selectedRam: item.selectedRam,
              quantity: item.quantity,
            }))
        })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe checkout
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Checkout failed");
      setLoader(false);
    }
  };

  return (
    <div className="cart-page">
      <Nav />
      <section>
        {loader && <Loader />}
        {error && <p className="text-red-500">{error}</p>}

        <h2 className="cart-title">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <div className="container">
            <div className="cart-container">
              {cartItems.map(item => {
                const itemKey = getItemKey(item);
                return (
                  <div key={itemKey} className="cart">
                    <input
                    className="checkbox"
                      type="checkbox"
                      checked={selectedItems.includes(itemKey)}
                      onChange={() => handleSelect(item)}
                    />
                    <div className="image">
                      <img onClick={() => navigate(`/product/${item.id}`)} src={item.image[0]} alt={item.name} width={50} />
                    </div>
                    <div className="cart-content">
                      <h4 onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h4>
                      <p>{item.description}</p>
                      <div className="cart-option">
                        <span>{item.selectedColor}</span>/
                        <span>{item.selectedSize}</span>/
                        <span>{item.selectedConect}</span>/
                        <span>{item.selectedRam}</span>
                      </div>
                    </div>
                    <div className="cart-info">
                      <div className="cart-count">
                        <button onClick={() => updateQuantity(item, 1)}>+</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item, -1)}>-</button>
                      </div>
                      <p>${item.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cart-total-box">
             
              <div className='cart-bar'>
              <h3 className='cart-total'>Subtotal: <span>${subTotal.toFixed(2)}</span></h3>
              <h3 className='cart-total'>Shipping: <span>${shipping.toFixed(2)}</span></h3>
              <h3 className='cart-total'>Tax: <span>${tax.toFixed(2)}</span></h3>
              </div>

              <div className='cart-total-bar'>
              <h3 className='cart-total'>Total: <span>${total.toFixed(2)}</span></h3>
            <button 
              onClick={handleCheckout} 
              className="cart-btn" 
              disabled={selectedItems.length === 0 || loader} // ✅ disable if no items or loading
            >
              Proceed to Checkout
            </button>
              </div>

            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default CartPage;
