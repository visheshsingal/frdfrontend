import React from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const OurPolicy = () => {
  const policies = [
    {
      icon: assets.quality_icon,
      title: "Quality Guarantee",
      description: "We deliver only the best quality products",
      delay: 0
    },
    {
      icon: assets.cart_icon,
      title: "Fast Delivery",
      description: "Quick and reliable delivery to your doorstep",
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
    <div className="py-16 bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12 text-blue-600"
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
              className="flex flex-col items-center p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-600 transition-colors duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: policy.delay }}
            >
              {/* Icon container */}
              <div className={policy.title === '7 Days Returns' ? "mb-4 p-3 bg-black rounded-full transition-colors duration-300" : "mb-4 p-3 bg-gray-100 rounded-full group-hover:bg-blue-400/10 transition-colors duration-300"}>
                {policy.title === '7 Days Returns' ? (
                  // render a white tick icon so it appears clearly on the black circular background
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <img
                    src={policy.icon}
                    className={policy.title === '24/7 Support' ? "w-8 h-8 filter brightness-0 transition-all duration-300" : "w-10 h-10 transition-all duration-300"}
                    alt={policy.title}
                  />
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-slate-800 mb-2 text-center">
                {policy.title}
              </h3>
              
              <p className="text-slate-600 text-sm text-center">
                {policy.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Additional note */}
        <motion.div 
          className="text-center mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-slate-600 text-sm">
            Your satisfaction is our priority. We stand behind every product we sell.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OurPolicy;