
import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { AMCTable } from '../components/AMCTable';
import { AddAMCForm } from '../components/AddAMCForm';

export const AMCDashboard = () => {
  const [isAddAMCOpen, setIsAddAMCOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Sidebar />
      <Header />
      
      <main className="ml-64 pt-16 p-6">
        {/* Top Navigation Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-8 border-b border-[#D5DbDB]">
            <button className="pb-3 text-[#1a1a1a] opacity-70 hover:opacity-100 transition-opacity">
              Project
            </button>
            <button className="pb-3 text-[#C72030] border-b-2 border-[#C72030] font-medium">
              Maintenance
            </button>
            <button className="pb-3 text-[#1a1a1a] opacity-70 hover:opacity-100 transition-opacity">
              CRM
            </button>
            <button className="pb-3 text-[#1a1a1a] opacity-70 hover:opacity-100 transition-opacity">
              Utility
            </button>
            <button className="pb-3 text-[#1a1a1a] opacity-70 hover:opacity-100 transition-opacity">
              Visitors
            </button>
            <button className="pb-3 text-[#1a1a1a] opacity-70 hover:opacity-100 transition-opacity">
              Experience
            </button>
            <button className="pb-3 text-[#1a1a1a] opacity-70 hover:opacity-100 transition-opacity">
              Property
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div>
            <p className="text-[#1a1a1a] opacity-70 mb-2">AMC &gt; AMC List</p>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">AMC LIST</h1>
          </div>
        </div>
        
        {/* AMC Table */}
        <AMCTable onAddAMC={() => setIsAddAMCOpen(true)} />
      </main>

      {/* Add AMC Form Modal */}
      <AddAMCForm 
        isOpen={isAddAMCOpen} 
        onClose={() => setIsAddAMCOpen(false)} 
      />
    </div>
  );
};
