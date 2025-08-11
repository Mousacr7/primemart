import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../component/Nav'
import "./cart.css"
import Loader from '../component/Loader';


const getItemKey = (item) =>
  `${item.id}-${item.selectedColor}-${item.selectedSize}-${item.selectedConect}-${item.selectedRam}`;

const getUpdatedPrice = (item) => {
    let basePrice = item.basePrice || item.price; // use basePrice to keep original
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
  const [loader, setLoader] = useState(false)
  
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

    // Attach basePrice to preserve original
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
      const isMatch = getItemKey(item) === getItemKey(targetItem);
      if (isMatch) {
        const updatedItem = {
          ...item,
          quantity: item.quantity + delta,
          price: getUpdatedPrice(item) // recalculate price
        };
        return updatedItem;
      }
      return item;
    })
    .filter(item => item.quantity > 0);
    
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
     window.dispatchEvent(new Event("cartUpdated")); // keep nav badge in-sync
    setSelectedItems(prev =>
      updatedCart.map(getItemKey).filter(key => prev.includes(key))
    );
  };
  
  const handleSelect = (item) => {
    const key = getItemKey(item);
    setSelectedItems(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };
  
  const total = cartItems
  .filter(item => selectedItems.includes(getItemKey(item)))
  .reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  
 useEffect(() => {
  const count = cartItems
    .filter(item => selectedItems.includes(getItemKey(item)))
    .reduce((sum, item) => sum + item.quantity, 0);

  localStorage.setItem('cartCount', count);
}, [cartItems, selectedItems]);

const navigate = useNavigate()

  const handleCheckout = async (e) => {
  e.preventDefault(); // stop page refresh
setLoader(true)
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const res = await fetch("https://primemartbackend-932n.onrender.com/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: cart.map(item => ({
        id: item.id,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        selectedConect: item.selectedConect,
        selectedRam: item.selectedRam,
        quantity: item.quantity
      }))
    })
  });

  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
    setLoader(false)
  }
};

  return (
    <div className='cart-page'>
      <Nav />
    <section>
      {loader && <Loader />}
   
      <h2 className="cart-title">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          <div className='container'>
          <div className='cart-container'>
            {cartItems.map((item) => {
              const itemKey = getItemKey(item);
              return (
                <div key={itemKey} className='cart' >
                  

                  <input
                    type="checkbox"
                    id={`select-${itemKey}`}              
                className={`custom-checkbox ${selectedItems.includes(itemKey) ? 'checked' : ''}`}
                checked={selectedItems.includes(itemKey)}
                onChange={() => handleSelect(item)}
                  />

                  <div className='image'>
                  <img  onClick={() => navigate(`/product/${item.id}`)} src={item.image[0]} alt={item.name} width={50} />
                  </div>
                  
                  <div className="cart-content">
                    <div className='cart-header'>
                    <h4   onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h4>
                    <p>{item.description}</p>
                    </div>
                    <div className='cart-option'>
                    <h4>{item.selectedColor}/</h4>
                    <h4>{item.selectedSize}/</h4>
                    <h4>{item.selectedConect}/</h4>
                    <h4>{item.selectedRam}</h4>
                    </div>

                    <div className='cart-info'>
                    <p>Price: ${item.price}</p>
                    <div className='cart-count'>
                    <button onClick={() => updateQuantity(item, 1)}>+</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item, -1)}>{item.quantity === 1 ? "🗑️":"-"}</button>
                    </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
         <div className="cart-total-bar">
    <h3>Total: ${total.toFixed(2)}</h3>
  </div>
          </div>
        </>
      )}
      <form style={{padding:"3rem"}} onSubmit={handleCheckout}>
  <button type="submit">Proceed to Checkout</button>
</form>

     </section>
    </div>
  );
};
export default CartPage;
