
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BookingItem {
  id: number;
  bookingId: string;
  name: string;
  bookedOn: string;
  scheduleOn: string;
  guest: number;
  status: string;
  additionalRequest: string;
}

interface OrderItem {
  id: number;
  orderId: string;
  restaurant: string;
  createdOn: string;
  createdBy: string;
  status: string;
  amountPaid: number;
  noOfItems: number;
  paymentStatus: string;
}

const mockBookingsData: BookingItem[] = [];
const mockOrdersData: OrderItem[] = [];

export const RestaurantBookingsTable = () => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'orders'>('bookings');
  const [bookings] = useState<BookingItem[]>(mockBookingsData);
  const [orders] = useState<OrderItem[]>(mockOrdersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="space-y-4">
      {/* Tab Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => setActiveTab('bookings')}
          variant={activeTab === 'bookings' ? 'default' : 'outline'}
          className={activeTab === 'bookings' ? 'bg-[#C72030] hover:bg-[#C72030]/90 text-white' : 'border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10'}
        >
          Table Bookings
        </Button>
        <Button
          onClick={() => setActiveTab('orders')}
          variant={activeTab === 'orders' ? 'default' : 'outline'}
          className={activeTab === 'orders' ? 'bg-[#C72030] hover:bg-[#C72030]/90 text-white' : 'border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10'}
        >
          Restaurant Orders
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        {activeTab === 'orders' && (
          <Button
            className="bg-[#8B5A3C] hover:bg-[#8B5A3C]/90 text-white"
          >
            Export
          </Button>
        )}
      </div>

      {/* Table Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-center">Actions</TableHead>
                <TableHead className="text-center">Booking ID</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Booked on</TableHead>
                <TableHead className="text-center">Schedule on</TableHead>
                <TableHead className="text-center">Guest</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Additional Request</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No table bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {/* Action buttons would go here */}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{booking.bookingId}</TableCell>
                    <TableCell className="text-center">{booking.name}</TableCell>
                    <TableCell className="text-center">{booking.bookedOn}</TableCell>
                    <TableCell className="text-center">{booking.scheduleOn}</TableCell>
                    <TableCell className="text-center">{booking.guest}</TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">{booking.additionalRequest}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Restaurant Orders Tab */}
      {activeTab === 'orders' && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-center">Actions</TableHead>
                <TableHead className="text-center">Order ID</TableHead>
                <TableHead className="text-center">Restaurant</TableHead>
                <TableHead className="text-center">Created on</TableHead>
                <TableHead className="text-center">Created by</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Amount Paid (₹)</TableHead>
                <TableHead className="text-center">No of Items</TableHead>
                <TableHead className="text-center">Payment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No restaurant orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {/* Action buttons would go here */}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{order.orderId}</TableCell>
                    <TableCell className="text-center">{order.restaurant}</TableCell>
                    <TableCell className="text-center">{order.createdOn}</TableCell>
                    <TableCell className="text-center">{order.createdBy}</TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">₹{order.amountPaid}</TableCell>
                    <TableCell className="text-center">{order.noOfItems}</TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
