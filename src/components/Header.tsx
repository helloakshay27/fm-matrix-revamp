
import React, { useState, useEffect } from 'react';
import { Bell, User, MapPin, ChevronDown, Home, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchWithSuggestions } from './SearchWithSuggestions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchAllowedCompanies, changeCompany } from '@/store/slices/projectSlice';
import { fetchAllowedSites, changeSite, clearSites } from '@/store/slices/siteSlice';

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  const currentPath = window.location.pathname;
  
  // Redux state
  const { companies, selectedCompany, loading: projectLoading } = useSelector((state: RootState) => state.project);
  const { sites, selectedSite, loading: siteLoading } = useSelector((state: RootState) => state.site);
  
  // Mock user ID - in real app, this would come from auth state
  const userId = 87989;

  const assetSuggestions = [
    'sdcdsc', 'test', 'asus zenbook', 'Diesel Generator', 'A.c', 'Energy Meter 23',
    'Located', 'sebc', 'Hay', 'ktta', 'demo', 'jyoti tower', 'jyoti',
    '203696', '203606', '194409', '166641', '168838', '144714', '53815'
  ];

  const handleSearch = (searchTerm: string) => {
    console.log('Search term:', searchTerm);
  };

  // Load initial data
  useEffect(() => {
    dispatch(fetchAllowedCompanies());
  }, [dispatch]);

  // Load sites when company changes
  useEffect(() => {
    if (selectedCompany) {
      dispatch(fetchAllowedSites(userId));
    } else {
      dispatch(clearSites());
    }
  }, [selectedCompany, userId, dispatch]);

  // Handle company change
  const handleCompanyChange = async (companyId: number) => {
    try {
      await dispatch(changeCompany(companyId)).unwrap();
      // Reload page smoothly after successful company change
      window.location.reload();
    } catch (error) {
      console.error('Failed to change company:', error);
    }
  };

  // Handle site change
  const handleSiteChange = async (siteId: number) => {
    try {
      await dispatch(changeSite(siteId)).unwrap();
      // Reload page smoothly after successful site change
      window.location.reload();
    } catch (error) {
      console.error('Failed to change site:', error);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#D5DbDB] fixed top-0 right-0 left-0 z-10 w-full">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-6">
          {/* Home Dashboard */}
          <a
            href="/"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              currentPath === '/' ? 'text-[#C72030]' : 'text-[#1a1a1a] hover:text-[#C72030]'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </a>

          {/* Project Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#C72030] transition-colors">
              {projectLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="text-sm font-medium">
                  {selectedCompany?.name || 'Select Project'}
                </span>
              )}
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-[#D5DbDB] shadow-lg">
              {companies.map((company) => (
                <DropdownMenuItem
                  key={company.id}
                  onClick={() => handleCompanyChange(company.id)}
                  className={selectedCompany?.id === company.id ? 'bg-[#f6f4ee] text-[#C72030]' : ''}
                >
                  {company.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Site Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#C72030] transition-colors">
              <MapPin className="w-4 h-4" />
              {siteLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="text-sm font-medium">
                  {selectedSite?.name || 'Select Site'}
                </span>
              )}
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-[#D5DbDB] shadow-lg">
              {sites.length > 0 ? (
                sites.map((site) => (
                  <DropdownMenuItem
                    key={site.id}
                    onClick={() => handleSiteChange(site.id)}
                    className={selectedSite?.id === site.id ? 'bg-[#f6f4ee] text-[#C72030]' : ''}
                  >
                    {site.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  {selectedCompany ? 'No sites available' : 'Select a project first'}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4">
          <SearchWithSuggestions
            placeholder="Search assets..."
            onSearch={handleSearch}
            suggestions={assetSuggestions}
            className="w-64"
          />

          <button className="p-2 hover:bg-[#f6f4ee] rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-[#1a1a1a]" />
          </button>

          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#C4b89D] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-[#1a1a1a]" />
              </div>
              <span className="text-sm font-medium text-[#1a1a1a]">Admin</span>
              <ChevronDown className="w-3 h-3 text-[#1a1a1a]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-[#D5DbDB] shadow-lg">
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Account Details</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <User className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
