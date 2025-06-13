
import React, { useState } from 'react';
import { ServiceTable } from '../components/ServiceTable';
import { AddServiceForm } from '../components/AddServiceForm';

export const ServiceDashboard = () => {
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Services &gt; Service List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">SERVICE LIST</h1>
        </div>
      </div>
      
      {/* Service Table */}
      <ServiceTable onAddService={() => setIsAddServiceOpen(true)} />

      {/* Add Service Form Modal */}
      <AddServiceForm 
        isOpen={isAddServiceOpen} 
        onClose={() => setIsAddServiceOpen(false)} 
      />
    </div>
  );
};
