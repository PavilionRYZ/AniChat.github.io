import React, { useState } from 'react';
import { Settings, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { authUser, checkAuth, logOut, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await checkAuth();
      await logOut();
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error?.message || 'Logout failed');
    }
  };

  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="navbar bg-white/10 shadow-md backdrop-blur-md fixed top-0 z-50" // Adjusted for glass effect
      style={{ fontFamily: "'Quicksand', 'cursive'" }}
      data-theme="cupcake"
    >
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-white bg-transparent border-none text-2xl tracking-wider hover:scale-105 transition-transform duration-300">
          🌸 AniChat
        </Link>
      </div>

      <div className="flex-none relative">
        <motion.button
          whileHover={{ rotate: 20 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-transparent hover:bg-transparent text-primary mr-4" // Custom transparent button styles
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <Settings size={28} className="navbar-settings-icon text-white" />
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="menu absolute right-0 mt-2 w-48 rounded-lg bg-base-200 shadow-xl ring-1 ring-primary ring-opacity-30 overflow-hidden"
              role="menu"
            >
              <ul className="p-2">
                {authUser && (
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-primary hover:text-white rounded-lg transition"
                      onClick={() => setOpen(false)}
                    >
                      <User size={18} /> Profile
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-primary hover:text-white rounded-lg transition"
                    onClick={() => setOpen(false)}
                  >
                    <Settings size={18} /> Settings
                  </Link>
                </li>
                {authUser && (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-primary hover:text-white rounded-lg transition"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default NavBar;