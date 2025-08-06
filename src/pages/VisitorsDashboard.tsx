
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
  const [activeVisitorType, setActiveVisitorType] = useState('unexpected');
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
    <div className="p-6  min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>visitors</span>
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
            variant="ghost"
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
            variant="ghost"
          >
            Visitor Out
          </Button>
          <Button 
            onClick={handleHistoryClick}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
            variant="ghost"
          >
            History
          </Button>
        </div>

        {/* Person Selection Dropdown */}
        <div className="mb-6">
          <Select value={selectedPerson} onValueChange={setSelectedPerson}>
            <SelectTrigger className="w-full max-w-md bg-white border border-gray-300">
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
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2 hover:bg-gray-100"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Visitor Type Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-200 p-1 rounded-lg w-fit">
          <Button 
            onClick={() => setActiveVisitorType('unexpected')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeVisitorType === 'unexpected' 
                ? 'bg-[#C72030] text-white shadow-sm' 
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
            variant="ghost"
          >
            Unexpected Visitor
          </Button>
          <Button 
            onClick={() => setActiveVisitorType('expected')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeVisitorType === 'expected' 
                ? 'bg-[#C72030] text-white shadow-sm' 
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
            variant="ghost"
          >
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
          <Button 
            onClick={() => setIsNewVisitorDialogOpen(true)}
            style={{ backgroundColor: '#C72030' }}
            className="w-12 h-12 rounded-full text-white hover:bg-[#C72030]/90 shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <NewVisitorDialog 
        isOpen={isNewVisitorDialogOpen}
        onClose={() => setIsNewVisitorDialogOpen(false)}
      />
    </div>
  );
};
