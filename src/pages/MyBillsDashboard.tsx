
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter } from "lucide-react";
import { MyBillsFilterDialog } from "@/components/MyBillsFilterDialog";

export const MyBillsDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('My Bills');

  const statsCards = [
    { label: "Total Bills", value: "0", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { label: "Total Amount", value: "₹0", color: "bg-gradient-to-r from-orange-500 to-yellow-500" },
    { label: "Pending Amount", value: "₹0", color: "bg-gradient-to-r from-orange-400 to-red-500" },
    { label: "Paid Amount", value: "₹0", color: "bg-gradient-to-r from-green-500 to-emerald-500" }
  ];

  const handleFilterApply = (filters: any) => {
    console.log('Applied filters:', filters);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white shadow-lg">
        <div className="p-4">
          <div className="space-y-2">
            <div 
              className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-all duration-200 ${activeTab === 'Tickets' ? 'bg-purple-700 shadow-md' : 'hover:bg-purple-800'}`}
              onClick={() => setActiveTab('Tickets')}
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-purple-900 text-lg font-bold">🎫</span>
              </div>
              <span className="font-medium">Tickets</span>
            </div>
            
            <div 
              className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-all duration-200 ${activeTab === 'My Bills' ? 'bg-purple-700 shadow-md border-l-4 border-white' : 'hover:bg-purple-800'}`}
              onClick={() => setActiveTab('My Bills')}
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-purple-900 text-lg font-bold">📄</span>
              </div>
              <span className="font-medium">My Bills</span>
            </div>
            
            <div 
              className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-all duration-200 ${activeTab === 'My Parking' ? 'bg-purple-700 shadow-md' : 'hover:bg-purple-800'}`}
              onClick={() => setActiveTab('My Parking')}
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-purple-900 text-lg font-bold">🅿️</span>
              </div>
              <span className="font-medium">My Parking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Bills LIST</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {statsCards.map((card, index) => (
              <div key={index} className={`${card.color} text-white p-6 rounded-lg shadow-md`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold mb-1">{card.value}</p>
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
              className="border-gray-300 hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  <TableHead className="font-semibold text-gray-700">ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Bill number</TableHead>
                  <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                  <TableHead className="font-semibold text-gray-700">Description</TableHead>
                  <TableHead className="font-semibold text-gray-700">Billing Date</TableHead>
                  <TableHead className="font-semibold text-gray-700">Total amount</TableHead>
                  <TableHead className="font-semibold text-gray-700">Due date</TableHead>
                  <TableHead className="font-semibold text-gray-700">Note</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">📄</span>
                      </div>
                      <p className="text-lg font-medium">No bills found</p>
                      <p className="text-sm text-gray-400">Bills will appear here when they are created</p>
                    </div>
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
    </div>
  );
};
