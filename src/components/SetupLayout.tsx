
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SetupSidebar } from './SetupSidebar';
import { SetupHeader } from './SetupHeader';

export const SetupLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f6f4ee]">
      <SetupSidebar />
      <div className="flex-1 ml-64">
        <SetupHeader />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
