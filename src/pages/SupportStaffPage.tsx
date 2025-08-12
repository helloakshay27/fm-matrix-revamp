import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search, RefreshCw, Grid3X3, Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

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
    const filtered = sampleStaff.filter(staff =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStaff(filtered);
  }, [searchTerm]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStaff(filteredStaff.map(staff => staff.id));
    } else {
      setSelectedStaff([]);
    }
  };

  const handleSelectStaff = (staffId: string, checked: boolean) => {
    if (checked) {
      setSelectedStaff(prev => [...prev, staffId]);
    } else {
      setSelectedStaff(prev => prev.filter(id => id !== staffId));
    }
  };

  const handleView = (staffId: string) => {
    console.log(`Viewing support staff: ${staffId}`);
    toast({
      title: "View Support Staff",
      description: `Viewing details for staff ID: ${staffId}`,
    });
  };

  const handleEdit = (staffId: string) => {
    console.log(`Editing support staff: ${staffId}`);
    toast({
      title: "Edit Support Staff",
      description: `Editing staff ID: ${staffId}`,
    });
  };

  const handleDelete = (staffId: string) => {
    console.log(`Deleting support staff: ${staffId}`);
    toast({
      title: "Delete Support Staff",
      description: `Staff ID: ${staffId} deletion requested`,
    });
  };

  const handleAdd = () => {
    console.log('Adding new support staff');
    toast({
      title: "Add Support Staff",
      description: "Opening add new support staff form",
    });
  };

  return (
    <div className="p-6 min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Support Staff</h1>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleAdd}
            className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search support staff..."
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
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedStaff.length === filteredStaff.length && filteredStaff.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-20">S.No.</TableHead>
              <TableHead className="w-32">Action</TableHead>
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead className="w-40">Estimated time</TableHead>
              <TableHead className="w-48">Created On</TableHead>
              <TableHead className="w-40">Created By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map((staff) => (
              <TableRow key={staff.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox 
                    checked={selectedStaff.includes(staff.id)}
                    onCheckedChange={(checked) => handleSelectStaff(staff.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {staff.sNo}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleView(staff.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="View"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleEdit(staff.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-600 hover:text-blue-600" />
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

      {/* Selection Info */}
      {selectedStaff.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          {selectedStaff.length} support staff selected
        </div>
      )}

      {/* Showing results count */}
      <div className="mt-4 text-sm text-gray-600">
        Showing 1 to {filteredStaff.length} of {filteredStaff.length} rows
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-600">
          <span>Powered by</span>
          <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
          <span className="font-semibold text-gray-800">LOCKATED</span>
        </div>
      </div>
    </div>
  );
};