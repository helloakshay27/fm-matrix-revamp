import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Switch } from '../components/ui/switch';
import { Plus, Search, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useLayout } from '../contexts/LayoutContext';
import { ColumnVisibilityDropdown } from '../components/ColumnVisibilityDropdown';

interface SlotConfigurationData {
  id: number;
  slotNumber: string;
  location: string;
  category: string;
  active: boolean;
  createdOn: string;
}

export const SlotConfigurationPage = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    actions: true,
    slotNumber: true,
    location: true,
    category: true,
    active: true,
    createdOn: true
  });

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);
  
  // Sample data for slot configuration
  const [slotConfigurationData, setSlotConfigurationData] = useState<SlotConfigurationData[]>([
    {
      id: 1,
      slotNumber: 'A-001',
      location: 'Ground Floor - Zone A',
      category: '2 Wheeler',
      active: true,
      createdOn: '12/12/2023'
    },
    {
      id: 2,
      slotNumber: 'A-002',
      location: 'Ground Floor - Zone A',
      category: '4 Wheeler',
      active: true,
      createdOn: '12/12/2023'
    },
    {
      id: 3,
      slotNumber: 'B-001',
      location: 'First Floor - Zone B',
      category: '2 Wheeler',
      active: false,
      createdOn: '10/11/2023'
    },
    {
      id: 4,
      slotNumber: 'C-001',
      location: 'Second Floor - Zone C',
      category: 'Heavy Vehicle',
      active: true,
      createdOn: '08/10/2023'
    }
  ]);

  const filteredData = slotConfigurationData.filter(item =>
    item.slotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm)
  );

  const handleStatusToggle = (id: number) => {
    setSlotConfigurationData(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { ...item, active: !item.active }
          : item
      )
    );
    
    const updatedItem = slotConfigurationData.find(item => item.id === id);
    const newValue = updatedItem ? !updatedItem.active : false;
    toast.success(`Status updated to ${newValue ? 'Active' : 'Inactive'}`);
  };

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
    { key: 'slotNumber', label: 'Slot Number', visible: visibleColumns.slotNumber },
    { key: 'location', label: 'Location', visible: visibleColumns.location },
    { key: 'category', label: 'Category', visible: visibleColumns.category },
    { key: 'active', label: 'Active/Inactive', visible: visibleColumns.active },
    { key: 'createdOn', label: 'Created On', visible: visibleColumns.createdOn }
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
              {visibleColumns.actions && <TableHead className="text-center">Actions</TableHead>}
              {visibleColumns.slotNumber && <TableHead>Slot Number</TableHead>}
              {visibleColumns.location && <TableHead>Location</TableHead>}
              {visibleColumns.category && <TableHead>Category</TableHead>}
              {visibleColumns.active && <TableHead className="text-center">Active/Inactive</TableHead>}
              {visibleColumns.createdOn && <TableHead>Created On</TableHead>}
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
                {visibleColumns.slotNumber && <TableCell className="font-medium">{item.slotNumber}</TableCell>}
                {visibleColumns.location && <TableCell>{item.location}</TableCell>}
                {visibleColumns.category && <TableCell>{item.category}</TableCell>}
                {visibleColumns.active && (
                  <TableCell className="text-center">
                    <Switch
                      checked={item.active}
                      onCheckedChange={() => handleStatusToggle(item.id)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </TableCell>
                )}
                {visibleColumns.createdOn && <TableCell>{item.createdOn}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};