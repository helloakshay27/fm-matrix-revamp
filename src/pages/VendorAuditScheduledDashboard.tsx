
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Copy } from "lucide-react";

export const VendorAuditScheduledDashboard = () => {
  const [scheduleData] = useState([
    {
      id: "11549",
      activityName: "Engineering Audit Checklist 2",
      noOfAssociation: "0",
      task: "No",
      taskAssignedTo: "",
      createdOn: "10/12/2024, 06:21 PM"
    }
  ]);

  const handleAdd = () => {
    console.log('Add new vendor audit schedule');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <p className="text-[#1a1a1a] opacity-70 mb-2">Schedule &gt; Schedule List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">SCHEDULE LIST</h1>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Button 
            onClick={handleAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Action</TableHead>
                <TableHead className="font-semibold text-gray-700">ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Activity Name</TableHead>
                <TableHead className="font-semibold text-gray-700">No. Of Association</TableHead>
                <TableHead className="font-semibold text-gray-700">Task</TableHead>
                <TableHead className="font-semibold text-gray-700">Task Assigned To</TableHead>
                <TableHead className="font-semibold text-gray-700">Created on</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduleData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="text-gray-600">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-blue-600 font-medium">{item.id}</TableCell>
                  <TableCell>{item.activityName}</TableCell>
                  <TableCell className="text-center">{item.noOfAssociation}</TableCell>
                  <TableCell>{item.task}</TableCell>
                  <TableCell>{item.taskAssignedTo}</TableCell>
                  <TableCell>{item.createdOn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
