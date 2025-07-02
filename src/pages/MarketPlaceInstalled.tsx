
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Calculator, CheckCircle } from 'lucide-react';

const installedApps = [
  {
    id: 'lease-management',
    name: 'Lease Management',
    description: 'Manage property leases and agreements',
    icon: FileText,
    href: '/market-place/lease-management',
    version: '2.1.0',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Financial management and reporting',
    icon: Calculator,
    href: '/market-place/accounting',
    version: '1.5.2',
    lastUpdated: '2024-01-10'
  }
];

const MarketPlaceInstalled = () => {
  const navigate = useNavigate();

  const handleCardClick = (href: string) => {
    navigate(href);
  };

  return (
    <div className="p-6 bg-[#fafafa] min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Installed Apps</h1>
        <p className="text-gray-600">Manage your installed applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {installedApps.map((app) => (
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
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs">Installed</span>
                </div>
              </div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">{app.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{app.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Version {app.version}</span>
                <span>Updated {app.lastUpdated}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MarketPlaceInstalled;
