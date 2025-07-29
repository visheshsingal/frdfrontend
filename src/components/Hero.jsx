import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const categories = [
  { name: 'All', image: 'https://www.journee-mondiale.com/en/wp-content/uploads/2024/07/journee-mondiale.com-2024-07-19T235656.734.jpg' },
  { name: 'Protein', image: 'https://invigor8.com/cdn/shop/articles/image_2024-01-23_162306644_782x.png?v=1706023398' },
  { name: 'Creatine', image: 'https://media.istockphoto.com/id/1140109435/photo/close-up-of-man-with-protein-shake-bottle-and-jar.jpg?s=612x612&w=0&k=20&c=vvGGrFax-Ap9e61I261Cm0AvZ7i9__gwbWYjCeR4Gyc=' },
  { name: 'BCAA', image: 'https://riptoned.com/cdn/shop/articles/do-i-need-bcaa-if-i-take-whey-protein-319540.webp?v=1698888285&width=1100' },
  { name: 'Mass Gainer', image: 'https://hips.hearstapps.com/hmg-prod/images/handsome-muscular-male-in-gym-drinking-protein-royalty-free-image-1692269063.jpg?crop=0.670xw:1.00xh;0.261xw,0&resize=1200:*' },
  { name: 'Pre Workout', image: 'https://eliwellnutrition.com/cdn/shop/articles/Things_to_Look_out_for_in_Pre-Workout_Shake_1200x1200.webp?v=1715513822' },
];

const Hero = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    categories.forEach(cat => {
      const img = new Image();
      img.src = cat.image;
    });
  }, []);

  const handleCategoryClick = (cat) => {
    const url = cat === 'All' ? '/collection' : `/collection?category=${encodeURIComponent(cat)}`;
    navigate(url);
  };

  return (
    <div ref={ref} className="relative w-full bg-gradient-to-br from-[#f8fbff] to-blue-50 py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16">

        {/* Text Content */}
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-blue-600 uppercase text-sm font-semibold tracking-widest mb-4">
            Fuel | Perform | Recover
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Unleash Your <span className="text-blue-600">Inner Athlete</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-lg">
            Explore our premium supplements designed to support every stage of your fitness journey — from energy to recovery.
          </p>
          <button
            onClick={() => navigate('/collection')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-all duration-300"
          >
            Browse All Products
          </button>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1595348020949-87cdfbb44174?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Athlete working out"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>

      {/* Category Cards */}
      <div className="max-w-7xl mx-auto px-6 mt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            className="relative rounded-xl overflow-hidden shadow group transform transition-transform hover:scale-105"
          >
            <img src={cat.image} alt={cat.name} className="w-full h-28 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="text-white font-semibold text-sm md:text-base tracking-wide">{cat.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Soft Blur Glow */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full -z-10 blur-3xl opacity-30"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
    </div>
  );
};

export default Hero;
