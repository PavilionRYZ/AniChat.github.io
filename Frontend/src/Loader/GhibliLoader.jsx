import React from 'react';
import { motion } from 'framer-motion';

const FloatingPetal = ({ delay }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, x: 0 }}
    animate={{ opacity: [0, 1, 0], y: [0, 300], x: [0, 50] }}
    transition={{
      duration: 6,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
      delay,
    }}
    className="absolute w-full h-full bg-pink-300 rounded-full opacity-70 blur-sm"
  />
);

const GhibliPetalLoader = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden bg-gradient-to-b from-sky-100 via-pink-100 to-yellow-100">
      {/* Floating Avatar */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="relative z-10"
      >
        <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden border-4 border-secondary">
          <span className="text-4xl">🌟</span>
        </div>
      </motion.div>

      {/* Floating Petals */}
      {Array.from({ length: 10 }).map((_, i) => (
        <FloatingPetal key={i} delay={i * 0.5} />
      ))}

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="mt-10 text-2xl font-semibold text-green-900 z-10"
      >
        Loading through Ghibli fields... 🌸🍃
      </motion.p>
    </div>
  );
};

export default GhibliPetalLoader;
