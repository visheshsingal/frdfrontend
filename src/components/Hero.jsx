import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Hero = () => {
  const navigate = useNavigate()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  useEffect(() => {
    const preload = new Image()
    preload.src = "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg"
  }, [])

  return (
    <div ref={ref} className="relative w-full bg-gradient-to-br from-white to-blue-50 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center justify-between gap-16">

        {/* Text Content */}
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-blue-600 uppercase text-sm font-semibold tracking-widest mb-4">
            Train Smart. Recover Faster.
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Performance <span className="text-blue-600">Redefined</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Power your body with clean, effective supplements designed for real results.
          </p>
          <button
            onClick={() => navigate('/collection')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-all duration-300"
          >
            Explore Products
          </button>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="w-full h-96 lg:h-[480px] rounded-xl overflow-hidden shadow-xl">
            <img
              className="w-full h-full object-cover"
              src="https://images.pexels.com/photos/30931850/pexels-photo-30931850.jpeg"
              alt="Athlete working out"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>

      {/* Soft Blue Shape */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full -z-10 blur-2xl opacity-30"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
    </div>
  )
}

export default Hero
