import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import { motion } from 'framer-motion'

const LatestCollection = () => {
  const { products } = useContext(ShopContext)
  const [latestProducts, setLatestProducts] = useState([])

  useEffect(() => {
    setLatestProducts(products.slice(0, 10))
  }, [products])

  return (
    <div className="my-16">
      {/* Title */}
      <div className="text-center py-8">
        <Title text1={'LATEST'} text2={'COLLECTIONS'} />
        <p className="w-3/4 md:w-1/2 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Explore our latest range of premium supplements designed for athletes and fitness enthusiasts. Quality you can trust.
        </p>
      </div>

      {/* Feature Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div
          className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition duration-300"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <img
            src="https://images.pexels.com/photos/1390403/pexels-photo-1390403.jpeg"
            alt="Natural Ingredients"
            className="h-52 w-full object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Your Daily Edge</h3>
            <p className="text-gray-600 text-sm">
            Made to fit your active lifestyle, our supplements help you stay energized, recover faster, and perform at your best — whenever life demands more.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition duration-300"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <img
            src="https://images.pexels.com/photos/33060540/pexels-photo-33060540.jpeg"
            alt="Performance Boost"
            className="h-52 w-full object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Engineered for Performance</h3>
            <p className="text-gray-600 text-sm">
              Designed for athletes seeking real impact — faster recovery, improved endurance, and noticeable strength gains. Formulated with cutting-edge research in mind.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition duration-300"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <img
            src="https://images.pexels.com/photos/9845424/pexels-photo-9845424.jpeg"
            alt="Safe & Certified"
            className="h-52 w-full object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Tested, Trusted & Certified</h3>
            <p className="text-gray-600 text-sm">
              Every product undergoes rigorous quality testing to ensure safety, purity, and effectiveness. Certified by industry standards — your health is our priority.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Latest Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  )
}

export default LatestCollection
