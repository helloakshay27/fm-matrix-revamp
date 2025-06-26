
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SetupSidebar } from './SetupSidebar';
import { SetupHeader } from './SetupHeader';

interface SetupLayoutProps {
  children: React.ReactNode;
}

export const SetupLayout = ({ children }: SetupLayoutProps) => {
  return (
    <div className="min-h-screen">
      {/* Setup Header */}
      <div className="dashboard-header">
        <SetupHeader />
      </div>
      
      {/* Setup Sidebar */}
      <div className="dashboard-sidebar">
        <SetupSidebar />
      </div>
      
      {/* Main Content */}
      <main className="dashboard-main">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
