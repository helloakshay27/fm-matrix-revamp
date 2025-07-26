
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
            
              <svg className="h-8 mx-auto"  height="66" viewBox="0 0 366 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M89.5066 3.94508H69.8799V30.5684H80.3176V22.6546H88.7763C96.1038 22.6546 101.028 20.2687 101.028 13.1345C101.052 7.15785 97.3997 3.94508 89.5066 3.94508ZM87.2683 15.8748H80.3176V10.8431H87.2683C89.5537 10.8431 90.6376 11.5754 90.6376 13.229C90.6376 15.0716 89.5537 15.8748 87.2683 15.8748ZM119.453 9.78003C115.401 9.78003 113.28 11.4809 112.291 12.8274V3.96869H102.96V30.5921H112.291V19.9852C112.291 17.6938 112.903 16.0637 115.636 16.0637C118.416 16.0637 118.864 17.7411 118.864 19.9852V30.5921H128.194V18.0717C128.171 12.5203 125.249 9.78003 119.453 9.78003ZM146.644 10.2997L142.544 21.261L138.137 10.2997H128.548L138.232 30.4268L134.626 36.9232H144.122L156.256 10.2997H146.644ZM173.056 10.2997H182.385V29.0566C182.385 36.9232 175.483 37.6555 167.919 37.6555C159.036 37.6555 155.784 34.8679 155.62 30.7575H164.15C164.526 32.0804 166.435 32.2458 167.895 32.2458C170.087 32.2458 173.009 32.3166 173.009 29.0566V27.3084C171.595 28.6077 169.545 29.3164 166.671 29.3164C160.403 29.3164 155.055 26.6233 155.055 19.7254C155.055 12.851 159.696 9.75638 165.94 9.75638C169.097 9.75638 171.407 10.5596 173.009 12.1187V10.2997H173.056ZM168.885 23.7414C172.114 23.7414 173.786 22.4185 173.786 19.749C173.786 17.056 171.995 15.7095 168.885 15.7095C165.728 15.7095 164.15 17.2214 164.15 19.749C164.15 22.2531 165.657 23.7414 168.885 23.7414ZM189.337 8.78786C192.141 8.78786 194.12 7.18146 194.12 4.41754C194.12 1.60637 192.141 0 189.337 0C186.532 0 184.554 1.60637 184.554 4.41754C184.554 7.18146 186.532 8.78786 189.337 8.78786ZM184.671 30.5921H194.001V10.3234H184.671V30.5921ZM214.523 15.3788V10.3234H208.61V5.07899H199.279V10.3234H195.534V15.3788H199.279V22.1586C199.279 29.4345 202.06 30.9465 210.33 30.9465C211.743 30.9465 213.299 30.8047 214.547 30.6393V24.5682C209.505 24.828 208.633 24.639 208.633 22.135V15.3552H214.523V15.3788ZM228.944 9.78003C222.182 9.78003 217.869 11.5282 217.139 16.4654H225.48C225.739 15.2134 226.894 14.7881 228.944 14.7881C231.606 14.7881 232.242 15.7331 232.242 17.5993V18.0954C218.883 17.4575 216.032 20.2687 216.032 24.9698C216.032 29.1511 219.095 31.1355 224.844 31.1355C228.496 31.1355 230.875 29.907 232.242 28.5368V30.5448H241.572V17.5757C241.596 10.9139 235.634 9.78003 228.944 9.78003ZM232.265 25.0407C231.253 25.9855 229.651 26.6706 227.624 26.6706C226.399 26.6706 225.008 26.4108 225.008 24.8516C225.008 22.7491 227.601 22.6075 232.265 22.8437V25.0407ZM243.857 2.50405V30.5684H253.188V2.50405H243.857ZM258.466 25.9383C257.028 25.9383 255.851 27.0723 255.851 28.5133C255.851 29.9542 257.028 31.1119 258.466 31.1119C259.88 31.1119 261.058 29.9779 261.058 28.5133C261.058 27.0486 259.88 25.9383 258.466 25.9383ZM291.828 10.2997H296.754L288.79 30.5684H284.243L278.705 15.8748L273.215 30.5684H268.668L260.704 10.2997H265.629L271.048 25.1824L276.632 10.2997H280.85L286.433 25.1824L291.828 10.2997ZM309.099 9.73277C303.185 9.73277 297.53 12.9691 297.53 20.4578C297.53 27.9462 303.185 31.159 309.099 31.159C315.013 31.159 320.715 27.9699 320.715 20.4578C320.691 12.9691 315.013 9.73277 309.099 9.73277ZM309.099 27.6865C303.68 27.6865 301.818 24.0012 301.818 20.4578C301.818 16.8906 303.68 13.1817 309.099 13.1817C314.519 13.1817 316.379 16.867 316.379 20.4578C316.379 24.0012 314.519 27.6865 309.099 27.6865ZM337.28 9.73277C332.921 9.73277 330.116 12.6148 329.197 14.1031V10.2997H324.485V30.5684H329.197V20.2687C329.197 17.1032 331.13 14.1503 336.266 14.1503C337.561 14.1503 338.575 14.292 339.376 14.5283H339.518V9.89811C338.716 9.78 338.197 9.73277 337.28 9.73277ZM359.262 30.5921H364.799L355.681 18.3316L364.304 10.2997H358.46L348.023 20.1506V3.94508H343.311V30.5684H348.023V25.4658L352.382 21.3554L359.262 30.5921Z" fill="#141414" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M59.1388 34.6126H30.4678V5.53711C30.4678 3.42569 28.7676 1.72107 26.6616 1.72107C25.1354 1.72107 23.8216 2.61213 23.2227 3.90997C20.885 2.45717 18.1608 1.62421 15.2242 1.62421C6.81999 1.62421 0 8.4621 0 16.8883C0 25.3147 6.81999 32.1525 15.2242 32.1525C18.0063 32.1525 20.6145 31.3971 22.8556 30.0799C22.8556 31.6296 22.8556 33.1404 22.8556 34.6126H16.055C15.7845 34.5932 15.4947 34.5932 15.2242 34.5932C6.81999 34.5932 0 41.4311 0 49.8574C0 58.2837 6.81999 65.1215 15.2242 65.1215C23.6285 65.1215 30.4484 58.2837 30.4484 49.8574C30.4484 49.4506 30.4291 49.0438 30.3905 48.6564H30.4871V42.264H59.0035L59.1388 34.6126ZM15.2049 24.5204C11.0125 24.5204 7.59279 21.0919 7.59279 16.8883C7.59279 12.6849 11.0125 9.25629 15.2049 9.25629C19.3973 9.25629 22.8171 12.6849 22.8171 16.8883C22.8171 21.1111 19.4167 24.5204 15.2049 24.5204ZM22.8556 49.1988C22.8556 49.4312 22.8363 49.6443 22.8171 49.8574C22.8171 54.0609 19.3973 57.4894 15.2049 57.4894C11.0125 57.4894 7.59279 54.0609 7.59279 49.8574C7.59279 45.7896 10.7613 42.4772 14.7606 42.2447V42.264H22.8556C22.8556 46.1382 22.8556 48.6564 22.8556 48.6564H22.875C22.8363 48.8307 22.8556 49.0244 22.8556 49.1988ZM47.3148 9.25629C51.5074 9.25629 54.927 12.6849 54.927 16.8883C54.927 21.0919 51.5074 24.5204 47.3148 24.5204C43.1224 24.5204 39.7027 21.0919 39.7027 16.8883C39.7027 12.6849 43.1031 9.25629 47.3148 9.25629ZM47.3148 1.62421C55.7192 1.62421 62.5391 8.4621 62.5391 16.8883C62.5391 25.3147 55.7192 32.1525 47.3148 32.1525C38.9107 32.1525 32.0907 25.3147 32.0907 16.8883C32.0907 8.4621 38.9107 1.62421 47.3148 1.62421Z" fill="#C72031" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M64.1615 37.6366C62.7511 36.5907 60.2781 34.7699 58.6552 33.5688C58.346 33.3557 57.9596 33.3171 57.6119 33.4913C57.2835 33.6657 57.071 33.995 57.071 34.3824C57.071 34.4599 57.071 34.5374 57.071 34.6149H30.332V42.2663H57.071C57.071 42.3438 57.071 42.4406 57.071 42.5181C57.071 42.8861 57.2835 43.2349 57.6119 43.4093C57.9404 43.5835 58.346 43.5448 58.6552 43.3124C60.2781 42.1113 62.7511 40.2905 64.1615 39.2445C64.4126 39.0507 64.5671 38.7602 64.5671 38.4503C64.5671 38.1403 64.4126 37.8304 64.1615 37.6366Z" fill="#C72031" />
              </svg>


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
