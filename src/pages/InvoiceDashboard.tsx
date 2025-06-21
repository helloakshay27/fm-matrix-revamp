
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InvoiceFilterDialog } from '@/components/InvoiceFilterDialog';
import { Filter, Search } from 'lucide-react';

export default function InvoiceDashboard() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleReset = () => {
    setSearchTerm('');
  };

  const handleGo = () => {
    console.log('Search term:', searchTerm);
  };

  // Sample data for the table
  const invoiceData = [
    // Empty for now, matching the image
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">WORK ORDER INVOICES/SES</h1>
        
        {/* Filter and Search Section */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsFilterOpen(true)}
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 border-gray-300"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-gray-300"
                />
              </div>
              <Button
                onClick={handleGo}
                className="bg-[#C72030] hover:bg-[#A61B28] text-white px-6"
              >
                Go!
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">View</TableHead>
                <TableHead className="font-semibold text-gray-900">ID</TableHead>
                <TableHead className="font-semibold text-gray-900">Invoice Number</TableHead>
                <TableHead className="font-semibold text-gray-900">Invoice Date</TableHead>
                <TableHead className="font-semibold text-gray-900">Supplier</TableHead>
                <TableHead className="font-semibold text-gray-900">W.O. Number</TableHead>
                <TableHead className="font-semibold text-gray-900">WO Amount</TableHead>
                <TableHead className="font-semibold text-gray-900">Total Invoice Amount</TableHead>
                <TableHead className="font-semibold text-gray-900">Last Approved By</TableHead>
                <TableHead className="font-semibold text-gray-900">Approved Status</TableHead>
                <TableHead className="font-semibold text-gray-900">Payable Amount</TableHead>
                <TableHead className="font-semibold text-gray-900">Adjustment Amount</TableHead>
                <TableHead className="font-semibold text-gray-900">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-8 text-gray-500">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                invoiceData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.view}</TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.invoiceNumber}</TableCell>
                    <TableCell>{item.invoiceDate}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{item.woNumber}</TableCell>
                    <TableCell>{item.woAmount}</TableCell>
                    <TableCell>{item.totalInvoiceAmount}</TableCell>
                    <TableCell>{item.lastApprovedBy}</TableCell>
                    <TableCell>{item.approvedStatus}</TableCell>
                    <TableCell>{item.payableAmount}</TableCell>
                    <TableCell>{item.adjustmentAmount}</TableCell>
                    <TableCell>{item.remarks}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <InvoiceFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
    </div>
  );
}
