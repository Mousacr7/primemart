import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProductsList from '../component/ProductsList';
import Nav from '../component/Nav';
import './filters.css';
import { useGlobal } from '../context/GolbalProvider';
import Footer from '../component/Footer';

const Products = () => {
  const {products} = useGlobal();
  const location = useLocation();
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categories = {
    Tech: { label: 'Tech', icon: '📱', subs: ['Smartphones', 'Earbuds', 'Keyboards'] },
    Fashion: { label: 'Fashion', icon: '🧥', subs: ['Shoes', 'Clothes', 'Accessories'] },
    Home: { label: 'Home', icon: '🏠', subs: ['Kitchen', 'Decor', 'Furniture'] }
  };

  useEffect(() => {
    if (location.state?.subcategory) setSubCategory(location.state.subcategory);
    if (location.state?.searchTerm) setSearchTerm(location.state.searchTerm);
  }, [location.state]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest('.subcategory-menu')
      ) {
        setCategory('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = products.filter((product) => {
    const matchCategory = category ? product.category === category : true;
    const matchSub = subCategory ? product.subcategory === subCategory : true;
    const matchSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subcategory?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchCategory && matchSub && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className=''>
   <div className='page'>

      <Nav />

      {/* Mobile Controls */}
      <div className="mobile-controls">
        <button
          aria-label="Toggle filters"
          onClick={() => {
            setMobileFilterOpen(!mobileFilterOpen);
            setMobileSortOpen(false);
          }}
        >
          ☰ Filters
        </button>
        <div className='sort-dropdown'>
        <button className='toggle-sort'
          aria-label="Toggle sort"
          onClick={() => {
            setMobileSortOpen(!mobileSortOpen);
            setMobileFilterOpen(false);
          }}
        >
          ⇅ Sort
        </button>

    <ul className={`sort-mobile ${!mobileSortOpen ? 'open' : ''}`}>
      <li
        className={sortOrder === 'asc' ? 'active-sub' : ''}
        onClick={() => {
          setSortOrder('asc');
          setMobileSortOpen(false);
        }}
      >
        🔼 Low to High
      </li>
      <li
        className={sortOrder === 'desc' ? 'active-sub' : ''}
        onClick={() => {
          setSortOrder('desc');
          setMobileSortOpen(false);
        }}
      >
        🔽 High to Low
      </li>
    </ul>

</div>
      </div>

      {/* Filter & Sort Bars */}
      <div className="filter">
        <div className={`filter-sort-bar ${mobileFilterOpen ? 'open' : ''}`} ref={dropdownRef}>
          <div className="categories">
            {Object.entries(categories).map(([key, cat]) => (
              <div className="category-dropdown" key={key}>
                <button
                  className={`filter-btn ${category === key ? 'active-btn' : ''}`}
                  onClick={() => {
                    setCategory(category === key ? '' : key);
                    setSubCategory('');
                  }}
                  title={`Filter by ${cat.label}`}
                >
                  {cat.icon} {cat.label}
                </button>
                {category === key && (
                  <ul className="subcategory-menu">
                    {cat.subs.map((sub) => (
                      <li
                        key={sub}
                        className={subCategory === sub ? 'active-sub' : ''}
                        onClick={() => {
                          setSubCategory(sub);
                          setMobileFilterOpen(false);
                        }}
                      >
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <button
              className="filter-btn clear-btn"
              onClick={() => {
                setCategory('');
                setSubCategory('');
                setSearchTerm('');
                setSortOrder('');
                setMobileFilterOpen(false);
                setMobileSortOpen(false);
              }}
              title="Clear all filters"
            >
              🧹 Clear All
            </button>
          </div>
        </div>

  {/* Sort Button (Desktop & Mobile) */}
<div >
    <ul className="sort-list">
      <li
        className={sortOrder === 'asc' ? 'active-sub' : ''}
        onClick={() => {
          setSortOrder('asc');
          
        }}
      >
        🔼 Low to High
      </li>
      <li
        className={sortOrder === 'desc' ? 'active-sub' : ''}
        onClick={() => {
          setSortOrder('desc');
          
        }}
        >
        🔽 High to Low
      </li>
    </ul>

</div>


      </div>

      {/* Summary */}
      <div className={`summary-bar ${mobileFilterOpen  && "summary"}`}>
        <span>{sorted.length} Products Found</span>
        {category && <span>📁 {category}</span>}
        {subCategory && <span>🔸 {subCategory}</span>}
        {searchTerm && <span>🔍 {searchTerm}</span>}
        {sortOrder && <span>↕ {sortOrder === 'asc' ? 'Low → High' : 'High → Low'}</span>}
      </div>

      <ProductsList products={sorted} num={8} />
    
        </div>
    <Footer />
    </div>
  );
};

export default Products;
