import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ghibliBackground from '../assets/forgotpass.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { forgotPassword, isLoggingIn } = useAuthStore(); // Fixed typo: fotgotPassword to forgotPassword
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      toast.success('OTP sent to your email! 🌟 Check your inbox to proceed.', {
        position: "top-right",
        autoClose: 3000,
      });
      navigate(`/reset-password?email=${encodeURIComponent(email)}&redirect=reset-password`);
    } catch (err) {
      toast.error(err.message || 'Forgot password request failed', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${ghibliBackground})` }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="card w-full max-w-md bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-emerald-700">🔑 Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label text-emerald-700 font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-white/80 focus:bg-white/90"
              placeholder="Enter your email"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoggingIn}
            type="submit"
            className="btn btn-success w-full rounded-full shadow-md"
          >
            {isLoggingIn ? 'Sending Magic...' : 'Send OTP ✨'}
          </motion.button>
        </form>

        <div className="text-center mt-4 text-sm text-emerald-700 opacity-70">
          🐾 We'll send you a magical link to reset your password!
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;