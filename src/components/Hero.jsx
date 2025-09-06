import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    title: "Fuel Your Ambition",
    desc: "Premium-grade supplements crafted to power your workout, boost recovery, and elevate performance.",
    image: "https://images.unsplash.com/photo-1595348020949-87cdfbb44174?q=80&w=2070&auto=format&fit=crop",
    cta: "Shop Now",
    link: "/collection",
  },
  {
    title: "Strength Meets Science",
    desc: "From whey protein to creatine, our supplements are engineered for champions — just like you.",
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=2070&auto=format&fit=crop",
    cta: "Explore Protein",
    link: "/collection?category=Protein",
  },
  {
    title: "Recovery. Reload. Repeat.",
    desc: "Faster recovery, better performance — get the amino acids and nutrients your muscles crave.",
    image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2070&auto=format&fit=crop",
    cta: "Browse BCAA",
    link: "/collection?category=BCAA",
  },
];

const categories = [
  { name: 'Protein', image: 'https://invigor8.com/cdn/shop/articles/image_2024-01-23_162306644_782x.png?v=1706023398' },
  { name: 'Creatine', image: 'https://media.istockphoto.com/id/1140109435/photo/close-up-of-man-with-protein-shake-bottle-and-jar.jpg?s=612x612&w=0&k=20&c=vvGGrFax-Ap9e61I261Cm0AvZ7i9__gwbWYjCeR4Gyc=' },
  { name: 'BCAA', image: 'https://riptoned.com/cdn/shop/articles/do-i-need-bcaa-if-i-take-whey-protein-319540.webp?v=1698888285&width=1100' },
  { name: 'Mass Gainer', image: 'https://hips.hearstapps.com/hmg-prod/images/handsome-muscular-male-in-gym-drinking-protein-royalty-free-image-1692269063.jpg?crop=0.670xw:1.00xh;0.261xw,0&resize=1200:*' },
  { name: 'Pre Workout', image: 'https://eliwellnutrition.com/cdn/shop/articles/Things_to_Look_out_for_in_Pre-Workout_Shake_1200x1200.webp?v=1715513822' },
  { name: 'All', image: 'https://www.journee-mondiale.com/en/wp-content/uploads/2024/07/journee-mondiale.com-2024-07-19T235656.734.jpg' },
];

const Hero = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = slides[index];

  return (
    <div className="relative w-full bg-black text-white overflow-hidden">
      {/* Hero Carousel */}
      <div className="relative h-[500px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={current.image}
              alt={current.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative z-10 max-w-4xl px-6 text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 uppercase tracking-wide text-green-500">
                {current.title}
              </h1>
              <p className="text-gray-200 text-lg md:text-xl mb-6">{current.desc}</p>
              <button
                onClick={() => navigate(current.link)}
                className="px-8 py-4 bg-green-500 text-black font-bold rounded-full hover:bg-green-600 transition-colors duration-300 uppercase"
              >
                {current.cta}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 w-full flex justify-center gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full ${i === index ? 'bg-green-500' : 'bg-gray-600'} transition-all`}
            />
          ))}
        </div>
      </div>

      {/* Category Quick Links */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() =>
              navigate(cat.name === 'All' ? '/collection' : `/collection?category=${encodeURIComponent(cat.name)}`)
            }
            className="relative rounded-xl overflow-hidden group transform transition-transform hover:scale-105"
          >
            <img src={cat.image} alt={cat.name} className="w-full h-28 object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-green-500 font-bold text-sm md:text-base tracking-wide uppercase">
                {cat.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
