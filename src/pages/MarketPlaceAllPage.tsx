
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Settings, Phone, Calculator, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const applications = [
  {
    id: 1,
    name: 'Lease Management',
    description: 'Manage your lease agreements and contracts efficiently',
    icon: FileText,
    featured: true,
    href: '/market-place/lease-management'
  },
  {
    id: 2,
    name: 'Loyalty Rule Engine',
    description: 'Set up and manage customer loyalty programs',
    icon: Settings,
    featured: false,
    href: '/market-place/loyalty-rule-engine'
  },
  {
    id: 3,
    name: 'Cloud Telephony',
    description: 'Manage your cloud-based telephony services',
    icon: Phone,
    featured: false,
    href: '/market-place/cloud-telephony'
  },
  {
    id: 4,
    name: 'Accounting',
    description: 'Complete accounting and financial management solution',
    icon: Calculator,
    featured: true,
    href: '/market-place/accounting'
  }
];

export const MarketPlaceAllPage = () => {
  const navigate = useNavigate();

  const handleCardClick = (href: string) => {
    navigate(href);
  };

  const featuredApps = applications.filter(app => app.featured);
  const editorsPick = applications.filter(app => !app.featured);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Market Place - All Apps</h1>
          <div className="flex gap-4">
            <span className="text-sm text-gray-600">Edition: All</span>
            <span className="text-sm text-gray-600">Price: All</span>
            <span className="text-sm text-gray-600">Rating: All</span>
            <span className="text-sm text-gray-600">Deployment type: All</span>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search apps"
            className="pl-10"
          />
        </div>
      </div>

      {/* Featured Apps */}
      {featuredApps.length > 0 && (
        <div className="mb-8">
          <div className="bg-[#4A90E2] text-white p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold">Featured apps</h2>
          </div>
          <div className="bg-[#4A90E2] p-4 rounded-b-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredApps.map((app) => (
                <Card 
                  key={app.id} 
                  className="bg-white cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleCardClick(app.href)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#C72030] rounded-lg flex items-center justify-center">
                        <app.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">{app.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs text-gray-600">
                      {app.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Editor's Pick */}
      {editorsPick.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Editor's pick</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {editorsPick.map((app) => (
              <Card 
                key={app.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCardClick(app.href)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#C72030] rounded-lg flex items-center justify-center">
                      <app.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium">{app.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs text-gray-600">
                    {app.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
