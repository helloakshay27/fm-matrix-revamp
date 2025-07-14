import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export const OperationalAuditScheduledDashboard = () => {
  const navigate = useNavigate();

  // Sample data matching the image
  const scheduleData = [
    { id: "11600", activityName: "clean", noOfAssociation: 1, task: "No", taskAssignedTo: "", createdOn: "02/01/2025, 01:41 PM" },
    { id: "11549", activityName: "Engineering Audit Checklist 2", noOfAssociation: 0, task: "No", taskAssignedTo: "", createdOn: "10/12/2024, 06:21 PM" },
    { id: "11496", activityName: "This is test Audit", noOfAssociation: 0, task: "No", taskAssignedTo: "", createdOn: "24/10/2024, 12:17 PM" },
    { id: "11491", activityName: "This is test Audit", noOfAssociation: 0, task: "No", taskAssignedTo: "", createdOn: "23/10/2024, 06:33 PM" },
    { id: "11091", activityName: "Short Audit Process Report 1", noOfAssociation: 0, task: "No", taskAssignedTo: "", createdOn: "16/05/2024, 12:13 PM" },
    { id: "11089", activityName: "Short Audit Process Report", noOfAssociation: 0, task: "No", taskAssignedTo: "", createdOn: "15/05/2024, 01:39 PM" },
    { id: "11088", activityName: "Engineering Audit Report", noOfAssociation: 0, task: "No", taskAssignedTo: "", createdOn: "15/05/2024, 01:36 PM" },
    { id: "10079", activityName: "Allow observation", noOfAssociation: 0, task: "No", taskAssignedTo: "", createdOn: "23/11/2023, 06:01 PM" },
    { id: "9182", activityName: "Short check list", noOfAssociation: 0, task: "Yes", taskAssignedTo: "", createdOn: "08/04/2023, 12:20 AM" },
    { id: "9145", activityName: "Engineering Audit Checklist 2", noOfAssociation: 0, task: "Yes", taskAssignedTo: "sanket Patil", createdOn: "27/03/2023, 11:31 AM" },
    { id: "8935", activityName: "Engineer audit", noOfAssociation: 0, task: "Yes", taskAssignedTo: "", createdOn: "13/02/2023, 05:14 PM" },
  ];

  const handleAddSchedule = () => {
    navigate('/maintenance/audit/operational/scheduled/add');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Schedule &gt; Schedule List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">SCHEDULE LIST</h1>
        </div>
      </div>
      
      <div className="mb-4">
        <Button 
          onClick={handleAddSchedule}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90 flex items-center gap-2"
        >
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
            {scheduleData.map((item, index) => (
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
