import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { DynamicHeader } from './DynamicHeader';
import { Header } from './Header';
import { useLayout } from '../contexts/LayoutContext';
import { OmanSidebar } from './OmanSidebar';
import { OmanDynamicHeader } from './OmanDynamicHeader';
import ViSidebar from './ViSidebar';
import ViDynamicHeader from './ViDynamicHeader';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSidebarCollapsed } = useLayout();

  // Get current domain
  const hostname = window.location.hostname;

  // Check if it's Oman site
  const isOmanSite = hostname.includes('oig.gophygital.work');
  const isViSite = hostname.includes('web.gophygital.work');

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />

      {/* Conditionally render based on domain */}
      {isOmanSite ? (
        <>
          <OmanSidebar />
          <OmanDynamicHeader />
        </>
      ) : isViSite ? (
        <>
          <ViSidebar />
          <ViDynamicHeader />
        </>
      ) : (
        <>
          <Sidebar />
          <DynamicHeader />
        </>
      )}

      <main
        className={`${isSidebarCollapsed ? 'ml-16' : 'ml-64'} pt-28 transition-all duration-300`}
      >
        <Outlet />
      </main>
    </div>
  );
};
