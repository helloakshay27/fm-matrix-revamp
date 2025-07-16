import React from 'react';
import { MasterSidebar } from './MasterSidebar';
import { Header } from './Header';

interface MasterLayoutProps {
  children?: React.ReactNode;
}

export const MasterLayout = ({ children }: MasterLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="flex">
        <MasterSidebar />
        <main className="flex-1 ml-64 mt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};