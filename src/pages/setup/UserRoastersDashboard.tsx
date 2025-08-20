
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
  const [roasters, setRoasters] = useState<RoasterData[]>([]);

  React.useEffect(() => {
    // Fetch roster data from API
    const fetchRoasters = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/pms/admin/user_roasters.json`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        if (!response.ok) throw new Error('Failed to fetch roasters');
        const data = await response.json();
        // Adapt API response to RoasterData[]
        const apiRoasters = Array.isArray(data) ? data : (data.user_roasters || []);
        setRoasters(apiRoasters.map((r: any) => ({
          id: r.id,
          template: r.name,
          location: r.location,
          department: r.departments || '',
          shift: r.shift,
          seatType: r.seat_type,
          roasterType: r.roaster_type,
          createdOn: r.created_on,
          createdBy: r.created_by
        })));
      } catch (err) {
        setRoasters([]);
      }
    };
    fetchRoasters();
  }, []);

  const handleAddClick = () => {
    navigate('/vas/space-management/setup/roster/create');
  };

  const handleEditClick = (rosterId: number) => {
    navigate(`/vas/space-management/setup/roster/edit/${rosterId}`);
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
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#C72030]/90 text-white flex items-center gap-2"
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
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="p-1"
                      onClick={() => handleEditClick(roaster.id)}
                    >
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
