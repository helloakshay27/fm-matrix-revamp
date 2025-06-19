
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, Eye, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

export const GRNSRNDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const grnData = [
    {
      id: 6407,
      inventory: "64 Size",
      supplier: "Check",
      invoiceNumber: "NA",
      referenceNo: "11051T",
      poNumber: "NA",
      poReferenceNumber: "11051T",
      approvedStatus: "Approved",
      lastApprovedBy: "PSIR_1",
      poAmount: 100.0,
      totalGrnAmount: 100.0,
      payableAmount: 100.0,
      retentionAmount: 0.0,
      tdsAmount: 0.0,
      qcAmount: 0.0,
      invoiceDate: "27/03/22"
    },
    {
      id: 6406,
      inventory: "64 Size",
      supplier: "Check",
      invoiceNumber: "NA",
      referenceNo: "11051T",
      poNumber: "NA",
      poReferenceNumber: "11051T",
      approvedStatus: "Approved",
      lastApprovedBy: "PSIR_1",
      poAmount: 100.0,
      totalGrnAmount: 100.0,
      payableAmount: 100.0,
      retentionAmount: 0.0,
      tdsAmount: 0.0,
      qcAmount: 0.0,
      invoiceDate: "27/03/22"
    },
    {
      id: 6405,
      inventory: "64 Size",
      supplier: "ABC",
      invoiceNumber: "NA",
      referenceNo: "11051S",
      poNumber: "NA",
      poReferenceNumber: "11051S",
      approvedStatus: "Approved",
      lastApprovedBy: "PSIR_1",
      poAmount: 1000000.0,
      totalGrnAmount: 1000000.0,
      payableAmount: 1000000.0,
      retentionAmount: 0.0,
      tdsAmount: 0.0,
      qcAmount: 0.0,
      invoiceDate: "27/03/22"
    },
    {
      id: 6404,
      inventory: "64 Size",
      supplier: "1St Printing N Design",
      invoiceNumber: "101",
      referenceNo: "11055C",
      poNumber: "NA",
      poReferenceNumber: "11055C",
      approvedStatus: "Approved",
      lastApprovedBy: "PSIR_1",
      poAmount: 10150000.0,
      totalGrnAmount: 10150000.0,
      payableAmount: 10150000.0,
      retentionAmount: 0.0,
      tdsAmount: 0.0,
      qcAmount: 0.0,
      invoiceDate: "27/03/22"
    },
    {
      id: 6403,
      inventory: "64 Size",
      supplier: "test gst",
      invoiceNumber: "101",
      referenceNo: "11052D",
      poNumber: "NA",
      poReferenceNumber: "11052D",
      approvedStatus: "Approved",
      lastApprovedBy: "PSIR_1",
      poAmount: 100.0,
      totalGrnAmount: 20.0,
      payableAmount: 20.0,
      retentionAmount: 0.0,
      tdsAmount: 0.0,
      qcAmount: 0.0,
      invoiceDate: "26/03/22"
    },
    {
      id: 964,
      inventory: "ABC",
      supplier: "A C Manufacture",
      invoiceNumber: "NA",
      referenceNo: "10211",
      poNumber: "NA",
      poReferenceNumber: "10211",
      approvedStatus: "Approved",
      lastApprovedBy: "PSIR_1",
      poAmount: 1090.0,
      totalGrnAmount: 0.0,
      payableAmount: 0.0,
      retentionAmount: 0.0,
      tdsAmount: 0.0,
      qcAmount: 0.0,
      invoiceDate: "28/06/22"
    },
    {
      id: 961,
      inventory: "BA4",
      supplier: "A C Manufacture",
      invoiceNumber: "64",
      referenceNo: "10233",
      poNumber: "NA",
      poReferenceNumber: "10233",
      approvedStatus: "Pending",
      lastApprovedBy: "",
      poAmount: 52000.0,
      totalGrnAmount: 880.0,
      payableAmount: 82.0,
      retentionAmount: 0.0,
      tdsAmount: 0.0,
      qcAmount: 0.0,
      invoiceDate: "13/06/22"
    },
    {
      id: 608,
      inventory: "BA4",
      supplier: "Havells Corp",
      invoiceNumber: "NA",
      referenceNo: "10225",
      poNumber: "NA",
      poReferenceNumber: "10225",
      approvedStatus: "Pending",
      lastApprovedBy: "",
      poAmount: 520.0,
      totalGrnAmount: 520.0,
      payableAmount: 520.0,
      retentionAmount: 0.0,
      tdsAmount: 0.0,
      qcAmount: 0.0,
      invoiceDate: "08/09/22"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-black';
      case 'rejected':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const filteredData = grnData.filter(item =>
    item.inventory.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.referenceNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    navigate('/finance/grn-srn/add');
  };

  const handleFilter = () => {
    toast.info('Filter functionality to be implemented');
  };

  const handleView = (id: number) => {
    navigate(`/finance/grn-srn/details/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/finance/grn-srn/edit/${id}`);
  };

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">GRN LIST</h1>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <Button 
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={handleAddNew}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button 
            variant="outline"
            onClick={handleFilter}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by Inventory Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button 
            className="bg-[#C72030] hover:bg-[#A01020] text-white px-6"
          >
            Go!
          </Button>
          <Button 
            variant="outline" 
            className="px-6"
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
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">View</TableHead>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Inventory</TableHead>
              <TableHead className="font-semibold">Supplier</TableHead>
              <TableHead className="font-semibold">Invoice Number</TableHead>
              <TableHead className="font-semibold">Reference No.</TableHead>
              <TableHead className="font-semibold">P.O. Number</TableHead>
              <TableHead className="font-semibold">P.O Reference Number</TableHead>
              <TableHead className="font-semibold">Approved Status</TableHead>
              <TableHead className="font-semibold">Last Approved By</TableHead>
              <TableHead className="font-semibold">PO Amount</TableHead>
              <TableHead className="font-semibold">Total GRN Amount</TableHead>
              <TableHead className="font-semibold">Payable Amount</TableHead>
              <TableHead className="font-semibold">Retention Amount</TableHead>
              <TableHead className="font-semibold">TDS Amount</TableHead>
              <TableHead className="font-semibold">QC Amount</TableHead>
              <TableHead className="font-semibold">Invoice Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="p-1"
                      onClick={() => handleEdit(item.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="p-1"
                    onClick={() => handleView(item.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.inventory}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>{item.invoiceNumber}</TableCell>
                <TableCell>{item.referenceNo}</TableCell>
                <TableCell>{item.poNumber}</TableCell>
                <TableCell>{item.poReferenceNumber}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.approvedStatus)}`}>
                    {item.approvedStatus}
                  </span>
                </TableCell>
                <TableCell>{item.lastApprovedBy}</TableCell>
                <TableCell>{item.poAmount.toFixed(1)}</TableCell>
                <TableCell>{item.totalGrnAmount.toFixed(1)}</TableCell>
                <TableCell>{item.payableAmount.toFixed(1)}</TableCell>
                <TableCell>{item.retentionAmount.toFixed(1)}</TableCell>
                <TableCell>{item.tdsAmount.toFixed(1)}</TableCell>
                <TableCell>{item.qcAmount.toFixed(1)}</TableCell>
                <TableCell>{item.invoiceDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-6">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-[#C72030] text-white">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">4</Button>
          <Button variant="outline" size="sm">5</Button>
          <Button variant="outline" size="sm">6</Button>
          <Button variant="outline" size="sm">Last ≫</Button>
        </div>
      </div>
    </div>
  );
};
