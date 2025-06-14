
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Filter } from "lucide-react";
import { BookingSetupFilterDialog } from "@/components/BookingSetupFilterDialog";
import { BookingSetupForm } from "@/components/BookingSetupForm";

export const BookingSetupDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);

  const handleFilterApply = (filters: any) => {
    console.log('Applied booking setup filters:', filters);
  };

  const bookingSetupData = [
    {
      id: "1307",
      name: "conference room now",
      type: "bookable",
      department: "Slot",
      bookBy: "D • H • M",
      bookBefore: "D • H • M",
      advanceBooking: "04/03/2025 10:00 AM",
      createdOn: "22/11/2022 12:36 PM",
      createdBy: "",
      status: "✓"
    },
    {
      id: "756",
      name: "Legacy Board Room ( HOUSE - 2ND FLOOR)",
      type: "bookable",
      department: "Slot",
      bookBy: "00 • 0H • 2M",
      bookBefore: "PD • 0H • 4M",
      advanceBooking: "",
      createdOn: "",
      createdBy: "Sony Bhogle",
      status: "✓"
    },
    {
      id: "741",
      name: "Admin Room",
      type: "bookable",
      department: "Slot",
      bookBy: "00 • 0H • 2M",
      bookBefore: "D • H • M",
      advanceBooking: "14/09/2022 5:54 PM",
      createdOn: "",
      createdBy: "",
      status: "✓"
    },
    {
      id: "740",
      name: "Conference Room",
      type: "bookable",
      department: "Slot",
      bookBy: "00 • 0H • 2M",
      bookBefore: "D • H • M",
      advanceBooking: "14/09/2022 5:52 PM",
      createdOn: "",
      createdBy: "",
      status: "✓"
    },
    {
      id: "664",
      name: "Gryfindor Focus Room",
      type: "bookable",
      department: "Slot",
      bookBy: "00 • 0H • 2M",
      bookBefore: "D • H • M",
      advanceBooking: "28/02/2022 6:11 PM",
      createdOn: "",
      createdBy: "Ankit Gupta",
      status: "✓"
    }
  ];

  const handleAddBooking = () => {
    setIsAddBookingOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <p className="text-[#1a1a1a] opacity-70 mb-2">Booking Setup &gt; Booking Setup List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">BOOKING SETUP</h1>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Button 
            onClick={handleAddBooking}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
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
                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Department</TableHead>
                <TableHead className="font-semibold text-gray-700">Book by</TableHead>
                <TableHead className="font-semibold text-gray-700">Book before</TableHead>
                <TableHead className="font-semibold text-gray-700">Advance Booking</TableHead>
                <TableHead className="font-semibold text-gray-700">Created On</TableHead>
                <TableHead className="font-semibold text-gray-700">Created by</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookingSetupData.map((booking, index) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">👁️</Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-blue-600 font-medium">{booking.id}</TableCell>
                  <TableCell className="text-blue-600">{booking.name}</TableCell>
                  <TableCell>{booking.type}</TableCell>
                  <TableCell>{booking.department}</TableCell>
                  <TableCell>{booking.bookBy}</TableCell>
                  <TableCell>{booking.bookBefore}</TableCell>
                  <TableCell>{booking.advanceBooking}</TableCell>
                  <TableCell>{booking.createdOn}</TableCell>
                  <TableCell>{booking.createdBy}</TableCell>
                  <TableCell className="text-green-600 font-bold">{booking.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Filter Dialog */}
        <BookingSetupFilterDialog 
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          onApply={handleFilterApply}
        />

        {/* Add Booking Setup Form */}
        {isAddBookingOpen && (
          <BookingSetupForm onClose={() => setIsAddBookingOpen(false)} />
        )}
      </div>
    </div>
  );
};
