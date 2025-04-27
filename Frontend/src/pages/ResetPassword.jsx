import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ghibliResetBackground from '../assets/forgotpass.png';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { resetPassword, isUpdatingProfile } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email, otp, newPassword);
      toast.success('Password reset successfully! 🌟 Redirecting to login...', {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      toast.error(err.message || 'Password reset failed', {
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
      style={{ backgroundImage: `url(${ghibliResetBackground})` }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="card w-full max-w-md bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-emerald-700">🔒 Reset Password</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label text-emerald-700 font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full text-black bg-gray-100 focus:bg-gray-100"
              placeholder="Enter your email"
              required
              readOnly
            />
          </div>
          <div className="form-control">
            <label className="label text-emerald-700 font-semibold">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input input-bordered w-full text-black bg-white/80 focus:bg-white/90"
              placeholder="Enter OTP"
              required
            />
          </div>
          <div className="form-control">
            <label className="label text-emerald-700 font-semibold">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input input-bordered w-full text-black bg-white/80 focus:bg-white/90"
              placeholder="Enter new password"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isUpdatingProfile}
            type="submit"
            className="btn btn-success w-full rounded-full shadow-lg"
          >
            {isUpdatingProfile ? 'Resetting Spell...' : 'Reset Password ✨'}
          </motion.button>
        </form>

        <div className="text-center mt-4 text-sm text-emerald-700 opacity-70">
          🧚‍♂️ Your new password will be blessed by a forest spirit!
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResetPassword;