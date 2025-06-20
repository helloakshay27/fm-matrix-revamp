
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SnaggingFilterDialog } from '@/components/SnaggingFilterDialog';

interface MySnagItem {
  id: number;
  checklistName: string;
  tower: string;
  floor: string;
  flat: string;
  roomType: string;
  stage: string;
  noOfQuestions: number;
  status: string;
}

const mySnagData: MySnagItem[] = [
  { id: 1, checklistName: 'electrical point', tower: 'A', floor: '2nd', flat: '201', roomType: 'Bedroom', stage: 'Units Snagging', noOfQuestions: 4, status: 'In Progress' },
  { id: 2, checklistName: 'water leakage', tower: 'B', floor: '4th', flat: '401', roomType: 'Bathroom', stage: 'Units Snagging', noOfQuestions: 2, status: 'Completed' },
  { id: 3, checklistName: 'door fitting', tower: 'A', floor: '3rd', flat: '302', roomType: 'Living Room', stage: 'Units Snagging', noOfQuestions: 3, status: 'Pending' },
];

export const MySnagPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(mySnagData);
  const navigate = useNavigate();

  const handleSearch = () => {
    const filtered = mySnagData.filter(item =>
      item.checklistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tower.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.flat.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    console.log('Search triggered for:', searchTerm);
  };

  const handleFilterApply = (filters: any) => {
    let filtered = mySnagData;
    
    if (filters.tower) {
      filtered = filtered.filter(item => item.tower === filters.tower);
    }
    if (filters.floor) {
      filtered = filtered.filter(item => item.floor === filters.floor);
    }
    if (filters.flat) {
      filtered = filtered.filter(item => item.flat === filters.flat);
    }
    if (filters.stage) {
      filtered = filtered.filter(item => item.stage.toLowerCase().includes(filters.stage.toLowerCase()));
    }
    
    setFilteredData(filtered);
    console.log('Applied filters:', filters);
  };

  const handleViewDetail = (item: MySnagItem) => {
    navigate(`/transitioning/my-snags/details/${item.id}`, { state: { item } });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Completed': 'bg-green-500 text-white',
      'In Progress': 'bg-blue-500 text-white',
      'Pending': 'bg-yellow-500 text-white'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs ${statusColors[status as keyof typeof statusColors] || 'bg-gray-500 text-white'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">MY SNAGS</h1>
        
        {/* Filters and Search Section */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => setIsFilterOpen(true)}
            style={{ backgroundColor: '#C72030' }}
            className="hover:opacity-90 text-white flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>

          <div className="flex gap-3">
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Button 
              onClick={handleSearch}
              style={{ backgroundColor: '#C72030' }}
              className="hover:opacity-90 text-white"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Sr.no.</TableHead>
                <TableHead className="font-semibold">Checklist Name</TableHead>
                <TableHead className="font-semibold">Tower</TableHead>
                <TableHead className="font-semibold">Floor</TableHead>
                <TableHead className="font-semibold">Flat</TableHead>
                <TableHead className="font-semibold">Room Type</TableHead>
                <TableHead className="font-semibold">Stage</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">No. Of Questions</TableHead>
                <TableHead className="font-semibold">View Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.checklistName}</TableCell>
                  <TableCell>{item.tower}</TableCell>
                  <TableCell>{item.floor}</TableCell>
                  <TableCell>{item.flat}</TableCell>
                  <TableCell>{item.roomType}</TableCell>
                  <TableCell>{item.stage}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{item.noOfQuestions}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetail(item)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Filter Dialog */}
      <SnaggingFilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        onApply={handleFilterApply}
      />
    </div>
  );
};
