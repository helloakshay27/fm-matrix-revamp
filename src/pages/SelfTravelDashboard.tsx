
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SelfTravelFilterModal } from "@/components/SelfTravelFilterModal";

export const SelfTravelDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const selfTravelData = [
    // Sample data structure - can be populated with real data later
  ];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Self Travel &gt; Self Travel Booking List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">SELF TRAVEL BOOKING LIST</h1>

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
              <TableHead className="font-semibold">Vehicle Type</TableHead>
              <TableHead className="font-semibold">Date & Time</TableHead>
              <TableHead className="font-semibold">Source Location</TableHead>
              <TableHead className="font-semibold">Destination Location</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selfTravelData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No self travel bookings found
                </TableCell>
              </TableRow>
            ) : (
              selfTravelData.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="text-blue-600">{item.employeeName}</TableCell>
                  <TableCell>{item.vehicleType}</TableCell>
                  <TableCell>{item.dateTime}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.sourceLocation}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.destinationLocation}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'Requested' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.status === 'Requested' && (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Filter Modal */}
      <SelfTravelFilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
    </div>
  );
};
