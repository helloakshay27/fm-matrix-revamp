
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NewVisitorDialog } from '@/components/NewVisitorDialog';

export const VisitorsDashboard = () => {
  const [activeTab, setActiveTab] = useState('visitor-in');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [isNewVisitorDialogOpen, setIsNewVisitorDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleHistoryClick = () => {
    navigate('/security/visitor/history');
  };

  const handleRefresh = () => {
    console.log('Refreshing person list...');
    // Handle refresh logic here
  };

  const handleUnexpectedVisitor = () => {
    console.log('Handling unexpected visitor...');
    // Handle unexpected visitor logic here
  };

  const handleExpectedVisitor = () => {
    console.log('Handling expected visitor...');
    // Handle expected visitor logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-white">
          <Button 
            onClick={() => setActiveTab('visitor-in')}
            className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'visitor-in' 
                ? 'border-blue-500 text-blue-600 bg-white' 
                : 'border-transparent text-gray-500 hover:text-gray-700 bg-white'
            }`}
            variant="ghost"
          >
            Visitor In
          </Button>
          <Button 
            onClick={() => setActiveTab('visitor-out')}
            className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'visitor-out' 
                ? 'border-blue-500 text-blue-600 bg-white' 
                : 'border-transparent text-gray-500 hover:text-gray-700 bg-white'
            }`}
            variant="ghost"
          >
            Visitor Out
          </Button>
          <Button 
            onClick={handleHistoryClick}
            className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'history' 
                ? 'border-blue-500 text-blue-600 bg-white' 
                : 'border-transparent text-gray-500 hover:text-gray-700 bg-white'
            }`}
            variant="ghost"
          >
            History
          </Button>
        </div>

        {/* Main Content */}
        <div className="p-8 bg-white">
          {/* Person Selection Dropdown */}
          <div className="mb-8">
            <Select value={selectedPerson} onValueChange={setSelectedPerson}>
              <SelectTrigger className="w-full max-w-md bg-white border border-gray-300 text-gray-600">
                <SelectValue placeholder="Select Person To Meet" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="person1">Abdul Ghaffar</SelectItem>
                <SelectItem value="person2">Arun</SelectItem>
                <SelectItem value="person3">Aryan</SelectItem>
                <SelectItem value="person4">Vinayak Mane</SelectItem>
                <SelectItem value="person5">Sohail Ansari</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visitor Type Buttons */}
          <div className="flex gap-8 mb-8">
            <div className="text-center">
              <Button 
                onClick={handleUnexpectedVisitor}
                className="px-12 py-4 text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg"
                variant="outline"
              >
                Unexpected Visitor
              </Button>
            </div>
            <div className="text-center">
              <Button 
                onClick={handleExpectedVisitor}
                className="px-12 py-4 text-red-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg relative"
                variant="outline"
              >
                Expected Visitor
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-red-500"></div>
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="min-h-[500px] flex items-center justify-center">
            <div className="text-center text-gray-400">
              {activeTab === 'visitor-in' && 'Visitor In content will be displayed here'}
              {activeTab === 'visitor-out' && 'Visitor Out content will be displayed here'}
              {activeTab === 'history' && 'History content will be displayed here'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Powered by</span>
            <span className="font-medium text-orange-500">goPhygital work</span>
          </div>
        </div>
      </div>

      <NewVisitorDialog 
        isOpen={isNewVisitorDialogOpen}
        onClose={() => setIsNewVisitorDialogOpen(false)}
      />
    </div>
  );
};
