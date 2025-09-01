import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setSelectedCompany } from '@/store/slices/projectSlice';
import { Building2, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { COMPANY_LAYOUTS } from '@/config/companyLayouts';
import { useCompanyLayout } from '@/hooks/useCompanyLayout';

/**
 * Company Layout Selector Component
 * Allows switching between different company layouts for testing purposes
 * This should only be visible in development or for admin users
 */
export const CompanyLayoutSelector: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCompany } = useSelector((state: RootState) => state.project);
  const { layoutConfig } = useCompanyLayout();

  // Real companies from API
  const testCompanies = [
    { id: 111, name: 'Lockated HO' },
    { id: 193, name: 'Panchshil' },
    { id: 199, name: 'Customer Support' },
    { id: 204, name: 'GoPhygital.work' },
  ];

  const handleCompanyChange = (company: { id: number; name: string }) => {
    dispatch(setSelectedCompany(company));
  };

  const getLayoutBadge = (companyId: number) => {
    const layout = COMPANY_LAYOUTS[companyId];
    if (!layout) return null;
    
    return (
      <Badge variant="outline" className="ml-2 text-xs">
        {layout.sidebarComponent}
      </Badge>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Company Layout Tester</h3>
        <Badge variant="secondary" className="text-xs">
          Development Only
        </Badge>
      </div>

      <div className="space-y-3">
        {/* Current Selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Current Company:
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>{selectedCompany?.name || 'No Company Selected'}</span>
                  {selectedCompany && getLayoutBadge(selectedCompany.id)}
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[250px]">
              <DropdownMenuItem
                onClick={() => handleCompanyChange({ id: 0, name: 'No Company' })}
                className={!selectedCompany ? "bg-gray-50" : ""}
              >
                <div className="flex items-center justify-between w-full">
                  <span>No Company Selected</span>
                  <Badge variant="outline" className="text-xs">static</Badge>
                </div>
              </DropdownMenuItem>
              {testCompanies.map((company) => (
                <DropdownMenuItem
                  key={company.id}
                  onClick={() => handleCompanyChange(company)}
                  className={selectedCompany?.id === company.id ? "bg-blue-50" : ""}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{company.name}</span>
                    {getLayoutBadge(company.id)}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Current Layout Info */}
        <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
          <div className="font-medium mb-1">Current Layout:</div>
          <div>Sidebar: <code>{layoutConfig.sidebarComponent}</code></div>
          <div>Header: <code>{layoutConfig.headerComponent}</code></div>
          {layoutConfig.theme?.primaryColor && (
            <div>
              Primary Color: 
              <code className="ml-1">{layoutConfig.theme.primaryColor}</code>
              <span 
                className="inline-block w-3 h-3 rounded ml-2 border border-gray-300"
                style={{ backgroundColor: layoutConfig.theme.primaryColor }}
              />
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 italic">
          * Changes will be reflected immediately in the layout
        </div>
      </div>
    </div>
  );
};
