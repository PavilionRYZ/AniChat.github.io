import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import loginbg from '../assets/login.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
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
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center"
      style={{ backgroundImage: `url(${loginbg})` }}
      data-theme="cupcake"
    >
      <div className="card glass w-full max-w-md shadow-xl p-6">
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