import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import otpverify from '../assets/otpverify.png';

const VerifyOTP = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { verifyOtp, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam)); // Decode the URL-encoded email
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await verifyOtp(email, otp);
      setShowSuccess(true);

      // Delay navigation to homepage after success
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/');
      }, 3000); // 3 seconds
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${otpverify})`, fontFamily: "'Quicksand', cursive" }}
    >
      {/* Soft overlay */}
      {/* <div className="absolute inset-0 backdrop-blur-xs" /> */}

      {/* Main Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="card glass w-full max-w-md shadow-xl p-6"
      >
        <h2 className="text-3xl font-bold text-center text-primary mb-6 drop-shadow-md">
          ✨ Verify OTP
        </h2>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="alert alert-error mb-4 shadow-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered input-primary w-full rounded-lg "
              placeholder="Verification request for email"
              required
              readOnly
            />
          </div>
          <div>
            <label className="label font-semibold">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input input-bordered input-primary w-full rounded-lg"
              placeholder="Enter the magic code ✨"
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoggingIn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary w-full rounded-full shadow-md transition-all duration-300"
          >
            {isLoggingIn ? 'Verifying...' : 'Verify OTP'}
          </motion.button>
        </form>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md z-50"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-base-100 p-10 rounded-2xl shadow-2xl text-center flex flex-col items-center"
            >
              <img
                src="https://i.pinimg.com/originals/df/f5/ed/dff5ed74e381dd2c1c2fc90d92c1e4f0.gif"
                alt="success"
                className="w-32 h-32 mb-4 rounded-full object-cover"
              />
              <h3 className="text-2xl font-bold text-success mb-2">Verified Successfully! 🌼</h3>
              <p className="text-sm text-gray-500">Redirecting you home... 🍃</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VerifyOTP;