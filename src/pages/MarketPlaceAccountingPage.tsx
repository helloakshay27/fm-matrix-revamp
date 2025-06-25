
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart3, 
  User, 
  CreditCard, 
  Receipt, 
  FileText, 
  Settings, 
  Wrench 
} from 'lucide-react';

export const MarketPlaceAccountingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    pan: '',
    tan: '',
    societyRegistrationNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: BarChart3, active: false },
    { name: 'Accountant', icon: User, active: false },
    { name: 'Transactions', icon: CreditCard, active: false },
    { name: 'Invoices', icon: FileText, active: false },
    { name: 'Receipts', icon: Receipt, active: false },
    { name: 'Configuration', icon: Settings, active: false },
    { name: 'Custom Settings', icon: Wrench, active: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#2c3e50] text-white">
        {/* Logo */}
        <div className="p-6 border-b border-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-white font-bold text-lg">LOCKATED</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={item.name}>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-600 rounded-lg transition-colors">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            <button className="px-6 py-4 text-[#17a2b8] border-b-2 border-[#17a2b8] font-medium">
              Accounting
            </button>
            <button className="px-6 py-4 text-gray-600 hover:text-gray-800">
              CRM
            </button>
            <button className="px-6 py-4 text-gray-600 hover:text-gray-800">
              PMS
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold text-gray-800 mb-8">
              Welcome Godrej Living,
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full h-12 border-gray-300 rounded-md"
                />
              </div>

              <div>
                <Label htmlFor="pan" className="text-sm font-medium text-gray-700 mb-2 block">
                  PAN
                </Label>
                <Input
                  id="pan"
                  value={formData.pan}
                  onChange={(e) => handleInputChange('pan', e.target.value)}
                  className="w-full h-12 border-gray-300 rounded-md"
                />
              </div>

              <div>
                <Label htmlFor="tan" className="text-sm font-medium text-gray-700 mb-2 block">
                  TAN
                </Label>
                <Input
                  id="tan"
                  value={formData.tan}
                  onChange={(e) => handleInputChange('tan', e.target.value)}
                  className="w-full h-12 border-gray-300 rounded-md"
                />
              </div>

              <div>
                <Label htmlFor="societyRegistrationNumber" className="text-sm font-medium text-gray-700 mb-2 block">
                  Society Registration Number
                </Label>
                <Input
                  id="societyRegistrationNumber"
                  value={formData.societyRegistrationNumber}
                  onChange={(e) => handleInputChange('societyRegistrationNumber', e.target.value)}
                  className="w-full h-12 border-gray-300 rounded-md"
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 right-0 p-6">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-sm">Powered by</span>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">L</span>
              </div>
              <span className="font-semibold text-sm">LOCKATED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
