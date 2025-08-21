import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Switch } from '../components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<File | null>(null);

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
    setIsCreateModalOpen(true);
  };

  const handleCreateCategory = () => {
    if (!categoryName) {
      toast.error('Please enter category name');
      return;
    }
    
    const newCategory = {
      id: Math.max(...parkingCategoryData.map(item => item.id)) + 1,
      name: categoryName,
      active: true,
      createdOn: new Date().toLocaleDateString('en-GB')
    };
    
    setParkingCategoryData(prevData => [...prevData, newCategory]);
    toast.success('Category created successfully');
    
    // Reset form
    setCategoryName('');
    setCategoryImage(null);
    setIsCreateModalOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCategoryImage(file);
    }
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
              {visibleColumns.actions && <TableHead className="text-center">Actions</TableHead>}
              {visibleColumns.name && <TableHead>Name</TableHead>}
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

      {/* Create Category Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg font-semibold">Create Category</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Category Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Category Name</label>
              <Select value={categoryName} onValueChange={setCategoryName}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2 Wheeler">2 Wheeler</SelectItem>
                  <SelectItem value="4 Wheeler">4 Wheeler</SelectItem>
                  <SelectItem value="Heavy Vehicle">Heavy Vehicle</SelectItem>
                  <SelectItem value="Bicycle">Bicycle</SelectItem>
                  <SelectItem value="Electric Vehicle">Electric Vehicle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Category Image</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  Choose File
                </Button>
                <span className="text-sm text-gray-500">
                  {categoryImage ? categoryImage.name : 'No file chosen'}
                </span>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleCreateCategory}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};