import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BestSeller = () => {
  const { products, currency } = useContext(ShopContext);
  const [justLaunched, setJustLaunched] = useState([]);
  const navigate = useNavigate();

  // Moving images for the banner
  const movingImages = [
    'https://sunnyhealthfitness.com/cdn/shop/articles/pre-workout-drink-and-post-workout-drink-for-peak-performance-01_750x.jpg?v=1728586350',
    'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % movingImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [movingImages.length]);

  useEffect(() => {
    const filtered = products.filter(item => {
      const sub = item.subCategory;
      if (!sub) return false;
      if (Array.isArray(sub)) {
        return sub.map(s => s.toLowerCase()).includes("just launched");
      }
      return sub.toLowerCase() === "just launched";
    });

    setJustLaunched(filtered.slice(0, 10));
  }, [products]);

  // Function to handle navigation with scroll to top
  const handleNavigation = (path) => {
    navigate(path);
    // Scroll to top after navigation
    window.scrollTo(0, 0);
  };

  return (
    <div className='my-20 bg-[#0B0C10] text-white px-4 py-14 rounded-xl shadow-xl border border-gray-800'>
      {/* Section Title */}
      <div className='text-center mb-14'>
        <Title text1={'JUST'} text2={'LAUNCHED'} />
        <p className='w-3/4 md:w-1/2 mx-auto text-sm text-gray-300 mt-4'>
          Discover our newest additions, crafted to fuel your strength and health journey with the latest innovation.
        </p>
      </div>

      {/* Product Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16'>
        {justLaunched.length > 0 ? (
          justLaunched.map((item, index) => {
            const hasDiscount = item.discount && item.discount > 0;
            const discountedPrice = hasDiscount
              ? Math.round(item.price - (item.price * item.discount / 100))
              : item.price;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
                className="hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-[#1F2833] rounded-xl p-4 border border-gray-700 cursor-pointer"
                onClick={() => handleNavigation(`/product/${item._id}`)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-contain mb-3 rounded"
                  loading="lazy"
                />
                <h4 className="text-sm font-semibold text-white line-clamp-2">
                  {item.name}
                </h4>
                <div className="mt-2">
                  {hasDiscount ? (
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 font-bold text-sm">
                        {currency} {discountedPrice}
                      </span>
                      <span className="line-through text-gray-500 text-xs">
                        {currency} {item.price}
                      </span>
                      <span className="text-red-400 text-xs font-semibold">
                        -{item.discount}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-green-400 font-bold text-sm">
                      {currency} {item.price}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No 'Just Launched' products found. Check back soon!
          </p>
        )}
      </div>

      {/* Promotional Banner with moving images */}
      <motion.div
        className="w-full max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-2xl border border-gray-700"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          <motion.img
            key={currentImageIndex}
            src={movingImages[currentImageIndex]}
            alt="Just Launched Supplements"
            className="w-full object-cover h-72 sm:h-80 lg:h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
            <div>
              <motion.h3 
                className="text-2xl sm:text-3xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Fresh Arrivals, <span className="text-green-400">Peak Performance</span>
              </motion.h3>
              <motion.p 
                className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                New formulas. Better blends. Everything you need to take your fitness to the next level.
              </motion.p>
              {/* <motion.button
                onClick={() => handleNavigation('/collection?subCategory=Just%20Launched')}
                className="mt-6 px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition-colors duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(72, 187, 120, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Shop New Arrivals
              </motion.button> */}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BestSeller;