
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Filter, Eye } from "lucide-react";
import { BookingSetupFilterModal } from "@/components/BookingSetupFilterModal";

export const BookingSetupDashboard = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterApply = (filters: any) => {
    console.log('Applied booking setup filters:', filters);
  };

  const [bookingSetupData, setBookingSetupData] = useState([
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
      status: true
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
      status: true
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
      status: true
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
      status: true
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
      status: true
    }
  ]);

  const handleAddBooking = () => {
    navigate('/vas/booking/setup/add');
  };

  const handleStatusToggle = (id: string) => {
    setBookingSetupData(prevData =>
      prevData.map(booking =>
        booking.id === id ? { ...booking, status: !booking.status } : booking
      )
    );
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
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-black font-medium">{booking.id}</TableCell>
                  <TableCell className="text-black">{booking.name}</TableCell>
                  <TableCell>{booking.type}</TableCell>
                  <TableCell>{booking.department}</TableCell>
                  <TableCell>{booking.bookBy}</TableCell>
                  <TableCell>{booking.bookBefore}</TableCell>
                  <TableCell>{booking.advanceBooking}</TableCell>
                  <TableCell>{booking.createdOn}</TableCell>
                  <TableCell>{booking.createdBy}</TableCell>
                  <TableCell>
                    <Switch
                      checked={booking.status}
                      onCheckedChange={() => handleStatusToggle(booking.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Filter Modal */}
        <BookingSetupFilterModal 
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          onApply={handleFilterApply}
        />

      </div>
    </div>
  );
};
