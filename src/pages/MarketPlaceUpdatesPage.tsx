
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Package, CheckSquare, Download } from 'lucide-react';

const availableUpdates = [
  {
    id: 1,
    name: 'Facility Management',
    description: 'Complete facility management solution',
    icon: Building,
    currentVersion: '2.1.0',
    newVersion: '2.2.0',
    updateSize: '12.5 MB',
    updateNotes: 'Bug fixes and performance improvements',
    href: '/maintenance'
  },
  {
    id: 2,
    name: 'Asset Tracking',
    description: 'Track and manage your assets',
    icon: Package,
    currentVersion: '1.8.5',
    newVersion: '1.9.0',
    updateSize: '8.2 MB',
    updateNotes: 'New reporting features and UI enhancements',
    href: '/maintenance/asset'
  },
  {
    id: 4,
    name: 'Security System',
    description: 'Comprehensive security management',
    icon: CheckSquare,
    currentVersion: '3.0.1',
    newVersion: '3.1.0',
    updateSize: '15.7 MB',
    updateNotes: 'Enhanced security protocols and new dashboard',
    href: '/security'
  }
];

export const MarketPlaceUpdatesPage = () => {
  const navigate = useNavigate();

  const handleCardClick = (href: string) => {
    navigate(href);
  };

  const handleUpdateClick = (e: React.MouseEvent, appName: string) => {
    e.stopPropagation();
    // Handle update logic here
    console.log(`Updating ${appName}...`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Available Updates</h1>
        <p className="text-[#1a1a1a] opacity-70">Keep your applications up to date</p>
      </div>

      {availableUpdates.length > 0 ? (
        <div className="space-y-4">
          {availableUpdates.map((app) => (
            <Card 
              key={app.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
              onClick={() => handleCardClick(app.href)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#C72030] rounded-lg flex items-center justify-center">
                    <app.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-[#1a1a1a] mb-1">{app.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{app.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span>Current: v{app.currentVersion}</span>
                          <span>→</span>
                          <span className="text-[#C72030] font-medium">New: v{app.newVersion}</span>
                          <span>•</span>
                          <span>{app.updateSize}</span>
                        </div>
                        <p className="text-sm text-gray-600">{app.updateNotes}</p>
                      </div>
                      <Button 
                        onClick={(e) => handleUpdateClick(e, app.name)}
                        style={{ backgroundColor: '#C72030' }}
                        className="text-white hover:bg-[#C72030]/90"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">All applications are up to date</h3>
          <p className="text-gray-400">Check back later for new updates</p>
        </div>
      )}
    </div>
  );
};
