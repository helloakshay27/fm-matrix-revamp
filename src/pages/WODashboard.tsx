
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WOFilterDialog } from "@/components/WOFilterDialog";

export const WODashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    referenceNumber: '',
    woNumber: '',
    supplierName: ''
  });

  const woData = [
    {
      id: 9175,
      woNumber: "NA",
      referenceNo: "10009",
      createdOn: "10/04/2024",
      supplier: "MODWIN NETWORKS PVT.LTD",
      approvedStatus: "Pending",
      paymentTenure: "",
      advanceAmount: "",
      totalAmount: "1000.00",
      tdsAmount: ""
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

  const filteredData = woData.filter(item => {
    const matchesSearch = 
      item.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.woNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = 
      (!appliedFilters.referenceNumber || item.referenceNo.toLowerCase().includes(appliedFilters.referenceNumber.toLowerCase())) &&
      (!appliedFilters.woNumber || item.woNumber.toLowerCase().includes(appliedFilters.woNumber.toLowerCase())) &&
      (!appliedFilters.supplierName || item.supplier.toLowerCase().includes(appliedFilters.supplierName.toLowerCase()));

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        WO
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">WORK ORDER LIST</h1>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            Filters
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
          </div>
          <Button variant="outline" className="px-4">
            Go!
          </Button>
          <Button 
            variant="outline" 
            className="px-4"
            onClick={() => {
              setSearchQuery('');
              setAppliedFilters({
                referenceNumber: '',
                woNumber: '',
                supplierName: ''
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
              <TableHead className="font-semibold">WO No.</TableHead>
              <TableHead className="font-semibold">Reference No.</TableHead>
              <TableHead className="font-semibold">Created On</TableHead>
              <TableHead className="font-semibold">Supplier</TableHead>
              <TableHead className="font-semibold">Approved Status</TableHead>
              <TableHead className="font-semibold">Payment Tenure(in Days)</TableHead>
              <TableHead className="font-semibold">Advance Amount</TableHead>
              <TableHead className="font-semibold">Total Amount</TableHead>
              <TableHead className="font-semibold">TDS Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Button size="sm" variant="ghost" className="p-1">
                    ✏️
                  </Button>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" className="p-1">
                    👁️
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.woNumber}</TableCell>
                <TableCell className="text-blue-600 hover:underline cursor-pointer">
                  {item.referenceNo}
                </TableCell>
                <TableCell>{item.createdOn}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.approvedStatus)}`}>
                    {item.approvedStatus}
                  </span>
                </TableCell>
                <TableCell>{item.paymentTenure}</TableCell>
                <TableCell>{item.advanceAmount}</TableCell>
                <TableCell className="font-medium">{item.totalAmount}</TableCell>
                <TableCell>{item.tdsAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <WOFilterDialog 
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        onApply={handleFilterApply}
      />
    </div>
  );
};
