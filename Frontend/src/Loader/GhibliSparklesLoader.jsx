import React from 'react';
import { motion } from 'framer-motion';

// Single Petal Component
const FloatingPetal = ({ delay, size, startX }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, x: startX, rotate: 0 }}
    animate={{
      opacity: [0, 1, 0],
      y: [0, 400],
      x: [startX, startX + 100],
      rotate: [0, 360],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
      delay,
    }}
    className="absolute bg-pink-200 rounded-full opacity-70 blur-sm"
    style={{
      width: size,
      height: size,
    }}
  />
);

// Single Sparkle Component
const FloatingSparkle = ({ delay, size, startX }) => (
  <motion.div
    initial={{ opacity: 0, y: -30, x: startX, scale: 0.5 }}
    animate={{
      opacity: [0, 1, 0],
      y: [0, 500],
      x: [startX, startX + 80],
      scale: [0.5, 1.2, 0.5],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
      delay,
    }}
    className="absolute bg-white rounded-full shadow-md"
    style={{
      width: size,
      height: size,
      filter: 'blur(1px)',
    }}
  />
);

const GhibliSparklesLoader = () => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-blue-100 via-pink-100 to-yellow-100">
      
      {/* Central Floating Avatar */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="relative z-10"
      >
        <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden border-4 border-secondary">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/0/0c/Totoro_in_the_forest.png"
            alt="Totoro"
            className="object-cover w-full h-full"
          />
        </div>
      </motion.div>

      {/* Cinematic Petals */}
      {Array.from({ length: 20 }).map((_, i) => (
        <FloatingPetal
          key={`petal-${i}`}
          delay={Math.random() * 5}
          size={`${Math.random() * 12 + 6}px`}
          startX={Math.random() * window.innerWidth - window.innerWidth / 2}
        />
      ))}

      {/* Magical Sparkles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <FloatingSparkle
          key={`sparkle-${i}`}
          delay={Math.random() * 6}
          size={`${Math.random() * 4 + 2}px`} // Tiny sparkles 2px - 6px
          startX={Math.random() * window.innerWidth - window.innerWidth / 2}
        />
      ))}

      {/* Magical Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="mt-10 text-2xl font-bold text-green-800 z-10 drop-shadow-lg"
      >
        Dreaming through Ghibli skies... ✨🍃
      </motion.p>
    </div>
  );
};

export default GhibliSparklesLoader;
