'use client';

import React from 'react';
import { AuthProvider } from './contexts/auth-context';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Provider;
