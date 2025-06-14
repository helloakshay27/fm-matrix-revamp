
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Download, Upload, FileText } from "lucide-react";
import { BookingsFilterDialog } from "@/components/BookingsFilterDialog";

export const BookingsDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterApply = (filters: any) => {
    console.log('Applied filters:', filters);
  };

  const bookingData = [
    {
      id: "142179",
      employeeId: "73974",
      employeeName: "HO Occupant 2",
      employeeEmail: "hooccupant2@locatard.com",
      scheduleDate: "29 December 2023",
      day: "Friday",
      category: "Angular War",
      building: "Jyoti Tower",
      floor: "2nd Floor",
      designation: "",
      department: "",
      slotsAndSeat: "10:00 AM to 08:00 PM - HR 1",
      status: "Cancelled",
      createdOn: "15/02/2023, 5:44 PM"
    },
    {
      id: "142150",
      employeeId: "71905",
      employeeName: "Prashant P",
      employeeEmail: "889853791@gmail.com",
      scheduleDate: "29 December 2023",
      day: "Friday",
      category: "Angular War",
      building: "Jyoti Tower",
      floor: "2nd Floor",
      designation: "",
      department: "",
      slotsAndSeat: "10:00 AM to 08:00 PM - S7",
      status: "Cancelled",
      createdOn: "15/02/2023, 5:43 PM"
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">SEAT BOOKING LIST</h1>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Roster Export
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                <TableHead className="font-semibold text-gray-700">ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Employee ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Employee Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Employee Email</TableHead>
                <TableHead className="font-semibold text-gray-700">Schedule Date</TableHead>
                <TableHead className="font-semibold text-gray-700">Day</TableHead>
                <TableHead className="font-semibold text-gray-700">Category</TableHead>
                <TableHead className="font-semibold text-gray-700">Building</TableHead>
                <TableHead className="font-semibold text-gray-700">Floor</TableHead>
                <TableHead className="font-semibold text-gray-700">Designation</TableHead>
                <TableHead className="font-semibold text-gray-700">Department</TableHead>
                <TableHead className="font-semibold text-gray-700">Slots & Seat No.</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Created On</TableHead>
                <TableHead className="font-semibold text-gray-700">Cancel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookingData.map((booking, index) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">👁️</Button>
                    </div>
                  </TableCell>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.employeeId}</TableCell>
                  <TableCell className="text-blue-600">{booking.employeeName}</TableCell>
                  <TableCell className="text-blue-600">{booking.employeeEmail}</TableCell>
                  <TableCell>{booking.scheduleDate}</TableCell>
                  <TableCell>{booking.day}</TableCell>
                  <TableCell>{booking.category}</TableCell>
                  <TableCell>{booking.building}</TableCell>
                  <TableCell>{booking.floor}</TableCell>
                  <TableCell>{booking.designation}</TableCell>
                  <TableCell>{booking.department}</TableCell>
                  <TableCell>{booking.slotsAndSeat}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </TableCell>
                  <TableCell>{booking.createdOn}</TableCell>
                  <TableCell>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Filter Dialog */}
        <BookingsFilterDialog 
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          onApply={handleFilterApply}
        />
      </div>
    </div>
  );
};
