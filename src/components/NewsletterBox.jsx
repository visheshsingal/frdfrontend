import React, { useState } from "react";
import { motion } from "framer-motion";

// A simple drifting particle component
const Particle = ({ delay }) => (
  <motion.div
    className="absolute w-1 h-1 bg-green-400 rounded-full opacity-50"
    initial={{ y: "100%", x: Math.random() * 100 + "%" }}
    animate={{ y: "-20vh", opacity: [0.5, 1, 0.2] }}
    transition={{
      duration: 8 + Math.random() * 5,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{ left: Math.random() * 100 + "%" }}
  />
);

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <div className="relative bg-black text-white py-24 px-6 overflow-hidden">
      {/* Animated neon grid background */}
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,197,94,0.15)_1px,transparent_1px),linear-gradient(rgba(34,197,94,0.15)_1px,transparent_1px)] bg-[size:50px_50px] animate-[pulse_4s_infinite_alternate]"
        style={{ maskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.6))" }}
      ></div>

      {/* Random floating particles */}
      {[...Array(12)].map((_, i) => (
        <Particle key={i} delay={i * 0.8} />
      ))}

      <div className="relative max-w-3xl mx-auto text-center z-10">
        {subscribed ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-4xl font-bold text-green-400">
              You’re In! ✅
            </h3>
            <p className="text-gray-400">
              Power unlocked — the future of strength is on its way.
            </p>
          </motion.div>
        ) : (
          <>
            <motion.h2
              className="text-5xl md:text-6xl font-extrabold mb-4 tracking-widest text-green-400"
              initial={{ opacity: 0, y: -40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Join The Power Grid
            </motion.h2>
            <motion.p
              className="text-gray-400 mb-8 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              Exclusive drops, advanced training hacks, & next-gen supplement launches.
            </motion.p>

            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full sm:w-80 px-6 py-3 rounded-full text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <motion.button
                type="submit"
                className="px-8 py-3 font-bold uppercase rounded-full bg-green-500 text-black hover:bg-green-600 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Activate
              </motion.button>
            </motion.form>
            <p className="text-sm text-gray-500 mt-6">
              No spam. Only high-voltage performance.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsletterBox;
