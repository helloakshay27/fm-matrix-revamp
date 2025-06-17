
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface RoasterData {
  id: number;
  template: string;
  location: string;
  department: string;
  shift: string;
  seatType: string;
  roasterType: string;
  createdOn: string;
  createdBy: string;
}

export const UserRoastersDashboard = () => {
  const navigate = useNavigate();
  const [roasters] = useState<RoasterData[]>([
    {
      id: 1,
      template: "Mon, Tue, Wed",
      location: "Lockated",
      department: "Tech",
      shift: "10:00 AM to 08:00 PM",
      seatType: "Angular Ws",
      roasterType: "Permanent",
      createdOn: "18/04/2023",
      createdBy: "Robert Day2"
    },
    {
      id: 2,
      template: "MON,TUE,WED",
      location: "Lockated",
      department: "Tech",
      shift: "10:00 AM to 08:00 PM",
      seatType: "Cubical",
      roasterType: "Permanent",
      createdOn: "13/03/2023",
      createdBy: "Robert Day2"
    },
    {
      id: 3,
      template: "Operations",
      location: "Lockated",
      department: "Operations",
      shift: "10:00 AM to 08:00 PM",
      seatType: "Angular Ws",
      roasterType: "Permanent",
      createdOn: "09/02/2023",
      createdBy: "Robert Day2"
    },
    {
      id: 4,
      template: "2023",
      location: "Lockated",
      department: "Operations",
      shift: "10:00 AM to 08:00 PM",
      seatType: "Angular Ws",
      roasterType: "Permanent",
      createdOn: "09/02/2023",
      createdBy: "Robert Day2"
    },
    {
      id: 5,
      template: "Monday,Wednesday,Friday",
      location: "Lockated",
      department: "Operations",
      shift: "10:00 AM to 07:00 PM",
      seatType: "Rectangle",
      roasterType: "Permanent",
      createdOn: "29/11/2022",
      createdBy: ""
    },
    {
      id: 6,
      template: "Mon,Wed,Fri",
      location: "Lockated",
      department: "Operations",
      shift: "10:30 AM to 06:30 PM",
      seatType: "circular",
      roasterType: "Permanent",
      createdOn: "28/11/2022",
      createdBy: "Robert Day2"
    },
    {
      id: 7,
      template: "operations",
      location: "Lockated",
      department: "Operations",
      shift: "09:00 AM to 06:00 PM",
      seatType: "Rectangle",
      roasterType: "Permanent",
      createdOn: "28/11/2022",
      createdBy: ""
    }
  ]);

  const handleAddClick = () => {
    navigate('/vas/space-management/setup/roaster/add');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Space &gt; User Roasters</div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">USER ROASTERS</h1>
            <Button 
              onClick={handleAddClick}
              className="bg-[#8B4D6B] hover:bg-[#8B4D6B]/90 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                <TableHead className="font-semibold text-gray-700">Template</TableHead>
                <TableHead className="font-semibold text-gray-700">Location</TableHead>
                <TableHead className="font-semibold text-gray-700">Department</TableHead>
                <TableHead className="font-semibold text-gray-700">Shift</TableHead>
                <TableHead className="font-semibold text-gray-700">Seat Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Roaster Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Created On</TableHead>
                <TableHead className="font-semibold text-gray-700">Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roasters.map((roaster) => (
                <TableRow key={roaster.id} className="border-b">
                  <TableCell>
                    <Button size="sm" variant="ghost" className="p-1">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{roaster.template}</TableCell>
                  <TableCell>{roaster.location}</TableCell>
                  <TableCell>{roaster.department}</TableCell>
                  <TableCell>{roaster.shift}</TableCell>
                  <TableCell>{roaster.seatType}</TableCell>
                  <TableCell>{roaster.roasterType}</TableCell>
                  <TableCell>{roaster.createdOn}</TableCell>
                  <TableCell>{roaster.createdBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
