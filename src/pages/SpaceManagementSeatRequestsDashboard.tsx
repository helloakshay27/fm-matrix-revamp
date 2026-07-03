import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
export const SpaceManagementSeatRequestsDashboard = () => {
  const [seatRequests, setSeatRequests] = useState([{
    id: "48823",
    name: "Robert Day2",
    requestedDate: "14/08/2024",
    seatType: "Angular Ws",
    shift: "10:00 AM to 08:00 PM",
    allocationType: "Recurring",
    count: 100,
    status: "Rejected"
  }, {
    id: "79876",
    name: "Abdul A",
    requestedDate: "25/07/2024",
    seatType: "circular",
    shift: "09:00 AM to 07:00 PM",
    allocationType: "",
    count: 1,
    status: "Rejected"
  }, {
    id: "48823",
    name: "Robert Day2",
    requestedDate: "17/10/2023",
    seatType: "Angular Ws",
    shift: "10:00 AM to 08:00 PM",
    allocationType: "Recurring",
    count: 100,
    status: "Rejected"
  }, {
    id: "48823",
    name: "Robert Day2",
    requestedDate: "26/05/2023",
    seatType: "Angular Ws",
    shift: "10:00 AM to 08:00 PM",
    allocationType: "Recurring",
    count: 100,
    status: "Approved"
  }, {
    id: "85672",
    name: "Kshitij Rasal",
    requestedDate: "12/04/2023",
    seatType: "circularchair",
    shift: "",
    allocationType: "",
    count: 1,
    status: "Approved"
  }, {
    id: "85672",
    name: "Kshitij Rasal",
    requestedDate: "29/04/2023",
    seatType: "circularchair",
    shift: "",
    allocationType: "",
    count: 1,
    status: "Approved"
  }, {
    id: "85672",
    name: "Kshitij Rasal",
    requestedDate: "28/04/2023",
    seatType: "Rectangle",
    shift: "",
    allocationType: "",
    count: 1,
    status: "Approved"
  }, {
    id: "79876",
    name: "Abdul A",
    requestedDate: "20/04/2023",
    seatType: "circular",
    shift: "09:00 AM to 07:00 PM",
    allocationType: "",
    count: 1,
    status: "Approved"
  }, {
    id: "79876",
    name: "Abdul A",
    requestedDate: "15/04/2023",
    seatType: "circular",
    shift: "09:00 AM to 07:00 PM",
    allocationType: "",
    count: 1,
    status: "Approved"
  }, {
    id: "79876",
    name: "Abdul A",
    requestedDate: "27/04/2023",
    seatType: "circular",
    shift: "09:00 AM to 07:00 PM",
    allocationType: "",
    count: 1,
    status: "Pending"
  }]);

  // Calculate statistics dynamically based on current data
  const statistics = useMemo(() => {
    const total = seatRequests.length;
    const pending = seatRequests.filter(request => request.status === 'Pending').length;
    const approved = seatRequests.filter(request => request.status === 'Approved').length;
    const rejected = seatRequests.filter(request => request.status === 'Rejected').length;
    return {
      total,
      pending,
      approved,
      rejected
    };
  }, [seatRequests]);
  const handleStatusChange = (requestId: string, newStatus: string) => {
    setSeatRequests(prevRequests => prevRequests.map(request => request.id === requestId ? {
      ...request,
      status: newStatus
    } : request));
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
  return <div className="p-6 min-h-screen bg-white">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Space</span>
          <span>&gt;</span>
          <span>Seat Approval request (seat request)</span>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6 uppercase">SEAT APPROVAL REQUEST</h1>
        
        {/* Statistics Cards */}
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  {/* All */}
  <div className="bg-[#f6f4ee] p-4 rounded-lg flex items-center gap-4 md:h-[132px]">
    <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center">
      <Users className="w-5 h-5 text-[#D92818]" />
    </div>
    <div>
      <div className="text-[#D92818] text-lg font-bold">{statistics.total}</div>
      <div className="text-sm text-gray-500">All</div>
    </div>
  </div>

  {/* Pending */}
  <div className="bg-[#f6f4ee] p-4 rounded-lg flex items-center gap-4 md:h-[132px]">
    <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center">
      <Clock className="w-5 h-5 text-[#D92818]" />
    </div>
    <div>
      <div className="text-[#D92818] text-lg font-bold">{statistics.pending}</div>
      <div className="text-sm text-gray-500">Pending</div>
    </div>
  </div>

  {/* Approved */}
  <div className="bg-[#f6f4ee] p-4 rounded-lg flex items-center gap-4 md:h-[132px]">
    <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center">
      <CheckCircle className="w-5 h-5 text-[#D92818]" />
    </div>
    <div>
      <div className="text-[#D92818] text-lg font-bold">{statistics.approved}</div>
      <div className="text-sm text-gray-500">Approved</div>
    </div>
  </div>

  {/* Rejected */}
  <div className="bg-[#f6f4ee] p-4 rounded-lg flex items-center gap-4 md:h-[132px]">
    <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center">
      <XCircle className="w-5 h-5 text-[#D92818]" />
    </div>
    <div>
      <div className="text-[#D92818] text-lg font-bold">{statistics.rejected}</div>
      <div className="text-sm text-gray-500">Rejected</div>
    </div>
  </div>
      </div>


        {/* Table */}
        <EnhancedTable
          data={seatRequests.map((r, i) => ({ ...r, _idx: i }))}
          columns={[
            { key: "id", label: "ID", sortable: true, draggable: true, defaultVisible: true },
            { key: "name", label: "Name", sortable: true, draggable: true, defaultVisible: true },
            { key: "requestedDate", label: "Requested Date", sortable: true, draggable: true, defaultVisible: true },
            { key: "seatType", label: "Seat Type", sortable: true, draggable: true, defaultVisible: true },
            { key: "shift", label: "Shift", sortable: true, draggable: true, defaultVisible: true },
            { key: "allocationType", label: "Allocation Type", sortable: true, draggable: true, defaultVisible: true },
            { key: "count", label: "Count", sortable: true, draggable: true, defaultVisible: true },
            { key: "status", label: "Status", sortable: true, draggable: true, defaultVisible: true },
            { key: "actions", label: "Actions", sortable: false, draggable: false, defaultVisible: true },
          ] as ColumnConfig[]}
          storageKey="seat-requests-table"
          enableSearch={true}
          pagination={true}
          pageSize={10}
          hideTableExport={true}
          emptyMessage="No seat requests found"
          renderCell={(item, columnKey) => {
            switch (columnKey) {
              case "name":
                return <span className="text-blue-600">{item.name}</span>;
              case "status":
                return (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                );
              case "actions":
                return (
                  <div className="flex gap-2 items-center">
                    {item.status === 'Pending' && (
                      <>
                        <Button
                          size="sm"
                          className="fm-button-fix h-8 rounded-md border border-[#DA7756] bg-[#fffaf6] px-3 text-xs font-medium text-[#DA7756] hover:bg-[#fdf0ea]"
                          onClick={() => handleStatusChange(item.id, 'Approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          className="fm-button-fix h-8 rounded-md border border-[#DA7756] bg-[#DA7756] px-3 text-xs font-medium text-white hover:bg-[#c96546]"
                          onClick={() => handleStatusChange(item.id, 'Rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {item.status !== 'Pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="fm-button-fix h-8 rounded-md border border-[#DA7756] bg-[#fffaf6] px-3 text-xs font-medium text-[#DA7756] hover:bg-[#fdf0ea]"
                        onClick={() => handleStatusChange(item.id, 'Pending')}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                );
              default:
                return item[columnKey as keyof typeof item] as React.ReactNode;
            }
          }}
        />
      </div>
    </div>;
};