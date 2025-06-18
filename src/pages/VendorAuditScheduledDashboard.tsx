
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from 'lucide-react';

export const VendorAuditScheduledDashboard = () => {
  const scheduleData = [
    {
      id: "11549",
      activityName: "Engineering Audit Checklist 2",
      noOfAssociation: 0,
      task: "No",
      taskAssignedTo: "",
      createdOn: "10/12/2024, 06:21 PM"
    }
  ];

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Schedule</span>
          <span className="mx-2">{'>'}</span>
          <span>Schedule List</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">SCHEDULE LIST</h1>
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <Button 
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Action</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Activity Name</TableHead>
              <TableHead>No. Of Association</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Task Assigned To</TableHead>
              <TableHead>Created on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduleData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300" 
                  />
                </TableCell>
                <TableCell className="text-blue-600 font-medium">
                  {item.id}
                </TableCell>
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

export default VendorAuditScheduledDashboard;
