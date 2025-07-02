
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Download, CheckSquare, Zap, Building, Calculator, Phone, Globe, Users, Settings } from 'lucide-react';

const featuredApps = [
  {
    id: 1,
    name: 'Facility Management',
    description: 'Complete facility management solution',
    icon: Building,
    category: 'Management',
    isInstalled: true,
    href: '/maintenance'
  },
  {
    id: 2,
    name: 'Asset Tracking',
    description: 'Track and manage your assets',
    icon: Package,
    category: 'Operations',
    isInstalled: true,
    href: '/maintenance/asset'
  },
  {
    id: 3,
    name: 'Energy Management',
    description: 'Monitor and optimize energy usage',
    icon: Zap,
    category: 'Utility',
    isInstalled: false,
    href: '/utility/energy'
  },
  {
    id: 4,
    name: 'Security System',
    description: 'Comprehensive security management',
    icon: CheckSquare,
    category: 'Security',
    isInstalled: true,
    href: '/security'
  }
];

const editorsPick = [
  {
    id: 5,
    name: 'CRM Suite',
    description: 'Customer relationship management',
    icon: Users,
    category: 'Sales',
    isInstalled: false,
    href: '/crm'
  },
  {
    id: 6,
    name: 'Accounting Plus',
    description: 'Advanced accounting features',
    icon: Calculator,
    category: 'Finance',
    isInstalled: true,
    href: '/finance/accounting'
  },
  {
    id: 7,
    name: 'Cloud Telephony',
    description: 'Cloud-based phone system',
    icon: Phone,
    category: 'Communication',
    isInstalled: false,
    href: '/settings'
  },
  {
    id: 8,
    name: 'Web Portal',
    description: 'Customer web portal access',
    icon: Globe,
    category: 'Web',
    isInstalled: true,
    href: '/settings'
  }
];

export const MarketPlaceAllPage = () => {
  const navigate = useNavigate();

  const handleCardClick = (href: string) => {
    navigate(href);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Market Place</h1>
        <p className="text-[#1a1a1a] opacity-70">Discover and manage your applications</p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#1a1a1a]">Edition: All</span>
          <span className="text-sm text-[#1a1a1a]">Price: All</span>
          <span className="text-sm text-[#1a1a1a]">Rating: All</span>
          <span className="text-sm text-[#1a1a1a]">Deployment type: All</span>
        </div>
        <div className="ml-auto">
          <input
            type="text"
            placeholder="Search apps"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
          />
        </div>
      </div>

      {/* Featured Apps */}
      <div className="mb-8">
        <div className="bg-[#2563eb] text-white p-4 rounded-t-lg">
          <h2 className="text-lg font-semibold">Featured apps</h2>
        </div>
        <div className="bg-white border border-t-0 rounded-b-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredApps.map((app) => (
              <Card 
                key={app.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
                onClick={() => handleCardClick(app.href)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-[#C72030] rounded-lg flex items-center justify-center">
                      <app.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#1a1a1a] mb-1">{app.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{app.description}</p>
                      {app.isInstalled && (
                        <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                          Installed
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Editor's Pick */}
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Editor's pick</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {editorsPick.map((app) => (
            <Card 
              key={app.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
              onClick={() => handleCardClick(app.href)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[#C72030] rounded-lg flex items-center justify-center">
                    <app.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#1a1a1a] mb-1">{app.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{app.description}</p>
                    {app.isInstalled && (
                      <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                        Installed
                      </span>
                    )}
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
