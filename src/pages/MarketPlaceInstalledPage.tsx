
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Target, Phone, Calculator } from 'lucide-react';

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Installed Applications</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search installed apps"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {/* Installed Apps Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Installed Apps</h2>
          <span className="text-sm text-gray-600">{installedApps.length} apps installed</span>
        </div>
        
        {installedApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {installedApps.map((app) => (
              <div
                key={app.id}
                onClick={() => handleCardClick(app.route)}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <app.icon className="w-8 h-8 text-[#C72030]" />
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">INSTALLED</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{app.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{app.description}</p>
                <p className="text-xs text-gray-500">Installed on {app.installedDate}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Building className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No apps installed yet</h3>
            <p className="text-gray-600 mb-4">Browse the marketplace to find and install apps for your business.</p>
            <button
              onClick={() => navigate('/market-place/all')}
              className="bg-[#C72030] text-white px-4 py-2 rounded-lg hover:bg-[#A01A28] transition-colors"
            >
              Browse Marketplace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
