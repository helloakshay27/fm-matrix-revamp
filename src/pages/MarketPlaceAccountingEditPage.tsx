
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const MarketPlaceAccountingEditPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    uniq: 'uso24bn',
    asOf1: 'Pma-Site',
    asOf2: '2189',
    name: 'nadia',
    country: '',
    state: '',
    city: '',
    timeZone: '',
    currencyCode: '',
    language: '',
    getRegistered: '',
    clientPortal: '',
    active: true,
    isDelete: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = () => {
    console.log('Updated data:', formData);
    // Navigate back to details page with updated data
    navigate('/market-place/accounting/details');
  };

  const handleShow = () => {
    navigate('/market-place/accounting/details');
  };

  const handleBack = () => {
    navigate('/market-place/accounting');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-8">
        {/* Header */}
        <h1 className="text-xl font-medium text-gray-800 mb-8">Editing Lock Account</h1>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="uniq" className="block text-sm font-medium text-gray-700 mb-1">
              Uniq
            </Label>
            <Input
              id="uniq"
              type="text"
              value={formData.uniq}
              onChange={(e) => handleInputChange('uniq', e.target.value)}
              className="w-full border-gray-300 rounded-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="asOf1" className="block text-sm font-medium text-gray-700 mb-1">
              As of
            </Label>
            <Input
              id="asOf1"
              type="text"
              value={formData.asOf1}
              onChange={(e) => handleInputChange('asOf1', e.target.value)}
              className="w-full border-gray-300 rounded-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="asOf2" className="block text-sm font-medium text-gray-700 mb-1">
              As of
            </Label>
            <Input
              id="asOf2"
              type="text"
              value={formData.asOf2}
              onChange={(e) => handleInputChange('asOf2', e.target.value)}
              className="w-full border-gray-300 rounded-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
            <Label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </Label>
            <Input
              id="country"
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full border-gray-300 rounded-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </Label>
            <Input
              id="state"
              type="text"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full border-gray-300 rounded-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </Label>
            <Input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full border-gray-300 rounded-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 mb-1">
              Time zone
            </Label>
            <Input
              id="timeZone"
              type="text"
              value={formData.timeZone}
              onChange={(e) => handleInputChange('timeZone', e.target.value)}
              className="w-full border-gray-300 rounded-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="currencyCode" className="block text-sm font-medium text-gray-700 mb-1">
              Currency code
            </Label>
            <Input
              id="currencyCode"
              type="text"
              value={formData.currencyCode}
              onChange={(e) => handleInputChange('currencyCode', e.target.value)}
              className="w-full border-gray-300 rounded-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </Label>
            <Input
              id="language"
              type="text"
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="w-full border-gray-300 rounded-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="getRegistered" className="block text-sm font-medium text-gray-700 mb-1">
              Get registered
            </Label>
            <Input
              id="getRegistered"
              type="text"
              value={formData.getRegistered}
              onChange={(e) => handleInputChange('getRegistered', e.target.value)}
              className="w-full border-gray-300 rounded-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="clientPortal" className="block text-sm font-medium text-gray-700 mb-1">
              Client portal
            </Label>
            <Input
              id="clientPortal"
              type="text"
              value={formData.clientPortal}
              onChange={(e) => handleInputChange('clientPortal', e.target.value)}
              className="w-full border-gray-300 rounded-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="active"
              type="checkbox"
              checked={formData.active}
              onChange={(e) => handleInputChange('active', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label htmlFor="active" className="text-sm font-medium text-gray-700">
              Active
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isDelete"
              type="checkbox"
              checked={formData.isDelete}
              onChange={(e) => handleInputChange('isDelete', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label htmlFor="isDelete" className="text-sm font-medium text-gray-700">
              Is delete
            </Label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-x-2">
          <Button
            onClick={handleUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-none"
          >
            Update Lock account
          </Button>
          <Button
            onClick={handleShow}
            variant="outline"
            className="px-4 py-2 rounded-none"
          >
            Show
          </Button>
          <Button
            onClick={handleBack}
            variant="outline"
            className="px-4 py-2 rounded-none"
          >
            Back
          </Button>
        </div>

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
