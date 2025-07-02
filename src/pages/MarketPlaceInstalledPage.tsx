
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Target, Search } from 'lucide-react';

export const MarketPlaceInstalledPage = () => {
  const navigate = useNavigate();

  const installedApps = [
    {
      id: 'lease-management',
      name: 'Lease Management',
      description: 'Comprehensive lease management system',
      icon: Building,
      route: '/market-place/lease-management',
      installedDate: 'Dec 15, 2023'
    },
    {
      id: 'loyalty-rule-engine',
      name: 'Loyalty Rule Engine',
      description: 'Advanced loyalty program management',
      icon: Target,
      route: '/market-place/loyalty-rule-engine',
      installedDate: 'Nov 28, 2023'
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Installed Applications</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search installed apps"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Your Installed Apps</h2>
          <span className="text-sm text-gray-600">{installedApps.length} apps installed</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {installedApps.map((app) => (
            <div
              key={app.id}
              onClick={() => handleCardClick(app.route)}
              className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <app.icon className="w-6 h-6 text-gray-600" />
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  INSTALLED
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{app.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{app.description}</p>
              <p className="text-xs text-gray-500">
                Installed on {app.installedDate}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
