
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Target, Download } from 'lucide-react';
import { SearchWithSuggestions } from '@/components/SearchWithSuggestions';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';

export const MarketPlaceUpdatesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

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

  const suggestions = useSearchSuggestions({
    data: availableUpdates,
    searchFields: ['name', 'description']
  });

  const filteredUpdates = availableUpdates.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleUpdate = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    // Handle update logic here
    console.log(`Updating app: ${appId}`);
    // You could show a toast notification here
    alert(`Updating ${appId}...`);
  };

  const handleUpdateAll = () => {
    console.log('Updating all apps...');
    alert('Updating all apps...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">App Updates</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleUpdateAll}
            className="text-[#C72030] hover:text-[#A01A28] text-sm font-medium transition-colors"
          >
            Update All
          </button>
          <div className="w-80">
            <SearchWithSuggestions
              placeholder="Search updates"
              onSearch={handleSearch}
              suggestions={suggestions}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Available Updates Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Available Updates</h2>
          <span className="text-sm text-gray-600">{filteredUpdates.length} updates available</span>
        </div>
        
        {filteredUpdates.length > 0 ? (
          <div className="space-y-4">
            {filteredUpdates.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center space-x-4 cursor-pointer flex-1"
                    onClick={() => handleCardClick(app.route)}
                  >
                    <div className="w-12 h-12 bg-[#C72030] rounded-lg flex items-center justify-center">
                      <app.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{app.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{app.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Current: <span className="font-medium">v{app.currentVersion}</span></span>
                        <span>→</span>
                        <span>New: <span className="text-[#C72030] font-medium">v{app.newVersion}</span></span>
                        <span>•</span>
                        <span>{app.updateSize}</span>
                        <span>•</span>
                        <span>{app.updateDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded font-medium">UPDATE AVAILABLE</span>
                    <button
                      onClick={(e) => handleUpdate(e, app.id)}
                      className="bg-[#C72030] text-white px-4 py-2 rounded-lg hover:bg-[#A01A28] transition-colors flex items-center space-x-2 font-medium"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No updates found' : 'All apps are up to date'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'No updates match your search criteria.' 
                : 'Your installed applications are running the latest versions.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
