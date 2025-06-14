
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter } from "lucide-react";
import { MyBillsFilterDialog } from "@/components/MyBillsFilterDialog";

export const MyBillsDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('My Bills');

  const statsCards = [
    { label: "Total Bills", value: "0", color: "bg-orange-500" },
    { label: "Total Amount", value: "₹0", color: "bg-purple-500" },
    { label: "Pending Amount", value: "₹0", color: "bg-orange-400" },
    { label: "Paid Amount", value: "₹0", color: "bg-green-500" }
  ];

  const handleFilterApply = (filters: any) => {
    console.log('Applied filters:', filters);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-purple-900 text-white">
        <div className="p-4">
          <div className="space-y-2">
            <div 
              className={`p-3 rounded cursor-pointer flex items-center gap-3 ${activeTab === 'Tickets' ? 'bg-purple-700' : 'hover:bg-purple-800'}`}
              onClick={() => setActiveTab('Tickets')}
            >
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-purple-900 text-sm font-bold">🎫</span>
              </div>
              <span>Tickets</span>
            </div>
            
            <div 
              className={`p-3 rounded cursor-pointer flex items-center gap-3 ${activeTab === 'My Bills' ? 'bg-purple-700' : 'hover:bg-purple-800'}`}
              onClick={() => setActiveTab('My Bills')}
            >
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-purple-900 text-sm font-bold">📄</span>
              </div>
              <span>My Bills</span>
            </div>
            
            <div 
              className={`p-3 rounded cursor-pointer flex items-center gap-3 ${activeTab === 'My Parking' ? 'bg-purple-700' : 'hover:bg-purple-800'}`}
              onClick={() => setActiveTab('My Parking')}
            >
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-purple-900 text-sm font-bold">🅿️</span>
              </div>
              <span>My Parking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Bills LIST</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {statsCards.map((card, index) => (
            <div key={index} className={`${card.color} text-white p-4 rounded-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-sm opacity-90">{card.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Button */}
        <div className="mb-6">
          <Button 
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className="border-gray-300"
          >
            <Filter className="w-4 h-4 mr-2" />
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
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  No bills found
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Filter Dialog */}
        <MyBillsFilterDialog 
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          onApply={handleFilterApply}
        />
      </div>
    </div>
  );
};
