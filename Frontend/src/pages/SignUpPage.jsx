import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import ghibli from '../assets/ghibli.jpg';

const SignUpPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState('');
  const { signUp, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signUp(fullName, email, password, avatar);
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center"
      style={{ backgroundImage: `url(${ghibli})` }}
      data-theme="cupcake"
    >
      <div className="card glass w-full max-w-md shadow-xl p-6">
        <h2 className="text-3xl font-bold text-center mb-4 text-secondary">🌸 Create an Account</h2>
        {error && (
          <div className="alert alert-error shadow-md mb-4">
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-red-600">Full Name</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Sophie Hatter"
              className="input input-bordered input-info w-full text-black bg-white/80"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-red-600">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sophie@ghibli.com"
              className="input input-bordered input-info w-full text-black bg-white/80"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-red-600">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input input-bordered input-info w-full text-black bg-white/80"
              required
            />
          </div>
          <div className="form-control flex flex-col">
            <label className="label">
              <span className="label-text text-red-600">Avatar</span>
            </label>
            <input
              type="file"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="file-input file-input-bordered w-full max-w-xs text-black bg-white/80"
              accept="image/*"
            />
          </div>
          <motion.button
            type="submit"
            disabled={isSigningUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary w-full mt-2"
          >
            {isSigningUp ? 'Signing Up...' : 'Sign Up'}
          </motion.button>
        </form>
        <p className="text-center mt-4 text-green-900">
          Already have an account?{' '}
          <a href="/login" className="text-yellow-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;