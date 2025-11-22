import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const staticSlides = [
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
  const { backendUrl } = useContext(ShopContext);
  const [slides, setSlides] = useState(staticSlides);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        if (!backendUrl) return;
        const res = await axios.get(`${backendUrl}/api/banner/list`);
        if (res.data.success && res.data.banners?.length > 0) {
          const mapped = res.data.banners.map(b => ({
            title: b.title || '',
            desc: '',
            image: b.image,
            cta: 'Shop Now',
            link: b.link || '/'
          }));
          setSlides(mapped);
          setIndex(0);
        }
      } catch (e) {
        // keep static
      }
    };
    fetchBanners();
  }, [backendUrl]);

  const current = slides[index % slides.length];

  const handleClick = (link) => {
    if (!link) return;
    const l = String(link).trim();
    if (/^https?:\/\//i.test(l)) return window.open(l, '_blank');
    if (l.startsWith('/')) return navigate(l);
    if (/^[0-9a-fA-F]{24}$/.test(l)) return navigate(`/product/${l}`);
    if (l.includes('/product/')) return navigate(l);
    if (l.includes('.') && !l.includes(' ')) return window.open(`https://${l}`, '_blank');
    navigate(l);
  };

  return (
    <>
      {/* HERO BANNER */}
      <div className="relative w-full overflow-hidden">

        {/* Mobile: Full image without crop */}
        <div className="block md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              onClick={() => handleClick(current.link)}
              className="cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-auto object-contain block"
                loading="eager"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop: Full screen */}
        <div className="hidden md:block h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              onClick={() => handleClick(current.link)}
              className="absolute inset-0 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === index ? 'bg-blue-600' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>

      {/* CATEGORIES — ZERO GAP GUARANTEED */}
      <div className="w-full bg-white -mb-1">
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() =>
                  navigate(cat.name === 'All' ? '/collection' : `/collection?category=${encodeURIComponent(cat.name)}`)
                }
                className="relative rounded-xl overflow-hidden group transform transition-transform hover:scale-105"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-28 md:h-32 object-cover brightness-75 group-hover:brightness-90 transition-all"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-bold text-sm md:text-base tracking-wide uppercase drop-shadow-md px-1 text-center">
                    {cat.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ab tera next section (FeaturedProducts, etc) bilkul chipak ke aayega! */}
    </>
  );
};

export default Hero;