
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AccountDetails {
  unit: string;
  asOf: string;
  name: string;
  country: string;
  state: string;
  city: string;
  timeZone: string;
  currencyCode: string;
  language: string;
  gstRegistered: boolean;
  clientPortal: string;
  active: boolean;
  isDelete: boolean;
}

export const AccountingDashboard = () => {
  const [currentView, setCurrentView] = useState<'form' | 'details' | 'edit'>('form');
  const [name, setName] = useState('');
  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    unit: 'So13itp',
    asOf: 'Pma-Site',
    name: 'Ankit',
    country: '',
    state: '',
    city: '',
    timeZone: '',
    currencyCode: '',
    language: '',
    gstRegistered: false,
    clientPortal: '',
    active: true,
    isDelete: false
  });
  const [editDetails, setEditDetails] = useState<AccountDetails>(accountDetails);

  const loggedInUser = 'Ankit Gupta'; // This would come from your auth context

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setAccountDetails(prev => ({ ...prev, name: name.trim() }));
      setCurrentView('details');
      console.log('Account details submitted:', { name });
    }
  };

  const handleEdit = () => {
    setEditDetails(accountDetails);
    setCurrentView('edit');
  };

  const handleUpdateAccount = () => {
    setAccountDetails(editDetails);
    setCurrentView('details');
    console.log('Account updated:', editDetails);
  };

  const handleBack = () => {
    setCurrentView('details');
  };

  const handleInputChange = (field: keyof AccountDetails, value: string | boolean) => {
    setEditDetails(prev => ({ ...prev, [field]: value }));
  };

  if (currentView === 'edit') {
    return (
      <div className="p-6 bg-white min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Editing Lock Account</h1>
        
        <div className="max-w-md space-y-4">
          <div>
            <Label className="text-sm font-medium">Unit</Label>
            <Input
              value={editDetails.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">As of</Label>
            <Input
              value={editDetails.asOf}
              onChange={(e) => handleInputChange('asOf', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Name</Label>
            <Input
              value={editDetails.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Country</Label>
            <Input
              value={editDetails.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">State</Label>
            <Input
              value={editDetails.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">City</Label>
            <Input
              value={editDetails.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Time zone</Label>
            <Input
              value={editDetails.timeZone}
              onChange={(e) => handleInputChange('timeZone', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Currency code</Label>
            <Input
              value={editDetails.currencyCode}
              onChange={(e) => handleInputChange('currencyCode', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Language</Label>
            <Input
              value={editDetails.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="gstRegistered"
              checked={editDetails.gstRegistered}
              onChange={(e) => handleInputChange('gstRegistered', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="gstRegistered" className="text-sm font-medium">Get registered</Label>
          </div>

          <div>
            <Label className="text-sm font-medium">Client portal</Label>
            <Input
              value={editDetails.clientPortal}
              onChange={(e) => handleInputChange('clientPortal', e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active"
              checked={editDetails.active}
              onChange={(e) => handleInputChange('active', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="active" className="text-sm font-medium">Active</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDelete"
              checked={editDetails.isDelete}
              onChange={(e) => handleInputChange('isDelete', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="isDelete" className="text-sm font-medium">Is delete</Label>
          </div>

          <Button 
            onClick={handleUpdateAccount}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 mt-6"
          >
            Update Lock account
          </Button>
        </div>
      </div>
    );
  }

  if (currentView === 'details') {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="mb-4">
          <div className="bg-green-100 text-green-800 p-2 rounded mb-4 text-sm">
            Lock account was successfully {accountDetails.name === 'Ankit' ? 'updated' : 'created'}.
          </div>
        </div>

        <div className="space-y-3 max-w-md">
          <div className="flex">
            <span className="font-medium w-32">Unit:</span>
            <span>{accountDetails.unit}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">As of:</span>
            <span>{accountDetails.asOf}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Name:</span>
            <span>{accountDetails.name}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Country:</span>
            <span>{accountDetails.country}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">State:</span>
            <span>{accountDetails.state}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">City:</span>
            <span>{accountDetails.city}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Time zone:</span>
            <span>{accountDetails.timeZone}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Currency code:</span>
            <span>{accountDetails.currencyCode}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Language:</span>
            <span>{accountDetails.language}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Get registered:</span>
            <span>{accountDetails.gstRegistered ? 'true' : 'false'}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Client portal:</span>
            <span>{accountDetails.clientPortal}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Active:</span>
            <span>{accountDetails.active ? 'true' : 'false'}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Is delete:</span>
            <span>{accountDetails.isDelete ? 'true' : 'false'}</span>
          </div>
        </div>

        <div className="mt-6 space-x-2">
          <Button 
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4"
          >
            Edit
          </Button>
          <Button 
            onClick={handleBack}
            variant="outline"
            className="px-4"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Finance &gt; Account
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">ACCOUNT EDIT/DETAIL</h1>

      {/* Welcome Message */}
      <div className="mb-6">
        <p className="text-lg">Welcome {loggedInUser},</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            placeholder="Enter name"
          />
        </div>

        <Button 
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-8"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};
