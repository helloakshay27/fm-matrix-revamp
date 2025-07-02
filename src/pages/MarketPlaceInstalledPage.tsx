
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText, Calculator, Search, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const installedApps = [
  {
    id: 1,
    name: 'Lease Management',
    description: 'Manage your lease agreements and contracts efficiently',
    icon: FileText,
    version: '2.1.0',
    installDate: '2024-01-15',
    href: '/market-place/lease-management'
  },
  {
    id: 2,
    name: 'Accounting',
    description: 'Complete accounting and financial management solution',
    icon: Calculator,
    version: '3.0.1',
    installDate: '2024-02-10',
    href: '/market-place/accounting'
  }
];

export const MarketPlaceInstalledPage = () => {
  const navigate = useNavigate();

  const handleCardClick = (href: string) => {
    navigate(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Market Place - Installed Apps</h1>
            <div className="text-sm text-gray-600">
              {installedApps.length} app{installedApps.length !== 1 ? 's' : ''} installed
            </div>
          </div>
          
          {/* Search */}
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search installed apps"
              className="pl-10"
            />
          </div>
        </div>

        {/* Installed Apps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {installedApps.map((app) => (
            <Card 
              key={app.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-green-500"
              onClick={() => handleCardClick(app.href)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#C72030] rounded-lg flex items-center justify-center">
                      <app.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium">{app.name}</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600">Installed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs text-gray-600 mb-2">
                  {app.description}
                </CardDescription>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Version: {app.version}</span>
                  <span>Installed: {app.installDate}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
