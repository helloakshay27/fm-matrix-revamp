
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InvoicesSESFilterDialog } from "@/components/InvoicesSESFilterDialog";

const InvoicesSESDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: '',
    status: '',
    amount: ''
  });

  const sesInvoiceData = [
    {
      id: "SES-001",
      date: "2024-01-15",
      client: "Tech Corp",
      amount: "₹1,25,000",
      status: "Paid",
      service: "IT Support"
    },
    {
      id: "SES-002", 
      date: "2024-01-16",
      client: "Global Inc",
      amount: "₹85,000",
      status: "Pending",
      service: "Maintenance"
    }
  ];

  const handleFilterApply = (filters: any) => {
    setAppliedFilters(filters);
    console.log('Applied filters:', filters);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Finance &gt; Invoices SES
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">INVOICES SES</h1>
      </div>

      {/* Filter Button */}
      <div className="flex justify-start">
        <Button 
          variant="outline" 
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
          onClick={() => setIsFilterOpen(true)}
        >
          🔍 Filters
        </Button>
      </div>

      {/* SES Invoices Table */}
      <Card className="border border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-[#1a1a1a]">Invoice ID</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Date</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Client</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Service</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Amount</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sesInvoiceData.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-[#1a1a1a]">{invoice.id}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{invoice.date}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{invoice.client}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{invoice.service}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{invoice.amount}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{invoice.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <InvoicesSESFilterDialog 
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        onApply={handleFilterApply}
      />
    </div>
  );
};

export default InvoicesSESDashboard;
