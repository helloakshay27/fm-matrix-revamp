
import React, { useState } from 'react';
import { AMCTable } from '../components/AMCTable';
import { AddAMCForm } from '../components/AddAMCForm';

export const AMCDashboard = () => {
  const [isAddAMCOpen, setIsAddAMCOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">AMC &gt; AMC List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">AMC LIST</h1>
        </div>
      </div>
      
      {/* AMC Table */}
      <AMCTable onAddAMC={() => setIsAddAMCOpen(true)} />

      {/* Add AMC Form Modal */}
      <AddAMCForm 
        isOpen={isAddAMCOpen} 
        onClose={() => setIsAddAMCOpen(false)} 
      />
    </div>
  );
};
