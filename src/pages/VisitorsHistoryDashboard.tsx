
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Filter } from 'lucide-react';
import { VisitorsHistoryFilterModal } from '@/components/VisitorsHistoryFilterModal';

const visitorsData = [
  {
    id: 1,
    profileImage: '👤',
    name: 'Test',
    mobileNumber: '8791151106',
    vehicleNumber: '0401',
    passNumber: '2345',
    passValidFrom: '10/06/25',
    passValidTo: '15/06/25',
    daysPermitted: 'Mon',
    personToMeet: 'Abdul Ghaffar',
    visitorType: 'Guest',
    purpose: 'Co'
  },
  {
    id: 2,
    profileImage: '👤',
    name: 'ajit',
    mobileNumber: '4323323212',
    vehicleNumber: 'up80cq0402',
    passNumber: '2222',
    passValidFrom: '',
    passValidTo: '',
    daysPermitted: '',
    personToMeet: 'arun',
    visitorType: 'Guest',
    purpose: 'Per'
  },
  {
    id: 3,
    profileImage: '👤',
    name: 'alok',
    mobileNumber: '2311223311',
    vehicleNumber: 'up80cq0401',
    passNumber: '2345',
    passValidFrom: '',
    passValidTo: '',
    daysPermitted: '',
    personToMeet: 'aryan',
    visitorType: 'Guest',
    purpose: 'Per'
  },
  {
    id: 4,
    profileImage: '👤',
    name: 'Advya',
    mobileNumber: '88788797875',
    vehicleNumber: 'UP87B85432',
    passNumber: 'HN9087',
    passValidFrom: '',
    passValidTo: '',
    daysPermitted: '',
    personToMeet: 'Vinayak Mane',
    visitorType: 'Guest',
    purpose: 'Conf'
  },
  {
    id: 5,
    profileImage: '👤',
    name: 'Aditi',
    mobileNumber: '5876345708',
    vehicleNumber: 'WS43ED7654',
    passNumber: 'HG675487',
    passValidFrom: '',
    passValidTo: '',
    daysPermitted: '',
    personToMeet: 'ABDUL Gaffar',
    visitorType: 'Guest',
    purpose: 'Per'
  },
  {
    id: 6,
    profileImage: '👤',
    name: 'Deepak',
    mobileNumber: '5435879378',
    vehicleNumber: 'EH45MH7890',
    passNumber: 'HK7658',
    passValidFrom: '',
    passValidTo: '',
    daysPermitted: '',
    personToMeet: 'Sohail Ansari',
    visitorType: 'Guest',
    purpose: 'me'
  },
  {
    id: 7,
    profileImage: '👤',
    name: 'Advya',
    mobileNumber: '88788797875',
    vehicleNumber: 'UP87B85432',
    passNumber: 'HN9087',
    passValidFrom: '',
    passValidTo: '',
    daysPermitted: '',
    personToMeet: 'Vinayak Mane',
    visitorType: 'Guest',
    purpose: 'Conf'
  },
  {
    id: 8,
    profileImage: '👤',
    name: 'Aditi',
    mobileNumber: '5876345708',
    vehicleNumber: 'WS43ED7654',
    passNumber: 'HG675487',
    passValidFrom: '',
    passValidTo: '',
    daysPermitted: '',
    personToMeet: 'ABDUL Gaffar',
    visitorType: 'Guest',
    purpose: 'Per'
  }
];

export const VisitorsHistoryDashboard = () => {
  const [activeTab, setActiveTab] = useState('History');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>visitors</span>
          <span>&gt;</span>
          <span>Visitors History</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">VISITORS HISTORY</h1>
        
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {['History', 'Visitor In', 'Visitor Out'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#C72030] text-[#C72030] bg-[#C72030]/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
            
            <div className="ml-auto p-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Valid From</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Valid To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Permitted</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Person To Meet</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visitorsData.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm">
                        {visitor.profileImage}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.mobileNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{visitor.vehicleNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.passNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.passValidFrom}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.passValidTo}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.daysPermitted}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.personToMeet}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.visitorType}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <VisitorsHistoryFilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
    </div>
  );
};
