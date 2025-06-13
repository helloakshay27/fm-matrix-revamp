
import React, { useState } from 'react';
import { SupplierTable } from '../components/SupplierTable';
import { AddSupplierForm } from '../components/AddSupplierForm';

export const SupplierDashboard = () => {
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Supplier &gt; Supplier List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">SUPPLIER LIST</h1>
        </div>
      </div>
      
      {/* Supplier Table */}
      <SupplierTable onAddSupplier={() => setIsAddSupplierOpen(true)} />

      {/* Add Supplier Form Modal */}
      <AddSupplierForm 
        isOpen={isAddSupplierOpen} 
        onClose={() => setIsAddSupplierOpen(false)} 
      />
    </div>
  );
};
