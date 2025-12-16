'use client';

import React from 'react';
import { AuthProvider } from './contexts/auth-context';
import { ThemeProvider } from './components/theme-provider';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>{children}</AuthProvider>;
    </ThemeProvider>
  );
};

export default Provider;
