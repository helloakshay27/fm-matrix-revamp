
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Target, Phone, Calculator, Download } from 'lucide-react';

export const MarketPlaceUpdatesPage = () => {
  const navigate = useNavigate();

  const availableUpdates = [
    {
      id: 'lease-management',
      name: 'Lease Management',
      description: 'Comprehensive lease management system',
      icon: Building,
      route: '/market-place/lease-management',
      currentVersion: '2.1.0',
      newVersion: '2.2.0',
      updateDate: 'Jan 15, 2024',
      updateSize: '12.5 MB'
    },
    {
      id: 'loyalty-rule-engine',
      name: 'Loyalty Rule Engine',
      description: 'Advanced loyalty program management',
      icon: Target,
      route: '/market-place/loyalty-rule-engine',
      currentVersion: '1.8.2',
      newVersion: '1.9.0',
      updateDate: 'Jan 10, 2024',
      updateSize: '8.3 MB'
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  const handleUpdate = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    // Handle update logic here
    console.log(`Updating app: ${appId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">App Updates</h1>
        <div className="flex items-center space-x-4">
          <button className="text-[#C72030] hover:text-[#A01A28] text-sm font-medium">
            Update All
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search updates"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              🔍
            </div>
          </div>
        </div>
      </div>

      {/* Available Updates Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Available Updates</h2>
          <span className="text-sm text-gray-600">{availableUpdates.length} updates available</span>
        </div>
        
        {availableUpdates.length > 0 ? (
          <div className="space-y-4">
            {availableUpdates.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center space-x-4 cursor-pointer flex-1"
                    onClick={() => handleCardClick(app.route)}
                  >
                    <app.icon className="w-12 h-12 text-[#C72030]" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{app.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{app.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Current: v{app.currentVersion}</span>
                        <span>→</span>
                        <span className="text-[#C72030] font-medium">New: v{app.newVersion}</span>
                        <span>•</span>
                        <span>{app.updateSize}</span>
                        <span>•</span>
                        <span>{app.updateDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">UPDATE AVAILABLE</span>
                    <button
                      onClick={(e) => handleUpdate(e, app.id)}
                      className="bg-[#C72030] text-white px-4 py-2 rounded-lg hover:bg-[#A01A28] transition-colors flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Update</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Download className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">All apps are up to date</h3>
            <p className="text-gray-600">Your installed applications are running the latest versions.</p>
          </div>
        )}
      </div>
    </div>
  );
};
