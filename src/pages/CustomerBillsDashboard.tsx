
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter } from "lucide-react";
import { CustomerBillsFilterDialog } from "@/components/CustomerBillsFilterDialog";

export const CustomerBillsDashboard = () => {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  // Sample data - empty as shown in the image
  const customerBillsData: any[] = [];

  const statsCards = [
    { label: "Total Invoices", value: "0", color: "bg-purple-500", icon: "📊" },
    { label: "Total Amount", value: `${localStorage.getItem('currency')} 0`, color: "bg-purple-600", icon: "💰" },
    { label: "Pending Amount", value: `${localStorage.getItem('currency')} 0`, color: "bg-orange-500", icon: "⏳" },
    { label: "Paid Amount", value: `${localStorage.getItem('currency')} 0`, color: "bg-red-500", icon: "✅" }
  ];

  const handleFilterApply = (filters: {
    billNo: string;
    paymentStatus: string;
    publishStatus: string;
  }) => {
    console.log('Applied filters:', filters);
  };

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Customer LIST</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((card, index) => (
          <div key={index} className={`${card.color} text-white p-4 rounded-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{card.value}</p>
                <p className="text-sm opacity-90">{card.label}</p>
              </div>
              <div className="text-2xl">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => setIsFilterDialogOpen(true)}
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Actions</TableHead>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Bill number</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Billing Date</TableHead>
              <TableHead className="font-semibold">Total amount</TableHead>
              <TableHead className="font-semibold">Due date</TableHead>
              <TableHead className="font-semibold">Note</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerBillsData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  No customer bills found
                </TableCell>
              </TableRow>
            ) : (
              customerBillsData.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell>{item.actions}</TableCell>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.billNumber}</TableCell>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.billingDate}</TableCell>
                  <TableCell>{item.totalAmount}</TableCell>
                  <TableCell>{item.dueDate}</TableCell>
                  <TableCell>{item.note}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CustomerBillsFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        onApply={handleFilterApply}
      />
    </div>
  );
};
