
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload, SlidersHorizontal, LogIn, LogOut } from 'lucide-react';
import { RVehicleFilterModal } from '@/components/RVehicleFilterModal';
import { RVehicleImportModal } from '@/components/RVehicleImportModal';
import { RVehicleInDialog } from '@/components/RVehicleInDialog';
import { RVehicleOutDialog } from '@/components/RVehicleOutDialog';

// Sample data for R Vehicles
const rVehicleData = [
  {
    id: 1,
    vehicleNumber: 'MH01AB1234',
    ownerName: 'John Doe',
    contactNumber: '+91 9876543210',
    flatNumber: 'A-101',
    vehicleType: 'Car',
    status: 'In',
    lastEntry: '2024-01-15 10:30 AM',
    lastExit: '2024-01-15 06:45 PM'
  },
  {
    id: 2,
    vehicleNumber: 'MH02CD5678',
    ownerName: 'Jane Smith',
    contactNumber: '+91 9876543211',
    flatNumber: 'B-205',
    vehicleType: 'Motorcycle',
    status: 'Out',
    lastEntry: '2024-01-14 09:15 AM',
    lastExit: '2024-01-14 08:30 PM'
  },
  {
    id: 3,
    vehicleNumber: 'MH03EF9012',
    ownerName: 'Mike Johnson',
    contactNumber: '+91 9876543212',
    flatNumber: 'C-304',
    vehicleType: 'Car',
    status: 'In',
    lastEntry: '2024-01-15 08:45 AM',
    lastExit: '2024-01-14 07:20 PM'
  }
];

export const RVehiclesDashboard = () => {
  const navigate = useNavigate();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isInDialogOpen, setIsInDialogOpen] = useState(false);
  const [isOutDialogOpen, setIsOutDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');

  const handleVehicleIn = (vehicleNumber: string) => {
    setSelectedVehicle(vehicleNumber);
    setIsInDialogOpen(true);
  };

  const handleVehicleOut = (vehicleNumber: string) => {
    setSelectedVehicle(vehicleNumber);
    setIsOutDialogOpen(true);
  };

  const handleHistoryClick = () => {
    navigate('/security/vehicles/r-vehicles/history');
  };

  const handleInClick = () => {
    navigate('/security/vehicles/r-vehicles/in');
  };

  const handleOutClick = () => {
    navigate('/security/vehicles/r-vehicles/out');
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>R Vehicles</span>
          <span>&gt;</span>
          <span>All R Vehicles</span>
        </div>
        
        <div className="bg-white rounded-none border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-[#1a1a1a] uppercase">REGISTERED VEHICLES</h2>
            
            {/* Action Buttons */}
            <div className="flex gap-3 mb-4">
              <Button 
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
              <Button 
                onClick={handleHistoryClick}
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none"
              >
                History
              </Button>
              <Button 
                onClick={handleInClick}
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none"
              >
                In
              </Button>
              <Button 
                onClick={handleOutClick}
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none"
              >
                Out
              </Button>
              <Button 
                onClick={() => setIsImportModalOpen(true)}
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button 
                onClick={() => setIsFilterModalOpen(true)}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-none"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f6f4ee]">
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded-none" />
                  </TableHead>
                  <TableHead>Vehicle Number</TableHead>
                  <TableHead>Owner Name</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Flat Number</TableHead>
                  <TableHead>Vehicle Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Entry</TableHead>
                  <TableHead>Last Exit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rVehicleData.map((vehicle) => (
                  <TableRow key={vehicle.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input type="checkbox" className="rounded-none" />
                    </TableCell>
                    <TableCell className="text-blue-600 font-medium">{vehicle.vehicleNumber}</TableCell>
                    <TableCell>{vehicle.ownerName}</TableCell>
                    <TableCell>{vehicle.contactNumber}</TableCell>
                    <TableCell>{vehicle.flatNumber}</TableCell>
                    <TableCell>{vehicle.vehicleType}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-none text-xs font-medium ${
                        vehicle.status === 'In' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </TableCell>
                    <TableCell>{vehicle.lastEntry}</TableCell>
                    <TableCell>{vehicle.lastExit}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {vehicle.status === 'Out' ? (
                          <Button
                            size="sm"
                            onClick={() => handleVehicleIn(vehicle.vehicleNumber)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-none"
                          >
                            <LogIn className="w-3 h-3 mr-1" />
                            In
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleVehicleOut(vehicle.vehicleNumber)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-none"
                          >
                            <LogOut className="w-3 h-3 mr-1" />
                            Out
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <RVehicleFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />

      {/* Import Modal */}
      <RVehicleImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* Vehicle In Dialog */}
      <RVehicleInDialog 
        isOpen={isInDialogOpen}
        onClose={() => setIsInDialogOpen(false)}
        vehicleNumber={selectedVehicle}
      />

      {/* Vehicle Out Dialog */}
      <RVehicleOutDialog 
        isOpen={isOutDialogOpen}
        onClose={() => setIsOutDialogOpen(false)}
        vehicleNumber={selectedVehicle}
      />
    </div>
  );
};
