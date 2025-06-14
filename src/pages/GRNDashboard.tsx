
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GRNFilterDialog } from "@/components/GRNFilterDialog";
import { useNavigate } from 'react-router-dom';

export const GRNDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    inventoryName: '',
    supplierName: '',
    invoiceNumber: ''
  });

  const grnData = [
    {
      id: 6703,
      inventory: "Carpet ...",
      supplier: "ABC",
      invoiceNumber: "123",
      referenceNo: "NA",
      poReferenceNumber: "121249",
      approvedStatus: "Approved",
      lastApprovedBy: "Sony Bhosle",
      poAmount: "2720.0",
      totalCost: ""
    },
    {
      id: 6560,
      inventory: "Carpet ...",
      supplier: "ABC",
      invoiceNumber: "abc10",
      referenceNo: "NA",
      poReferenceNumber: "121248",
      approvedStatus: "Approved",
      lastApprovedBy: "Sony Bhosle",
      poAmount: "7000.0",
      totalCost: ""
    },
    {
      id: 6487,
      inventory: "Cruet Set",
      supplier: "Godrej",
      invoiceNumber: "",
      referenceNo: "NA",
      poReferenceNumber: "121236",
      approvedStatus: "Approved",
      lastApprovedBy: "Sony Bhosle",
      poAmount: "130.0",
      totalCost: ""
    },
    {
      id: 6466,
      inventory: "Cruet Set",
      supplier: "Godrej",
      invoiceNumber: "",
      referenceNo: "NA",
      poReferenceNumber: "121236",
      approvedStatus: "Approved",
      lastApprovedBy: "Sony Bhosle",
      poAmount: "130.0",
      totalCost: ""
    },
    {
      id: 6465,
      inventory: "Laptop",
      supplier: "Godrej",
      invoiceNumber: "1232r23re",
      referenceNo: "NA",
      poReferenceNumber: "121236",
      approvedStatus: "Approved",
      lastApprovedBy: "Abhishek Sharma",
      poAmount: "130.0",
      totalCost: ""
    },
    {
      id: 6464,
      inventory: "Cruet Set",
      supplier: "Godrej",
      invoiceNumber: "tst101",
      referenceNo: "NA",
      poReferenceNumber: "121236",
      approvedStatus: "Approved",
      lastApprovedBy: "Sony Bhosle",
      poAmount: "130.0",
      totalCost: ""
    },
    {
      id: 6463,
      inventory: "Cruet Set",
      supplier: "Godrej",
      invoiceNumber: "12efe31",
      referenceNo: "NA",
      poReferenceNumber: "121236",
      approvedStatus: "Approved",
      lastApprovedBy: "Sony Bhosle",
      poAmount: "130.0",
      totalCost: ""
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleFilterApply = (filters: typeof appliedFilters) => {
    setAppliedFilters(filters);
    console.log('Applied filters:', filters);
  };

  const filteredData = grnData.filter(item => {
    const matchesSearch = 
      item.inventory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = 
      (!appliedFilters.inventoryName || item.inventory.toLowerCase().includes(appliedFilters.inventoryName.toLowerCase())) &&
      (!appliedFilters.supplierName || item.supplier.toLowerCase().includes(appliedFilters.supplierName.toLowerCase())) &&
      (!appliedFilters.invoiceNumber || item.invoiceNumber.toLowerCase().includes(appliedFilters.invoiceNumber.toLowerCase()));

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        GRN
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">GRN LIST</h1>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => navigate('/finance/grn/add')}
          >
            + Add
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            🏷️ Filters
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Inventory Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
          </div>
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6"
          >
            Go!
          </Button>
          <Button 
            variant="outline" 
            className="px-4"
            onClick={() => {
              setSearchQuery('');
              setAppliedFilters({
                inventoryName: '',
                supplierName: '',
                invoiceNumber: ''
              });
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">View</TableHead>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Inventory</TableHead>
              <TableHead className="font-semibold">Supplier</TableHead>
              <TableHead className="font-semibold">Invoice Number</TableHead>
              <TableHead className="font-semibold">Reference No.</TableHead>
              <TableHead className="font-semibold">P.O Reference Number</TableHead>
              <TableHead className="font-semibold">Approved Status</TableHead>
              <TableHead className="font-semibold">Last Approved By</TableHead>
              <TableHead className="font-semibold">PO Amount</TableHead>
              <TableHead className="font-semibold">Total Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Button size="sm" variant="ghost" className="p-1">
                    👁️
                  </Button>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" className="p-1">
                    👁️
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell className="text-blue-600 hover:underline cursor-pointer">
                  {item.inventory}
                </TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>{item.invoiceNumber}</TableCell>
                <TableCell>{item.referenceNo}</TableCell>
                <TableCell className="text-blue-600">{item.poReferenceNumber}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.approvedStatus)}`}>
                    {item.approvedStatus}
                  </span>
                </TableCell>
                <TableCell>{item.lastApprovedBy}</TableCell>
                <TableCell className="font-medium">{item.poAmount}</TableCell>
                <TableCell>{item.totalCost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <GRNFilterDialog 
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        onApply={handleFilterApply}
      />
    </div>
  );
};
