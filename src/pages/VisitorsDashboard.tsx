
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <Button 
              onClick={() => setActiveTab('visitor-in')}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 rounded-none bg-transparent hover:bg-transparent ${
                activeTab === 'visitor-in' 
                  ? 'text-primary border-primary bg-primary/5' 
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
              variant="ghost"
            >
              Visitor In
            </Button>
            <Button 
              onClick={() => setActiveTab('visitor-out')}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 rounded-none bg-transparent hover:bg-transparent ${
                activeTab === 'visitor-out' 
                  ? 'text-primary border-primary bg-primary/5' 
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
              variant="ghost"
            >
              Visitor Out
            </Button>
            <Button 
              onClick={handleHistoryClick}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 rounded-none bg-transparent hover:bg-transparent ${
                activeTab === 'history' 
                  ? 'text-primary border-primary bg-primary/5' 
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
              variant="ghost"
            >
              History
            </Button>
          </div>

          {/* Show content only for Visitor In tab */}
          {activeTab === 'visitor-in' && (
            <div className="p-4">
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
              <div className="flex gap-8 mb-6 border-b border-border">
              <Button 
                onClick={() => setActiveVisitorType('unexpected')}
                className={`px-0 py-3 text-sm font-medium transition-colors border-b-2 rounded-none bg-transparent hover:bg-transparent ${
                  activeVisitorType === 'unexpected' 
                    ? 'text-primary border-primary' 
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
                variant="ghost"
              >
                Unexpected Visitor
              </Button>
              <Button 
                onClick={() => setActiveVisitorType('expected')}
                className={`px-0 py-3 text-sm font-medium transition-colors border-b-2 rounded-none bg-transparent hover:bg-transparent ${
                  activeVisitorType === 'expected' 
                    ? 'text-primary border-primary' 
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
                variant="ghost"
              >
                Expected Visitor
              </Button>
              </div>

              {/* Content Area */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[400px]">
              {activeVisitorType === 'unexpected' && (
                <div className="space-y-4">
                  {/* Visitor Card */}
                  <div className="bg-orange-50 rounded-lg p-4 relative">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-orange-300 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
                      </div>
                      
                      {/* Visitor Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">Test</h3>
                          <button className="w-4 h-4 text-blue-500">
                            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                            </svg>
                          </button>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                            </svg>
                            <span>Test 42.0</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path>
                            </svg>
                            <span>Personal</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        Pending
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button 
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
                    >
                      Resend OTP
                    </Button>
                    <Button 
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
                    >
                      Skip Host Approval
                    </Button>
                  </div>
                </div>
              )}
              
              {activeVisitorType === 'expected' && (
                <div className="text-center text-gray-500 py-16">
                  Expected Visitor content will be displayed here
                </div>
              )}
              </div>
            </div>
          )}

          {/* Visitor Out tab content - blank */}
          {activeTab === 'visitor-out' && (
            <div className="p-4 min-h-[400px]">
              {/* This tab is intentionally blank */}
            </div>
          )}
        </div>

        {/* Floating Add Button - only show for Visitor In */}
        {activeTab === 'visitor-in' && (
          <div className="fixed bottom-8 right-8">
            <Button 
              onClick={() => setIsNewVisitorDialogOpen(true)}
              style={{ backgroundColor: '#C72030' }}
              className="w-12 h-12 rounded-full text-white hover:bg-[#C72030]/90 shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        )}
      </div>

      <NewVisitorDialog 
        isOpen={isNewVisitorDialogOpen}
        onClose={() => setIsNewVisitorDialogOpen(false)}
      />
    </div>
  );
};
