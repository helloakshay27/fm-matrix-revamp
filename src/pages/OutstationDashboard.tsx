
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OutstationFilterModal } from "@/components/OutstationFilterModal";

export const OutstationDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const outstationData = [
    {
      id: "30",
      employeeName: "Robert Dayz",
      dateTime: "Wed, Jul 12 12:24 PM",
      pickupLocation: "Pune, Pune District, Maharashtra, 411023, India",
      dropLocation: "Keshav Nagar, Pune, Pune District, Maharashtra, 411013, India",
      slab: "Slab 1",
      vehicleType: "Prime SUV",
      status: "Rejected"
    },
    {
      id: "29",
      employeeName: "Chetan Safna",
      dateTime: "Wed, Jul 12 11:58 AM",
      pickupLocation: "Laxminagingh, Apan Marg, Mariamman Nagar, G/S Ward, Zone 2, Mumbai, Maharashtra, 400018, India",
      dropLocation: "Keshav Nagar, Pune, Pune District, Maharashtra, 411013, India",
      slab: "Slab 1",
      vehicleType: "Prime SUV",
      status: "Requested"
    },
    {
      id: "25",
      employeeName: "Kshitij Rasal",
      dateTime: "Sat, Apr 01 9:59 AM",
      pickupLocation: "Old Mirada Play Ground, Glady's Alvares Avenue, Naigaon, Vasant Vihar, Thane, Thane Taluka, Thane, Maharashtra, 401502, India",
      dropLocation: "Siddharth Free Reading Room & Library, Shivaji Road, Kadba Peth, Pune, Pune District, Maharashtra, 411002, India",
      slab: "Slab 1",
      vehicleType: "Hatchback",
      status: "Approved"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">✓ Approve</span>;
      case "Rejected":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">✗ Reject</span>;
      case "Requested":
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Requested</span>;
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Outstation &gt; Outstation Booking List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">OUTSTATION BOOKING LIST</h1>

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
              <TableHead className="font-semibold">Date & Time</TableHead>
              <TableHead className="font-semibold">Pickup Location</TableHead>
              <TableHead className="font-semibold">Drop Location</TableHead>
              <TableHead className="font-semibold">Slab</TableHead>
              <TableHead className="font-semibold">Vehicle Type</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outstationData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell className="text-blue-600">{item.employeeName}</TableCell>
                <TableCell>{item.dateTime}</TableCell>
                <TableCell className="max-w-xs truncate">{item.pickupLocation}</TableCell>
                <TableCell className="max-w-xs truncate">{item.dropLocation}</TableCell>
                <TableCell>{item.slab}</TableCell>
                <TableCell>{item.vehicleType}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>
                  {item.status === "Requested" && (
                    <div className="flex gap-1">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1">
                        ✓ Approve
                      </Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1">
                        ✗ Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Filter Modal */}
      <OutstationFilterModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
};
