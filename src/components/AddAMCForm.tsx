
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface AddAMCFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAMCForm = ({ isOpen, onClose }: AddAMCFormProps) => {
  const [formData, setFormData] = useState({
    assetName: '',
    vendor: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AMC Form Data:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#1a1a1a]">Add New AMC</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Asset Name"
              type="text"
              placeholder="Enter asset name"
              value={formData.assetName}
              onChange={(e) => handleInputChange('assetName', e.target.value)}
            />
          </div>
          
          <div>
            <Input
              label="Vendor"
              type="text"
              placeholder="Enter vendor name"
              value={formData.vendor}
              onChange={(e) => handleInputChange('vendor', e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
            >
              Add AMC
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
