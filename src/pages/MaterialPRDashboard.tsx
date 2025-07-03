
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { MaterialPRFilterDialog } from '@/components/MaterialPRFilterDialog';
import { TextField } from "@/components/ui/textfield";

export const MaterialPRDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const materialPRData = [
    {
      id: 11045,
      prNumber: "121250",
      referenceNo: "121250",
      supplierName: "ABC",
      createdBy: "Abhishek Sharma",
      createdOn: "15/05/2025",
      lastApprovedBy: "",
      approvedStatus: "Pending",
      prAmount: "₹ 3,560",
      activeInactive: true
    },
    {
      id: 10716,
      prNumber: "121249",
      referenceNo: "121249",
      supplierName: "Godrej",
      createdBy: "Sony Bhosle",
      createdOn: "22/04/2025",
      lastApprovedBy: "Sony Bhosle",
      approvedStatus: "Rejected",
      prAmount: "₹ 13,000",
      activeInactive: true
    },
    {
      id: 10711,
      prNumber: "121248",
      referenceNo: "121248",
      supplierName: "ABC",
      createdBy: "Sony Bhosle",
      createdOn: "22/04/2025",
      lastApprovedBy: "Sony Bhosle",
      approvedStatus: "Approved",
      prAmount: "₹ 2,000",
      activeInactive: true
    },
    {
      id: 10500,
      prNumber: "121247",
      referenceNo: "121247",
      supplierName: "ABC",
      createdBy: "Sony B Bhosle",
      createdOn: "01/04/2025",
      lastApprovedBy: "Sony B Bhosle",
      approvedStatus: "Approved",
      prAmount: "₹ 7,000",
      activeInactive: true
    },
    {
      id: 10408,
      prNumber: "121246",
      referenceNo: "121246",
      supplierName: "L&T",
      createdBy: "Sony B Bhosle",
      createdOn: "26/03/2025",
      lastApprovedBy: "Sony B Bhosle",
      approvedStatus: "Rejected",
      prAmount: "₹ 3,02,600",
      activeInactive: true
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

  const filteredData = materialPRData.filter(item =>
    item.prNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6">
      {/* Breadcrumb */}
      <div className="mb-2 text-sm text-gray-600">Material PR</div>

      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4">MATERIAL PR</h1>

      {/* Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* Left Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={() => navigate('/finance/material-pr/add')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
            Filters
          </Button>
        </div>

        {/* Right Search */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
            <TextField
              placeholder="Search By PR Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                style: { paddingLeft: '40px' }
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button className="bg-[#C72030] hover:bg-[#A01020] text-white px-4">Go!</Button>
            <Button variant="outline" className="px-4" onClick={() => setSearchQuery('')}>Reset</Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">View</TableHead>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">PR No.</TableHead>
              <TableHead className="font-semibold">Reference No.</TableHead>
              <TableHead className="font-semibold">Supplier Name</TableHead>
              <TableHead className="font-semibold">Created By</TableHead>
              <TableHead className="font-semibold">Created On</TableHead>
              <TableHead className="font-semibold">Last Approved By</TableHead>
              <TableHead className="font-semibold">Approved Status</TableHead>
              <TableHead className="font-semibold">PR Amount</TableHead>
              <TableHead className="font-semibold">Active/Inactive</TableHead>
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
                    onClick={() => navigate(`/finance/material-pr/edit/${item.id}`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => navigate(`/finance/material-pr/details/${item.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell className="text-blue-600 hover:underline cursor-pointer">{item.prNumber}</TableCell>
                <TableCell className="text-blue-600 hover:underline cursor-pointer">{item.referenceNo}</TableCell>
                <TableCell>{item.supplierName}</TableCell>
                <TableCell>{item.createdBy}</TableCell>
                <TableCell>{item.createdOn}</TableCell>
                <TableCell>{item.lastApprovedBy}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.approvedStatus)}`}>
                    {item.approvedStatus}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{item.prAmount}</TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={item.activeInactive}
                    readOnly
                    className="w-4 h-4"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Filter Dialog */}
      <MaterialPRFilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
      />
    </div>
  );
};
