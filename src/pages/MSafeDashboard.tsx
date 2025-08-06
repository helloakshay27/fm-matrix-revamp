
import React from 'react';
import { Users, UserCheck, UserClock, Settings, Shield, UserPlus, Search, Filter, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const MSafeDashboard = () => {
  const cardData = [
    { title: "User Management", count: 25, icon: Users },
    { title: "Active Users", count: 18, icon: UserCheck },
    { title: "Pending Approvals", count: 7, icon: UserClock },
    { title: "System Settings", count: 12, icon: Settings },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">MSafe Dashboard</h1>
        <p className="text-gray-600">Manage your security operations and user access</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-[#f6f4ee] rounded-lg p-6 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4"
          >
            <div className="w-14 h-14 bg-[#FBEDEC] rounded-full flex items-center justify-center">
              <card.icon className="w-6 h-6 text-[#C72030]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#C72030]">{card.count}</div>
              <div className="text-sm font-medium text-gray-600">{card.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Button className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
          <Button className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security Settings
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500">No recent activity to display.</p>
      </div>
    </div>
  );
};
