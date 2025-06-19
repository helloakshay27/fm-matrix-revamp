
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { SettingsSidebar } from './SettingsSidebar';

interface SettingsLayoutProps {
  children?: React.ReactNode;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex pt-16">
        <SettingsSidebar />
        
        <main className="flex-1 p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
</SettingsLayout>
