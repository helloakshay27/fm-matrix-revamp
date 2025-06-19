
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { DynamicHeader } from './DynamicHeader';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <Sidebar />
      <DynamicHeader />
      
      <main className="ml-64 pt-28">
        <Outlet />
      </main>
    </div>
  );
};
