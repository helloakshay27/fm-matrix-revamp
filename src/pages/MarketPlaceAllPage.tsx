
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Target, Phone, Calculator, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const MarketPlaceAllPage = () => {
  const navigate = useNavigate();
  const [installingApps, setInstallingApps] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const handleInstall = (appId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setInstallingApps(prev => [...prev, appId]);
    
    // Simulate installation process
    setTimeout(() => {
      setInstallingApps(prev => prev.filter(id => id !== appId));
      console.log(`App ${appId} installed successfully`);
    }, 2000);
  };

  const MarketPlaceFilterModal = () => (
    <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Applications</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Edition</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>All</option>
              <option>Basic</option>
              <option>Premium</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Price</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>All</option>
              <option>Free</option>
              <option>Paid</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Rating</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>All</option>
              <option>4+ Stars</option>
              <option>3+ Stars</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button 
            onClick={() => setIsFilterOpen(false)} 
            className="flex-1 bg-[#C72030] hover:bg-[#C72030]/90 text-white"
          >
            Apply Filters
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(false)}
            className="flex-1 border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const AppCard = ({ app, isEditor = false }: { app: typeof featuredApps[0], isEditor?: boolean }) => (
    <div
      key={`${isEditor ? 'editor-' : ''}${app.id}`}
      onClick={() => handleCardClick(app.route)}
      className={`group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl ${
        isEditor 
          ? 'bg-white border border-gray-200 hover:border-[#C72030]/30' 
          : 'bg-white hover:bg-gradient-to-br hover:from-white hover:to-red-50'
      }`}
    >
      <div className="p-4 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-[#C72030]/10 transition-colors duration-300">
            <app.icon className="w-6 h-6 text-[#C72030] group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">FREE</span>
            <Button
              onClick={(e) => handleInstall(app.id, e)}
              disabled={installingApps.includes(app.id)}
              size="sm"
              className={`opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 bg-[#C72030] hover:bg-[#C72030]/90 text-white px-3 py-1 text-xs ${
                installingApps.includes(app.id) ? 'opacity-100' : ''
              }`}
            >
              {installingApps.includes(app.id) ? (
                <>
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                  Installing...
                </>
              ) : (
                <>
                  <Download className="w-3 h-3 mr-1" />
                  Install
                </>
              )}
            </Button>
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 text-base group-hover:text-[#C72030] transition-colors duration-300">
          {app.name}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {app.description}
        </p>
      </div>
      
      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#C72030]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Bottom border animation */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#C72030] to-red-400 group-hover:w-full transition-all duration-500 ease-out"></div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-600 mb-2 text-sm">Market Place &gt; All Apps</p>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] uppercase">MARKET PLACE</h1>
      </div>

      <div className="space-y-6">
        {/* Filter Button */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {featuredApps.length} apps found
          </div>
          <Button
            onClick={() => setIsFilterOpen(true)}
            variant="outline"
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Featured Apps Section */}
        <div className="bg-[#C72030] rounded-lg p-4 sm:p-6">
          <h2 className="text-white text-lg sm:text-xl font-semibold mb-4">Featured apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>

        {/* Editor's Pick Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Editor's pick</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredApps.map((app) => (
              <AppCard key={`editor-${app.id}`} app={app} isEditor={true} />
            ))}
          </div>
        </div>
      </div>

      <MarketPlaceFilterModal />
    </div>
  );
};

export default MarketPlaceAllPage;
