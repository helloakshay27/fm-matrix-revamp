
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Target, Phone, Calculator } from 'lucide-react';
import { SearchWithSuggestions } from '@/components/SearchWithSuggestions';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';

const MarketPlaceAllPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const featuredApps = [
    {
      id: 'lease-management',
      name: 'Lease Management',
      description: 'Comprehensive lease management system',
      icon: Building,
      route: '/market-place/lease-management'
    },
    {
      id: 'loyalty-rule-engine',
      name: 'Loyalty Rule Engine',
      description: 'Advanced loyalty program management',
      icon: Target,
      route: '/market-place/loyalty-rule-engine'
    },
    {
      id: 'cloud-telephony',
      name: 'Cloud Telephony',
      description: 'Cloud-based telephony solutions',
      icon: Phone,
      route: '/market-place/cloud-telephony'
    },
    {
      id: 'accounting',
      name: 'Accounting',
      description: 'Complete accounting management system',
      icon: Calculator,
      route: '/market-place/accounting'
    }
  ];

  const suggestions = useSearchSuggestions({
    data: featuredApps,
    searchFields: ['name', 'description']
  });

  const filteredApps = featuredApps.filter(app =>
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
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Edition: <span className="text-blue-600 underline">All</span></span>
          <span className="text-sm text-gray-600">Price: <span className="text-blue-600 underline">All</span></span>
          <span className="text-sm text-gray-600">Rating: <span className="text-blue-600 underline">All</span></span>
          <span className="text-sm text-gray-600">Deployment type: <span className="text-blue-600 underline">All</span></span>
        </div>
        <div className="w-80">
          <SearchWithSuggestions
            placeholder="Search apps"
            onSearch={handleSearch}
            suggestions={suggestions}
            className="w-full"
          />
        </div>
      </div>

      {/* Featured Apps Section */}
      <div className="bg-[#C72030] rounded-lg p-6">
        <h2 className="text-white text-xl font-semibold mb-4">Featured apps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              onClick={() => handleCardClick(app.route)}
              className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <app.icon className="w-8 h-8 text-[#C72030]" />
                <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">FREE</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-base">{app.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{app.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editor's Pick Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Editor's pick</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredApps.map((app) => (
            <div
              key={`editor-${app.id}`}
              onClick={() => handleCardClick(app.route)}
              className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <app.icon className="w-8 h-8 text-[#C72030]" />
                <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">FREE</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-base">{app.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{app.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketPlaceAllPage;
