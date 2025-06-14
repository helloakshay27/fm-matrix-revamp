
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

export const OperationalAuditScheduledDashboard = () => {
  const scheduledData = [
    { id: "11600", activityName: "clean", noOfAssociation: 1, task: "No", taskAssignedTo: "", createdOn: "02/01/2025, 01:41 PM" },
    { id: "11549", activityName: "Engineering Audit Checklist 2", noOfAssociation: 0, task: "No", taskAssignedTo: "", createdOn: "10/12/2024, 06:21 PM" },
    { id: "11496", activityName: "This is test Audit", noOfAssociation: 0, task: "No", taskAssignedTo: "", createdOn: "24/10/2024, 12:17 PM" },
    { id: "11491", activityName: "This is test Audit", noOfAssociation: 0, task: "No", taskAssignedTo: "", createdOn: "23/10/2024, 06:33 PM" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Operational Audit > Scheduled</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">SCHEDULED</h1>
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
            {scheduledData.map((item, index) => (
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
