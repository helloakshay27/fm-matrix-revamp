
import React from 'react';
import { Bell, Search, User, MapPin } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Lockastead Site 1</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};
