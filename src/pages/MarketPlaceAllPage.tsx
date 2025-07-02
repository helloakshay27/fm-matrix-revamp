
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Target, Phone, Calculator } from 'lucide-react';

const MarketPlaceAllPage = () => {
  const navigate = useNavigate();

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

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Edition: All</span>
          <span className="text-sm text-gray-600">Price: All</span>
          <span className="text-sm text-gray-600">Rating: All</span>
          <span className="text-sm text-gray-600">Deployment type: All</span>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search apps"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {/* Featured Apps Section */}
      <div className="bg-[#C72030] rounded-lg p-6">
        <h2 className="text-white text-xl font-semibold mb-4">Featured apps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredApps.map((app) => (
            <div
              key={app.id}
              onClick={() => handleCardClick(app.route)}
              className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <app.icon className="w-8 h-8 text-[#C72030]" />
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">FREE</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{app.name}</h3>
              <p className="text-sm text-gray-600">{app.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editor's Pick Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Editor's pick</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredApps.map((app) => (
            <div
              key={`editor-${app.id}`}
              onClick={() => handleCardClick(app.route)}
              className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <app.icon className="w-8 h-8 text-[#C72030]" />
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">FREE</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{app.name}</h3>
              <p className="text-sm text-gray-600">{app.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketPlaceAllPage;
