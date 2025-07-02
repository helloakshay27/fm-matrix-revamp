
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Calculator, Search, Download, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const availableUpdates = [
  {
    id: 1,
    name: 'Lease Management',
    description: 'New features for lease tracking and automated renewals',
    icon: FileText,
    currentVersion: '2.1.0',
    newVersion: '2.2.0',
    updateSize: '15.2 MB',
    releaseDate: '2024-03-01',
    href: '/market-place/lease-management'
  },
  {
    id: 2,
    name: 'Accounting',
    description: 'Performance improvements and bug fixes',
    icon: Calculator,
    currentVersion: '3.0.1',
    newVersion: '3.0.2',
    updateSize: '8.7 MB',
    releaseDate: '2024-02-28',
    href: '/market-place/accounting'
  }
];

export const MarketPlaceUpdatesPage = () => {
  const navigate = useNavigate();

  const handleCardClick = (href: string) => {
    navigate(href);
  };

  const handleUpdateClick = (e: React.MouseEvent, appName: string) => {
    e.stopPropagation();
    alert(`Updating ${appName}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Market Place - Updates</h1>
            <div className="text-sm text-gray-600">
              {availableUpdates.length} update{availableUpdates.length !== 1 ? 's' : ''} available
            </div>
          </div>
          
          {/* Search */}
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search for updates"
              className="pl-10"
            />
          </div>
        </div>

        {/* Available Updates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableUpdates.map((app) => (
            <Card 
              key={app.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-500"
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
                        <ArrowUp className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-blue-600">
                          {app.currentVersion} → {app.newVersion}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#C72030] hover:bg-[#A01020] text-white"
                    onClick={(e) => handleUpdateClick(e, app.name)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Update
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs text-gray-600 mb-2">
                  {app.description}
                </CardDescription>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Size: {app.updateSize}</span>
                  <span>Released: {app.releaseDate}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
