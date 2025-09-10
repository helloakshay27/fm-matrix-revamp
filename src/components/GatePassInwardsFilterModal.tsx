import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GatePassInwardsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (filters: any) => void;
}

export const GatePassInwardsFilterModal = ({ isOpen, onClose, filters, setFilters }: GatePassInwardsFilterModalProps) => {
  // Provide default filters if undefined
  const safeFilters = filters || {
    gateNumber: '',
    createdBy: '',
    materialName: '',
    supplierName: '',
    materialType: '',
    expectedReturnDate: '',
  };

  const handleChange = (field: string, value: string) => {
    setFilters({ ...safeFilters, [field]: value });
  };

  const handleApply = () => {
    onClose();
  };

  const handleReset = () => {
    setFilters({
      gateNumber: '',
      createdBy: '',
      materialName: '',
      supplierName: '',
      materialType: '',
      expectedReturnDate: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">FILTER</DialogTitle>
        </DialogHeader>
        <div className="">
          {/* Gate Number Input */}
          <div className="mb-4">
            <Label htmlFor="gateNumber" className="text-sm font-medium">
              Gate Number
            </Label>
            <Input
              id="gateNumber"
              placeholder="Enter gate number"
              value={safeFilters.gateNumber}
              onChange={e => handleChange('gateNumber', e.target.value)}
              className="border-gray-300 rounded-none"
            />
          </div>
          {/* Created By */}
          <div className="mb-4">
            <Label htmlFor="createdBy" className="text-sm font-medium">
              Created By (Full Name)
            </Label>
            <Input
              id="createdBy"
              placeholder="Enter full name"
              value={safeFilters.createdBy}
              onChange={e => handleChange('createdBy', e.target.value)}
              className="border-gray-300 rounded-none"
            />
          </div>
          {/* Material Name */}
          <div className="mb-4">
            <Label htmlFor="materialName" className="text-sm font-medium">
              Material Name
            </Label>
            <Input
              id="materialName"
              placeholder="Enter material name"
              value={safeFilters.materialName}
              onChange={e => handleChange('materialName', e.target.value)}
              className="border-gray-300 rounded-none"
            />
          </div>
          {/* Supplier Name */}
          <div className="mb-4">
            <Label htmlFor="supplierName" className="text-sm font-medium">
              Supplier Name
            </Label>
            <Input
              id="supplierName"
              placeholder="Enter supplier name"
              value={safeFilters.supplierName}
              onChange={e => handleChange('supplierName', e.target.value)}
              className="border-gray-300 rounded-none"
            />
          </div>
          {/* Material Type */}
          <div className="mb-4">
            <Label htmlFor="materialType" className="text-sm font-medium">
              Material Type
            </Label>
            <Input
              id="materialType"
              placeholder="Enter material type"
              value={safeFilters.materialType}
              onChange={e => handleChange('materialType', e.target.value)}
              className="border-gray-300 rounded-none"
            />
          </div>
          {/* Expected Return Date */}
          <div className="mb-4">
            <Label htmlFor="expectedReturnDate" className="text-sm font-medium">
              Expected Return Date
            </Label>
            <Input
              id="expectedReturnDate"
              type="date"
              value={safeFilters.expectedReturnDate}
              onChange={e => handleChange('expectedReturnDate', e.target.value)}
              className="border-gray-300 rounded-none"
            />
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-none"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
              className="hover:bg-[#F2EEE9]/90 px-6 py-2 rounded-none"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
