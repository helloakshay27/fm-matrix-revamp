
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SlidersHorizontal, Eye } from 'lucide-react';
import { GatePassOutwardsFilterModal } from '@/components/GatePassOutwardsFilterModal';

export const GatePassOutwardsDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = (id: string) => {
    navigate(`/security/gate-pass/outwards/${id}`);
  };

  // Data matching the screenshot
  const outwardData = [
    {
      id: "850",
      type: "Fresh",
      returnableNonReturnable: "Non Returnable",
      expectedReturnDate: "",
      category: "Visitor",
      personName: "Suraj",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand,By Vehicle",
      lrNo: "",
      tripId: "7-10013",
      gateEntry: "",
      itemDetails: "Transmission - - MW - -"
    },
    {
      id: "845",
      type: "SRN",
      returnableNonReturnable: "Returnable",
      expectedReturnDate: "20/02/2023",
      category: "Visitor",
      personName: "kshitij r",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Courier,By Vehicle",
      lrNo: "12",
      tripId: "7-10008",
      gateEntry: "55",
      itemDetails: "MW - 4 - 2 Transmission - 8 - 2"
    },
    {
      id: "844",
      type: "SRN",
      returnableNonReturnable: "Returnable",
      expectedReturnDate: "20/02/2023",
      category: "Visitor",
      personName: "Din",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand,By Courier",
      lrNo: "123",
      tripId: "7-10007",
      gateEntry: "55",
      itemDetails: "Transmission - 12 - 55 MW - 4 - 3"
    },
    {
      id: "840",
      type: "",
      returnableNonReturnable: "Non Returnable",
      expectedReturnDate: "",
      category: "Staff",
      personName: "demo demo",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "",
      lrNo: "",
      tripId: "7-10003",
      gateEntry: "",
      itemDetails: "Transmission - 45 - 1 MW - 23 - 5"
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Outward List</h1>
      
      <div className="flex items-center gap-3 mb-6">
        <Button 
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 flex items-center gap-2 border border-[#C72030]"
          onClick={() => navigate('/security/gate-pass/outwards/add')}
        >
          <span className="text-lg">+</span>
          Add
        </Button>
        
        <Button 
          variant="outline"
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 px-4 py-2 flex items-center gap-2"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">

        {/* Data Table */}
        <div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="text-left font-semibold text-gray-700 px-6 py-4">S No.</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 px-6 py-4">Preview</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 px-6 py-4">ID</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 px-6 py-4">Type</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 px-6 py-4">Returnable/Non Returnable</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 px-6 py-4">Expected Return Date</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 px-6 py-4">Category</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 px-6 py-4">Person Name</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 px-6 py-4">Profile Image</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 px-6 py-4">Pass No.</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 px-6 py-4">Mode of Transport</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 px-6 py-4">LR No.</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 px-6 py-4">Trip ID</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 px-6 py-4">Gate Entry</TableHead>
                <TableHead className="text-left font-semibold text-gray-700 px-6 py-4">Item Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outwardData.map((entry, index) => (
                <TableRow key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="px-6 py-4 text-gray-900">{String(index + 1).padStart(1, '0')}</TableCell>
                  <TableCell className="px-6 py-4">
                    <button 
                      onClick={() => handleViewDetails(entry.id)}
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <button
                      className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors font-medium"
                      onClick={() => handleViewDetails(entry.id)}
                    >
                      {entry.id}
                    </button>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-900">{entry.type}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-900">{entry.returnableNonReturnable}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-900">{entry.expectedReturnDate}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-900">{entry.category}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-900 font-medium">{entry.personName}</TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-xs font-medium">
                        {entry.personName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-900">{entry.passNo}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-900">{entry.modeOfTransport}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-900">{entry.lrNo}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-900">{entry.tripId}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-900">{entry.gateEntry}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-900 max-w-xs truncate">{entry.itemDetails}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <GatePassOutwardsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
