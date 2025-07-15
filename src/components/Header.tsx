
import React, { useEffect, useState } from 'react';
import { Bell, User, MapPin, ChevronDown, Home } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchWithSuggestions } from './SearchWithSuggestions';
import { useAppDispatch, useAppSelector } from '@/hooks/slice-hooks';
import { changeCompany, changeSite, fetchCompanyList, fetchSiteList } from '@/redux/login/loginSlice';

export interface Company {
  id: number;
  name: string;
}

export interface Site {
  id: number;
  name: string;
}

export const Header = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');

  const { data: companies } = useAppSelector(state => state.fetchCompanyList)
  const { data: sites } = useAppSelector(state => state.fetchSiteList)

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const currentPath = window.location.pathname;

  const assetSuggestions = [
    'sdcdsc', 'test', 'asus zenbook', 'Diesel Generator', 'A.c', 'Energy Meter 23',
    'Located', 'sebc', 'Hay', 'ktta', 'demo', 'jyoti tower', 'jyoti',
    '203696', '203606', '194409', '166641', '168838', '144714', '53815'
  ];

  const handleSearch = (searchTerm: string) => {
    console.log('Search term:', searchTerm);
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        await dispatch(fetchCompanyList({ baseUrl, token })).unwrap();
      } catch (error) {
        console.log(error)
      }
    }

    const fetchSites = async () => {
      try {
        await dispatch(fetchSiteList({ baseUrl, token, id: JSON.parse(localStorage.getItem('user')!).id })).unwrap();
      } catch (error) {
        console.log(error)
      }
    }

    fetchCompanies();
    fetchSites();
  }, [dispatch, baseUrl, token])

  const handleCompanyChange = async (id: number) => {
    try {
      await dispatch(changeCompany({ baseUrl, token, id })).unwrap();
      window.location.reload();
    } catch (error) {
      console.log(error)
    }
  }

  const handleSiteChange = async (id: number) => {
    try {
      await dispatch(changeSite({ baseUrl, token, id })).unwrap();
      window.location.reload();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <header className="h-16 bg-white border-b border-[#D5DbDB] fixed top-0 right-0 left-0 z-10 w-full">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-6">
          {/* Home Dashboard */}
          <a
            href="/"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentPath === '/' ? 'text-[#C72030]' : 'text-[#1a1a1a] hover:text-[#C72030]'
              }`}
          >
            <Home className="w-4 h-4" />
            Home
          </a>

          {/* Project Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#C72030] transition-colors">
              <span className="text-sm font-medium">{companies.selected_company?.name}</span>
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-[#D5DbDB] shadow-lg">
              {
                companies && companies.companies && companies.companies.map((company: Company) => (
                  <DropdownMenuItem onClick={() => handleCompanyChange(company.id)} key={company.id}>{company.name}</DropdownMenuItem>
                ))
              }
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Site Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#C72030] transition-colors">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{sites.selected_site?.name}</span>
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-[#D5DbDB] shadow-lg max-h-[400px] overflow-y-auto">
              {
                sites && sites.sites && sites.sites.map((site: any) => (
                  <DropdownMenuItem onClick={() => handleSiteChange(site.id)} key={site.id}>{site.name}</DropdownMenuItem>
                ))
              }
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
