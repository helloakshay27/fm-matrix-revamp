
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const MarketPlaceAccountingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    pan: '',
    tan: '',
    societyRegistrationNumber: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Navigate to the details page
    navigate('/market-place/accounting/details');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-8">
        {/* Welcome Message */}
        <h1 className="text-2xl font-normal text-gray-700 mb-8">
          Welcome Admin,
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full border-gray-300 rounded-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-2">
              PAN
            </Label>
            <Input
              id="pan"
              type="text"
              value={formData.pan}
              onChange={(e) => handleInputChange('pan', e.target.value)}
              className="w-full border-gray-300 rounded-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="tan" className="block text-sm font-medium text-gray-700 mb-2">
              TAN
            </Label>
            <Input
              id="tan"
              type="text"
              value={formData.tan}
              onChange={(e) => handleInputChange('tan', e.target.value)}
              className="w-full border-gray-300 rounded-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="societyRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Society Registration Number
            </Label>
            <Input
              id="societyRegistrationNumber"
              type="text"
              value={formData.societyRegistrationNumber}
              onChange={(e) => handleInputChange('societyRegistrationNumber', e.target.value)}
              className="w-full border-gray-300 rounded-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          {/* Horizontal line */}
          <hr className="border-gray-300 my-6" />

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-6 py-2 rounded-none"
          >
            Submit
          </Button>
        </form>

        {/* Footer with LOCKATED branding */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Powered by</span>
            <div className="w-8 h-8 bg-yellow-500 rounded-sm flex items-center justify-center">
              <span className="text-black font-bold text-xs">L</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
