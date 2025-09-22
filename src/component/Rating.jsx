import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating , showRate}) => {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;
  const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <div className='rating'>
      {/* Full stars */}
      {[...Array(filledStars)].map((_, i) => (
        <FaStar key={`full-${i}`}  />
      ))}
      {/* Half star */}
      {hasHalfStar && <FaStarHalfAlt  />}
      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} />
      ))}
      {/* Numeric rating */}
      {showRate && (<span >
        {rating.toFixed(1)}
      </span> )}
    </div>
  );
};

export default StarRating;
