import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductOptions from './ProductOptions';
import { FaCartPlus } from "react-icons/fa";
import StarRating from './Rating';

const ProductsList = ({ products ,num }) => {
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); // control the open panel
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleOptionSelect = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="products">
      {loading
        ? Array(num).fill(0).map((_, idx) => (<div className='item'>
            <div key={idx} className="load-1 skeleton"></div>
              <div className='load-2 skeleton'></div>
              <div className='load-3 skeleton'></div>
        </div>
          ))
        : products.map((product) => (
            <div className="item" key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
              <div className="image">
                <img src={product.image[0]} alt={product.name} loading="lazy" />
                
              </div>
              <div className="product-detail">
                <h2>{product.name}</h2>
                <StarRating rating={product.rating}/>
              <span>${product.price.toFixed(2)}</span>
              </div>
              <button
                className="add-to-cart"
                title="Add to cart"
                onClick={(e) => {
                  e.stopPropagation(); // stop navigation
                  handleOptionSelect(product); // open option panel
                }}
              >
               <FaCartPlus />
              </button>
            </div>
          ))}

      {/* Sidebar/Panel - shown if a product is selected */}
      {selectedProduct && (
        <>
        <div className="options-panel" onClick={() => setSelectedProduct(null)}>
          </div>
          <ProductOptions
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
          </>
      )}
      </div>

  );
};

export default ProductsList;
