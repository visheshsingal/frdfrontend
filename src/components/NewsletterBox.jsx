import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NewsletterBox = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative bg-gradient-to-r from-blue-50 to-white py-12 px-6 rounded-xl shadow-xl overflow-hidden border border-blue-100"
    >
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-100/30"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-blue-100/20"></div>
      
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {subscribed ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
            <p className="text-gray-600">You've been subscribed to our newsletter.</p>
          </motion.div>
        ) : (
          <>
            <motion.h3 
              whileHover={{ scale: 1.02 }}
              className="text-3xl font-bold text-[#052659] mb-3"
            >
              Join Our <span className="text-blue-500">Fitness Community</span>
            </motion.h3>
            
            <p className="text-gray-600 mb-6 text-lg">
              Subscribe now & get <span className="font-bold text-blue-500">20% OFF</span> your first order
            </p>
            
            <motion.form
              onSubmit={onSubmitHandler}
              className="w-full sm:w-3/4 flex flex-col sm:flex-row gap-4 mx-auto"
              whileHover={{ scale: 1.01 }}
            >
              <motion.div className="flex-1 relative" whileTap={{ scale: 0.98 }}>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-300 text-gray-800 bg-white"
                  type="email"
                  placeholder="Your email address"
                  required
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.div>
              
              <motion.button
                type="submit"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 5px 15px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                Subscribe
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </motion.svg>
              </motion.button>
            </motion.form>
            
            <p className="text-gray-500 mt-4 text-sm">
              We'll send you exclusive offers and fitness tips. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default NewsletterBox;
