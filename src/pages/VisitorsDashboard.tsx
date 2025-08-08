
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RefreshCw, Plus, Search, RotateCcw, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NewVisitorDialog } from '@/components/NewVisitorDialog';
import { UpdateNumberDialog } from '@/components/UpdateNumberDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

export const VisitorsDashboard = () => {
  const [selectedPerson, setSelectedPerson] = useState('');
  const [isNewVisitorDialogOpen, setIsNewVisitorDialogOpen] = useState(false);
  const [isUpdateNumberDialogOpen, setIsUpdateNumberDialogOpen] = useState(false);
  const [currentVisitorNumber, setCurrentVisitorNumber] = useState('');
  const [activeVisitorType, setActiveVisitorType] = useState('unexpected');
  const [mainTab, setMainTab] = useState('visitor');
  const [visitorSubTab, setVisitorSubTab] = useState('visitor-in');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisitors, setSelectedVisitors] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  // Mock visitor out data based on the image
  const visitorOutData = [
    {
      id: 1,
      name: 'Test visitor',
      visitorName: 'Test visitor',
      host: 'Sohail Ansari',
      purpose: 'Meeting',
      checkedInAt: '21/02/25, 10:56 AM',
      status: 'Approved',
      avatar: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'SY',
      visitorName: 'SY',
      host: 'Saumir Yadav',
      purpose: 'Personal',
      checkedInAt: '18/02/25, 2:29 PM',
      status: 'Approved',
      avatar: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Abdul',
      visitorName: 'Abdul',
      host: 'abdul abdul',
      purpose: 'Meeting',
      location: 'Maumbal',
      checkedInAt: '20/02/25, 9:30 AM',
      status: 'Approved',
      avatar: '/placeholder.svg'
    }
  ];

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

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedVisitors(visitorOutData.map(visitor => visitor.id));
    } else {
      setSelectedVisitors([]);
    }
  };

  const handleSelectVisitor = (visitorId: number, checked: boolean) => {
    if (checked) {
      setSelectedVisitors(prev => [...prev, visitorId]);
    } else {
      setSelectedVisitors(prev => prev.filter(id => id !== visitorId));
      setSelectAll(false);
    }
  };

  const handleCheckOut = (visitorId: number) => {
    console.log('Checking out visitor:', visitorId);
    // Handle check out logic here
  };

  const handleViewVisitor = (visitorId: number) => {
    console.log('Viewing visitor:', visitorId);
    // Handle view visitor logic here
  };

  const handleEditVisitor = (visitorId: number) => {
    console.log('Editing visitor:', visitorId);
    // Handle edit visitor logic here
  };

  const handleDeleteVisitor = (visitorId: number) => {
    console.log('Deleting visitor:', visitorId);
    // Handle delete visitor logic here
  };
  
  // Column configurations for different tables
  const visitorOutColumns: ColumnConfig[] = [
    { key: 'select', label: 'Select', sortable: false, hideable: false, draggable: false },
    { key: 'actions', label: 'Actions', sortable: false, hideable: false, draggable: false },
    { key: 'visitorName', label: 'Visitor Name', sortable: true, hideable: true, draggable: true },
    { key: 'host', label: 'Host', sortable: true, hideable: true, draggable: true },
    { key: 'purpose', label: 'Purpose', sortable: true, hideable: true, draggable: true },
    { key: 'checkedInAt', label: 'Checked In At', sortable: true, hideable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true }
  ];

  const historyColumns: ColumnConfig[] = [
    { key: 'sNo', label: 'S No.', sortable: false, hideable: false, draggable: false },
    { key: 'actions', label: 'Actions', sortable: false, hideable: false, draggable: false },
    { key: 'passNumber', label: 'Pass Number', sortable: true, hideable: true, draggable: true },
    { key: 'name', label: 'Name', sortable: true, hideable: true, draggable: true },
    { key: 'host', label: 'Host', sortable: true, hideable: true, draggable: true },
    { key: 'location', label: 'Location', sortable: true, hideable: true, draggable: true },
    { key: 'purpose', label: 'Purpose', sortable: true, hideable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true }
  ];

  const renderVisitorOutRow = (visitor: any) => ({
    select: (
      <Checkbox
        checked={selectedVisitors.includes(visitor.id)}
        onCheckedChange={(checked) => handleSelectVisitor(visitor.id, checked as boolean)}
      />
    ),
    actions: (
      <div className="flex gap-2">
        <Button size="sm" onClick={() => handleCheckOut(visitor.id)}>
          Check Out
        </Button>
      </div>
    ),
    visitorName: (
      <div className="flex items-center gap-3">
        <img 
          src={visitor.avatar} 
          alt={visitor.visitorName}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span>{visitor.visitorName}</span>
      </div>
    ),
    host: visitor.host,
    purpose: visitor.purpose,
    checkedInAt: visitor.checkedInAt,
    status: (
      <Badge variant="outline" className="text-green-600 border-green-600">
        {visitor.status}
      </Badge>
    )
  });

  const renderHistoryRow = (visitor: any, index: number) => ({
    sNo: index + 1,
    actions: (
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => handleViewVisitor(visitor.id)}>
          <Eye className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleEditVisitor(visitor.id)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleDeleteVisitor(visitor.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
    passNumber: visitor.passNumber,
    name: visitor.name,
    host: visitor.host,
    location: visitor.location || '--',
    purpose: visitor.purpose,
    status: (
      <Badge variant="outline" className="text-green-600 border-green-600">
        {visitor.status}
      </Badge>
    )
  });

  const historyDataWithIndex = visitorHistoryData.map((visitor, index) => ({
    ...visitor,
    sNo: index + 1
  }));

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
                      style={{ backgroundColor: '#C72030' }}
                      className="text-white hover:bg-[#C72030]/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
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
                      <div className="p-4">
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-lg font-medium mb-2">No unexpected visitors</div>
                          <div className="text-sm">There are currently no unexpected visitors to display</div>
                        </div>
                      </div>
                    )}
                    
                    {activeVisitorType === 'expected' && (
                      <div className="p-4">
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-lg font-medium mb-2">No expected visitors</div>
                          <div className="text-sm">There are currently no expected visitors to display</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Visitor Out Tab */}
              {visitorSubTab === 'visitor-out' && (
                <div className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                      />
                      <span className="text-sm">Select All</span>
                    </div>
                  </div>
                  
                  <EnhancedTable
                    data={visitorOutData}
                    columns={visitorOutColumns}
                    renderRow={renderVisitorOutRow}
                    storageKey="visitor-out-table"
                    emptyMessage="No visitors currently checked in"
                    enableSearch={true}
                    enableExport={true}
                    searchPlaceholder="Search visitors..."
                    exportFileName="visitor-out-data"
                  />
                </div>
              )}

              {/* History Tab */}
              {visitorSubTab === 'history' && (
                <div className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search visitors..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <Button size="sm" onClick={handleSearch}>
                        <Search className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleReset}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <EnhancedTable
                    data={historyDataWithIndex}
                    columns={historyColumns}
                    renderRow={(visitor) => renderHistoryRow(visitor, visitor.sNo - 1)}
                    storageKey="visitor-history-table"
                    emptyMessage="No visitor history available"
                    enableSearch={true}
                    enableExport={true}
                    searchPlaceholder="Search visitor history..."
                    exportFileName="visitor-history"
                  />
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
