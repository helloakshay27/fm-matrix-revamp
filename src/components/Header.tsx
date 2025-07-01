import React, { useState } from 'react';
import { Bell, User, MapPin, ChevronDown, Home, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchWithSuggestions } from './SearchWithSuggestions';

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const assetSuggestions = [
    'sdcdsc', 'test', 'asus zenbook', 'Diesel Generator', 'A.c', 'Energy Meter 23',
    'Located', 'sebc', 'Hay', 'ktta', 'demo', 'jyoti tower', 'jyoti',
    '203696', '203606', '194409', '166641', '168838', '144714', '53815'
  ];

  const handleSearch = (searchTerm: string) => {
    console.log('Search term:', searchTerm);
  };

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-10 w-full
        bg-white border-b border-[#D5DbDB]
        shadow-[0px_2px_18px_rgba(69,69,69,0.1)]

        h-[28px] px-[12px] pt-[12px] pb-[8px]     // Mobile

        md:h-[60px] md:px-[280px] md:pt-[24px] md:pb-[24px] // Tablet

        lg:h-[75px] lg:px-[312px] lg:pt-[24px] lg:pb-[24px] // Desktop
      "
    >
      <div className="flex items-center justify-between h-full w-full">
        <div className="flex items-center gap-x-[6px] md:gap-x-[24px] lg:gap-x-[64px]">
          {/* Home */}
          <button className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#C72030] transition-colors">
            <Home className="w-4 h-4" />
            <span
              className="
                font-['Work_Sans']
                text-[10px] md:text-[12px] lg:text-[16px]
                font-semibold
                text-[#1A1A1A]
                opacity-100 lg:opacity-70
              "
            >
              Home
            </span>
          </button>

          {/* Setup */}
          <a
            href="/setup"
            className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#C72030] transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span
              className="
                font-['Work_Sans']
                text-[10px] md:text-[12px] lg:text-[16px]
                font-medium
                text-[#1A1A1A]
              "
            >
              Setup
            </span>
          </a>

          {/* Project Change */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#C72030] transition-colors">
              <span className="text-[10px] md:text-[12px] lg:text-[16px] font-medium font-['Work_Sans'] text-[#1A1A1A]">
                Project Change
              </span>
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-[#D5DbDB] shadow-lg">
              <DropdownMenuItem>Project Alpha</DropdownMenuItem>
              <DropdownMenuItem>Project Beta</DropdownMenuItem>
              <DropdownMenuItem>Project Gamma</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Site Change */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#C72030] transition-colors">
              <MapPin className="w-4 h-4" />
              <span className="text-[10px] md:text-[12px] lg:text-[16px] font-medium font-['Work_Sans'] text-[#1A1A1A]">
                Lockastead Site 1
              </span>
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-[#D5DbDB] shadow-lg">
              <DropdownMenuItem>Lockastead Site 1</DropdownMenuItem>
              <DropdownMenuItem>Lockastead Site 2</DropdownMenuItem>
              <DropdownMenuItem>Downtown Office</DropdownMenuItem>
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

          {/* Notification */}
          <button className="p-2 hover:bg-[#f6f4ee] rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-[#1a1a1a]" />
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#C4b89D] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-[#1a1a1a]" />
              </div>
              <span className="text-[10px] md:text-[12px] lg:text-[16px] font-medium font-['Work_Sans'] text-[#1A1A1A]">
                Admin
              </span>
              <ChevronDown className="w-3 h-3 text-[#1a1a1a]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-[#D5DbDB] shadow-lg">
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Account Details</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
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
