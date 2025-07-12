
import React from 'react';

export const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Maintenance Tasks</h2>
          <p className="text-gray-600">View and manage scheduled maintenance tasks</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Work Orders</h2>
          <p className="text-gray-600">Track work order progress and completion</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Occupant Requests</h2>
          <p className="text-gray-600">Manage requests from building occupants</p>
        </div>
      </div>
    </div>
  );
};
