
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Target, Phone, Calculator } from 'lucide-react';
import { SearchWithSuggestions } from '@/components/SearchWithSuggestions';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';

export const MarketPlaceInstalledPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

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
      route: '/loyalty-rule-engine',
      installedDate: 'Nov 28, 2023'
    }
  ];

  const suggestions = useSearchSuggestions({
    data: installedApps,
    searchFields: ['name', 'description']
  });

  const filteredApps = installedApps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Installed Applications</h1>
        <div className="w-80">
          <SearchWithSuggestions
            placeholder="Search installed apps"
            onSearch={handleSearch}
            suggestions={suggestions}
            className="w-full"
          />
        </div>
      </div>

      {/* Installed Apps Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Installed Apps</h2>
          <span className="text-sm text-gray-600">{filteredApps.length} apps installed</span>
        </div>
        
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => handleCardClick(app.route)}
                className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#C72030] rounded-lg flex items-center justify-center">
                    <app.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">INSTALLED</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{app.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{app.description}</p>
                <p className="text-xs text-gray-500">Installed on {app.installedDate}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Building className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No apps found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'No apps match your search criteria.' : 'Browse the marketplace to find and install apps for your business.'}
            </p>
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
