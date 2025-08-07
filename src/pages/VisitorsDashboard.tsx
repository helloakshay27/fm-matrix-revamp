
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RefreshCw, Plus, Search, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NewVisitorDialog } from '@/components/NewVisitorDialog';
import { UpdateNumberDialog } from '@/components/UpdateNumberDialog';

export const VisitorsDashboard = () => {
  const [selectedPerson, setSelectedPerson] = useState('');
  const [isNewVisitorDialogOpen, setIsNewVisitorDialogOpen] = useState(false);
  const [isUpdateNumberDialogOpen, setIsUpdateNumberDialogOpen] = useState(false);
  const [currentVisitorNumber, setCurrentVisitorNumber] = useState('');
  const [activeVisitorType, setActiveVisitorType] = useState('unexpected');
  const [mainTab, setMainTab] = useState('visitor');
  const [visitorSubTab, setVisitorSubTab] = useState('visitor-in');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Mock visitor data for history
  const visitorHistoryData = [
    {
      id: 1,
      name: 'nadia',
      host: 'Mahendra Lungare',
      location: 'mumbai',
      purpose: 'Meeting',
      status: 'Approved',
      passNumber: 'P001'
    },
    {
      id: 2,
      name: 'Test',
      host: 'Test 42.0',
      location: '',
      purpose: 'Personal',
      status: 'Approved',
      passNumber: 'P002'
    },
    {
      id: 3,
      name: 'Sohail',
      host: 'Mahendra Lungare',
      location: 'Gophygital',
      purpose: 'Meeting',
      status: 'Approved',
      passNumber: 'P003'
    }
  ];

  // Filter visitors based on search term
  const filteredVisitors = visitorHistoryData.filter(visitor => 
    visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.passNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.host.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleHistoryClick = () => {
    setVisitorSubTab('history');
  };

  const handleRefresh = () => {
    console.log('Refreshing person list...');
    // Handle refresh logic here
  };

  const handleEditClick = (currentNumber: string) => {
    setCurrentVisitorNumber(currentNumber);
    setIsUpdateNumberDialogOpen(true);
  };

  const handleNumberUpdate = (newNumber: string) => {
    console.log('Updating number from', currentVisitorNumber, 'to', newNumber);
    // Handle number update logic here
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // Handle search logic here
  };

  const handleReset = () => {
    setSearchTerm('');
    console.log('Search reset');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
            <TabsTrigger
              value="visitor"
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              <svg
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.875 4.25L3 5.375L5.25 3.125M1.875 9.5L3 10.625L5.25 8.375M1.875 14.75L3 15.875L5.25 13.625M7.875 9.5H16.125M7.875 14.75H16.125M7.875 4.25H16.125"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Visitor
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
              >
                <path
                  d="M7.66681 11.6106C6.59669 11.5192 5.69719 11.0831 4.96831 10.3024C4.23944 9.52162 3.875 8.5875 3.875 7.5C3.875 6.35413 4.27606 5.38019 5.07819 4.57819C5.88019 3.77606 6.85413 3.375 8 3.375C9.0875 3.375 10.0216 3.73825 10.8024 4.46475C11.5831 5.19112 12.0192 6.08944 12.1106 7.15969L10.9179 6.80625C10.7557 6.13125 10.4066 5.57812 9.87031 5.14688C9.33419 4.71563 8.71075 4.5 8 4.5C7.175 4.5 6.46875 4.79375 5.88125 5.38125C5.29375 5.96875 5 6.675 5 7.5C5 8.2125 5.21681 8.8375 5.65044 9.375C6.08406 9.9125 6.636 10.2625 7.30625 10.425L7.66681 11.6106ZM8.56681 14.5946C8.47231 14.6149 8.37788 14.625 8.2835 14.625H8C7.01438 14.625 6.08812 14.438 5.22125 14.064C4.35437 13.69 3.60031 13.1824 2.95906 12.5413C2.31781 11.9002 1.81019 11.1463 1.43619 10.2795C1.06206 9.41275 0.875 8.48669 0.875 7.50131C0.875 6.51581 1.062 5.5895 1.436 4.72237C1.81 3.85525 2.31756 3.101 2.95869 2.45962C3.59981 1.81825 4.35375 1.31044 5.2205 0.936187C6.08725 0.562062 7.01331 0.375 7.99869 0.375C8.98419 0.375 9.9105 0.562062 10.7776 0.936187C11.6448 1.31019 12.399 1.81781 13.0404 2.45906C13.6818 3.10031 14.1896 3.85437 14.5638 4.72125C14.9379 5.58812 15.125 6.51438 15.125 7.5V7.77975C15.125 7.873 15.1149 7.96631 15.0946 8.05969L14 7.725V7.5C14 5.825 13.4187 4.40625 12.2563 3.24375C11.0938 2.08125 9.675 1.5 8 1.5C6.325 1.5 4.90625 2.08125 3.74375 3.24375C2.58125 4.40625 2 5.825 2 7.5C2 9.175 2.58125 10.5938 3.74375 11.7563C4.90625 12.9187 6.325 13.5 8 13.5H8.225L8.56681 14.5946ZM14.1052 14.7332L10.7043 11.325L9.88944 13.7884L8 7.5L14.2884 9.38944L11.825 10.2043L15.2332 13.6052L14.1052 14.7332Z"
                  fill="currentColor"
                />
              </svg>
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visitor" className="bg-white rounded-lg border border-gray-200 mt-4">
            <Tabs value={visitorSubTab} onValueChange={setVisitorSubTab} className="w-full">
              <div className="flex bg-white p-1 rounded-lg">
                <Button 
                  onClick={() => setVisitorSubTab('visitor-in')}
                  className={`px-6 py-2 text-sm font-medium transition-colors rounded-md border-none ${
                    visitorSubTab === 'visitor-in' 
                      ? 'bg-[#EDEAE3] text-[#C72030] shadow-sm' 
                      : 'bg-transparent text-gray-600 hover:bg-white/50'
                  }`}
                  variant="ghost"
                >
                  Visitor In
                </Button>
                <Button 
                  onClick={() => setVisitorSubTab('visitor-out')}
                  className={`px-6 py-2 text-sm font-medium transition-colors rounded-md border-none ${
                    visitorSubTab === 'visitor-out' 
                      ? 'bg-[#EDEAE3] text-[#C72030] shadow-sm' 
                      : 'bg-transparent text-gray-600 hover:bg-white/50'
                  }`}
                  variant="ghost"
                >
                  Visitor Out
                </Button>
                <Button 
                  onClick={handleHistoryClick}
                  className={`px-6 py-2 text-sm font-medium transition-colors rounded-md border-none ${
                    visitorSubTab === 'history' 
                      ? 'bg-[#EDEAE3] text-[#C72030] shadow-sm' 
                      : 'bg-transparent text-gray-600 hover:bg-white/50'
                  }`}
                  variant="ghost"
                >
                  History
                </Button>
              </div>

              {/* Show content only for Visitor In tab */}
              {visitorSubTab === 'visitor-in' && (
                <div className="p-4">
                  {/* Top Row with Add Button and Person Selection */}
                  <div className="mb-6 flex justify-between items-center">
                    <Button 
                      onClick={() => setIsNewVisitorDialogOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#F8F5F0] text-[#C72030] hover:bg-[#F0EBE5] border border-[#E5D8CD] rounded-lg font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                    
                    <div className="flex items-center">
                      <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                        <SelectTrigger className="w-64 bg-white border border-gray-300">
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
                  <div className="bg-white rounded-lg border border-gray-200 min-h-[400px]">
                    {activeVisitorType === 'unexpected' && (
                      <div className="overflow-x-auto">
                        <table className="w-full caption-bottom text-sm border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground border-b border-gray-200 whitespace-nowrap" style={{ backgroundColor: "#f6f4ee" }}>
                                <input type="checkbox" className="w-4 h-4" />
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground border-b border-gray-200 whitespace-nowrap" style={{ backgroundColor: "#f6f4ee" }}>
                                Actions
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground border-b border-gray-200 whitespace-nowrap" style={{ backgroundColor: "#f6f4ee" }}>
                                Visitor Name
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground border-b border-gray-200 whitespace-nowrap" style={{ backgroundColor: "#f6f4ee" }}>
                                Details
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground border-b border-gray-200 whitespace-nowrap" style={{ backgroundColor: "#f6f4ee" }}>
                                Purpose
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground border-b border-gray-200 whitespace-nowrap" style={{ backgroundColor: "#f6f4ee" }}>
                                Status
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground border-b border-gray-200 whitespace-nowrap" style={{ backgroundColor: "#f6f4ee" }}>
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-200 transition-colors hover:bg-gray-50">
                              <td className="p-4 align-middle border-b border-gray-200 whitespace-nowrap">
                                <input type="checkbox" className="w-4 h-4" />
                              </td>
                              <td className="p-4 align-middle border-b border-gray-200 whitespace-nowrap">
                                <button 
                                  className="w-4 h-4 text-blue-500 hover:text-blue-700"
                                  onClick={() => handleEditClick('9555625186')}
                                >
                                  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                  </svg>
                                </button>
                              </td>
                              <td className="p-4 align-middle border-b border-gray-200 whitespace-nowrap">Test</td>
                              <td className="p-4 align-middle border-b border-gray-200 whitespace-nowrap">Test 42.0</td>
                              <td className="p-4 align-middle border-b border-gray-200 whitespace-nowrap">Personal</td>
                              <td className="p-4 align-middle border-b border-gray-200 whitespace-nowrap">
                                <div className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                  Pending
                                </div>
                              </td>
                              <td className="p-4 align-middle border-b border-gray-200 whitespace-nowrap">
                                <div className="flex gap-2">
                                  <Button 
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-xs rounded"
                                  >
                                    Resend OTP
                                  </Button>
                                  <Button 
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs rounded"
                                  >
                                    Skip Host Approval
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
              {visitorSubTab === 'visitor-out' && (
                <div className="p-4 min-h-[400px]">
                  <div className="text-center text-gray-500 py-16">
                    Visitor Out content will be displayed here
                  </div>
                </div>
              )}

              {/* History tab content */}
              {visitorSubTab === 'history' && (
                <div className="p-4 min-h-[400px] space-y-4">
                  {/* Add Button and Search Bar */}
                  <div className="flex justify-between items-center mb-4">
                    <Button 
                      onClick={() => setIsNewVisitorDialogOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#F8F5F0] text-[#C72030] hover:bg-[#F0EBE5] border border-[#E5D8CD] rounded-lg font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                    
                    <div className="flex items-center gap-2 flex-1 max-w-md ml-4">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Search using Guest's Name or Pass Number."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        />
                        <button
                          onClick={handleSearch}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      </div>
                      <Button
                        onClick={handleReset}
                        variant="ghost"
                        size="sm"
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Visitor Cards */}
                  <div className="space-y-4">
                    {filteredVisitors.length > 0 ? (
                      filteredVisitors.map((visitor) => (
                        <div key={visitor.id} className="bg-[#F8F5F0] rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{visitor.name}</h3>
                                <div className="flex items-center text-sm text-gray-600 gap-1">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                  </svg>
                                  {visitor.host}
                                </div>
                                {visitor.location && (
                                  <div className="flex items-center text-sm text-gray-600 gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    {visitor.location}
                                  </div>
                                )}
                                <div className="flex items-center text-sm text-gray-600 gap-1 mt-1">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7h-3V2h-2v2H8V2H6v2H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H3V9h14v11z"/>
                                  </svg>
                                  {visitor.purpose}
                                </div>
                              </div>
                            </div>
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              {visitor.status}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600 font-medium">Checked In at:</span>
                              <div className="text-gray-900"></div>
                            </div>
                            <div>
                              <span className="text-gray-600 font-medium">Checked Out at:</span>
                              <div className="text-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        {searchTerm ? 'No visitors found matching your search.' : 'No visitor history available.'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Tabs>
          </TabsContent>

          <TabsContent value="analytics" className="bg-white rounded-lg border border-gray-200 mt-4 p-6">
            <div className="text-center text-gray-500 py-16">
              Analytics content will be displayed here
            </div>
          </TabsContent>
        </Tabs>

      </div>

      <NewVisitorDialog 
        isOpen={isNewVisitorDialogOpen}
        onClose={() => setIsNewVisitorDialogOpen(false)}
      />
      
      <UpdateNumberDialog 
        isOpen={isUpdateNumberDialogOpen}
        onClose={() => setIsUpdateNumberDialogOpen(false)}
        currentNumber={currentVisitorNumber}
        onUpdate={handleNumberUpdate}
      />
    </div>
  );
};
