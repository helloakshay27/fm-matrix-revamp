import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, MapPin, User, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VisitorsHistoryFilterModal } from '@/components/VisitorsHistoryFilterModal';
import { NewVisitorDialog } from '@/components/NewVisitorDialog';

const visitorsData = [
  {
    id: 1,
    name: 'Sohail',
    status: 'Approved',
    host: 'Mahendra Lunagre',
    location: 'Gophygital',
    purpose: 'Meeting',
    passNumber: '2345',
    checkedIn: '06/08/25, 1:17 PM',
    checkedOut: ''
  },
  {
    id: 2,
    name: 'Test',
    status: 'Approved',
    host: 'Abdul A',
    location: 'Sam',
    purpose: 'Personal',
    passNumber: '2222',
    checkedIn: '06/08/25, 3:15 PM',
    checkedOut: ''
  },
  {
    id: 3,
    name: 'Aquil',
    status: 'Approved',
    host: 'Abdul A',
    location: 'Mumbai',
    purpose: 'Meeting',
    passNumber: 'HK7658',
    checkedIn: '06/08/25, 12:34 PM',
    checkedOut: ''
  },
  {
    id: 4,
    name: 'rohan',
    status: 'Approved',
    host: 'Sunil Kumar',
    location: 'Jaipur',
    purpose: 'Personal',
    passNumber: 'RH1234',
    checkedIn: '06/08/25, 2:45 PM',
    checkedOut: ''
  }
];

export const VisitorsHistoryDashboard = () => {
  const [activeTab, setActiveTab] = useState('History');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNewVisitorDialogOpen, setIsNewVisitorDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabClick = (tab: string) => {
    if (tab === 'Visitor In' || tab === 'Visitor Out') {
      navigate('/security/visitor');
    } else {
      setActiveTab(tab);
    }
  };

  const handleSearch = () => {
    setCurrentSearchTerm(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
    setCurrentSearchTerm('');
  };

  const filteredVisitors = visitorsData.filter(visitor =>
    visitor.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
    visitor.passNumber.toLowerCase().includes(currentSearchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-[hsl(var(--analytics-background))] min-h-screen">
      <div className="mb-6">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {['Visitor In', 'Visitor Out', 'History'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#C72030] text-[#C72030] bg-[#EDEAE3]'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Search using Guest's Name or Pass Number."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-4 pr-20 border-gray-300"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <Button 
                    onClick={handleSearch}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <Search className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button 
                    onClick={handleReset}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Visitor Cards */}
          <div className="p-4 space-y-4">
            {filteredVisitors.map((visitor) => (
              <div key={visitor.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{visitor.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{visitor.host}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{visitor.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span>
                        <span>{visitor.purpose}</span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {visitor.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Checked In at:</span>
                    <p className="text-sm text-blue-600 font-medium">{visitor.checkedIn}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Checked Out at:</span>
                    <p className="text-sm text-gray-400">{visitor.checkedOut || '-'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

      <VisitorsHistoryFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />

      <NewVisitorDialog 
        isOpen={isNewVisitorDialogOpen}
        onClose={() => setIsNewVisitorDialogOpen(false)}
      />
    </div>
  );
};