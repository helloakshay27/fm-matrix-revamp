import React from 'react';
import { MasterSidebar } from './MasterSidebar';
import { Header } from './Header';

interface MasterLayoutProps {
  children?: React.ReactNode;
}

export const MasterLayout = ({ children }: MasterLayoutProps) => {
  return (
    <div className="h-screen flex flex-col bg-[#fafafa] overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <MasterSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};