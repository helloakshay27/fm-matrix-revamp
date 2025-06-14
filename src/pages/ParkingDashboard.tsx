
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Download, Eye } from "lucide-react";
import { AddParkingModal } from "@/components/AddParkingModal";
import { useNavigate } from "react-router-dom";

const ParkingDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  const parkingStats = [
    { title: "Vacant Two Wheeler Slots", count: 4, color: "bg-green-500" },
    { title: "Vacant Four Wheeler Slots", count: 7, color: "bg-green-500" },
    { title: "Total Two Wheeler Allotted Slots", count: 2, color: "bg-red-500" },
    { title: "Total Four Wheeler Allotted Slots", count: 0, color: "bg-orange-500" },
    { title: "Total Allotted Slots", count: 0, color: "bg-red-500" },
    { title: "Total Vacant Slots", count: 11, color: "bg-purple-500" }
  ];

  const parkingData = [
    { id: "HSBC", clientName: "HSBC", twoWheeler: 0, fourWheeler: 0, freeParking: 10, paidParking: 20, availableSlots: 30 },
    { id: "localized", clientName: "localized", twoWheeler: 0, fourWheeler: 0, freeParking: 20, paidParking: 40, availableSlots: 40 },
    { id: "demo", clientName: "demo", twoWheeler: 0, fourWheeler: 0, freeParking: 2, paidParking: 5, availableSlots: 7 },
    { id: "Sohail Ansari", clientName: "Sohail Ansari", twoWheeler: 0, fourWheeler: 0, freeParking: 5, paidParking: 5, availableSlots: 10 },
    { id: "Deepak Jain", clientName: "Deepak Jain", twoWheeler: 0, fourWheeler: 0, freeParking: 5, paidParking: 2, availableSlots: 7 },
    { id: "Mahendra Lungare", clientName: "Mahendra Lungare", twoWheeler: 0, fourWheeler: 0, freeParking: 2, paidParking: 1, availableSlots: 3 },
    { id: "Rajnish Patil", clientName: "Rajnish Patil", twoWheeler: 0, fourWheeler: 0, freeParking: 5, paidParking: 2, availableSlots: 7 },
    { id: "demon", clientName: "demon", twoWheeler: 0, fourWheeler: 0, freeParking: 2, paidParking: 2, availableSlots: 4 },
    { id: "pop", clientName: "pop", twoWheeler: 0, fourWheeler: 0, freeParking: 2, paidParking: 4, availableSlots: 6 },
    { id: "Vinayak Test web 1", clientName: "Vinayak Test web 1", twoWheeler: 0, fourWheeler: 0, freeParking: 1, paidParking: 10, availableSlots: 11 },
    { id: "Vinayak Test", clientName: "Vinayak Test", twoWheeler: 0, fourWheeler: 0, freeParking: 1, paidParking: 0, availableSlots: 1 }
  ];

  const handleViewBookings = () => {
    navigate('/property/parking/bookings');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">PARKING BOOKING LIST</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleViewBookings}>
            <Eye className="w-4 h-4 mr-2" />
            View Bookings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {parkingStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className={`absolute top-0 left-0 w-full h-1 ${stat.color}`}></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.count}</div>
                <div className="text-sm text-gray-600 leading-tight">{stat.title}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Client Name</TableHead>
                <TableHead className="font-semibold">No. of 2 Wheeler</TableHead>
                <TableHead className="font-semibold">No. of 4 Wheeler</TableHead>
                <TableHead className="font-semibold">Free Parking</TableHead>
                <TableHead className="font-semibold">Paid Parking</TableHead>
                <TableHead className="font-semibold">Available Parking Slots</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parkingData.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>{row.clientName}</TableCell>
                  <TableCell className="text-center">{row.twoWheeler}</TableCell>
                  <TableCell className="text-center">{row.fourWheeler}</TableCell>
                  <TableCell className="text-center">{row.freeParking}</TableCell>
                  <TableCell className="text-center">{row.paidParking}</TableCell>
                  <TableCell className="text-center">{row.availableSlots}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddParkingModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
    </div>
  );
};

export default ParkingDashboard;
