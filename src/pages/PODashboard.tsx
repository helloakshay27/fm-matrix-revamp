import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { POFilterDialog } from "@/components/POFilterDialog";
import { useNavigate } from 'react-router-dom';

export const PODashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const poData = [
    {
      id: 10712,
      poNumber: "NA",
      referenceNo: "121240",
      createdBy: "Sony Bhosle",
      createdOn: "22/04/2025",
      supplier: "ABC",
      paymentTenure: "",
      activeInactive: true,
      lastApprovedBy: "Sony Bhosle",
      approvalStatus: "Approved",
      advanceAmount: "2720.00",
      poAmount: "",
      retention: "0",
      tds: "",
      qc: "",
      tdsAmount: "0"
    },
    {
      id: 10501,
      poNumber: "NA",
      referenceNo: "121248",
      createdBy: "Sony B Bhosle",
      createdOn: "01/04/2025",
      supplier: "ABC",
      paymentTenure: "",
      activeInactive: true,
      lastApprovedBy: "Sony B Bhosle",
      approvalStatus: "Approved",
      advanceAmount: "7000.00",
      poAmount: "",
      retention: "0.0",
      tds: "",
      qc: "",
      tdsAmount: "0"
    },
    {
      id: 10405,
      poNumber: "NA",
      referenceNo: "121243",
      createdBy: "Sony B Bhosle",
      createdOn: "26/03/2025",
      supplier: "ACHLA CORPORATION",
      paymentTenure: "",
      activeInactive: true,
      lastApprovedBy: "",
      approvalStatus: "Pending",
      advanceAmount: "130.00",
      poAmount: "",
      retention: "0",
      tds: "",
      qc: "",
      tdsAmount: "0"
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

  const filteredData = poData.filter(item =>
    item.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPO = (id: number) => {
    navigate(`/finance/po/details/${id}`);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Breadcrumb */}
      <div className="mb-2 text-sm text-gray-600">PO</div>

      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4">PURCHASE ORDER LIST</h1>

      {/* Action + Search Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
            className="hover:bg-[#F2EEE9]/90"
            onClick={() => navigate('/finance/po/add')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            Filters
          </Button>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BF213E] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <Button
              style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
              className="hover:bg-[#F2EEE9]/90 px-4"
            >
              Go!
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
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">View</TableHead>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">PO No.</TableHead>
              <TableHead className="font-semibold">Reference No.</TableHead>
              <TableHead className="font-semibold">Created by</TableHead>
              <TableHead className="font-semibold">Created on</TableHead>
              <TableHead className="font-semibold">Supplier</TableHead>
              <TableHead className="font-semibold">Payment Tenure(in Days)</TableHead>
              <TableHead className="font-semibold">Active/Inactive</TableHead>
              <TableHead className="font-semibold">Last Approved By</TableHead>
              <TableHead className="font-semibold">Approval status</TableHead>
              <TableHead className="font-semibold">Advance Amount</TableHead>
              <TableHead className="font-semibold">PO Amount</TableHead>
              <TableHead className="font-semibold">Retention(%)</TableHead>
              <TableHead className="font-semibold">TDS(%)</TableHead>
              <TableHead className="font-semibold">QC(%)</TableHead>
              <TableHead className="font-semibold">TDS Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => handleViewPO(item.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.poNumber}</TableCell>
                <TableCell className="text-blue-600 hover:underline cursor-pointer">
                  {item.referenceNo}
                </TableCell>
                <TableCell>{item.createdBy}</TableCell>
                <TableCell>{item.createdOn}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>{item.paymentTenure}</TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={item.activeInactive}
                    readOnly
                    className="w-4 h-4"
                  />
                </TableCell>
                <TableCell>{item.lastApprovedBy}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.approvalStatus)}`}>
                    {item.approvalStatus}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{item.advanceAmount}</TableCell>
                <TableCell>{item.poAmount}</TableCell>
                <TableCell>{item.retention}</TableCell>
                <TableCell>{item.tds}</TableCell>
                <TableCell>{item.qc}</TableCell>
                <TableCell>{item.tdsAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Filter Dialog */}
      <POFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
      />
    </div>
  );
};
