
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Filter, Eye, Plus } from 'lucide-react';
import { GatePassInwardsFilterModal } from '@/components/GatePassInwardsFilterModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    navigate(`/security/gate-pass/inwards/detail/${id}`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">Inward List</h1>
        
        {/* Add and Filters Buttons */}
        <div className="flex justify-between items-center">
          <Button 
            onClick={() => navigate('/security/gate-pass/inwards/add')}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button 
            variant="outline"
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white p-2 rounded-md"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 border-b">
              <TableHead className="font-semibold text-gray-700 py-4 px-6">S No.</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">Actions</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">ID</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">Type</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">Category</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">Person Name</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">Profile Image</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">Pass No.</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">Mode of Transport</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">LR No.</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">Trip ID</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">Gate Entry</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6 w-48">Item Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inwardData.map((entry, index) => (
              <TableRow key={entry.id} className="border-b hover:bg-gray-50 transition-colors">
                <TableCell className="py-4 px-6 text-gray-900 font-medium">{index + 1}</TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex justify-center">
                    <div title="View details">
                      <Eye 
                        className="w-5 h-5 text-gray-500 cursor-pointer hover:text-[#C72030] transition-colors" 
                        onClick={() => handleViewDetails(entry.id)}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <button
                    onClick={() => handleViewDetails(entry.id)}
                    className="text-[#C72030] hover:text-[#C72030]/80 transition-colors font-semibold"
                  >
                    {entry.id}
                  </button>
                </TableCell>
                <TableCell className="py-4 px-6 text-gray-700">{entry.type || '--'}</TableCell>
                <TableCell className="py-4 px-6 text-gray-700">{entry.category}</TableCell>
                <TableCell className="py-4 px-6 text-gray-700">{entry.personName}</TableCell>
                <TableCell className="py-4 px-6">
                  <img 
                    src={entry.profileImage} 
                    alt={`${entry.personName} profile`}
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                </TableCell>
                <TableCell className="py-4 px-6 text-gray-700">{entry.passNo || '--'}</TableCell>
                <TableCell className="py-4 px-6 text-gray-700">{entry.modeOfTransport || '--'}</TableCell>
                <TableCell className="py-4 px-6 text-gray-700">{entry.lrNo || '--'}</TableCell>
                <TableCell className="py-4 px-6 text-gray-700">{entry.tripId || '--'}</TableCell>
                <TableCell className="py-4 px-6 text-gray-700">{entry.gateEntry}</TableCell>
                <TableCell className="py-4 px-6">
                  <div className="max-w-xs">
                    <div className="truncate text-gray-700" title={entry.itemDetails}>
                      {entry.itemDetails}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {inwardData.length === 0 && (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-12">
                  <div className="flex flex-col items-center text-gray-500">
                    <div className="text-lg font-medium mb-2">No inward entries available</div>
                    <div className="text-sm">There are no entries to display</div>
                  </div>
                </TableCell>
              </TableRow>
            )}
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
