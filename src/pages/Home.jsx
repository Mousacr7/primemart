import React from 'react'
import Nav from '../component/Nav'
import FeaturedProducts from '../component/FeaturedProducts'
import TestimonialCarousel from '../component/Testimonial'
import Footer from '../component/Footer'
import { FaShoppingBag } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useGlobal } from '../context/GolbalProvider'


const Home = () => {
    const navigate = useNavigate();
  const {products } = useGlobal();
    // ✅ Get first product for each unique subcategory
    const firstProductsBySub = new Map();
    products.forEach((product) => {
      if (product.subcategory && !firstProductsBySub.has(product.subcategory)) {
        firstProductsBySub.set(product.subcategory, product);
      }
    });
  
  return (
    <>
      <header>
      <Nav />

<section className="hero">
  <div className="hero-image-wrapper mt-11 pt-3">
    <picture>
      {/* <!-- Mobile first --> */}
      <source media="(min-width: 768px)" srcSet="https://lkdcpkdsyznswcdohwvs.supabase.co/storage/v1/object/public/primemart/hero-desktop.webp"fetchpriority="high" />
      <img src="https://lkdcpkdsyznswcdohwvs.supabase.co/storage/v1/object/public/primemart/hero-mobile.webp" alt="Tech products display" className="hero-img" fetchpriority="high" />
    </picture>
  </div>

  <div className="hero-content">
    <h1 className='text-4xl'>Level Up <br />Your Tech Game</h1>
    <p>Premium accessories for phones, AirPods & more.</p>
    <div className="hero-buttons">
      <button onClick={() =>
          navigate("/products")} className="btn primary flex justify-center gap-2 ">Shop Now <FaShoppingBag className='mt-1 '/></button>
    </div>
  </div>
</section>


      </header>
      <main className="page">
          {/* ✅ Subcategory buttons with image */}
<section className="subcategory">
  <ul className="subcategory-list">
    {Array.from(firstProductsBySub.entries()).map(([sub, product]) => (
      <li
        key={sub}
        className="sub-btn"
        onClick={() =>
          navigate("/products", { state: { subcategory: sub } })
        }
      >
        <img
          src={product.image[0]}
          alt={product.name}
          className="sub-thumb"
          loading="lazy"
        />
        <span>{sub}</span>
      </li>
    ))}
  </ul>
</section>

      <FeaturedProducts />
      <TestimonialCarousel />
      </main>
      <Footer />
    </>
  )
}

export default Home
