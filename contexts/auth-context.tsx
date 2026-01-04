'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AdminProfile } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface AuthContextType {
  admin: AdminProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (moduleName: string, action: 'view' | 'create' | 'edit' | 'delete') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const storedAdmin = authService.getStoredAdmin();
          if (storedAdmin) {
            setAdmin(storedAdmin);

            const profile = await authService.getProfile();
            setAdmin(profile);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setAdmin(response.admin);
      router.push('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Invalid credentials');
      }
      throw new Error('Something went wrong');
    }
  };

  const logout = async () => {
    await authService.logout();
    setAdmin(null);
    router.push('/login');
  };

  const hasPermission = (
    moduleName: string,
    action: 'view' | 'create' | 'edit' | 'delete'
  ): boolean => {
    return authService.hasPermission(moduleName, action);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
