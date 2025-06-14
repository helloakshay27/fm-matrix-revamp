
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { AddGDNDialog } from "@/components/AddGDNDialog";

export const GDNDashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const gdnData = [
    {
      id: 310792,
      gdnDate: "22/04/2025",
      inventoryCount: 2,
      status: "Pending",
      createdOn: "22/04/2025",
      createdBy: "Sony Bhosle",
      handedOverTo: ""
    },
    {
      id: 137967,
      gdnDate: "02/07/2024",
      inventoryCount: 1,
      status: "Pending",
      createdOn: "30/07/2024",
      createdBy: "Anjali Lungare",
      handedOverTo: ""
    },
    {
      id: 137964,
      gdnDate: "10/07/2024",
      inventoryCount: 1,
      status: "Approved",
      createdOn: "30/07/2024",
      createdBy: "Anjali Lungare",
      handedOverTo: ""
    },
    {
      id: 96838,
      gdnDate: "01/05/2024",
      inventoryCount: 1,
      status: "Approved",
      createdOn: "03/05/2024",
      createdBy: "Vinayak Mane",
      handedOverTo: ""
    },
    {
      id: 95230,
      gdnDate: "29/04/2024",
      inventoryCount: 1,
      status: "Dispatched",
      createdOn: "29/04/2024",
      createdBy: "",
      handedOverTo: ""
    },
    {
      id: 95229,
      gdnDate: "29/04/2024",
      inventoryCount: 1,
      status: "Rejected",
      createdOn: "29/04/2024",
      createdBy: "",
      handedOverTo: ""
    },
    {
      id: 91269,
      gdnDate: "12/04/2024",
      inventoryCount: 1,
      status: "Approved",
      createdOn: "17/04/2024",
      createdBy: "Vinayak Mane",
      handedOverTo: ""
    },
    {
      id: 91267,
      gdnDate: "11/04/2024",
      inventoryCount: 1,
      status: "Dispatched",
      createdOn: "17/04/2024",
      createdBy: "Vinayak Mane",
      handedOverTo: ""
    },
    {
      id: 91266,
      gdnDate: "11/04/2024",
      inventoryCount: 1,
      status: "Rejected",
      createdOn: "17/04/2024",
      createdBy: "Vinayak Mane",
      handedOverTo: ""
    },
    {
      id: 90021,
      gdnDate: "15/04/2024",
      inventoryCount: 2,
      status: "Dispatched",
      createdOn: "15/04/2024",
      createdBy: "Jayesh P",
      handedOverTo: ""
    },
    {
      id: 89982,
      gdnDate: "15/04/2024",
      inventoryCount: 2,
      status: "Dispatched",
      createdOn: "15/04/2024",
      createdBy: "Vinayak Mane",
      handedOverTo: "Shubh Jhaveri"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-black';
      case 'dispatched':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        GDN Generation &gt; GDN List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">GDN LIST</h1>

      {/* Add Button */}
      <div className="mb-6">
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => setIsAddDialogOpen(true)}
        >
          + Add
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Actions</TableHead>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">GDN Date</TableHead>
              <TableHead className="font-semibold">Inventory Count</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Created On</TableHead>
              <TableHead className="font-semibold">Created By</TableHead>
              <TableHead className="font-semibold">Handed Over To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gdnData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  <Button size="sm" variant="ghost" className="p-1">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.gdnDate}</TableCell>
                <TableCell>{item.inventoryCount}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>{item.createdOn}</TableCell>
                <TableCell>{item.createdBy}</TableCell>
                <TableCell>{item.handedOverTo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddGDNDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};
