import { create } from 'zustand';
import axiosInstance from '../lib/axios';

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check-auth');
      set({ authUser: response.data.user });
    } catch (error) {
      // console.log(error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (fullName, email, password, avatar) => {
    set({ isSigningUp: true });
    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('password', password);
      if (avatar) formData.append('avatar', avatar);
      const response = await axiosInstance.post('/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set({ authUser: response.data.user });
      return response.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    } finally {
      set({ isSigningUp: false });
    }
  },
  verifyOtp: async (email, otp) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
      set({ authUser: response.data.user });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      set({ isLoggingIn: false });
    }
  },
  login: async (email, password) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      set({ authUser: response.data.user });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logOut: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
    } catch (error) {
      console.log(error);
    }
  },
  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      set({ authUser: response.data.user });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Forgot password request failed');
    } finally {
      set({ isLoggingIn: false });
    }
  },
  resetPassword: async (email, otp, newPassword) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.post('/auth/reset-password', { email, otp, newPassword });
      set({ authUser: response.data.user });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  updateProfile: async (formData) => {
    try {
      const response = await axiosInstance.put('/auth/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set((state) => ({
        authUser: response.data.user,
      }));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },
}));