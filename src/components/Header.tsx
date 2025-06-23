
import React, { useState } from 'react';
import { Bell, Search, User, MapPin, ChevronDown, Home, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-grey-text fixed top-0 right-0 left-0 z-10 w-100">
      <div className="flex items-center justify-between h-full px-grid-margin-mobile md:px-grid-margin-tablet lg:px-grid-margin-desktop">
        <div className="flex items-center gap-ds-6">
          {/* Home Dashboard */}
          <button className="flex items-center icon-gap text-ds-primary hover:text-ds-accent transition-colors">
            <Home className="w-4 h-4" />
            <span className="body-text-4 font-medium">Home</span>
          </button>

          {/* Setup Link */}
          <a href="/setup" className="flex items-center icon-gap text-ds-primary hover:text-ds-accent transition-colors">
            <Settings className="w-4 h-4" />
            <span className="body-text-4 font-medium">Setup</span>
          </a>

          {/* Project Change Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center icon-gap text-ds-primary hover:text-ds-accent transition-colors">
              <span className="body-text-4 font-medium">Project Change</span>
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-grey-text shadow-design-system z-50">
              <DropdownMenuItem className="body-text-4">Project Alpha</DropdownMenuItem>
              <DropdownMenuItem className="body-text-4">Project Beta</DropdownMenuItem>
              <DropdownMenuItem className="body-text-4">Project Gamma</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Site Change Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center icon-gap text-ds-primary hover:text-ds-accent transition-colors">
              <MapPin className="w-4 h-4" />
              <span className="body-text-4 font-medium">Lockastead Site 1</span>
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-grey-text shadow-design-system z-50">
              <DropdownMenuItem className="body-text-4">Lockastead Site 1</DropdownMenuItem>
              <DropdownMenuItem className="body-text-4">Lockastead Site 2</DropdownMenuItem>
              <DropdownMenuItem className="body-text-4">Downtown Office</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-ds-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-grey-text" />
            <input
              type="text"
              placeholder="Search assets..."
              className="search-input pl-10"
            />
          </div>
          
          <button className="p-2 hover:bg-bg-primary rounded-none transition-colors">
            <Bell className="w-5 h-5 text-ds-primary" />
          </button>
          
          {/* Profile Dropdown */}
          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger className="flex items-center icon-gap">
              <div className="w-8 h-8 bg-bg-secondary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-ds-primary" />
              </div>
              <span className="body-text-4 font-medium text-ds-primary">Admin</span>
              <ChevronDown className="w-3 h-3 text-ds-primary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-grey-text shadow-design-system z-50">
              <DropdownMenuItem className="body-text-4">Profile Settings</DropdownMenuItem>
              <DropdownMenuItem className="body-text-4">Account Details</DropdownMenuItem>
              <DropdownMenuItem className="body-text-4">Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-status-rejected body-text-4">
                <Settings className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
