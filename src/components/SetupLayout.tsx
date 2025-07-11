
import React from 'react';

interface SetupLayoutProps {
  children: React.ReactNode;
}

export const SetupLayout = ({ children }: SetupLayoutProps) => {
  return (
    <div className="flex-1 ml-64 p-6 bg-gray-50 min-h-screen">
      {children}
    </div>
  );
};
