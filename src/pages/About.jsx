import React from 'react';
import { motion } from 'framer-motion';
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';

const About = () => {
  return (
    <div className="bg-white text-slate-800 overflow-hidden">
      {/* Hero Section */}
      <motion.div
        className="relative w-full h-[60vh] flex items-center justify-center bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src="https://images.pexels.com/photos/2261482/pexels-photo-2261482.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Supplements Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* dark translucent overlay so image stays vibrant but text is readable */}
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <h1 className="relative z-10 text-5xl md:text-6xl font-extrabold tracking-widest text-white">
          ABOUT <span className="text-blue-400">FRD</span>
        </h1>
      </motion.div>

      {/* Dynamic Image Section */}
      <div className="grid grid-cols-2 gap-6 px-6 md:px-20 py-16">
        {[
          'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/791763/pexels-photo-791763.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/7674486/pexels-photo-7674486.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/6453398/pexels-photo-6453398.jpeg?auto=compress&cs=tinysrgb&w=800',
        ].map((src, idx) => (
          <motion.img
            key={idx}
            src={src}
            alt={`Gallery ${idx}`}
            className="rounded-2xl shadow-2xl object-cover w-full h-64 border border-gray-800"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>

      {/* About Content */}
      <div className="px-6 md:px-20 py-8">
        <motion.div
          className="max-w-3xl mx-auto text-lg text-gray-300 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p>
            FRD Nutrition was born with a mission — to empower athletes and
            fitness enthusiasts with premium, science-backed supplements.
          </p>
          <p>
            Our products are designed to fuel your ambition, strength, and
            recovery — trusted by professionals, crafted for everyone aiming
            higher.
          </p>
          <h2 className="text-2xl font-bold text-blue-600">Our Mission</h2>
          <p>
            We’re committed to innovation, quality, and transparency — bringing
            you the best performance nutrition to reach your goals faster,
            safer, and stronger.
          </p>
        </motion.div>
      </div>

      {/* Why Choose Us */}
      <div className="px-6 md:px-20 py-16 bg-gray-50">
        <Title text1="WHY" text2="CHOOSE US" />
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {[
            {
              title: 'Elite Quality',
              desc: 'Meticulously tested formulas for purity and potency — trusted by athletes, for athletes.',
              delay: 0.2,
            },
            {
              title: 'Fast & Easy',
              desc: 'Smooth website experience, secure checkout, and rapid delivery — no compromise.',
              delay: 0.4,
            },
            {
              title: 'Expert Care',
              desc: 'Our support team and fitness experts are always ready to guide your journey.',
              delay: 0.6,
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-8 hover:-translate-y-3 hover:shadow-2xl transition-transform duration-300 border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: card.delay, duration: 0.8 }}
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                {card.title}
              </h3>
              <p className="text-slate-600">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
