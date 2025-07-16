import React from 'react';
import { MasterSidebar } from './MasterSidebar';
import { Header } from './Header';

interface MasterLayoutProps {
  children?: React.ReactNode;
}

export const MasterLayout = ({ children }: MasterLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#fafafa] w-full overflow-x-hidden">
      <Header />
      <div className="flex w-full min-w-full">
        <MasterSidebar />
        <main className="flex-1 w-full min-w-0 ml-64 mt-16 overflow-x-auto">
          <div className="w-full min-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};