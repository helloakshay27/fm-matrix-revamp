
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Calculator, Download, AlertCircle } from 'lucide-react';

const availableUpdates = [
  {
    id: 'lease-management',
    name: 'Lease Management',
    description: 'New features and bug fixes available',
    icon: FileText,
    href: '/market-place/lease-management',
    currentVersion: '2.1.0',
    newVersion: '2.2.0',
    updateSize: '15.2 MB',
    updateType: 'Feature Update'
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Critical security updates',
    icon: Calculator,
    href: '/market-place/accounting',
    currentVersion: '1.5.2',
    newVersion: '1.5.3',
    updateSize: '8.7 MB',
    updateType: 'Security Update'
  }
];

const MarketPlaceUpdates = () => {
  const navigate = useNavigate();

  const handleCardClick = (href: string) => {
    navigate(href);
  };

  const handleUpdateClick = (e: React.MouseEvent, appName: string) => {
    e.stopPropagation();
    console.log(`Updating ${appName}...`);
    // Handle update logic here
  };

  return (
    <div className="p-6 bg-[#fafafa] min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Available Updates</h1>
        <p className="text-gray-600">Keep your applications up to date</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableUpdates.map((app) => (
          <Card 
            key={app.id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200"
            onClick={() => handleCardClick(app.href)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-[#C72030] rounded-lg flex items-center justify-center">
                  <app.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-1 text-orange-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">{app.updateType}</span>
                </div>
              </div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">{app.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{app.description}</p>
              <div className="space-y-2 mb-4 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Current: {app.currentVersion}</span>
                  <span>New: {app.newVersion}</span>
                </div>
                <div>Size: {app.updateSize}</div>
              </div>
              <button
                className="w-full bg-[#C72030] hover:bg-[#A01828] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                onClick={(e) => handleUpdateClick(e, app.name)}
              >
                <Download className="w-4 h-4" />
                Update
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MarketPlaceUpdates;
