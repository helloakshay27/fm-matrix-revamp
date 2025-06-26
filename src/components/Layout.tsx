
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { DynamicHeader } from './DynamicHeader';
import { Header } from './Header';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      {/* Header - using CSS variables */}
      <div className="dashboard-header">
        <Header />
      </div>
      
      {/* Sidebar - using CSS variables */}
      <div className="dashboard-sidebar">
        <Sidebar />
      </div>
      
      {/* Subheader - using CSS variables */}
      <div className="dashboard-subheader">
        <DynamicHeader />
      </div>
      
      {/* Main Content - using CSS variables */}
      <main className="dashboard-main">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
