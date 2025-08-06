
import React from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // For now, just render children directly
  // In a real app, you'd check authentication status here
  return <>{children}</>;
};
