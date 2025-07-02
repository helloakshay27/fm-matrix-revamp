
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Package, CheckSquare, Users, Calculator, Globe } from 'lucide-react';

const installedApps = [
  {
    id: 1,
    name: 'Facility Management',
    description: 'Complete facility management solution',
    icon: Building,
    category: 'Management',
    installedDate: '2024-01-15',
    href: '/maintenance'
  },
  {
    id: 2,
    name: 'Asset Tracking',
    description: 'Track and manage your assets',
    icon: Package,
    category: 'Operations',
    installedDate: '2024-02-20',
    href: '/maintenance/asset'
  },
  {
    id: 4,
    name: 'Security System',
    description: 'Comprehensive security management',
    icon: CheckSquare,
    category: 'Security',
    installedDate: '2024-03-10',
    href: '/security'
  },
  {
    id: 6,
    name: 'Accounting Plus',
    description: 'Advanced accounting features',
    icon: Calculator,
    category: 'Finance',
    installedDate: '2024-01-25',
    href: '/finance/accounting'
  },
  {
    id: 8,
    name: 'Web Portal',
    description: 'Customer web portal access',
    icon: Globe,
    category: 'Web',
    installedDate: '2024-02-05',
    href: '/settings'
  }
];

export const MarketPlaceInstalledPage = () => {
  const navigate = useNavigate();

  const handleCardClick = (href: string) => {
    navigate(href);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Installed Applications</h1>
        <p className="text-[#1a1a1a] opacity-70">Manage your installed applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {installedApps.map((app) => (
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
                  <h3 className="font-semibold text-[#1a1a1a] mb-2">{app.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{app.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                      Installed
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(app.installedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
