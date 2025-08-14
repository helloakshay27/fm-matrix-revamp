import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Search, Filter, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GRNFilterDialog } from "@/components/GRNFilterDialog";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const GRNDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const grnData = [
    {
      id: 1,
      supplier: "ABC",
      poNumber: "121240",
      poDate: "22/04/2025",
      poDeliveryDate: "25/04/2025",
      poSentDate: "23/04/2025",
      poQty: "100",
      poRate: "50.00",
      poAmount: "5000.00",
      grnNumber: "GRN001",
      grnDate: "24/04/2025",
      grnQty: "95",
      grnRate: "50.00",
      grnAmount: "4750.00",
      grnStatus: "Completed",
      remarks: "Good condition"
    },
    {
      id: 2,
      supplier: "XYZ Corporation",
      poNumber: "121241",
      poDate: "23/04/2025",
      poDeliveryDate: "26/04/2025",
      poSentDate: "24/04/2025",
      poQty: "200",
      poRate: "75.00",
      poAmount: "15000.00",
      grnNumber: "GRN002",
      grnDate: "25/04/2025",
      grnQty: "180",
      grnRate: "75.00",
      grnAmount: "13500.00",
      grnStatus: "Pending",
      remarks: "Partial delivery"
    },
    {
      id: 3,
      supplier: "ACHLA CORPORATION",
      poNumber: "121242",
      poDate: "24/04/2025",
      poDeliveryDate: "27/04/2025",
      poSentDate: "25/04/2025",
      poQty: "150",
      poRate: "30.00",
      poAmount: "4500.00",
      grnNumber: "GRN003",
      grnDate: "26/04/2025",
      grnQty: "150",
      grnRate: "30.00",
      grnAmount: "4500.00",
      grnStatus: "Completed",
      remarks: "All items received"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-black';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const filteredData = grnData.filter(item =>
    item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.grnNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowSelect = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map(item => item.id));
    }
  };

  const handleExport = () => {
    const dataToExport = selectedRows.length > 0
      ? filteredData.filter(item => selectedRows.includes(item.id))
      : filteredData;

    // Convert to CSV
    const headers = ['Supplier', 'PO Number', 'PO Date', 'PO Delivery Date', 'PO Sent Date', 'PO Qty', 'PO Rate', 'PO Amount', 'GRN Number', 'GRN Date', 'GRN Qty', 'GRN Rate', 'GRN Amount', 'Status', 'Remarks'];
    const csvData = [
      headers.join(','),
      ...dataToExport.map(item => [
        item.supplier,
        item.poNumber,
        item.poDate,
        item.poDeliveryDate,
        item.poSentDate,
        item.poQty,
        item.poRate,
        item.poAmount,
        item.grnNumber,
        item.grnDate,
        item.grnQty,
        item.grnRate,
        item.grnAmount,
        item.grnStatus,
        item.remarks
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grn_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success(`Exported ${dataToExport.length} records successfully`);
    setSelectedRows([]);
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        GRN / SRN
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">GRN LIST</h1>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <Button
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={() => navigate('/finance/grn-srn/add')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button
            variant="outline"
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Supplier, PO Number, or GRN Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent w-80"
            />
          </div>
          <Button
            className="bg-[#C72030] hover:bg-[#A01020] text-white px-4"
          >
            Search
          </Button>
          <Button
            variant="outline"
            className="px-4"
            onClick={() => setSearchQuery('')}
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
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
              <TableHead className="font-semibold">Supplier</TableHead>
              <TableHead className="font-semibold">PO Number</TableHead>
              <TableHead className="font-semibold">PO Date</TableHead>
              <TableHead className="font-semibold">PO Delivery Date</TableHead>
              <TableHead className="font-semibold">PO Sent Date</TableHead>
              <TableHead className="font-semibold">PO Qty</TableHead>
              <TableHead className="font-semibold">PO Rate</TableHead>
              <TableHead className="font-semibold">PO Amount</TableHead>
              <TableHead className="font-semibold">GRN Number</TableHead>
              <TableHead className="font-semibold">GRN Date</TableHead>
              <TableHead className="font-semibold">GRN Qty</TableHead>
              <TableHead className="font-semibold">GRN Rate</TableHead>
              <TableHead className="font-semibold">GRN Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleRowSelect(item.id)}
                    className="rounded"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-1"
                      onClick={() => navigate(`/finance/grn-srn/details/${item.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.supplier}</TableCell>
                <TableCell className="text-blue-600 hover:underline cursor-pointer">
                  {item.poNumber}
                </TableCell>
                <TableCell>{item.poDate}</TableCell>
                <TableCell>{item.poDeliveryDate}</TableCell>
                <TableCell>{item.poSentDate}</TableCell>
                <TableCell>{item.poQty}</TableCell>
                <TableCell>{localStorage.getItem('currency')}{item.poRate}</TableCell>
                <TableCell className="font-medium">{localStorage.getItem('currency')}{item.poAmount}</TableCell>
                <TableCell className="text-blue-600 hover:underline cursor-pointer">
                  {item.grnNumber}
                </TableCell>
                <TableCell>{item.grnDate}</TableCell>
                <TableCell>{item.grnQty}</TableCell>
                <TableCell>{localStorage.getItem('currency')}{item.grnRate}</TableCell>
                <TableCell className="font-medium">{localStorage.getItem('currency')}{item.grnAmount}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.grnStatus)}`}>
                    {item.grnStatus}
                  </span>
                </TableCell>
                <TableCell>{item.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Showing {filteredData.length} of {grnData.length} entries
          {selectedRows.length > 0 && (
            <span className="ml-4 text-[#C72030]">
              {selectedRows.length} selected
            </span>
          )}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <GRNFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
      />
    </div>
  );
};
