import React, { useContext, useEffect, useState, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LatestCollection = () => {
  const { products = [], currency } = useContext(ShopContext);
  const [popularProducts, setPopularProducts] = useState([]);
  const navigate = useNavigate();

  // Moving banner images (hardcoded)
  const movingImages = [
    'https://images.pexels.com/photos/13534122/pexels-photo-13534122.jpeg',
    'https://images.pexels.com/photos/12314077/pexels-photo-12314077.jpeg',
    'https://images.pexels.com/photos/7690207/pexels-photo-7690207.jpeg',
    'https://images.pexels.com/photos/5929236/pexels-photo-5929236.jpeg'
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Banner image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % movingImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [movingImages.length]);

  // ---------- Helpers ----------
  const toArray = (v) => (Array.isArray(v) ? v : v != null ? [v] : []);
  const norm = (s) => String(s).toLowerCase();
  const hasPopular = (val) => toArray(val).some((v) => norm(v).includes('popular'));
  const isPopularProduct = (item) =>
    hasPopular(item?.subCategory) ||
    hasPopular(item?.category) ||
    hasPopular(item?.tags) ||
    hasPopular(item?.labels) ||
    hasPopular(item?.badges) ||
    item?.isPopular === true ||
    item?.popular === true;

  const safeNum = (n, fallback = 0) => {
    const x = typeof n === 'string' ? parseFloat(n) : n;
    return Number.isFinite(x) ? x : fallback;
  };

  // ---------- Compute popular products ----------
  const computedPopular = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    let list = products.filter(isPopularProduct);

    if (list.length === 0) {
      const scored = [...products].map((p) => ({
        item: p,
        score:
          safeNum(p.sold) * 3 +
          safeNum(p.sales) * 3 +
          safeNum(p.rating) * 2 +
          safeNum(p.reviews) * 1,
      }));
      scored.sort((a, b) => b.score - a.score);
      list = scored.map((s) => s.item);
    }

    return list.slice(0, 10);
  }, [products]);

  useEffect(() => {
    setPopularProducts(computedPopular);
  }, [computedPopular]);

  // Navigate to product page
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const formatPrice = (price) => safeNum(price).toFixed(2);

  // ---------- Render ----------
  return (
    <div className="my-20 bg-white text-slate-800 px-4 py-14 rounded-xl shadow-xl border border-gray-200">
      
      {/* Title */}
      <div className="text-center mb-14">
        <Title text1="POPULAR" text2="SUPPLEMENTS" />
        <p className="w-3/4 md:w-1/2 mx-auto text-sm text-slate-600 mt-4">
          Trusted by athletes and fitness enthusiasts — explore our most popular, performance-boosting supplements.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
        {popularProducts.length > 0 ? (
          popularProducts.map((item, index) => {
            const price = safeNum(item?.price);
            const discount = safeNum(item?.discount);
            const hasDiscount = discount > 0;
            const discountedPrice = hasDiscount ? price - (price * discount) / 100 : price;

            return (
              <motion.div
                key={item?._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
                className="hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-gray-50 rounded-xl p-4 border border-gray-200 cursor-pointer"
                onClick={() => handleNavigation(`/product/${item._id}`)}
              >
                <img
                  src={item?.image?.[0] || 'https://images.pexels.com/photos/7674485/pexels-photo-7674485.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                  alt={item?.name || 'Supplement'}
                  className="w-full h-40 object-cover mb-3 rounded"
                  loading="lazy"
                />
                <h4 className="text-sm font-semibold text-slate-800 line-clamp-2">
                  {item?.name || 'Popular Supplement'}
                </h4>

                <div className="mt-2">
                  {hasDiscount ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-blue-600 font-bold text-sm">
                        {currency} {formatPrice(discountedPrice)}
                      </span>
                      <span className="line-through text-gray-500 text-xs">
                        {currency} {formatPrice(price)}
                      </span>
                      <span className="text-red-400 text-xs font-semibold">
                        -{discount}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-blue-600 font-bold text-sm">
                      {currency} {formatPrice(price)}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-slate-600">
            Loading popular supplements...
          </p>
        )}
      </div>

      {/* Moving Banner */}
      <motion.div
        className="w-full max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-2xl border border-gray-200"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          <motion.img
            key={currentImageIndex}
            src={movingImages[currentImageIndex]}
            alt="Popular Supplements"
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
                className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Fuel Your <span className="text-blue-600 font-extrabold drop-shadow">Performance</span>
              </motion.h3>
              <motion.p 
                className="text-sm sm:text-base text-white/90 drop-shadow max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Premium formulas, tested for quality — crafted to power your goals, every single day.
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default LatestCollection;
