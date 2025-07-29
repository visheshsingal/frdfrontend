import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { motion } from 'framer-motion';

const BestSeller = () => {
  const { products, currency } = useContext(ShopContext);
  const [justLaunched, setJustLaunched] = useState([]);

  useEffect(() => {
    const filtered = products.filter(item => {
      const sub = item.subCategory;
      if (!sub) return false;
      if (Array.isArray(sub)) {
        return sub.map(s => s.toLowerCase()).includes("just launched");
      }
      return sub.toLowerCase() === "just launched";
    });

    setJustLaunched(filtered.slice(0, 6));
  }, [products]);

  return (
    <div className='my-16 bg-white px-4 py-10 rounded-lg shadow-md border border-blue-50'>
      {/* Section Title */}
      <div className='text-center mb-8'>
        <Title text1={'JUST'} text2={'LAUNCHED'} />
        <p className='w-3/4 md:w-1/2 mx-auto text-sm text-[#052659]/80 mt-2'>
          Discover our newest additions, crafted to fuel your strength and health journey with the latest innovation.
        </p>
      </div>

      {/* Product Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-10 mb-12'>
        {justLaunched.length > 0 ? (
          justLaunched.map((item, index) => (
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
            No 'Just Launched' products found. Check back soon!
          </p>
        )}
      </div>

      {/* Promotional Banner */}
      <motion.div
        className="w-full max-w-5xl mx-auto overflow-hidden rounded-xl shadow-lg border border-blue-100"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          <img
            src="https://sunnyhealthfitness.com/cdn/shop/articles/pre-workout-drink-and-post-workout-drink-for-peak-performance-01_750x.jpg?v=1728586350"
            alt="Just Launched Banner"
            className="w-full object-cover h-60 sm:h-72 lg:h-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#052659]/80 to-transparent"></div>
        </div>
        <div className="p-6 bg-gradient-to-br from-blue-50 to-white text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#052659]">
            Fresh Arrivals, <span className="text-blue-600">Peak Performance</span>
          </h2>
          <p className="text-sm sm:text-base text-[#052659]/90 mt-2">
            New formulas. Better blends. Everything you need to take your fitness to the next level.
          </p>
          <button className="mt-4 px-6 py-2 bg-[#052659] hover:bg-blue-800 text-white font-medium rounded-lg transition-colors duration-300">
            Shop New Arrivals
          </button>
        </div>
      </motion.div>
    </div>
  );
};


export default BestSeller;