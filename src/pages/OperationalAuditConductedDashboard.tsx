
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

export const OperationalAuditConductedDashboard = () => {
  const conductedData = [
    { id: "9182", activityName: "Short check list", noOfAssociation: 0, task: "Yes", taskAssignedTo: "", createdOn: "08/04/2023, 12:20 AM" },
    { id: "9145", activityName: "Engineering Audit Checklist 2", noOfAssociation: 0, task: "Yes", taskAssignedTo: "sanket Patil", createdOn: "27/03/2023, 11:31 AM" },
    { id: "8935", activityName: "Engineer audit", noOfAssociation: 0, task: "Yes", taskAssignedTo: "", createdOn: "13/02/2023, 05:14 PM" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Operational Audit > Conducted</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">CONDUCTED</h1>
        </div>
      </div>
      
      <div className="mb-4">
        <Button className="bg-[#C72030] hover:bg-[#a91b28] text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">ID</TableHead>
              <TableHead className="font-semibold text-gray-700">Activity Name</TableHead>
              <TableHead className="font-semibold text-gray-700">No. Of Association</TableHead>
              <TableHead className="font-semibold text-gray-700">Task</TableHead>
              <TableHead className="font-semibold text-gray-700">Task Assigned To</TableHead>
              <TableHead className="font-semibold text-gray-700">Created on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conductedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-blue-600 font-medium">{item.id}</TableCell>
                <TableCell>{item.activityName}</TableCell>
                <TableCell>{item.noOfAssociation}</TableCell>
                <TableCell>{item.task}</TableCell>
                <TableCell>{item.taskAssignedTo}</TableCell>
                <TableCell>{item.createdOn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
