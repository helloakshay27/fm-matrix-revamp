
import React, { useState } from 'react';
import { SupplierTable } from '../components/SupplierTable';
import { AddSupplierForm } from '../components/AddSupplierForm';
import { Heading } from '@/components/ui/heading';

export const SupplierDashboard = () => {
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Supplier &gt; Supplier List</p>
          <Heading level="h1" variant="default" className="uppercase">
            SUPPLIER LIST
          </Heading>
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
