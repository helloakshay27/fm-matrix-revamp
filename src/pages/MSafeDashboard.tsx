
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Users, FileText } from 'lucide-react';

export const MSafeDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">M Safe</h1>
            <p className="text-gray-600">Safety management and compliance dashboard</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Non FTE Users Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Non FTE Users</h3>
                <p className="text-sm text-gray-600">Manage non-full-time employees</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/maintenance/m-safe/non-fte-users')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              View Non FTE Users
            </Button>
          </div>

          {/* KRCC Form List Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">KRCC Form List</h3>
                <p className="text-sm text-gray-600">Manage KRCC compliance forms</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/maintenance/m-safe/krcc-form-list')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              View KRCC Forms
            </Button>
          </div>
        </div>

        {/* Quick Access Dropdown */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                  Safety Modules
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg">
                <DropdownMenuItem 
                  onClick={() => navigate('/maintenance/m-safe/non-fte-users')}
                  className="hover:bg-purple-50 cursor-pointer"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Non FTE Users
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/maintenance/m-safe/krcc-form-list')}
                  className="hover:bg-purple-50 cursor-pointer"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  KRCC Form List
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
