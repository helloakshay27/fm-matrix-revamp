
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SlidersHorizontal } from 'lucide-react';
import { GatePassInwardsFilterModal } from '@/components/GatePassInwardsFilterModal';

export const GatePassInwardsDashboard = () => {
  const navigate = useNavigate();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Data matching the screenshot
  const inwardData = [
    {
      id: "4102",
      type: "",
      category: "Visitor",
      personName: "Aniket",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10027",
      itemDetails: "- Drill machine serials 1244 -"
    },
    {
      id: "1083",
      type: "Faulty",
      category: "Vendor",
      personName: "Haven infoline",
      profileImage: "/placeholder.svg",
      passNo: "143",
      modeOfTransport: "By Hand",
      lrNo: "Bbvbb",
      tripId: "0",
      gateEntry: "7-10026",
      itemDetails: "RAN - 1 - MW - -"
    },
    {
      id: "864",
      type: "SRN",
      category: "Visitor",
      personName: "Yash",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10025",
      itemDetails: "Transmission - - MW - -"
    },
    {
      id: "863",
      type: "SRN",
      category: "Staff",
      personName: "demo demo",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10024",
      itemDetails: "Transmission - - 5 Transmission - -"
    },
    {
      id: "862",
      type: "Fresh",
      category: "Visitor",
      personName: "Prashant",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10023",
      itemDetails: "Transmission - - Transmission - - Transmission - -"
    },
    {
      id: "861",
      type: "SRN",
      category: "Visitor",
      personName: "bilal",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10022",
      itemDetails: "MW - - Transmission - - Transmission - -"
    },
    {
      id: "860",
      type: "Faulty",
      category: "Visitor",
      personName: "Saurabh",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10021",
      itemDetails: "MW - - Transmission - -"
    }
  ];

  const handleViewDetails = (id: string) => {
    console.log('View details for:', id);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">Inward List</h1>
        
        {/* Add and Filters Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="!bg-[#F2EEE9] border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => navigate('/security/gate-pass/inwards/add')}
          >
            <span className="text-lg">+</span>
            Add
          </Button>
          <Button 
            variant="outline"
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white px-4 py-2 rounded-none flex items-center gap-2"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Person Name</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Profile Image</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Pass No.</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mode of Transport</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">LR No.</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Trip ID</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Gate Entry</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inwardData.map((entry, index) => (
              <TableRow key={entry.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                <TableCell className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleViewDetails(entry.id)}
                    className="text-blue-600 hover:underline hover:text-blue-800 transition-colors font-medium"
                  >
                    {entry.id}
                  </button>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">{entry.type}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">{entry.category}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">{entry.personName}</TableCell>
                <TableCell className="px-4 py-3">
                  <img 
                    src={entry.profileImage} 
                    alt={`${entry.personName} profile`}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">{entry.passNo}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">{entry.modeOfTransport}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">{entry.lrNo}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">{entry.tripId}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">{entry.gateEntry}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{entry.itemDetails}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <GatePassInwardsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
