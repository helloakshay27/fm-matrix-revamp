
import React from 'react';
import { SetupSidebar } from '../components/SetupSidebar';

export const SetupDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SetupSidebar />
      <main className="flex-1 ml-64">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6">Setup Dashboard</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Select an option from the sidebar to configure your system settings.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
