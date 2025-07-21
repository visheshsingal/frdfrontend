import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import { motion, AnimatePresence } from 'framer-motion'

const banners = [
  {
    image: 'https://i.ibb.co/V0YPHBQ3/1.jpg',
    title: 'Fuel Your Workout',
    desc: 'Maximize energy & endurance with top-rated pre-workout blends.'
  },
  {
    image: 'https://i.ibb.co/nq9FnzQn/2.jpg',
    title: 'Recover Like a Pro',
    desc: 'Specialized formulas for faster recovery & better performance.'
  }
]

const BestSeller = () => {
  const { products } = useContext(ShopContext)
  const [bestSeller, setBestSeller] = useState([])
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    const bestProduct = products.filter(item => item.bestseller)
    setBestSeller(bestProduct.slice(0, 5))
  }, [products])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='my-16 bg-white p-4 rounded shadow'>
      {/* Section Title */}
      <div className='text-center text-3xl text-[#052659] font-bold py-4'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-2'>
          Discover our top-selling gym supplements, trusted by fitness enthusiasts for performance, recovery, and strength.
        </p>
      </div>

      {/* Banner Carousel with Image & Text Below */}
      <div className="w-full max-w-3xl mx-auto overflow-hidden rounded-lg shadow-lg mb-8">
        <div className="relative">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentBanner}
              className="w-full flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={banners[currentBanner].image}
                alt={banners[currentBanner].title}
                className="w-full object-contain"
              />
              <div className="p-4 text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-[#052659]">{banners[currentBanner].title}</h2>
                <p className="text-sm sm:text-base text-gray-700 mt-2">{banners[currentBanner].desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Best Sellers Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {bestSeller.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <ProductItem
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default BestSeller
