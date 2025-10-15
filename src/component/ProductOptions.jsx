import React, { useState, useMemo } from "react";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { calculateUpdatedPrice } from "./BasePrice";
import { FaTimes } from "react-icons/fa";
import "./productoption.css";

const ProductOptions = ({ product, onClose }) => {
  const [color, setColor]   = useState("white");
  const [size, setSize]     = useState("64GB");
  const [conect, setConect] = useState("usb");
  const [ram, setRam]       = useState("8GB");
  const [qty, setQty]       = useState(1);          // quantity state
  const [message, setMessage] = useState(null);

  const user = auth.currentUser;

  /* ----  price calc with memo  ---- */
  const dynamicProduct = useMemo(
    () => ({ ...product, selectedSize: size, selectedRam: ram }),
    [product, size, ram]
  );
  const price = calculateUpdatedPrice(dynamicProduct);

  /* ----  local cart helper  ---- */
  const updateLocalCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
      (item) =>
        item.id === product.id &&
        item.selectedColor === color &&
        item.selectedSize === size &&
        item.selectedRam === ram &&
        item.selectedConect === conect
    );

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        ...product,
        basePrice: product.basePrice || product.price,
        selectedColor: color,
        selectedSize: size,
        selectedConect: conect,
        selectedRam: ram,
        quantity: qty,          // 🔹 count goes here
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated")); // keep nav badge in-sync
  };

  /* ----  confirm handler  ---- */
  const handleConfirm = () => {
    updateLocalCart();
    setMessage({ type: "success", text: "Item added to cart!" });

    setTimeout(() => {
      setMessage(null);
      if (onClose) onClose();
    }, 800);
  };

  /* ----  early exit for non‑logged in user  ---- */

  /* ---------------------------------------- */
  return (
    <>
    {!user ?   <div className={` option-box ${onClose ? "box" : ""}`}>
        <p className="text-lg text-black">
          You need to&nbsp;
          <Link className="text-lg text-blue-600" to="/login">log in</Link>&nbsp;to select options.
        </p>
      </div>
      :
    
    <div className={`option-box ${onClose ? "box" : ""}`}>
      {onClose && (
        <div className="option-header">
          <h3>Select features for: {product.name}</h3>
          <img src={product.image[0]} alt={product.name} />
        </div>
      )}

      <span>Price: ${price}</span>

      {/* OPTIONS */}
      <div className="options">
        {product.color?.length > 0 && (
          <div className="option">
            <p>Color:</p>
            <div className="option-btn">
              {product.color.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setColor(c)}
                  className={`color ${color === c ? "selected-color" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        )}

        {product.size?.length > 0 && (
          <div className="option">
            <p>Size:</p>
            <div className="option-btn">
              {product.size.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSize(s)}
                  className={size === s ? "selected" : ""}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.ram?.length > 0 && (
          <div className="option">
            <p>RAM:</p>
            <div className="option-btn">
              {product.ram.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setRam(r)}
                  className={ram === r ? "selected" : ""}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.conect?.length > 0 && (
          <div className="option">
            <p>Connect:</p>
            <div className="option-btn">
              {product.conect.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setConect(c)}
                  className={conect === c ? "selected" : ""}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MESSAGE */}
      {message && (
        <div className={!onClose ? "message-top" : ""}>
          <div className={`message ${message.type}`}>{message.text}</div>
        </div>
      )}

      {/* QUANTITY PICKER */}
    <div className="actions">
  <div className="cart-count">
    <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty === 1}>-</button>
    <span>{qty}</span>
    <button onClick={() => setQty(q => q + 1)}>+</button>
  </div>

  <button className="add" onClick={handleConfirm}>ADD TO CART</button>
</div>


      {/* CLOSE BTN (in modal) */}
      {onClose && (
        <button className="close" onClick={onClose}>
          <FaTimes />
        </button>
      )}
    </div>
      }
    </>
  );
};

export default ProductOptions;
