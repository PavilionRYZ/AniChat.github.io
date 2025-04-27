import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import loginbg from '../assets/login.png';

const FloatingPetal = ({ delay, size, startX }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, x: startX }}
    animate={{
      opacity: [0, 1, 0],
      y: [0, 600],
      x: [startX + 50, startX],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
      delay,
    }}
    className="absolute bg-pink-300 rounded-full opacity-70 blur-sm"
    style={{
      width: size,
      height: size,
    }}
  />
);

const FloatingSparkle = ({ delay, size, startX }) => (
  <motion.div
    initial={{ opacity: 0, y: -30, x: startX }}
    animate={{
      opacity: [0, 1, 0],
      y: [0, 500],
      x: [startX + 30, startX],
      scale: [0.8, 1.4, 0.8],
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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${loginbg})` }}
      data-theme="cupcake"
    >
      {/* Floating Petals */}
      {Array.from({ length: 15 }).map((_, i) => (
        <FloatingPetal
          key={`petal-${i}`}
          delay={Math.random() * 5}
          size={`${Math.random() * 10 + 8}px`}
          startX={Math.random() * window.innerWidth - window.innerWidth / 2}
        />
      ))}

      {/* Floating Sparkles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <FloatingSparkle
          key={`sparkle-${i}`}
          delay={Math.random() * 6}
          size={`${Math.random() * 5 + 2}px`}
          startX={Math.random() * window.innerWidth - window.innerWidth / 2}
        />
      ))}

      {/* Main Login Card */}
      <div className="card glass w-full max-w-md shadow-xl p-6 z-10">
        <h2 className="text-3xl font-bold text-center mb-4 text-secondary">🌟 Welcome Back!</h2>
        {error && (
          <div className="alert alert-error shadow-md mb-4">
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-red-600">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sophie@ghibli.com"
              autoComplete="email"
              className="input input-bordered input-info w-full text-black bg-gray-100"
              required
            />
          </div>

          <div className="form-control relative">
            <label className="label">
              <span className="label-text text-red-600">Password</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="input input-bordered input-info w-full text-black bg-gray-100 pr-12"
                required
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </motion.button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoggingIn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary w-full mt-2"
          >
            {isLoggingIn ? 'Logging In...' : 'Login'}
          </motion.button>
        </form>
        <div className="text-center mt-4 text-green-900">
          <p>
            Forgot your password?{' '}
            <a href="/forgot-password" className="text-blue-900 hover:underline">
              Reset it
            </a>
          </p>
          <p className="mt-2">
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-900 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
