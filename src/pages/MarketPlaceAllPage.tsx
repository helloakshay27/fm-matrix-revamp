import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Target, Phone, Calculator, Download, Filter, ChevronDown } from 'lucide-react';
import { SearchWithSuggestions } from '@/components/SearchWithSuggestions';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import { Button } from '@/components/ui/button';

const MarketPlaceAllPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [installingApps, setInstallingApps] = useState<string[]>([]);

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

  const handleInstall = (appId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setInstallingApps(prev => [...prev, appId]);
    
    // Simulate installation process
    setTimeout(() => {
      setInstallingApps(prev => prev.filter(id => id !== appId));
      console.log(`App ${appId} installed successfully`);
    }, 2000);
  };

  const FilterChip = ({ label, value, isActive = false }: { label: string; value: string; isActive?: boolean }) => (
    <div className={`group relative flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 border ${
      isActive 
        ? 'bg-[#C72030] text-white border-[#C72030] shadow-md' 
        : 'bg-white text-gray-700 border-gray-200 hover:border-[#C72030] hover:bg-[#C72030]/5'
    }`}>
      <span className="text-sm font-medium">{label}:</span>
      <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-[#C72030]'}`}>{value}</span>
      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
        isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#C72030]'
      }`} />
      
      {/* Hover effect */}
      {!isActive && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#C72030]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
    </div>
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
    <div className="p-6 space-y-8">
      {/* Enhanced Header with filters and search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Filter Section */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <FilterChip label="Edition" value="All" isActive />
              <FilterChip label="Price" value="All" />
              <FilterChip label="Rating" value="All" />
              <FilterChip label="Deployment" value="All" />
            </div>
          </div>

          {/* Enhanced Search Section */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {filteredApps.length} apps found
            </div>
            <div className="relative">
              <SearchWithSuggestions
                placeholder="Search marketplace apps..."
                onSearch={handleSearch}
                suggestions={suggestions}
                className="w-80"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-[#C72030]/20 to-transparent rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Apps Section */}
      <div className="bg-[#C72030] rounded-lg p-6">
        <h2 className="text-white text-xl font-semibold mb-4">Featured apps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>

      {/* Editor's Pick Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Editor's pick</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredApps.map((app) => (
            <AppCard key={`editor-${app.id}`} app={app} isEditor={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketPlaceAllPage;
