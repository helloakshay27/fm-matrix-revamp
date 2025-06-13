
import React from 'react';
import { Bell, Search, User, MapPin, ChevronDown } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-[#D5DbDB] fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6">
            <button className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg text-sm">
              Home
            </button>
            <span className="text-sm text-[#1a1a1a] opacity-70">Dashboard</span>
            <span className="text-sm text-[#1a1a1a] opacity-70">Setup</span>
            <span className="text-sm text-[#1a1a1a] opacity-70">Executive Dashboard</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[#1a1a1a]">
            <span>UrbanWrk</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-[#1a1a1a]">
            <span>Aeromall, Vimaan Nagar</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          
          <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-semibold text-sm">
            A
          </div>
        </div>
      </div>
    </header>
  );
};
