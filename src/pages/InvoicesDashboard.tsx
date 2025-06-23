
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Filter } from "lucide-react";
import { InvoiceFilterDialog } from "@/components/InvoiceFilterDialog";

const InvoicesDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const invoiceData = [
    {
      id: "INV-001",
      date: "2024-01-15",
      supplier: "ABC Supplies",
      amount: "₹25,000",
      status: "Paid",
      dueDate: "2024-02-15"
    },
    {
      id: "INV-002", 
      date: "2024-01-16",
      supplier: "XYZ Services",
      amount: "₹18,500",
      status: "Pending",
      dueDate: "2024-02-16"
    },
    {
      id: "INV-003",
      date: "2024-01-17", 
      supplier: "Tech Solutions",
      amount: "₹42,000",
      status: "Overdue",
      dueDate: "2024-01-31"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Finance &gt; Invoices
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">INVOICES</h1>
      </div>

      {/* Filter Button */}
      <div className="flex justify-start">
        <Button 
          variant="outline" 
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Invoices Table */}
      <Card className="border border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-[#1a1a1a]">Invoice ID</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Date</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Supplier</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Amount</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Status</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Due Date</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-[#1a1a1a]">{invoice.id}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{invoice.date}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{invoice.supplier}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#1a1a1a]">{invoice.dueDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <InvoiceFilterDialog 
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        onApply={(filters) => {
          console.log('Applied filters:', filters);
        }}
      />
    </div>
  );
};

export default InvoicesDashboard;
