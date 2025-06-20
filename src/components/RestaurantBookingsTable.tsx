
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Booking {
  id: number;
  bookingId: string;
  name: string;
  bookedOn: string;
  scheduleOn: string;
  guest: number;
  status: string;
  additionalRequest: string;
}

const mockBookingsData: Booking[] = [];

export const RestaurantBookingsTable = () => {
  const [bookings] = useState<Booking[]>(mockBookingsData);

  return (
    <div className="space-y-4">
      {/* Tabs for different booking views */}
      <Tabs defaultValue="restaurant-bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-gray-100">
          <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
          <TabsTrigger value="status-setup">Status Setup</TabsTrigger>
          <TabsTrigger value="categories-setup">Categories Setup</TabsTrigger>
          <TabsTrigger value="sub-categories-setup">Sub Categories Setup</TabsTrigger>
          <TabsTrigger value="restaurant-menu">Restaurant Menu</TabsTrigger>
          <TabsTrigger value="restaurant-bookings" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Restaurant Bookings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="restaurant-bookings" className="mt-6">
          <div className="space-y-4">
            {/* Additional sub-tabs for bookings */}
            <Tabs defaultValue="restaurant-bookings" className="w-full">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="restaurant-bookings" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Restaurant Bookings
                </TabsTrigger>
                <TabsTrigger value="restaurant-orders">Restaurant Orders</TabsTrigger>
              </TabsList>

              <TabsContent value="restaurant-bookings" className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-center font-medium">Actions</TableHead>
                        <TableHead className="text-center font-medium">Booking ID</TableHead>
                        <TableHead className="text-center font-medium">Name</TableHead>
                        <TableHead className="text-center font-medium">Booked on</TableHead>
                        <TableHead className="text-center font-medium">Schedule on</TableHead>
                        <TableHead className="text-center font-medium">Guest</TableHead>
                        <TableHead className="text-center font-medium">Status</TableHead>
                        <TableHead className="text-center font-medium">Additional Request</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            No bookings found.
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
                                booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
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
              </TabsContent>

              <TabsContent value="restaurant-orders">
                <div className="p-8 text-center text-gray-500">
                  Restaurant Orders content would be implemented here
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
