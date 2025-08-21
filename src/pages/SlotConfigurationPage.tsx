import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Search, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useLayout } from '../contexts/LayoutContext';
import { ColumnVisibilityDropdown } from '../components/ColumnVisibilityDropdown';

interface SlotConfigurationData {
  id: number;
  location: string;
  floor: string;
  twoWheeler: {
    totalParkings: number;
    nonStackParkings: number;
    stackParkings: number;
    reservedParkings: number;
  };
  fourWheeler: {
    totalParkings: number;
    nonStackParkings: number;
    stackParkings: number;
    reservedParkings: number;
  };
  createdOn: string;
}

export const SlotConfigurationPage = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    actions: true,
    location: true,
    floor: true,
    twoWheelerTotal: true,
    twoWheelerNonStack: true,
    twoWheelerStack: true,
    twoWheelerReserved: true,
    fourWheelerTotal: true,
    fourWheelerNonStack: true,
    fourWheelerStack: true,
    fourWheelerReserved: true
  });

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);
  
  // Sample data for slot configuration
  const [slotConfigurationData, setSlotConfigurationData] = useState<SlotConfigurationData[]>([
    {
      id: 1,
      location: 'Sai Radhe',
      floor: 'Ground Floor',
      twoWheeler: {
        totalParkings: 182,
        nonStackParkings: 182,
        stackParkings: 0,
        reservedParkings: 0
      },
      fourWheeler: {
        totalParkings: 76,
        nonStackParkings: 76,
        stackParkings: 0,
        reservedParkings: 0
      },
      createdOn: '12/12/2023'
    },
    {
      id: 2,
      location: 'Building A',
      floor: 'First Floor',
      twoWheeler: {
        totalParkings: 150,
        nonStackParkings: 100,
        stackParkings: 50,
        reservedParkings: 10
      },
      fourWheeler: {
        totalParkings: 60,
        nonStackParkings: 50,
        stackParkings: 10,
        reservedParkings: 5
      },
      createdOn: '12/12/2023'
    },
    {
      id: 3,
      location: 'Building B',
      floor: 'Second Floor',
      twoWheeler: {
        totalParkings: 120,
        nonStackParkings: 80,
        stackParkings: 40,
        reservedParkings: 8
      },
      fourWheeler: {
        totalParkings: 40,
        nonStackParkings: 35,
        stackParkings: 5,
        reservedParkings: 3
      },
      createdOn: '10/11/2023'
    }
  ]);

  const filteredData = slotConfigurationData.filter(item =>
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm)
  );

  const handleEdit = (id: number) => {
    navigate(`/settings/vas/parking-management/slot-configuration/edit/${id}`);
  };

  const handleAdd = () => {
    navigate('/settings/vas/parking-management/slot-configuration/add');
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: visible
    }));
  };

  // Column definitions for visibility control
  const columns = [
    { key: 'actions', label: 'Actions', visible: visibleColumns.actions },
    { key: 'location', label: 'Location', visible: visibleColumns.location },
    { key: 'floor', label: 'Floor', visible: visibleColumns.floor },
    { key: 'twoWheelerTotal', label: '2W Total Parkings', visible: visibleColumns.twoWheelerTotal },
    { key: 'twoWheelerNonStack', label: '2W Non Stack', visible: visibleColumns.twoWheelerNonStack },
    { key: 'twoWheelerStack', label: '2W Stack', visible: visibleColumns.twoWheelerStack },
    { key: 'twoWheelerReserved', label: '2W Reserved', visible: visibleColumns.twoWheelerReserved },
    { key: 'fourWheelerTotal', label: '4W Total Parkings', visible: visibleColumns.fourWheelerTotal },
    { key: 'fourWheelerNonStack', label: '4W Non Stack', visible: visibleColumns.fourWheelerNonStack },
    { key: 'fourWheelerStack', label: '4W Stack', visible: visibleColumns.fourWheelerStack },
    { key: 'fourWheelerReserved', label: '4W Reserved', visible: visibleColumns.fourWheelerReserved }
  ];

  return (
    <div className="p-6 min-h-screen">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={handleAdd}
          className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <ColumnVisibilityDropdown
            columns={columns}
            onColumnToggle={handleColumnToggle}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f6f4ee]">
              {visibleColumns.actions && <TableHead className="text-center" rowSpan={2}>Actions</TableHead>}
              {visibleColumns.location && <TableHead rowSpan={2}>Location</TableHead>}
              {visibleColumns.floor && <TableHead rowSpan={2}>Floor</TableHead>}
              <TableHead className="text-center" colSpan={4}>2 Wheeler</TableHead>
              <TableHead className="text-center" colSpan={4}>4 Wheeler</TableHead>
            </TableRow>
            <TableRow className="bg-[#f6f4ee]">
              {visibleColumns.twoWheelerTotal && <TableHead className="text-center">Total<br/>Parkings</TableHead>}
              {visibleColumns.twoWheelerNonStack && <TableHead className="text-center">Non Stack<br/>Parkings</TableHead>}
              {visibleColumns.twoWheelerStack && <TableHead className="text-center">Stack<br/>Parkings</TableHead>}
              {visibleColumns.twoWheelerReserved && <TableHead className="text-center text-red-600">Reserved<br/>Parkings</TableHead>}
              {visibleColumns.fourWheelerTotal && <TableHead className="text-center">Total<br/>Parkings</TableHead>}
              {visibleColumns.fourWheelerNonStack && <TableHead className="text-center">Non Stack<br/>Parkings</TableHead>}
              {visibleColumns.fourWheelerStack && <TableHead className="text-center">Stack<br/>Parkings</TableHead>}
              {visibleColumns.fourWheelerReserved && <TableHead className="text-center text-red-600">Reserved<br/>Parkings</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                {visibleColumns.actions && (
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                      </button>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.location && <TableCell className="font-medium">{item.location}</TableCell>}
                {visibleColumns.floor && <TableCell>{item.floor}</TableCell>}
                {visibleColumns.twoWheelerTotal && <TableCell className="text-center">{item.twoWheeler.totalParkings}</TableCell>}
                {visibleColumns.twoWheelerNonStack && <TableCell className="text-center">{item.twoWheeler.nonStackParkings}</TableCell>}
                {visibleColumns.twoWheelerStack && <TableCell className="text-center">{item.twoWheeler.stackParkings}</TableCell>}
                {visibleColumns.twoWheelerReserved && <TableCell className="text-center text-red-600">{item.twoWheeler.reservedParkings}</TableCell>}
                {visibleColumns.fourWheelerTotal && <TableCell className="text-center">{item.fourWheeler.totalParkings}</TableCell>}
                {visibleColumns.fourWheelerNonStack && <TableCell className="text-center">{item.fourWheeler.nonStackParkings}</TableCell>}
                {visibleColumns.fourWheelerStack && <TableCell className="text-center">{item.fourWheeler.stackParkings}</TableCell>}
                {visibleColumns.fourWheelerReserved && <TableCell className="text-center text-red-600">{item.fourWheeler.reservedParkings}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};