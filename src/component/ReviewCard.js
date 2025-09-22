import React from 'react';
import "./review.css"
const ReviewCard = ({ review, product, handleNext, handlePrev, home }) => {
  return (
    <div className="review-card">
      <h4>{review.date}</h4>  
      <div className="client-info">
        <div className="client-name">
          <img src={review.clientImage} alt={review.clientName} loading="lazy" />
          <h3>{review.clientName}</h3>
        </div>
      </div>

      <div className="product-review">
        {product && (
          <div className='review-p'>
            <img src={product.image[0]} alt={product.name} className="product-img" loading="lazy" />
            <p className="product-name">{product.name}</p>
          </div>
        )}
        <p className="stars">
          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
        </p>
        <p className="comment">{review.comment}</p>
      </div>

      {home && (
        <div className="carousel-buttons">
          <button onClick={handlePrev}>←</button>
          <button onClick={handleNext}>→</button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
