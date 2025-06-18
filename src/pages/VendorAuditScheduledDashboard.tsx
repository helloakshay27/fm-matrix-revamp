
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VendorAuditScheduledDashboard = () => {
  const navigate = useNavigate();

  const handleCopy = (id: string) => {
    navigate('/maintenance/audit/vendor/scheduled/copy');
  };

  const handleAdd = () => {
    navigate('/maintenance/audit/vendor/scheduled/add');
  };

  const handleIdClick = (id: string) => {
    navigate(`/maintenance/audit/vendor/scheduled/view/${id}`);
  };

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
          onClick={handleAdd}
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
                  <Button
                    onClick={() => handleCopy(item.id)}
                    size="sm"
                    style={{ backgroundColor: '#C72030' }}
                    className="text-white hover:opacity-90"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-blue-600 font-medium">
                  <button
                    onClick={() => handleIdClick(item.id)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {item.id}
                  </button>
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
