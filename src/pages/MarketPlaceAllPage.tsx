import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Target, Phone, Calculator, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
  },
};

// Portals to document.body so the menu anchors under the field instead of
// inheriting the Radix Dialog's translate transform (which mispositions it).
const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

const MarketPlaceAllPage = () => {
  const navigate = useNavigate();
  const [installingApps, setInstallingApps] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const featuredApps = [{
    id: 'lease-management',
    name: 'Lease Management',
    description: 'Comprehensive lease management system',
    icon: Building,
    route: '/market-place/lease-management'
  }, {
    id: 'loyalty-rule-engine',
    name: 'Loyalty Rule Engine',
    description: 'Advanced loyalty program management',
    icon: Target,
    route: '/market-place/loyalty-rule-engine'
  }, {
    id: 'cloud-telephony',
    name: 'Cloud Telephony',
    description: 'Cloud-based telephony solutions',
    icon: Phone,
    route: '/market-place/cloud-telephony'
  }, {
    id: 'accounting',
    name: 'Accounting',
    description: 'Complete accounting management system',
    icon: Calculator,
    route: '/market-place/accounting'
  }];
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
  const MarketPlaceFilterModal = () => <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen} modal={false}>
      <DialogContent
        className="w-full sm:max-w-[500px] bg-white overflow-visible"
        onPointerDownOutside={(e) => {
          // Keep dialog open when interacting with the MUI select menu
          if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Filter Applications</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="edition-label">Edition</InputLabel>
            <MuiSelect
              labelId="edition-label"
              label="Edition"
              value=""
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
            </MuiSelect>
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="price-label">Price</InputLabel>
            <MuiSelect
              labelId="price-label"
              label="Price"
              value=""
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="free">Free</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </MuiSelect>
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="rating-label">Rating</InputLabel>
            <MuiSelect
              labelId="rating-label"
              label="Rating"
              value=""
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="4">4+ Stars</MenuItem>
              <MenuItem value="3">3+ Stars</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Button onClick={() => setIsFilterOpen(false)} className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={() => setIsFilterOpen(false)} className="border-brand text-brand px-8 w-full sm:w-auto">
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
  const AppCard = ({
    app,
    isEditor = false
  }: {
    app: typeof featuredApps[0];
    isEditor?: boolean;
  }) => <div key={`${isEditor ? 'editor-' : ''}${app.id}`} onClick={() => handleCardClick(app.route)} className={`group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl ${isEditor ? 'bg-white' : 'bg-white hover:bg-gradient-to-br hover:from-white hover:to-red-50'}`}>
      <div className="p-4 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="fm-button-fix fm-button-brand !h-8 !w-8 !min-h-8 !p-0 rounded-lg bg-[#da7756] text-white transition-colors duration-300">
            <app.icon className="w-4 h-4 text-white stroke-white group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">FREE</span>
            <Button onClick={e => handleInstall(app.id, e)} disabled={installingApps.includes(app.id)} size="sm" className={`fm-button-fix fm-button-brand px-8 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 text-xs ${installingApps.includes(app.id) ? 'opacity-100' : ''}`}>
              {installingApps.includes(app.id) ? <>
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                  Installing...
                </> : <>
                  <Download className="w-3 h-3 mr-1" />
                  Install
                </>}
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
    </div>;
  return <div className="p-4 sm:p-6 min-h-screen">
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
          <Button onClick={() => setIsFilterOpen(true)} className="fm-button-fix fm-button-brand px-8 py-2">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Featured Apps Section */}
        <div className="rounded-lg p-4 sm:p-6 bg-slate-50">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-slate-950">Featured apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredApps.map(app => <AppCard key={app.id} app={app} />)}
          </div>
        </div>

        {/* Editor's Pick Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Editor's pick</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredApps.map(app => <AppCard key={`editor-${app.id}`} app={app} isEditor={true} />)}
          </div>
        </div>
      </div>

      <MarketPlaceFilterModal />
    </div>;
};
export default MarketPlaceAllPage;
