
import React, { useState } from 'react';
import { Bell, Search, User, MapPin, ChevronDown, Home, Settings, LogOut } from 'lucide-react';
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
    <header className="h-16 bg-blue-900 border-b border-blue-800 fixed top-0 right-0 left-0 z-10 w-100">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-6">
          {/* Home Dashboard */}
          <button className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home </span>
          </button>

          {/* Setup Link */}
          <a href="/setup" className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Setup</span>
          </a>

          {/* Project Change Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
              <span className="text-sm font-medium">Project Change</span>
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg z-50">
              <DropdownMenuItem>Project Alpha</DropdownMenuItem>
              <DropdownMenuItem>Project Beta</DropdownMenuItem>
              <DropdownMenuItem>Project Gamma</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Site Change Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Lockastead Site 1</span>
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg z-50">
              <DropdownMenuItem>Lockastead Site 1</DropdownMenuItem>
              <DropdownMenuItem>Lockastead Site 2</DropdownMenuItem>
              <DropdownMenuItem>Downtown Office</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button className="p-2 hover:bg-blue-800 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-white" />
          </button>
          
          {/* Profile Dropdown */}
          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white">Admin</span>
              <ChevronDown className="w-3 h-3 text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg z-50">
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Account Details</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
