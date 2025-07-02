
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Download, Eye } from "lucide-react";
import { AddParkingModal } from "@/components/AddParkingModal";
import { BulkUploadModal } from "@/components/BulkUploadModal";
import { useNavigate } from "react-router-dom";

const ParkingDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const navigate = useNavigate();

  const parkingStats = [
    { title: "Vacant Two Wheeler Slots", count: 4, color: "bg-green-500" },
    { title: "Vacant Four Wheeler Slots", count: 7, color: "bg-green-500" },
    { title: "Total Two Wheeler Allotted Slots", count: 0, color: "bg-red-500" },
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
    { id: "Rajnish Patil", clientName: "Rajnish Patil", twoWheeler: 0, fourWheeler: 0, freeParking: 5, paidParking: 2, availableSlots: 7 }
  ];

  const handleViewBookings = () => {
    navigate('/vas/parking/bookings');
  };

  const handleExport = () => {
    setIsBulkUploadOpen(true);
  };

  const handleViewDetails = (clientId: string) => {
    navigate(`/vas/parking/details/${encodeURIComponent(clientId)}`);
  };

  return (
    <div className="p-6 space-y-6  min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">PARKING BOOKING LIST</h1>
        <div className="flex gap-2">
          <Button 
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none border-none shadow-none" 
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button 
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none border-none shadow-none"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button 
            className="bg-[#C72030] hover:bg-[#B01E2A] text-white px-4 py-2 rounded" 
            onClick={handleViewBookings}
          >
            View Bookings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
  {parkingStats.map((stat, index) => (
    <Card key={index} className="flex items-center gap-3 px-4 py-3 shadow-sm border rounded-xl">
      <div className={`h-10 w-1.5 rounded-full ${stat.color}`} />
      <div className="flex flex-col">
        <span className="text-xl font-bold text-gray-900">{stat.count}</span>
        <span className="text-sm text-muted-foreground">{stat.title}</span>
      </div>
    </Card>
  ))}
</div>


      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold border-r">
                  <Eye className="w-4 h-4" />
                </TableHead>
                <TableHead className="font-semibold border-r">Client Name</TableHead>
                <TableHead className="font-semibold border-r">No. of 2 Wheeler</TableHead>
                <TableHead className="font-semibold border-r">No. of 4 Wheeler</TableHead>
                <TableHead className="font-semibold border-r">Free Parking</TableHead>
                <TableHead className="font-semibold border-r">Paid Parking</TableHead>
                <TableHead className="font-semibold">Available Parking Slots</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parkingData.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  <TableCell className="border-r">
                    <button 
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => handleViewDetails(row.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </TableCell>
                  <TableCell className="font-medium border-r">{row.clientName}</TableCell>
                  <TableCell className="text-center border-r">{row.twoWheeler}</TableCell>
                  <TableCell className="text-center border-r">{row.fourWheeler}</TableCell>
                  <TableCell className="text-center border-r">{row.freeParking}</TableCell>
                  <TableCell className="text-center border-r">{row.paidParking}</TableCell>
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
      
      <BulkUploadModal 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)} 
      />
    </div>
  );
};

export default ParkingDashboard;
