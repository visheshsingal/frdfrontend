import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { motion } from 'framer-motion';

const LatestCollection = () => {
  const { products, currency } = useContext(ShopContext);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    // Filter products with "Popular" subCategory (handling both string and array cases)
    const popular = products.filter(item => {
      const sub = item.subCategory;
      if (!sub) return false;
      if (Array.isArray(sub)) {
        return sub.map(s => s.toLowerCase()).includes("popular");
      }
      return sub.toLowerCase() === "popular";
    });
    setPopularProducts(popular.slice(0, 12)); // Limit to 12 products
  }, [products]);

  return (
    <div className="my-16 bg-white px-4 py-10 rounded-lg shadow-md border border-blue-50">
      {/* Title Section */}
      <div className="text-center mb-10">
        <Title text1={'POPULAR'} text2={'PRODUCTS'} />
        <p className="w-3/4 md:w-1/2 mx-auto text-sm text-[#052659]/80 mt-3">
          Handpicked health and fitness supplements chosen by our community — high-quality, trusted, and performance-proven.
        </p>
      </div>

      {/* Popular Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
        {popularProducts.length > 0 ? (
          popularProducts.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <ProductItem
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
                currency={currency}
              />
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-[#052659]/70">
            No popular products found. Check back soon!
          </p>
        )}
      </div>

      {/* Health Benefit Banner */}
      <motion.div
        className="w-full max-w-5xl mx-auto overflow-hidden rounded-xl shadow-lg border border-blue-100"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          <img
            src="https://plus.unsplash.com/premium_photo-1664298829781-4d7e2d419fde?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Health Supplements"
            className="w-full object-cover h-60 sm:h-72 lg:h-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#052659]/80 to-transparent"></div>
        </div>
        <div className="p-6 bg-gradient-to-br from-blue-50 to-white text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-[#052659]">
            Your Wellness, <span className="text-blue-600">Our Priority</span>
          </h3>
          <p className="text-sm sm:text-base text-[#052659]/90 mt-2">
            From boosting immunity to enhancing strength, our scientifically formulated health supplements are trusted by thousands.
          </p>
          <button className="mt-4 px-6 py-2 bg-[#052659] hover:bg-blue-800 text-white font-medium rounded-lg transition-colors duration-300">
            Shop Popular Products
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LatestCollection;