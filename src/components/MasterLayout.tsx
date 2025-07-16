import React from 'react';
import { MasterSidebar } from './MasterSidebar';
import { Header } from './Header';

interface MasterLayoutProps {
  children?: React.ReactNode;
}

export const MasterLayout = ({ children }: MasterLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#fafafa] w-full">
      <Header />
      <div className="flex w-full">
        <MasterSidebar />
        <main className="flex-1 ml-64 mt-16 p-6 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};