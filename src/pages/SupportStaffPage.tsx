import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Chip, OutlinedInput } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, RefreshCw, Grid3X3, Edit, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLayout } from '@/contexts/LayoutContext';

interface SupportStaffData {
  id: string;
  sNo: number;
  name: string;
  estimatedTime: string;
  createdOn: string;
  createdBy: string;
}

export const SupportStaffPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: '',
    days: '',
    hours: '',
    minutes: '',
    selectedIcons: [] as string[]
  });

  // Field styles for Material-UI components
  const fieldStyles = {
    backgroundColor: '#fff',
    borderRadius: '4px',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ddd',
      },
      '&:hover fieldset': {
        borderColor: '#C72030',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030',
      },
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: '#C72030',
      },
    },
  };

  // Service type options
  const serviceTypeOptions = [
    'Delivery',
    'Chef',
    'Cleaning',
    'Maintenance',
    'Security',
    'Catering',
    'Housekeeping',
    'Plumbing',
    'Electrical',
    'Gardening'
  ];

  // Sample data matching the uploaded image structure
  const sampleStaff: SupportStaffData[] = [
    {
      id: '1',
      sNo: 1,
      name: 'DTDC',
      estimatedTime: '',
      createdOn: '15/01/2025 11:04 AM',
      createdBy: 'Abdul A'
    },
    {
      id: '2', 
      sNo: 2,
      name: 'Swiggy/Instamrt',
      estimatedTime: '',
      createdOn: '15/01/2025 11:04 AM',
      createdBy: 'Abdul A'
    },
    {
      id: '3',
      sNo: 3,
      name: 'OLA',
      estimatedTime: '',
      createdOn: '15/01/2025 11:03 AM',
      createdBy: 'Abdul A'
    },
    {
      id: '4',
      sNo: 4,
      name: 'Flipkart',
      estimatedTime: '',
      createdOn: '15/01/2025 11:02 AM',
      createdBy: 'Abdul A'
    },
    {
      id: '5',
      sNo: 5,
      name: 'Amazon',
      estimatedTime: '',
      createdOn: '15/01/2025 11:02 AM',
      createdBy: 'Abdul A'
    },
    {
      id: '6',
      sNo: 6,
      name: 'UBER',
      estimatedTime: '',
      createdOn: '15/01/2025 10:59 AM',
      createdBy: 'Abdul A'
    },
    {
      id: '7',
      sNo: 7,
      name: 'Zomato',
      estimatedTime: '',
      createdOn: '15/01/2025 10:59 AM',
      createdBy: 'Abdul A'
    }
  ];

  const [filteredStaff, setFilteredStaff] = useState<SupportStaffData[]>(sampleStaff);

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);

  useEffect(() => {
    const filtered = sampleStaff.filter(staff =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStaff(filtered);
  }, [searchTerm]);

  const iconOptions = [
    { id: '1', icon: '📦', name: 'Package' },
    { id: '2', icon: '📦', name: 'Delivery Box' },
    { id: '3', icon: '🛒', name: 'Shopping Cart' },
    { id: '4', icon: '🏥', name: 'Medical' },
    { id: '5', icon: '👶', name: 'Baby Care' },
    { id: '6', icon: '🧑‍⚕️', name: 'Nurse' },
    { id: '7', icon: '💬', name: 'Communication' },
    { id: '8', icon: '🧳', name: 'Luggage' },
    { id: '9', icon: '💨', name: 'Hair Dryer' },
    { id: '10', icon: '📦', name: 'Box' },
    { id: '11', icon: '🌊', name: 'Washing' },
    { id: '12', icon: '🏗️', name: 'Construction' },
    { id: '13', icon: '💳', name: 'Payment' },
    { id: '14', icon: '➕', name: 'Medical Plus' },
    { id: '15', icon: '👨‍💼', name: 'Business' },
    { id: '16', icon: '🏛️', name: 'Government' },
    { id: '17', icon: '💼', name: 'Work' },
    { id: '18', icon: '🧑‍🍳', name: 'Chef' },
    { id: '19', icon: '👨‍💼', name: 'Manager' },
    { id: '20', icon: '📦', name: 'Storage' },
    { id: '21', icon: '👩‍💻', name: 'Receptionist' },
    { id: '22', icon: '👨‍🔧', name: 'Technician' },
    { id: '23', icon: '👩‍⚕️', name: 'Female Doctor' },
    { id: '24', icon: '👩‍🏫', name: 'Teacher' },
    { id: '25', icon: '🧑‍🚒', name: 'Worker' },
    { id: '26', icon: '⚙️', name: 'Settings' },
    { id: '27', icon: '📦', name: 'Package Delivery' },
    { id: '28', icon: '👨‍🔧', name: 'Maintenance' },
    { id: '29', icon: '👩‍🍳', name: 'Female Chef' },
    { id: '30', icon: '👩‍💼', name: 'Female Manager' },
    { id: '31', icon: '👩‍🏭', name: 'Factory Worker' },
    { id: '32', icon: '⚙️', name: 'Engineering' }
  ];

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setFormData({
      categoryName: '',
      days: '',
      hours: '',
      minutes: '',
      selectedIcons: []
    });
  };

  const handleIconToggle = (iconId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedIcons: prev.selectedIcons.includes(iconId)
        ? prev.selectedIcons.filter(id => id !== iconId)
        : [...prev.selectedIcons, iconId]
    }));
  };

  const handleSubmit = () => {
    if (!formData.categoryName) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Support staff category created successfully",
    });
    handleModalClose();
  };

  const handleEdit = (staffId: string) => {
    navigate(`/security/visitor-management/support-staff/edit/${staffId}`);
  };

  const handleDelete = (staffId: string) => {
    console.log(`Deleting support staff: ${staffId}`);
    toast({
      title: "Delete Support Staff",
      description: `Staff ID: ${staffId} deletion requested`,
    });
  };

  return (
    <>
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
          <Button variant="outline" size="icon" className="border-gray-300">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="border-gray-300">
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f6f4ee]">
              <TableHead className="w-20">S.No.</TableHead>
              <TableHead className="w-20">Actions</TableHead>
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead className="w-40">Estimated time</TableHead>
              <TableHead className="w-48">Created On</TableHead>
              <TableHead className="w-40">Created By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map((staff) => (
              <TableRow key={staff.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {staff.sNo}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(staff.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                    </button>
                    <button
                      onClick={() => handleDelete(staff.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {staff.name}
                </TableCell>
                <TableCell className="text-gray-500">
                  {staff.estimatedTime || '--'}
                </TableCell>
                <TableCell>{staff.createdOn}</TableCell>
                <TableCell>{staff.createdBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Showing results count */}
      <div className="mt-4 text-sm text-gray-600">
        Showing 1 to {filteredStaff.length} of {filteredStaff.length} rows
      </div>
      </div>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Create</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleModalClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Category Name Input */}
            <div>
              <TextField
                placeholder="Enter Category Name"
                value={formData.categoryName}
                onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                fullWidth
                variant="outlined"
                size="small"
                sx={fieldStyles}
              />
            </div>


            {/* Time Inputs */}
            <div className="grid grid-cols-3 gap-4">
              <TextField
                placeholder="Days"
                value={formData.days}
                onChange={(e) => setFormData({...formData, days: e.target.value})}
                variant="outlined"
                size="small"
                sx={fieldStyles}
              />
              <TextField
                placeholder="Hrs"
                value={formData.hours}
                onChange={(e) => setFormData({...formData, hours: e.target.value})}
                variant="outlined"
                size="small"
                sx={fieldStyles}
              />
              <TextField
                placeholder="Min"
                value={formData.minutes}
                onChange={(e) => setFormData({...formData, minutes: e.target.value})}
                variant="outlined"
                size="small"
                sx={fieldStyles}
              />
            </div>

            {/* Icon Selection Grid */}
            <div className="grid grid-cols-6 gap-4">
              {iconOptions.map((option) => (
                <div
                  key={option.id}
                  className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                    formData.selectedIcons.includes(option.id)
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleIconToggle(option.id)}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="text-xs text-center">{option.name}</div>
                  {formData.selectedIcons.includes(option.id) && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-6"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};