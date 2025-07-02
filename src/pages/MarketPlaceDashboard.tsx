
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Calculator, Phone, Shield } from 'lucide-react';

const marketPlaceApps = [
  {
    id: 'lease-management',
    name: 'Lease Management',
    description: 'Manage property leases and agreements',
    icon: FileText,
    href: '/market-place/lease-management',
    category: 'Property'
  },
  {
    id: 'loyalty-rule-engine',
    name: 'Loyalty Rule Engine',
    description: 'Create and manage loyalty programs',
    icon: Shield,
    href: '/market-place/loyalty-rule-engine',
    category: 'Customer'
  },
  {
    id: 'cloud-telephony',
    name: 'Cloud Telephony',
    description: 'Voice communication solutions',
    icon: Phone,
    href: '/market-place/cloud-telephony',
    category: 'Communication'
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Financial management and reporting',
    icon: Calculator,
    href: '/market-place/accounting',
    category: 'Finance'
  }
];

const MarketPlaceDashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (href: string) => {
    navigate(href);
  };

  return (
    <div className="p-6 bg-[#fafafa] min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Market Place</h1>
        <p className="text-gray-600">Discover and manage applications for your facility management needs</p>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
            <option>Edition: All</option>
            <option>Basic</option>
            <option>Professional</option>
            <option>Enterprise</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
            <option>Price: All</option>
            <option>Free</option>
            <option>Paid</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
            <option>Rating: All</option>
            <option>5 Stars</option>
            <option>4+ Stars</option>
            <option>3+ Stars</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
            <option>Deployment type: All</option>
            <option>Cloud</option>
            <option>On-premise</option>
            <option>Hybrid</option>
          </select>
        </div>
        <div className="ml-auto">
          <input
            type="search"
            placeholder="Search apps"
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm w-64"
          />
        </div>
      </div>

      {/* Featured Apps Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 px-4 py-3 bg-[#C72030] text-white rounded-t-lg">
          Featured apps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketPlaceApps.map((app) => (
            <Card 
              key={app.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200"
              onClick={() => handleCardClick(app.href)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#C72030] rounded-lg flex items-center justify-center mb-4">
                    <app.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#1a1a1a] mb-2">{app.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{app.description}</p>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {app.category}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Editor's Pick Section */}
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Editor's pick</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketPlaceApps.map((app) => (
            <Card 
              key={`editor-${app.id}`}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200"
              onClick={() => handleCardClick(app.href)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#C72030] rounded-lg flex items-center justify-center">
                    <app.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#1a1a1a] text-sm">{app.name}</h3>
                    <p className="text-xs text-gray-600">{app.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketPlaceDashboard;
