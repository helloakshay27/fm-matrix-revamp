
import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose, appName }) => {
  const [formData, setFormData] = useState({
    activityStatus: '',
    contactPersonName: '',
    email: '',
    phone: '',
    country: 'United States',
    followTerms: false,
    receiveUpdates: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle installation logic here
    console.log('Installing app:', appName, formData);
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-white rounded-lg">
        {/* Header */}
        <div className="bg-[#C72030] text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Confirm Installation</h2>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white/10 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Use of Personal Details</h3>
            <p className="text-sm text-gray-600 mb-3">
              The following details will be shared with the vendor.
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Status
                </label>
                <input
                  type="text"
                  value={formData.activityStatus}
                  onChange={(e) => handleInputChange('activityStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                  placeholder="abhay.dubey@paxel.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                >
                  <option value="United States">United States</option>
                  <option value="India">India</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <label className="flex items-start space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.followTerms}
                onChange={(e) => handleInputChange('followTerms', e.target.checked)}
                className="mt-1"
              />
              <span className="text-gray-600">
                I agree to the terms of the end-client/end-customer to contact me regarding sales, promotions, 
                offers, and other relevant updates.
              </span>
            </label>

            <label className="flex items-start space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.receiveUpdates}
                onChange={(e) => handleInputChange('receiveUpdates', e.target.checked)}
                className="mt-1"
              />
              <span className="text-gray-600">
                I want to receive email updates.
              </span>
            </label>
          </div>

          {/* Installation Details */}
          <div className="bg-gray-50 p-3 rounded">
            <h4 className="font-medium text-gray-900 mb-2">Installation details</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Marketplace:</span>
                <span>Lead Enrichment by Zeda CRM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Source:</span>
                <span>CRM Plus editions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Install Status:</span>
                <span className="text-green-600 font-medium">Licensed</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-[#C72030] text-white rounded hover:bg-[#A01A28] transition-colors"
            >
              Install Application
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
