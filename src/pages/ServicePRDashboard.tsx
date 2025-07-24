import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ServicePRFilterDialog } from "@/components/ServicePRFilterDialog";
import { useNavigate } from 'react-router-dom';

export const ServicePRDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const servicePRData = [
    {
      id: 12985,
      prNumber: "10011",
      referenceNo: "10011",
      supplierName: "xyz",
      createdBy: "Anjali Lungare",
      createdOn: "30/07/2024",
      lastApprovedBy: "",
      approvedStatus: "Pending",
      prAmount: "₹ 150.00",
      activeInactive: true
    },
    {
      id: 12936,
      prNumber: "10010",
      referenceNo: "10010",
      supplierName: "xyz",
      createdBy: "Anjali Lungare",
      createdOn: "26/07/2024",
      lastApprovedBy: "",
      approvedStatus: "Pending",
      prAmount: "₹ 5,000.00",
      activeInactive: true
    },
    {
      id: 378,
      prNumber: "10006",
      referenceNo: "10006",
      supplierName: "",
      createdBy: "Robert Day2",
      createdOn: "05/07/2023",
      lastApprovedBy: "",
      approvedStatus: "Pending",
      prAmount: "₹ 10,700.00",
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

  const filteredData = servicePRData.filter(item =>
    item.prNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6">
      {/* Breadcrumb */}
      <div className="mb-2 text-sm text-gray-600">Service PR</div>

      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4">SERVICE PR</h1>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <Button className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium" onClick={() => navigate('/finance/service-pr/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Action
          </Button>
          <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
            Filters
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search By PR Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <Button className="bg-[#C72030] hover:bg-[#A01020] text-white px-4">
              Go!
            </Button>
            <Button variant="outline" className="px-4" onClick={() => setSearchQuery('')}>
              Reset
            </Button>
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
                    onClick={() => navigate(`/finance/service-pr/edit/${item.id}`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => navigate(`/finance/service-pr/details/${item.id}`)}
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
                  <input type="checkbox" checked={item.activeInactive} readOnly className="w-4 h-4" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Filter Dialog */}
      <ServicePRFilterDialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen} />
    </div>
  );
};
