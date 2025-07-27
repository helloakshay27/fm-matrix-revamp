
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { DynamicHeader } from './DynamicHeader';
import { Header } from './Header';
import { useLayout } from '../contexts/LayoutContext';
import { OmanSidebar } from './OmanSidebar';
import { OmanDynamicHeader } from './OmanDynamicHeader';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentSection, isSidebarCollapsed } = useLayout();

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <OmanSidebar />
      <OmanDynamicHeader />

      <main className={`${isSidebarCollapsed ? 'ml-16' : 'ml-64'} pt-28 transition-all duration-300`}>
        <Outlet />
      </main>
    </div>
  );
};
