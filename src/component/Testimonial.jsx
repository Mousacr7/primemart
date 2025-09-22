import { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';
import { useGlobal } from '../context/GolbalProvider';

const TestimonialCarousel = () => {
  const {products, reviews} = useGlobal()
  const [index, setIndex] = useState(0);
  const total = reviews.length;

  useEffect(() => {
  const interval = setInterval(() => {
    setIndex(prev => (prev + 1) % total);
  }, 4000);
  return () => clearInterval(interval);
}, [total]);

const handleNext = () => {
  setIndex(prev => (prev + 1) % total);
};

const handlePrev = () => {
  setIndex(prev => (prev - 1 + total) % total);
};


  const review = reviews[index];
  const product = products.find(p => p.id === review.productId);
const home = true
  return (
  
      <div className="container review">
        <div className="container-header">
          <h1 className="header-title">What Clients Say</h1>
        </div>

        <ReviewCard
          review={review}
          product={product}
          handleNext={handleNext}
          handlePrev={handlePrev}
          home={home}
        />
      </div>
    
  );
};

export default TestimonialCarousel;
