// src/components/dashboard/ChangePassword.tsx
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  RiEyeLine, 
  RiEyeOffLine, 
  RiLockLine, 
  RiShieldCheckLine,
  RiErrorWarningLine,
  RiCheckLine
} from 'react-icons/ri';
import type { AxiosError } from 'axios';
import api from '../../api/api';
import { useAuthState } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

// Validation schema
const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ApiError {
  error: string;
  message?: string;
}

interface ChangePasswordResponse {
  message: string;
  success: boolean;
}

// Password strength indicator
const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: '', color: 'bg-gray-200' };
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    
    // Determine strength level
    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getStrength(password);
  const widthPercentage = (strength.score / 6) * 100;

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">Password strength</span>
        <span className={`text-sm font-medium ${
          strength.label === 'Weak' ? 'text-red-600' :
          strength.label === 'Medium' ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {strength.label}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${widthPercentage}%` }}
        />
      </div>
    </div>
  );
};

// Password requirements checklist
const PasswordRequirements: React.FC<{ password: string }> = ({ password }) => {
  const requirements = [
    { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
    { test: (p: string) => /[a-z]/.test(p), label: 'One lowercase letter' },
    { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
    { test: (p: string) => /\d/.test(p), label: 'One number' },
  ];

  return (
    <div className="mt-3 space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Password requirements:</h4>
      <ul className="space-y-1">
        {requirements.map((req, index) => {
          const isMet = password ? req.test(password) : false;
          return (
            <li key={index} className="flex items-center gap-2 text-sm">
              {isMet ? (
                <RiCheckLine className="w-4 h-4 text-green-600" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
              )}
              <span className={isMet ? 'text-green-600' : 'text-gray-500'}>
                {req.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const ChangePassword: React.FC = () => {
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  
  const { userInfo, isAuthenticated } = useAuthState();
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const newPassword = watch('newPassword', '');

  // Change password mutation
  const changePasswordMutation = useMutation<
    ChangePasswordResponse,
    AxiosError<ApiError>,
    ChangePasswordFormData
  >({
    mutationFn: async (data: ChangePasswordFormData) => {
      const { data: response } = await api.put<ChangePasswordResponse>('/customer/change-password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        userId: userInfo?.id,
      });
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message || 'Password changed successfully!');
      reset(); // Clear form
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to change password';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(data);
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!isAuthenticated || !userInfo) {
    return (
      <div className="p-4 bg-white rounded-md">
        <div className="text-center py-8">
          <RiErrorWarningLine className="mx-auto text-4xl text-red-500 mb-2" />
          <p className="text-gray-500">Please log in to change your password.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <RiShieldCheckLine className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Change Password</h2>
          <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
        </div>
      </div>

      {/* Security notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <RiLockLine className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Security Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use a unique password that you don't use elsewhere</li>
              <li>• Include a mix of letters, numbers, and special characters</li>
              <li>• Avoid using personal information like names or birthdays</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Password */}
        <div className="space-y-2">
          <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
            Current Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiLockLine className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('oldPassword')}
              type={showPasswords.oldPassword ? 'text' : 'password'}
              id="oldPassword"
              className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.oldPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('oldPassword')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.oldPassword ? (
                <RiEyeOffLine className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <RiEyeLine className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <RiErrorWarningLine className="w-4 h-4" />
              {errors.oldPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiLockLine className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('newPassword')}
              type={showPasswords.newPassword ? 'text' : 'password'}
              id="newPassword"
              className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('newPassword')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.newPassword ? (
                <RiEyeOffLine className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <RiEyeLine className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <RiErrorWarningLine className="w-4 h-4" />
              {errors.newPassword.message}
            </p>
          )}
          
          {/* Password strength indicator */}
          <PasswordStrengthIndicator password={newPassword} />
          
          {/* Password requirements */}
          {newPassword && <PasswordRequirements password={newPassword} />}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiLockLine className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('confirmPassword')}
              type={showPasswords.confirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.confirmPassword ? (
                <RiEyeOffLine className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <RiEyeLine className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <RiErrorWarningLine className="w-4 h-4" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={changePasswordMutation.isPending}
          >
            Clear Form
          </button>
          
          <button
            type="submit"
            disabled={!isValid || changePasswordMutation.isPending}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
          >
            {changePasswordMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              <>
                <RiShieldCheckLine className="w-4 h-4" />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success/Error Messages */}
      {changePasswordMutation.isError && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex gap-3">
            <RiErrorWarningLine className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700">
                {changePasswordMutation.error?.response?.data?.error || 'Failed to change password'}
              </p>
            </div>
          </div>
        </div>
      )}

      {changePasswordMutation.isSuccess && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex gap-3">
            <RiCheckLine className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800">Success</h3>
              <p className="text-sm text-green-700">
                Your password has been changed successfully!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;