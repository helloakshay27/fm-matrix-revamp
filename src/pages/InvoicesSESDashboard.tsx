
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InvoicesSESFilterDialog } from "@/components/InvoicesSESFilterDialog";

export const InvoicesSESDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    invoiceNumber: '',
    invoiceDate: '',
    supplierName: ''
  });

  // Sample data - empty as shown in the image
  const invoicesData: any[] = [];

  const handleFilterApply = (filters: typeof appliedFilters) => {
    setAppliedFilters(filters);
    console.log('Applied filters:', filters);
  };

  const filteredData = invoicesData.filter(item => {
    const matchesSearch = searchQuery === '' || 
      (item?.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item?.supplier?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilters = 
      (!appliedFilters.invoiceNumber || item?.invoiceNumber?.toLowerCase().includes(appliedFilters.invoiceNumber.toLowerCase())) &&
      (!appliedFilters.supplierName || item?.supplier?.toLowerCase().includes(appliedFilters.supplierName.toLowerCase())) &&
      (!appliedFilters.invoiceDate || item?.invoiceDate?.includes(appliedFilters.invoiceDate));

    return matchesSearch && matchesFilters;
  });

  return (
    <Layout>
      <div className="p-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6">WORK ORDER INVOICES/SES</h1>

        {/* Search and Filter Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => setIsFilterDialogOpen(true)}
              className="flex items-center gap-2"
            >
              🏷️ Filters
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 h-[36px]"
                style={{ height: '36px' }}
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
                  invoiceNumber: '',
                  invoiceDate: '',
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
                <TableHead className="font-semibold">View</TableHead>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Invoice Number</TableHead>
                <TableHead className="font-semibold">Invoice Date</TableHead>
                <TableHead className="font-semibold">Supplier</TableHead>
                <TableHead className="font-semibold">W.O. Number</TableHead>
                <TableHead className="font-semibold">WO Amount</TableHead>
                <TableHead className="font-semibold">Total Invoice Amount</TableHead>
                <TableHead className="font-semibold">Last Approved By</TableHead>
                <TableHead className="font-semibold">Approved Status</TableHead>
                <TableHead className="font-semibold">Payable Amount</TableHead>
                <TableHead className="font-semibold">Adjustment Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="p-1">
                        👁️
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.invoiceNumber}</TableCell>
                    <TableCell>{item.invoiceDate}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell className="text-blue-600">{item.woNumber}</TableCell>
                    <TableCell className="font-medium">{item.woAmount}</TableCell>
                    <TableCell className="font-medium">{item.totalInvoiceAmount}</TableCell>
                    <TableCell>{item.lastApprovedBy}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium bg-gray-100`}>
                        {item.approvedStatus}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{item.payableAmount}</TableCell>
                    <TableCell className="font-medium">{item.adjustmentAmount}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <InvoicesSESFilterDialog 
          open={isFilterDialogOpen}
          onOpenChange={setIsFilterDialogOpen}
          onApply={handleFilterApply}
        />
      </div>
    </Layout>
  );
};
