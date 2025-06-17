
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";

export const SpaceManagementSeatRequestsDashboard = () => {
  const [seatRequests, setSeatRequests] = useState([
    {
      id: "48823",
      name: "Robert Day2",
      requestedDate: "14/08/2024",
      seatType: "Angular Ws",
      shift: "10:00 AM to 08:00 PM",
      allocationType: "Recurring",
      count: 100,
      status: "Rejected"
    },
    {
      id: "79876",
      name: "Abdul A",
      requestedDate: "25/07/2024",
      seatType: "circular",
      shift: "09:00 AM to 07:00 PM",
      allocationType: "",
      count: 1,
      status: "Rejected"
    },
    {
      id: "48823",
      name: "Robert Day2",
      requestedDate: "17/10/2023",
      seatType: "Angular Ws",
      shift: "10:00 AM to 08:00 PM",
      allocationType: "Recurring",
      count: 100,
      status: "Rejected"
    },
    {
      id: "48823",
      name: "Robert Day2",
      requestedDate: "26/05/2023",
      seatType: "Angular Ws",
      shift: "10:00 AM to 08:00 PM",
      allocationType: "Recurring",
      count: 100,
      status: "Approved"
    },
    {
      id: "85672",
      name: "Kshitij Rasal",
      requestedDate: "12/04/2023",
      seatType: "circularchair",
      shift: "",
      allocationType: "",
      count: 1,
      status: "Approved"
    },
    {
      id: "85672",
      name: "Kshitij Rasal",
      requestedDate: "29/04/2023",
      seatType: "circularchair",
      shift: "",
      allocationType: "",
      count: 1,
      status: "Approved"
    },
    {
      id: "85672",
      name: "Kshitij Rasal",
      requestedDate: "28/04/2023",
      seatType: "Rectangle",
      shift: "",
      allocationType: "",
      count: 1,
      status: "Approved"
    },
    {
      id: "79876",
      name: "Abdul A",
      requestedDate: "20/04/2023",
      seatType: "circular",
      shift: "09:00 AM to 07:00 PM",
      allocationType: "",
      count: 1,
      status: "Approved"
    },
    {
      id: "79876",
      name: "Abdul A",
      requestedDate: "15/04/2023",
      seatType: "circular",
      shift: "09:00 AM to 07:00 PM",
      allocationType: "",
      count: 1,
      status: "Approved"
    },
    {
      id: "79876",
      name: "Abdul A",
      requestedDate: "27/04/2023",
      seatType: "circular",
      shift: "09:00 AM to 07:00 PM",
      allocationType: "",
      count: 1,
      status: "Pending"
    }
  ]);

  // Calculate statistics dynamically based on current data
  const statistics = useMemo(() => {
    const total = seatRequests.length;
    const pending = seatRequests.filter(request => request.status === 'Pending').length;
    const approved = seatRequests.filter(request => request.status === 'Approved').length;
    const rejected = seatRequests.filter(request => request.status === 'Rejected').length;

    return { total, pending, approved, rejected };
  }, [seatRequests]);

  const handleStatusChange = (requestId: string, newStatus: string) => {
    setSeatRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId ? { ...request, status: newStatus } : request
      )
    );
    console.log(`Status changed for request ${requestId} to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Space</span>
          <span>&gt;</span>
          <span>Seat Approval request (seat request)</span>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6 uppercase">SEAT APPROVAL REQUEST</h1>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-500 p-4 rounded-lg text-white">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8" />
              <div>
                <div className="text-2xl font-bold">{statistics.total}</div>
                <div className="text-sm">All</div>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-500 p-4 rounded-lg text-white">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8" />
              <div>
                <div className="text-2xl font-bold">{statistics.pending}</div>
                <div className="text-sm">Pending</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-500 p-4 rounded-lg text-white">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8" />
              <div>
                <div className="text-2xl font-bold">{statistics.approved}</div>
                <div className="text-sm">Approved</div>
              </div>
            </div>
          </div>
          
          <div className="bg-red-500 p-4 rounded-lg text-white">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8" />
              <div>
                <div className="text-2xl font-bold">{statistics.rejected}</div>
                <div className="text-sm">Rejected</div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Requested Date</TableHead>
                  <TableHead className="font-semibold text-gray-700">Seat Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Shift</TableHead>
                  <TableHead className="font-semibold text-gray-700">Allocation Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Count</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seatRequests.map((request, index) => (
                  <TableRow key={`${request.id}-${index}`}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell className="text-blue-600">{request.name}</TableCell>
                    <TableCell>{request.requestedDate}</TableCell>
                    <TableCell>{request.seatType}</TableCell>
                    <TableCell>{request.shift}</TableCell>
                    <TableCell>{request.allocationType}</TableCell>
                    <TableCell>{request.count}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {request.status === 'Pending' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleStatusChange(request.id, 'Approved')}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleStatusChange(request.id, 'Rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {request.status !== 'Pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-gray-300 text-gray-700"
                            onClick={() => handleStatusChange(request.id, 'Pending')}
                          >
                            Reset
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
