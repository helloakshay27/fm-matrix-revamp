import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Switch } from '../components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLayout } from '../contexts/LayoutContext';
import { ColumnVisibilityDropdown } from '../components/ColumnVisibilityDropdown';

interface ParkingCategoryData {
  id: number;
  name: string;
  active: boolean;
  createdOn: string;
}

export const ParkingCategoryPage = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    actions: true,
    name: true,
    active: true,
    createdOn: true
  });

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);
  
  // Sample data for parking categories
  const [parkingCategoryData, setParkingCategoryData] = useState<ParkingCategoryData[]>([
    {
      id: 1,
      name: '2 Wheeler',
      active: true,
      createdOn: '12/12/2023'
    },
    {
      id: 2,
      name: '4 Wheeler',
      active: true,
      createdOn: '12/12/2023'
    },
    {
      id: 3,
      name: 'Heavy Vehicle',
      active: false,
      createdOn: '10/11/2023'
    },
    {
      id: 4,
      name: 'Bicycle',
      active: true,
      createdOn: '08/10/2023'
    }
  ]);

  const filteredData = parkingCategoryData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm)
  );

  const handleStatusToggle = (id: number) => {
    setParkingCategoryData(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { ...item, active: !item.active }
          : item
      )
    );
    
    const updatedItem = parkingCategoryData.find(item => item.id === id);
    const newValue = updatedItem ? !updatedItem.active : false;
    toast.success(`Status updated to ${newValue ? 'Active' : 'Inactive'}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/settings/vas/parking-management/parking-category/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    setParkingCategoryData(prevData => prevData.filter(item => item.id !== id));
    toast.success('Parking category deleted successfully');
  };

  const handleAdd = () => {
    navigate('/settings/vas/parking-management/parking-category/add');
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
    { key: 'name', label: 'Name', visible: visibleColumns.name },
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
              {visibleColumns.actions && <TableHead className="w-24">Actions</TableHead>}
              {visibleColumns.name && <TableHead className="w-80">Name</TableHead>}
              {visibleColumns.active && <TableHead className="w-40 text-center">Active/Inactive</TableHead>}
              {visibleColumns.createdOn && <TableHead className="w-40">Created On</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                {visibleColumns.actions && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-500" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Parking Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.name && <TableCell className="font-medium">{item.name}</TableCell>}
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