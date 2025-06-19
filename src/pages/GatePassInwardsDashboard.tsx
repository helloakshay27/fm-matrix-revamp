
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Download, SlidersHorizontal, Eye } from 'lucide-react';
import { GatePassInwardsFilterModal } from '@/components/GatePassInwardsFilterModal';

export const GatePassInwardsDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Sample data based on the screenshot
  const gatePassData = [
    {
      id: "GP001",
      type: "Visitor",
      category: "Guest",
      personName: "John Smith",
      profileImage: "/placeholder.svg",
      passNo: "VP2024001",
      modeOfTransport: "Car",
      lrNo: "LR001",
      tripId: "T001",
      gateEntry: "Gate A",
      itemDetails: "Laptop, Documents"
    },
    {
      id: "GP002",
      type: "Vendor",
      category: "Delivery",
      personName: "Sarah Johnson",
      profileImage: "/placeholder.svg",
      passNo: "VP2024002",
      modeOfTransport: "Truck",
      lrNo: "LR002",
      tripId: "T002",
      gateEntry: "Gate B",
      itemDetails: "Office Supplies"
    },
    {
      id: "GP003",
      type: "Employee",
      category: "Staff",
      personName: "Mike Davis",
      profileImage: "/placeholder.svg",
      passNo: "EP2024001",
      modeOfTransport: "Bike",
      lrNo: "LR003",
      tripId: "T003",
      gateEntry: "Gate A",
      itemDetails: "Personal Items"
    },
    {
      id: "GP004",
      type: "Contractor",
      category: "Maintenance",
      personName: "Lisa Wilson",
      profileImage: "/placeholder.svg",
      passNo: "CP2024001",
      modeOfTransport: "Van",
      lrNo: "LR004",
      tripId: "T004",
      gateEntry: "Gate C",
      itemDetails: "Tools, Equipment"
    }
  ];

  const handleViewDetails = (id: string) => {
    console.log('View details for:', id);
    // This could navigate to a details page or open a modal
  };

  const handleExport = () => {
    console.log('Exporting gate pass data...');
    // Export functionality would be implemented here
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Action Buttons */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex gap-3">
          <Button 
            style={{ backgroundColor: '#C72030' }}
            className="hover:bg-[#C72030]/90 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Inwards Pass
          </Button>
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded flex items-center gap-2"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded flex items-center gap-2"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-left font-semibold">ID</TableHead>
              <TableHead className="text-left font-semibold">Type</TableHead>
              <TableHead className="text-left font-semibold">Category</TableHead>
              <TableHead className="text-left font-semibold">Person Name</TableHead>
              <TableHead className="text-left font-semibold">Profile Image</TableHead>
              <TableHead className="text-left font-semibold">Pass No.</TableHead>
              <TableHead className="text-left font-semibold">Mode of Transport</TableHead>
              <TableHead className="text-left font-semibold">LR No.</TableHead>
              <TableHead className="text-left font-semibold">Trip ID</TableHead>
              <TableHead className="text-left font-semibold">Gate Entry</TableHead>
              <TableHead className="text-left font-semibold">Item Details</TableHead>
              <TableHead className="text-left font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gatePassData.map((entry) => (
              <TableRow key={entry.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-blue-600">
                  <button
                    onClick={() => handleViewDetails(entry.id)}
                    className="text-blue-600 hover:underline"
                  >
                    {entry.id}
                  </button>
                </TableCell>
                <TableCell>{entry.type}</TableCell>
                <TableCell>{entry.category}</TableCell>
                <TableCell className="font-medium">{entry.personName}</TableCell>
                <TableCell>
                  <img 
                    src={entry.profileImage} 
                    alt={`${entry.personName} profile`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>{entry.passNo}</TableCell>
                <TableCell>{entry.modeOfTransport}</TableCell>
                <TableCell>{entry.lrNo}</TableCell>
                <TableCell>{entry.tripId}</TableCell>
                <TableCell>{entry.gateEntry}</TableCell>
                <TableCell className="max-w-xs truncate">{entry.itemDetails}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(entry.id)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination or Load More could be added here */}
      <div className="p-4 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Showing {gatePassData.length} entries
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>

      <GatePassInwardsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
