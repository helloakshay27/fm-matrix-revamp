
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface AddVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  amcId: string;
}

export const AddVisitModal = ({ isOpen, onClose, amcId }: AddVisitModalProps) => {
  const [formData, setFormData] = useState({
    vendor: '',
    startDate: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Visit Data:', { ...formData, amcId });
    // Handle form submission
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-[#1a1a1a]">ADD VISIT</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Vendor<span className="text-red-500">*</span>
              </label>
              <Input 
                placeholder="Enter Visit Number"
                value={formData.vendor}
                onChange={(e) => handleInputChange('vendor', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <Input 
                placeholder="Enter Visit Date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button 
              type="submit" 
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90 px-8"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
