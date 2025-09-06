import React from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const OurPolicy = () => {
  const policies = [
    {
      icon: assets.exchange_icon,
      title: "Easy Exchange",
      description: "Hassle-free exchange on all orders",
      delay: 0
    },
    {
      icon: assets.quality_icon,
      title: "7 Days Returns",
      description: "Free returns within 7 days",
      delay: 0.1
    },
    {
      icon: assets.support_img,
      title: "24/7 Support",
      description: "We're here anytime you need us",
      delay: 0.2
    }
  ];

  return (
    <div className="py-16 bg-black border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12 text-green-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Policies
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-green-400 transition-colors duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: policy.delay }}
            >
              {/* Icon container */}
              <div className="mb-4 p-3 bg-gray-800 rounded-full group-hover:bg-green-400/10 transition-colors duration-300">
                <img 
                  src={policy.icon} 
                  className="w-8 h-8 filter invert brightness-0 group-hover:brightness-100 group-hover:invert-0 transition-all duration-300" 
                  alt={policy.title}
                />
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2 text-center">
                {policy.title}
              </h3>
              
              <p className="text-gray-400 text-sm text-center">
                {policy.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Additional note */}
        <motion.div 
          className="text-center mt-12 p-6 bg-gray-900 rounded-xl border border-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-gray-400 text-sm">
            Your satisfaction is our priority. We stand behind every product we sell.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OurPolicy;