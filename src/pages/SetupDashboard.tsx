
import React, { useEffect } from 'react';
import { SetupLayout } from '../components/SetupLayout';
import { useLayout } from '../contexts/LayoutContext';

export const SetupDashboard = () => {

  // Note: Section is now automatically set by LayoutProvider based on route
  // useEffect(() => {
  //   setCurrentSection('Settings');
  // }, [setCurrentSection]);

  return (
    <SetupLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Setup Dashboard</h1>
        <p className="text-[#1a1a1a] opacity-70">Configure your system settings and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-[#D5DbDB]">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Location Management</h3>
          <p className="text-sm text-[#1a1a1a] opacity-70">Manage accounts, buildings, wings, areas, floors, units, and rooms</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-[#D5DbDB]">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">User Roles</h3>
          <p className="text-sm text-[#1a1a1a] opacity-70">Configure departments, roles, FM users, and occupant users</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-[#D5DbDB]">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">System Configuration</h3>
          <p className="text-sm text-[#1a1a1a] opacity-70">Setup meter types, asset groups, and checklists</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-[#D5DbDB]">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Ticket Management</h3>
          <p className="text-sm text-[#1a1a1a] opacity-70">Configure ticket setup, escalation, and cost approval</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-[#D5DbDB]">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Approval Systems</h3>
          <p className="text-sm text-[#1a1a1a] opacity-70">Manage approval matrix and patrolling approval</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-[#D5DbDB]">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Configuration</h3>
          <p className="text-sm text-[#1a1a1a] opacity-70">Setup SAC/HSN, addresses, and export settings</p>
        </div>
      </div>
    </SetupLayout>
  );
};
