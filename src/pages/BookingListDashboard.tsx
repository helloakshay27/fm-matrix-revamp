import React, { useState } from 'react';
import { Eye, Plus, Filter, Download, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface BookingData {
  id: number;
  bookedBy: string;
  bookedFor: string;
  companyName: string;
  facility: string;
  facilityType: string;
  scheduledDate: string;
  scheduledTime: string;
  bookingStatus: 'Confirmed' | 'Pending' | 'Cancelled';
  createdOn: string;
  source: string;
}

const mockBookingData: BookingData[] = [
  {
    id: 334945,
    bookedBy: 'Test 11 Bulk',
    bookedFor: 'Test 11 Bulk',
    companyName: 'Lockated HO',
    facility: 'Admin Meeting Room',
    facilityType: 'bookable',
    scheduledDate: '9 June 2025',
    scheduledTime: '02:00 PM to 02:15 PM',
    bookingStatus: 'Confirmed',
    createdOn: '9 June 2025',
    source: 'GoPhygital'
  },
  {
    id: 331666,
    bookedBy: 'Test 999.0',
    bookedFor: 'Test 999.0',
    companyName: 'Lockated HO',
    facility: 'Admin Meeting Room',
    facilityType: 'bookable',
    scheduledDate: '30 May 2025',
    scheduledTime: '08:00 AM to 08:15 AM',
    bookingStatus: 'Confirmed',
    createdOn: '28 May 2025',
    source: 'GoPhygital'
  },
  {
    id: 313358,
    bookedBy: 'Robert Day2',
    bookedFor: 'Robert Day2',
    companyName: 'Lockated HO',
    facility: 'Admin Meeting Room',
    facilityType: 'bookable',
    scheduledDate: '14 March 2025',
    scheduledTime: '08:15 AM to 08:30 AM',
    bookingStatus: 'Confirmed',
    createdOn: '13 March 2025',
    source: 'GoPhygital'
  },
  {
    id: 306844,
    bookedBy: '',
    bookedFor: '',
    companyName: '',
    facility: 'Admin Meeting Room',
    facilityType: 'bookable',
    scheduledDate: '17 February 2025',
    scheduledTime: '10:00 AM to 10:15 AM',
    bookingStatus: 'Confirmed',
    createdOn: '13 February 2025',
    source: 'GoPhygital'
  },
  {
    id: 306838,
    bookedBy: '',
    bookedFor: '',
    companyName: '',
    facility: 'Admin Meeting Room',
    facilityType: 'bookable',
    scheduledDate: '14 February 2025',
    scheduledTime: '08:00 AM to 08:15 AM',
    bookingStatus: 'Confirmed',
    createdOn: '13 February 2025',
    source: 'GoPhygital'
  }
];

const BookingListDashboard = () => {
  const navigate = useNavigate();
  const [bookings] = useState<BookingData[]>(mockBookingData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddBooking = () => {
    navigate('/vas/booking/add');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Booking &gt; Booking List
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">BOOKING LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={handleAddBooking}
          className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        
        <Button variant="outline" className="border-[#8B4B8C] text-[#8B4B8C] hover:bg-[#8B4B8C] hover:text-white">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            <DropdownMenuItem>Export as Excel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white">
          <Download className="w-4 h-4 mr-2" />
          Export (By Centre)
        </Button>
      </div>

      {/* Filter Columns Button */}
      <div>
        <Button variant="outline" className="border-[#8B4B8C] text-[#8B4B8C] hover:bg-[#8B4B8C] hover:text-white">
          Filter Columns
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">View</TableHead>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Booked By</TableHead>
              <TableHead className="font-semibold">Booked For</TableHead>
              <TableHead className="font-semibold">Company Name</TableHead>
              <TableHead className="font-semibold">Facility</TableHead>
              <TableHead className="font-semibold">Facility Type</TableHead>
              <TableHead className="font-semibold">Scheduled Date</TableHead>
              <TableHead className="font-semibold">Scheduled Time</TableHead>
              <TableHead className="font-semibold">Booking Status</TableHead>
              <TableHead className="font-semibold">Created On</TableHead>
              <TableHead className="font-semibold">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBookings.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-gray-50">
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>{booking.bookedBy}</TableCell>
                <TableCell>{booking.bookedFor}</TableCell>
                <TableCell>{booking.companyName}</TableCell>
                <TableCell>{booking.facility}</TableCell>
                <TableCell>{booking.facilityType}</TableCell>
                <TableCell>{booking.scheduledDate}</TableCell>
                <TableCell>{booking.scheduledTime}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(booking.bookingStatus)}>
                    {booking.bookingStatus}
                  </Badge>
                </TableCell>
                <TableCell>{booking.createdOn}</TableCell>
                <TableCell>{booking.source}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default BookingListDashboard;
