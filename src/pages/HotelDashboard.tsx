
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HotelFilterModal } from "@/components/HotelFilterModal";

export const HotelDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const hotelData = [
    // Sample data structure - can be populated with real data later
  ];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Hotel &gt; Hotel Booking List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">HOTEL BOOKING LIST</h1>

      {/* Filter Button */}
      <div className="mb-6">
        <Button 
          variant="outline"
          onClick={() => setIsFilterOpen(true)}
          className="border-gray-300"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Employee Name</TableHead>
              <TableHead className="font-semibold">From Date</TableHead>
              <TableHead className="font-semibold">To Date</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotelData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No hotel bookings found
                </TableCell>
              </TableRow>
            ) : (
              hotelData.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="text-blue-600">{item.employeeName}</TableCell>
                  <TableCell>{item.fromDate}</TableCell>
                  <TableCell>{item.toDate}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.location}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    {/* Action buttons can be added here */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Filter Modal */}
      <HotelFilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
    </div>
  );
};
