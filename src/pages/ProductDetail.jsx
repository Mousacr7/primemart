import { Link, useParams } from 'react-router-dom';
import ProductOptions from '../component/ProductOptions';
import ReviewCard from '../component/ReviewCard';
import Nav from '../component/Nav';
import ProductsList from '../component/ProductsList';
import RatingStars from '../component/Rating';
import "./productDetail.css"
import { FaTruck } from 'react-icons/fa';
import { useGlobal } from '../context/GolbalProvider';
const ProductDetail = () => {
  const {products, reviews} = useGlobal()
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  if (!product) return <p>Product not found</p>;

  // Get all related products in the same subcategory or category
  const sameSubcategory = products.filter(
    (p) => p.subcategory === product.subcategory && p.id !== product.id
  );

  const sameCategory = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  const review = reviews[product.id];

  return (
    <div className="product-detail-page">
      <Nav image={true}/>
    <section>
      <div className='container'>
   <div className="breadcrumb">
  <Link to="/">Home</Link> / 
  <Link to="/products">Products</Link> / 
  <span>{product.name}</span>
</div>

{!product ?  (
  // Skeleton while loading
  <div className="detail-container product-skeleton">
    <div className="skeleton image-skeleton"></div>
    <div className='detail-content'>
      <div className="skeleton text-skeleton title"></div>
      <div className="skeleton text-skeleton price"></div>
      <div className="skeleton text-skeleton desc"></div>
    </div>
  </div>
) :
        (<div className='detail-container fade-in'>
          <div className='image-scroll-wrapper'>
            <div className={`image-scroll ${product.image.length > 2 && "scroll-image"}`}>
            {product.image.map((c, key) => (
              <img key={key} src={c} alt={product.name} />
            ))}
          </div>
        </div>
     <div className='detail-content'>

      <h1>{product.name}</h1>

      <p>{product.description}</p>

       <RatingStars showRate={true} rating={product.rating} />

      <ProductOptions product={product} />
     </div>
        </div>
)}

    <p className="delivery-time">
      <FaTruck />
      Estimated delivery: 3-5 business days
    </p>
 

<div className='review'>

      {review && <ReviewCard review={review} />}
</div>
      </div>
    </section>

      {/* Related by Subcategory */}
      {sameSubcategory.length > 0 && (
   <section>
       <div className="container">
         <div className="content-wrapper">
           <div className="featured-header">
          <h2 className="sub">Similar in {product.subcategory}</h2>
           </div>
          <ProductsList products={sameSubcategory} num={4} />
          </div>
        </div>
    </section>
        
      )}

      {/* Related by Category */}
      {sameCategory.length > 0 && (
     <section>
      <div className="container">
         <div className="content-wrapper">
           <div className="featured-header">
              <h2 className="sub">More from {product.category}</h2>
          </div>
          <ProductsList products={sameCategory} num={4} />

         </div>
       </div>
      </section>
      )}
    </div>
  );
};

export default ProductDetail;
