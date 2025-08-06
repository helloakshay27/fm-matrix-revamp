
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, MapPin, User, Car, CreditCard, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VisitorsHistoryFilterModal } from '@/components/VisitorsHistoryFilterModal';

const visitorsData = [
  {
    id: 1,
    name: 'Test',
    status: 'Approved',
    location: 'Delhi',
    purpose: 'business bay',
    category: 'Courier',
    passNumber: '2345',
    checkedIn: '',
    checkedOut: ''
  },
  {
    id: 2,
    name: 'ajit',
    status: 'Approved',
    location: 'Pune',
    purpose: '',
    category: 'Personal',
    passNumber: '2222',
    checkedIn: '',
    checkedOut: ''
  },
  {
    id: 3,
    name: 'Deepak',
    status: 'Approved',
    location: 'Mumbai',
    purpose: '',
    category: 'meeting',
    passNumber: 'HK7658',
    checkedIn: '',
    checkedOut: ''
  },
  {
    id: 4,
    name: 'sunil',
    status: 'Approved',
    location: 'jaipur',
    purpose: 'Devesh Jain',
    category: 'Personal',
    passNumber: '',
    checkedIn: '',
    checkedOut: ''
  }
];

export const VisitorsHistoryDashboard = () => {
  const [activeTab, setActiveTab] = useState('History');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
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
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>visitors</span>
          <span>&gt;</span>
          <span>Visitors History</span>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {['Visitor In', 'Visitor Out', 'History'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#C72030] text-[#C72030] bg-[#C72030]/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Action Buttons and Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            </div>
            
            <div className="flex items-center gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search using Guest's Name or Pass Number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={handleSearch}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:bg-[#C72030]/90"
                size="sm"
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button 
                onClick={handleReset}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:bg-[#C72030]/90"
                size="sm"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
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
                      {visitor.purpose && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <User className="w-3 h-3" />
                          <span>{visitor.purpose}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                    {visitor.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{visitor.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center text-xs bg-gray-200 rounded">?</span>
                    <span>{visitor.category}</span>
                  </div>
                  {visitor.passNumber && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>{visitor.passNumber}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mt-3 pt-3 border-t border-green-200 text-sm">
                  <div>
                    <span className="font-medium text-blue-600">Checked In at:</span>
                    <span className="ml-1 text-gray-600">{visitor.checkedIn || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-600">Checked Out at:</span>
                    <span className="ml-1 text-gray-600">{visitor.checkedOut || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-200">
            <Button 
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
              size="sm"
            >
              1
            </Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">4</Button>
            <Button variant="outline" size="sm">5</Button>
            <span className="text-gray-500">...</span>
            <Button variant="outline" size="sm">»</Button>
            <Button variant="outline" size="sm" className="text-blue-600">Last »</Button>
          </div>
        </div>
      </div>

      <VisitorsHistoryFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
