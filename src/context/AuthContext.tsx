import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../lib/apiClient.ts';

export interface User {
  id: string;
  email: string;
  display_name: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  preferred_language: 'bn' | 'en';
  email_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, displayName: string, lang?: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; code?: string; error?: string }>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  requestEmailOtp: (email: string) => Promise<{ success: boolean; otp?: string; error?: string }>;
  loginWithOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  verifyEmailAddress: () => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('lf_token'));
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const data = await apiFetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUser(data.user);
    } catch (err) {
      console.error('Failed to authenticate token:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('lf_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (email: string, password: string, displayName: string, lang = 'bn') => {
    try {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          display_name: displayName,
          preferred_language: lang,
        }),
      });
      localStorage.setItem('lf_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const data = await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return { success: true, code: data.code };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to request reset' };
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, new_password: newPassword }),
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to reset password' };
    }
  };

  const requestEmailOtp = async (email: string) => {
    try {
      const data = await apiFetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return { success: true, otp: data.otp };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send OTP' };
    }
  };

  const loginWithOtp = async (email: string, otp: string) => {
    try {
      const data = await apiFetch('/api/auth/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      localStorage.setItem('lf_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'OTP login failed' };
    }
  };

  const verifyEmailAddress = async () => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const data = await apiFetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (user) {
        setUser({ ...user, email_verified: true });
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      await apiFetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to change password' };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await apiFetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        // ignore error on logout
      }
    }
    localStorage.removeItem('lf_token');
    setToken(null);
    setUser(null);
  };

  const deleteAccount = async () => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      await apiFetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await logout();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        requestPasswordReset,
        resetPassword,
        requestEmailOtp,
        loginWithOtp,
        verifyEmailAddress,
        changePassword,
        logout,
        deleteAccount,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
