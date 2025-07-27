
import React, { useState, useEffect } from 'react';
import { Bell, User, MapPin, ChevronDown, Home, Loader2, LogOut, Settings, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SearchWithSuggestions } from './SearchWithSuggestions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchAllowedCompanies, changeCompany } from '@/store/slices/projectSlice';
import { fetchAllowedSites, changeSite, clearSites } from '@/store/slices/siteSlice';
import { getUser, clearAuth } from '@/utils/auth';

export interface Company {
  id: number;
  name: string;
}

export interface Site {
  id: number;
  name: string;
}

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const currentPath = window.location.pathname;

  // Redux state
  const { companies, selectedCompany, loading: projectLoading } = useSelector((state: RootState) => state.project);
  const { sites, selectedSite, loading: siteLoading } = useSelector((state: RootState) => state.site);

  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(3);

  // Get user data from localStorage
  const user = getUser() || {
    id: 0,
    firstname: "Guest",
    lastname: "",
    email: ""
  };
  const userId = user.id;

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
    <header className="h-16 bg-white border-b border-[#D5DbDB] fixed top-0 right-0 left-0 z-10 w-full shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          {/* Home Dashboard */}
            <img
                src="https://india.lockated.co/wp-content/uploads/lockated-logo-nw.png"
                alt="Logo"
                className="h-9 mx-auto"
              />
          
          {/* Dashboard Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#1a1a1a] hover:text-[#C72030] hover:bg-[#f6f4ee] rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>

          {/* Project Dropdown */}

        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#C72030] transition-colors">
              <MapPin className="w-4 h-4" />

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


          <div className="relative">
            <button className="p-2 hover:bg-[#f6f4ee] rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-[#1a1a1a]" />
            </button>
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full">
                {notificationCount}
              </Badge>
            )}
          </div>

          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#C4b89D] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#1a1a1a]" />
              </div>
              <div className="hidden md:block">
                <span className="text-sm font-medium text-[#1a1a1a]">{user.firstname}</span>
                <ChevronDown className="w-3 h-3 text-[#1a1a1a] inline-block ml-1" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-white border border-[#D5DbDB] shadow-lg p-2">
              <div className="px-2 py-2 mb-2 border-b border-gray-100">
                <p className="font-medium text-sm">{user.firstname} {user.lastname}</p>
                <div className="flex items-center text-gray-600 text-xs mt-1">
                  <Mail className="w-3 h-3 mr-1" />
                  <span>{user.email}</span>
                </div>
                <div className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded mt-2 inline-block">
                  User
                </div>
              </div>
              <DropdownMenuItem className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  clearAuth();
                  window.location.reload();

                  navigate('/login');
                }}
                className="flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
