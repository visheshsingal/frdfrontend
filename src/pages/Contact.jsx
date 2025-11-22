import React from 'react';
import { motion } from 'framer-motion';
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';

const Contact = () => {
  return (
    <div className="bg-white text-slate-800 overflow-hidden">
      {/* Hero Banner */}
      <motion.div
        className="relative w-full h-[50vh] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src="https://images.pexels.com/photos/4164767/pexels-photo-4164767.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Contact Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <h1 className="relative z-10 text-5xl font-extrabold tracking-wide text-white">
          CONTACT <span className="text-blue-400">US</span>
        </h1>
      </motion.div>

      {/* Contact Info Section */}
      <div className="my-20 flex flex-col md:flex-row justify-center gap-12 px-6 md:px-20">
        <motion.img
          src="https://images.pexels.com/photos/6453398/pexels-photo-6453398.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Contact Office"
          className="w-full md:max-w-[480px] rounded-2xl shadow-2xl border border-gray-700 object-cover"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="flex flex-col justify-center gap-6 md:w-1/2 text-gray-300"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-semibold text-2xl text-blue-600">Our Store</p>
          <p>
            FRD Nutrition <br />
            Dev Colony Gali, 1, Delhi Rd, <br />
            Rohtak, Haryana 124001
          </p>
          <p>
            +91 92781 60000 <br />
            frdgym.com
          </p>
          <p className="font-semibold text-2xl text-blue-600">
            Careers at FRD Nutrition
          </p>
          <p>Join our team and grow with the leaders in sports nutrition.</p>
          <motion.button
            className="border border-blue-600 px-8 py-3 text-sm font-semibold hover:bg-blue-600 hover:text-white transition rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Jobs
          </motion.button>
        </motion.div>
      </div>

      {/* Map / Extra Image Section */}
      <div className="px-6 md:px-20 mb-20">
        <motion.div
          className="w-full overflow-hidden rounded-2xl shadow-2xl border border-gray-700"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src="https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Gym Contact Map"
            className="w-full h-72 md:h-[400px] object-cover"
          />
        </motion.div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
