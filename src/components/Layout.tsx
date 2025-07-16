
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MasterSidebar } from './MasterSidebar';
import { DynamicHeader } from './DynamicHeader';
import { Header } from './Header';
import { useLayout } from '../contexts/LayoutContext';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentSection } = useLayout();

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      {currentSection === 'Master' ? <MasterSidebar /> : <Sidebar />}
      <DynamicHeader />
      
      <main className="ml-64 pt-28">
        <Outlet />
      </main>
    </div>
  );
};
