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
    const img = new Image()
    img.src = "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg"
  }, [])

  return (
    <div ref={ref} className="relative w-full h-screen overflow-hidden bg-gray-100">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/3112004/pexels-photo-3112004.jpeg)`,
          backgroundAttachment: 'fixed'
        }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </motion.div>

      {/* Content */}
      <div className="relative h-full w-full flex items-center justify-center px-4 md:px-8 xl:px-16">
<div className="w-full flex flex-col lg:flex-row items-center gap-8 px-4 md:px-8">
          {/* Text */}
          <motion.div
            className="w-full lg:w-1/2 text-white z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="w-10 h-[2px] bg-white"></div>
              <p className="font-medium text-sm tracking-wider text-white">
                FOR ATHLETES & GYM LOVERS
              </p>
            </motion.div>
            <motion.h1
  className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-white"
  initial={{ opacity: 0, y: 20 }}
  animate={inView ? { opacity: 1, y: 0 } : {}}
  transition={{ delay: 0.4, duration: 0.8 }}
>
  Power Your <br />
  <span className="inline-block bg-white/80 px-4 py-2 rounded-md shadow-md text-[#052659]">
    Performance
  </span>
</motion.h1>


            <motion.p
              className="text-lg sm:text-xl text-gray-200 mb-8 max-w-lg"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Premium supplements engineered to fuel your workouts and accelerate recovery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <button
                onClick={() => navigate('/collection')}
                className="relative overflow-hidden group px-8 py-3 bg-[#052659] text-white font-medium rounded-md hover:bg-[#031e47] transition-all duration-300"
              >
                <span className="relative z-10">SHOP NOW</span>
                <span className="absolute inset-0 bg-[#031e47] origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-0"></span>
              </button>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="hidden lg:block lg:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src="https://images.pexels.com/photos/28080/pexels-photo.jpg"
                alt="Athlete lifting weights"
                loading="eager"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="animate-bounce w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white rounded-full mt-2"></div>
        </div>
      </motion.div>
    </div>
  )
}

export default Hero
