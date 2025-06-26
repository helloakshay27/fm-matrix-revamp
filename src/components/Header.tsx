
import React from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Left side - Home, Setup, Project Change */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
            🏠 Home
          </Button>
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
            ⚙️ Setup
          </Button>
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
            📋 Project Change
          </Button>
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
            🔒 Lockstead Site 1
          </Button>
        </div>

        {/* Right side - Search, Notifications, User */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search assets..." 
              className="pl-10 w-64"
            />
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Admin</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
