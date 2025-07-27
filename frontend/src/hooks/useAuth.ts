//src\hooks\useAuth.ts
// src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../api/api';
import { useAuthStore } from '../store/useAuthStore';
import type { LoginData, RegisterData } from '../types';
import toast from 'react-hot-toast';

interface AuthResponse {
  message: string;
  token: string;
}

interface ApiError {
  error: string;
  message?: string;
}

// Register mutation
export const useRegister = () => {
  const { setLoader, setError, setSuccess, setUserInfo } = useAuthStore();

  return useMutation<AuthResponse, AxiosError<ApiError>, RegisterData>({
    mutationFn: async (registerData: RegisterData) => {
      const { data } = await api.post<AuthResponse>('/customer/customer-register', registerData);
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (data) => {
      setUserInfo(data.token);
      setSuccess(data.message);
      toast.success(data.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

// Login mutation
export const useLogin = () => {
  const { setLoader, setError, setSuccess, setUserInfo } = useAuthStore();

  return useMutation<AuthResponse, AxiosError<ApiError>, LoginData>({
    mutationFn: async (loginData: LoginData) => {
      const { data } = await api.post<AuthResponse>('/customer/customer-login', loginData);
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (data) => {
      setUserInfo(data.token);
      setSuccess(data.message);
      toast.success(data.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

// Hook for auth state
export const useAuthState = () => {
  const authState = useAuthStore();
  
  return {
    userInfo: authState.userInfo,
    loader: authState.loader,
    errorMessage: authState.errorMessage,
    successMessage: authState.successMessage,
    isAuthenticated: !!authState.userInfo,
    clearMessages: authState.clearMessages,
    logout: authState.logout
  };
};

// Hook to get current user - this was missing!
export const useCurrentUser = () => {
  const { userInfo } = useAuthStore();
  return userInfo;
};