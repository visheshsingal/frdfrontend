import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useLocation } from 'react-router-dom';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [price, setPrice] = useState(6000);

  const location = useLocation();

  // Read category from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      setMainCategory(cat);
    }
  }, [location.search]);

  const categories = [
    'Protein',
    'Creatine',
    'BCAA',
    'Mass Gainer',
    'Pre Workout',
    'Post Workout',
    'Vitamins'
  ];

  const subCategories = [
    'Popular',
    'Just Launched',
    "Editor's Choice",
    'Trending'
  ];

  const applyFilters = () => {
    let filtered = [...products];

    if (showSearch && search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (mainCategory) {
      filtered = filtered.filter(item => item.category === mainCategory);
    }

    if (subCategory) {
      filtered = filtered.filter(item => item.subCategory === subCategory);
    }

    filtered = filtered.filter(item => {
      const finalPrice = item.discount > 0
        ? Math.round(item.price - (item.price * item.discount) / 100)
        : item.price;
      return finalPrice <= price;
    });

    switch (sortType) {
      case 'low-high':
        filtered.sort((a, b) => {
          const aPrice = a.discount > 0
            ? a.price - (a.price * a.discount) / 100
            : a.price;
          const bPrice = b.discount > 0
            ? b.price - (b.price * b.discount) / 100
            : b.price;
          return aPrice - bPrice;
        });
        break;
      case 'high-low':
        filtered.sort((a, b) => {
          const aPrice = a.discount > 0
            ? a.price - (a.price * a.discount) / 100
            : a.price;
          const bPrice = b.discount > 0
            ? b.price - (b.price * b.discount) / 100
            : b.price;
          return bPrice - aPrice;
        });
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [search, showSearch, products, sortType, mainCategory, subCategory, price]);

  return (
    <div className="px-4 md:px-12 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <Title text1="OUR" text2="PRODUCTS" />
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border-2 border-gray-300 text-sm px-3 py-1 rounded"
        >
          <option value="relevant">Sort by: Relevance</option>
          <option value="low-high">Sort by: Low to High</option>
          <option value="high-low">Sort by: High to Low</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={mainCategory}
          onChange={(e) => setMainCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded"
        >
          <option value="">All Tags</option>
          {subCategories.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <label htmlFor="price" className="text-gray-700 font-medium whitespace-nowrap">
            Max Price: ₹{price}
          </label>
          <input
            id="price"
            type="range"
            min="100"
            max="6000"
            step="100"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-[200px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length ? (
          filteredProducts.map((product) => {
            const finalPrice = product.discount > 0
              ? Math.round(product.price - (product.price * product.discount) / 100)
              : product.price;

            return (
              <ProductItem
                key={product._id}
                id={product._id}
                name={product.name}
                price={finalPrice}
                image={product.image}
                originalPrice={product.price}
                discount={product.discount}
              />
            );
          })
        ) : (
          <p className="text-gray-500 col-span-full">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Collection;
