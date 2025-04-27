import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-toastify';
import { Camera } from 'lucide-react';
import ghibli from '../assets/ghibli.jpg';

const Profile = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(authUser?.avatar || '');
  const [isAvatarLoading, setIsAvatarLoading] = useState(false); // New State for shimmer

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setIsAvatarLoading(true); // Start shimmer loading
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) {
      toast.info('Please select a new avatar to update.', { position: "top-right", autoClose: 3000 });
      return;
    }
    try {
      await updateProfile({ avatar });
      toast.success('Profile updated successfully! 🌟', { position: "top-right", autoClose: 3000 });
      setAvatar(null);
    } catch (err) {
      toast.error(err.message || 'Profile update failed', { position: "top-right", autoClose: 3000 });
    }
  };

  const memberSince = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

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
      <div className="card glass w-full max-w-lg shadow-xl p-8 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-secondary">🌸 Your Profile</h2>

        {/* Profile Image Section */}
        <div className="flex justify-center mb-6 relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            {isAvatarLoading ? (
              // Shimmer effect while loading
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse border-4 border-secondary" />
            ) : (
              <img
                src={avatarPreview || 'https://via.placeholder.com/150?text=Avatar'}
                alt="Profile Avatar"
                onLoad={() => setIsAvatarLoading(false)}
                className="w-32 h-32 rounded-full object-cover border-4 border-secondary shadow-md"
              />
            )}
            {/* Hidden File Input */}
            <input
              type="file"
              id="avatarInput"
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            {/* Camera Icon */}
            <label htmlFor="avatarInput" className="absolute bottom-0 right-0 bg-secondary p-2 rounded-full cursor-pointer opacity-90 hover:opacity-100 transition-all group-hover:scale-110">
              <Camera size={20} color="white" />
            </label>
          </motion.div>
        </div>

        {/* Update Avatar Button */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.button
            type="submit"
            disabled={isUpdatingProfile}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary w-full"
          >
            {isUpdatingProfile ? 'Updating...' : 'Save Changes'}
          </motion.button>
        </form>

        {/* User Information */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-green-900">Full Name:</span>
            <span className="text-lg text-gray-700">{authUser?.fullName || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-green-900">Email:</span>
            <span className="text-lg text-gray-700">{authUser?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-green-900">Member Since:</span>
            <span className="text-lg text-gray-700">{memberSince}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
