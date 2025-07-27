// src/hooks/usePassword.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import type { AxiosError } from 'axios';
import api from '../api/api';
import toast from 'react-hot-toast';
import type { ApiResponse } from '../types';

interface ApiError {
  error: string;
  message?: string;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  userId: string;
}

interface ResetPasswordData {
  email: string;
}

interface ConfirmResetPasswordData {
  token: string;
  newPassword: string;
}

interface PasswordValidationResult {
  isValid: boolean;
  score: number;
  feedback: string[];
  strength: 'weak' | 'medium' | 'strong';
}

interface PasswordSecuritySettings {
  requireTwoFactor: boolean;
  passwordHistory: number;
  sessionTimeout: number;
  lastPasswordChange: string;
}

// Change Password Hook
export const useChangePassword = () => {
  return useMutation<ApiResponse, AxiosError<ApiError>, ChangePasswordData>({
    mutationFn: async (data: ChangePasswordData) => {
      const { data: response } = await api.put<ApiResponse>('/user/change-password', data);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message || 'Password changed successfully!');
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to change password';
      toast.error(errorMessage);
    },
  });
};

// Reset Password Hook
export const useResetPassword = () => {
  return useMutation<ApiResponse, AxiosError<ApiError>, ResetPasswordData>({
    mutationFn: async (data: ResetPasswordData) => {
      const { data: response } = await api.post<ApiResponse>('/auth/reset-password', data);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message || 'Reset link sent to your email!');
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to send reset link';
      toast.error(errorMessage);
    },
  });
};

// Confirm Reset Password Hook
export const useConfirmResetPassword = () => {
  return useMutation<ApiResponse, AxiosError<ApiError>, ConfirmResetPasswordData>({
    mutationFn: async (data: ConfirmResetPasswordData) => {
      const { data: response } = await api.post<ApiResponse>('/auth/confirm-reset-password', data);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message || 'Password reset successfully!');
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to reset password';
      toast.error(errorMessage);
    },
  });
};

// Password Security Settings Hook
export const usePasswordSecuritySettings = (userId: string) => {
  return useQuery<PasswordSecuritySettings>({
    queryKey: ['passwordSecurity', userId],
    queryFn: async () => {
      const { data } = await api.get<PasswordSecuritySettings>(`/user/password-security/${userId}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Password History Hook
export const usePasswordHistory = (userId: string) => {
  return useQuery<{ passwords: Array<{ createdAt: string; isCompromised: boolean }> }>({
    queryKey: ['passwordHistory', userId],
    queryFn: async () => {
      const { data } = await api.get(`/user/password-history/${userId}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Password Validation Hook
export const usePasswordValidation = () => {
  const validatePassword = useCallback((password: string): PasswordValidationResult => {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length < 8) {
      feedback.push('Password should be at least 8 characters long');
    } else if (password.length >= 8) {
      score += 1;
    }

    if (password.length >= 12) {
      score += 1;
    }

    // Character variety checks
    if (!/[a-z]/.test(password)) {
      feedback.push('Include at least one lowercase letter');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Include at least one uppercase letter');
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      feedback.push('Include at least one number');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push('Include at least one special character');
    } else {
      score += 1;
    }

    // Common patterns check
    if (/(.)\1{2,}/.test(password)) {
      feedback.push('Avoid repeating characters');
      score -= 1;
    }

    if (/123|abc|qwe|password/i.test(password)) {
      feedback.push('Avoid common patterns and words');
      score -= 1;
    }

    // Determine strength
    let strength: 'weak' | 'medium' | 'strong';
    if (score <= 2) {
      strength = 'weak';
    } else if (score <= 4) {
      strength = 'medium';
    } else {
      strength = 'strong';
    }

    const isValid = score >= 4 && feedback.length === 0;

    return {
      isValid,
      score: Math.max(0, score),
      feedback,
      strength,
    };
  }, []);

  return { validatePassword };
};

// Password Generator Hook
export const usePasswordGenerator = () => {
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  const generatePassword = useCallback((options: {
    length?: number;
    includeUppercase?: boolean;
    includeLowercase?: boolean;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
    excludeSimilar?: boolean;
  } = {}) => {
    const {
      length = 16,
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true,
      excludeSimilar = true,
    } = options;

    let charset = '';
    
    if (includeLowercase) {
      charset += excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    }
    
    if (includeUppercase) {
      charset += excludeSimilar ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    
    if (includeNumbers) {
      charset += excludeSimilar ? '23456789' : '0123456789';
    }
    
    if (includeSymbols) {
      charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    if (!charset) {
      throw new Error('At least one character type must be selected');
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setGeneratedPassword(password);
    return password;
  }, []);

  const copyToClipboard = useCallback(async (password?: string) => {
    const textToCopy = password || generatedPassword;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Password copied to clipboard!');
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Password copied to clipboard!');
    }
  }, [generatedPassword]);

  return {
    generatedPassword,
    generatePassword,
    copyToClipboard,
  };
};

// Password Strength Checker Hook with Breach Detection
export const usePasswordBreachCheck = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkPasswordBreach = useCallback(async (password: string): Promise<{
    isBreached: boolean;
    breachCount: number;
  }> => {
    setIsChecking(true);
    
    try {
      // Using SHA-1 hash of password (first 5 characters) for k-anonymity
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      const prefix = hashHex.substring(0, 5).toUpperCase();
      const suffix = hashHex.substring(5).toUpperCase();
      
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const data_text = await response.text();
      
      const lines = data_text.split('\n');
      const match = lines.find(line => line.startsWith(suffix));
      
      if (match) {
        const count = parseInt(match.split(':')[1]);
        return { isBreached: true, breachCount: count };
      }
      
      return { isBreached: false, breachCount: 0 };
    } catch {
      console.warn('Unable to check password breach status');
      return { isBreached: false, breachCount: 0 };
    } finally {
      setIsChecking(false);
    }
  }, []);

  return {
    checkPasswordBreach,
    isChecking,
  };
};

// Two-Factor Authentication Setup Hook
export const useTwoFactorAuth = () => {
  const setupTwoFactor = useMutation<
    { qrCode: string; secret: string },
    AxiosError<ApiError>,
    { userId: string }
  >({
    mutationFn: async ({ userId }) => {
      const { data } = await api.post(`/user/setup-2fa/${userId}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Two-factor authentication setup initiated');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Failed to setup 2FA';
      toast.error(errorMessage);
    },
  });

  const verifyTwoFactor = useMutation<
    ApiResponse,
    AxiosError<ApiError>,
    { userId: string; token: string }
  >({
    mutationFn: async ({ userId, token }) => {
      const { data } = await api.post(`/user/verify-2fa/${userId}`, { token });
      return data;
    },
    onSuccess: (response) => {
      toast.success(response.message || 'Two-factor authentication enabled');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Failed to verify 2FA';
      toast.error(errorMessage);
    },
  });

  const disableTwoFactor = useMutation<
    ApiResponse,
    AxiosError<ApiError>,
    { userId: string; password: string }
  >({
    mutationFn: async ({ userId, password }) => {
      const { data } = await api.post(`/user/disable-2fa/${userId}`, { password });
      return data;
    },
    onSuccess: (response) => {
      toast.success(response.message || 'Two-factor authentication disabled');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Failed to disable 2FA';
      toast.error(errorMessage);
    },
  });

  return {
    setupTwoFactor,
    verifyTwoFactor,
    disableTwoFactor,
  };
};

// Security Session Management Hook
export const useSecuritySessions = (userId: string) => {
  const getSessions = useQuery<{
    sessions: Array<{
      id: string;
      deviceInfo: string;
      location: string;
      ipAddress: string;
      lastActivity: string;
      isCurrent: boolean;
    }>;
  }>({
    queryKey: ['securitySessions', userId],
    queryFn: async () => {
      const { data } = await api.get(`/user/security-sessions/${userId}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const terminateSession = useMutation<
    ApiResponse,
    AxiosError<ApiError>,
    { sessionId: string }
  >({
    mutationFn: async ({ sessionId }) => {
      const { data } = await api.delete(`/user/security-sessions/${sessionId}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Session terminated successfully');
      getSessions.refetch();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Failed to terminate session';
      toast.error(errorMessage);
    },
  });

  const terminateAllSessions = useMutation<
    ApiResponse,
    AxiosError<ApiError>,
    { userId: string }
  >({
    mutationFn: async ({ userId }) => {
      const { data } = await api.delete(`/user/security-sessions/all/${userId}`);
      return data;
    },
    onSuccess: () => {
      toast.success('All sessions terminated successfully');
      getSessions.refetch();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Failed to terminate all sessions';
      toast.error(errorMessage);
    },
  });

  return {
    sessions: getSessions.data?.sessions || [],
    isLoading: getSessions.isLoading,
    terminateSession,
    terminateAllSessions,
    refetch: getSessions.refetch,
  };
};

// Password Recovery Questions Hook
export const usePasswordRecoveryQuestions = () => {
  const getQuestions = useQuery<{
    questions: Array<{ id: string; question: string }>;
  }>({
    queryKey: ['recoveryQuestions'],
    queryFn: async () => {
      const { data } = await api.get('/auth/recovery-questions');
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const setRecoveryQuestions = useMutation<
    ApiResponse,
    AxiosError<ApiError>,
    {
      userId: string;
      questions: Array<{ questionId: string; answer: string }>;
    }
  >({
    mutationFn: async (data) => {
      const { data: response } = await api.post('/user/recovery-questions', data);
      return response;
    },
    onSuccess: () => {
      toast.success('Recovery questions set successfully');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Failed to set recovery questions';
      toast.error(errorMessage);
    },
  });

  const verifyRecoveryAnswers = useMutation<
    { token: string },
    AxiosError<ApiError>,
    {
      email: string;
      answers: Array<{ questionId: string; answer: string }>;
    }
  >({
    mutationFn: async (data) => {
      const { data: response } = await api.post('/auth/verify-recovery-answers', data);
      return response;
    },
    onSuccess: () => {
      toast.success('Recovery answers verified');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Invalid recovery answers';
      toast.error(errorMessage);
    },
  });

  return {
    questions: getQuestions.data?.questions || [],
    isLoading: getQuestions.isLoading,
    setRecoveryQuestions,
    verifyRecoveryAnswers,
  };
};

// Comprehensive Password Security Hook
export const usePasswordSecurity = (userId: string) => {
  const { validatePassword } = usePasswordValidation();
  const { checkPasswordBreach } = usePasswordBreachCheck();
  const { generatePassword } = usePasswordGenerator();
  
  const securitySettings = usePasswordSecuritySettings(userId);
  const passwordHistory = usePasswordHistory(userId);
  const changePassword = useChangePassword();
  
  const [securityScore, setSecurityScore] = useState<number>(0);

  const calculateSecurityScore = useCallback(async (password?: string) => {
    let score = 0;
    
    // Password strength (0-40 points)
    if (password) {
      const validation = validatePassword(password);
      score += (validation.score / 6) * 40;
    }
    
    // Two-factor authentication (20 points)
    if (securitySettings.data?.requireTwoFactor) {
      score += 20;
    }
    
    // Recent password change (20 points)
    if (securitySettings.data?.lastPasswordChange) {
      const lastChange = new Date(securitySettings.data.lastPasswordChange);
      const daysSinceChange = (Date.now() - lastChange.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceChange <= 90) {
        score += 20;
      } else if (daysSinceChange <= 180) {
        score += 10;
      }
    }
    
    // Password not breached (20 points)
    if (password) {
      try {
        const breachCheck = await checkPasswordBreach(password);
        if (!breachCheck.isBreached) {
          score += 20;
        }
      } catch {
        // If check fails, assume not breached
        score += 20;
      }
    }
    
    setSecurityScore(Math.min(100, Math.max(0, score)));
    return score;
  }, [validatePassword, checkPasswordBreach, securitySettings.data]);

  return {
    securityScore,
    securitySettings: securitySettings.data,
    passwordHistory: passwordHistory.data,
    changePassword,
    validatePassword,
    checkPasswordBreach,
    generatePassword,
    calculateSecurityScore,
    isLoading: securitySettings.isLoading || passwordHistory.isLoading,
  };
};

// Password Policy Enforcement Hook
export const usePasswordPolicy = () => {
  const checkPasswordPolicy = useCallback((password: string, userInfo?: {
    name?: string;
    email?: string;
    dateOfBirth?: string;
  }) => {
    const violations: string[] = [];
    
    // Basic requirements
    if (password.length < 8) {
      violations.push('Password must be at least 8 characters long');
    }
    
    if (!/[a-z]/.test(password)) {
      violations.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      violations.push('Password must contain at least one uppercase letter');
    }
    
    if (!/\d/.test(password)) {
      violations.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      violations.push('Password must contain at least one special character');
    }
    
    // Personal information check
    if (userInfo) {
      const personalInfo = [
        userInfo.name?.toLowerCase(),
        userInfo.email?.split('@')[0]?.toLowerCase(),
        userInfo.dateOfBirth?.replace(/[-/]/g, ''),
      ].filter(Boolean);
      
      const passwordLower = password.toLowerCase();
      
      for (const info of personalInfo) {
        if (info && info.length > 2 && passwordLower.includes(info)) {
          violations.push('Password should not contain personal information');
          break;
        }
      }
    }
    
    // Common patterns
    const commonPatterns = [
      /123/,
      /abc/,
      /qwerty/i,
      /password/i,
      /admin/i,
      /user/i,
    ];
    
    for (const pattern of commonPatterns) {
      if (pattern.test(password)) {
        violations.push('Password should not contain common patterns or words');
        break;
      }
    }
    
    return {
      isValid: violations.length === 0,
      violations,
    };
  }, []);

  return { checkPasswordPolicy };
};