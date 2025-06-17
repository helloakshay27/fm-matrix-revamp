
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Plus } from 'lucide-react';

export const VisitorsDashboard = () => {
  const [activeTab, setActiveTab] = useState('visitor-in');

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>visitors</span>
          <span>&gt;</span>
          <span>Visitors</span>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-gray-200 p-1 rounded-lg w-fit">
          <Button 
            onClick={() => setActiveTab('visitor-in')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'visitor-in' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Visitor In
          </Button>
          <Button 
            onClick={() => setActiveTab('visitor-out')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'visitor-out' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Visitor Out
          </Button>
          <Button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            History
          </Button>
        </div>

        {/* Person Selection Dropdown */}
        <div className="mb-6">
          <Select>
            <SelectTrigger className="w-full max-w-md bg-white border border-gray-300">
              <SelectValue placeholder="Select Person To Meet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="person1">Person 1</SelectItem>
              <SelectItem value="person2">Person 2</SelectItem>
              <SelectItem value="person3">Person 3</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" className="ml-2">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Visitor Type Buttons */}
        <div className="flex gap-4 mb-6">
          <Button className="px-8 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg">
            Unexpected Visitor
          </Button>
          <Button className="px-8 py-3 bg-[#C72030] hover:bg-[#B01E2A] text-white rounded-lg">
            Expected Visitor
          </Button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-[400px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            {activeTab === 'visitor-in' && 'Visitor In content will be displayed here'}
            {activeTab === 'visitor-out' && 'Visitor Out content will be displayed here'}
            {activeTab === 'history' && 'History content will be displayed here'}
          </div>
        </div>

        {/* Floating Add Button */}
        <div className="fixed bottom-8 right-8">
          <Button className="w-12 h-12 rounded-full bg-[#C72030] hover:bg-[#B01E2A] text-white shadow-lg">
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
