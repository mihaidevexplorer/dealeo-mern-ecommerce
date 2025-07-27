// src\store\useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../types';

interface AuthState {
  userInfo: User | null;
  loader: boolean;
  errorMessage: string;
  successMessage: string;
}

interface AuthActions {
  setLoader: (loading: boolean) => void;
  setError: (error: string) => void;
  setSuccess: (message: string) => void;
  setUserInfo: (token: string) => void;
  clearMessages: () => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

const decodeToken = (token: string | null): User | null => {
  if (token) {
    try {
      const userInfo = jwtDecode<User>(token);
      return userInfo;
    } catch {
      // Removed unused 'error' variable
      localStorage.removeItem('customerToken');
      return null;
    }
  }
  return null;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      userInfo: decodeToken(localStorage.getItem('customerToken')),
      loader: false,
      errorMessage: '',
      successMessage: '',

      // Actions
      setLoader: (loading: boolean) => set({ loader: loading }),
      
      setError: (error: string) => set({ 
        errorMessage: error, 
        loader: false,
        successMessage: '' 
      }),
      
      setSuccess: (message: string) => set({ 
        successMessage: message, 
        loader: false,
        errorMessage: '' 
      }),
      
      setUserInfo: (token: string) => {
        localStorage.setItem('customerToken', token);
        const userInfo = decodeToken(token);
        set({ userInfo });
      },
      
      clearMessages: () => set({ 
        errorMessage: '', 
        successMessage: '' 
      }),
      
      logout: () => {
        localStorage.removeItem('customerToken');
        set({ 
          userInfo: null, 
          errorMessage: '', 
          successMessage: '',
          loader: false 
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        userInfo: state.userInfo 
      }),
    }
  )
);