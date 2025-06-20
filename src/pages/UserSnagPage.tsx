
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SnaggingFilterDialog } from '@/components/SnaggingFilterDialog';

interface SnaggingItem {
  id: number;
  checklistName: string;
  tower: string;
  floor: string;
  flat: string;
  roomType: string;
  stage: string;
  noOfQuestions: number;
  createdBy: string;
}

const mockData: SnaggingItem[] = [
  { id: 1, checklistName: 'civil point', tower: 'A', floor: '3rd', flat: '301', roomType: 'Living Room', stage: 'Units Snagging', noOfQuestions: 6, createdBy: 'G Emerald Inspector' },
  { id: 2, checklistName: 'plumbing', tower: 'A', floor: '1st', flat: '101', roomType: 'Living Room Balcony', stage: 'Units Snagging', noOfQuestions: 1, createdBy: 'G Emerald Inspector' },
  { id: 3, checklistName: 'cleaning checklist', tower: 'A', floor: '6th', flat: '601', roomType: 'Living Room', stage: 'Units Snagging', noOfQuestions: 1, createdBy: 'G Emerald Inspector' },
  { id: 4, checklistName: 'XYZ checklist', tower: 'B', floor: '5th', flat: '501', roomType: 'Living Room', stage: 'Units Snagging', noOfQuestions: 1, createdBy: 'G Emerald Inspector' },
  { id: 5, checklistName: 'gdydy', tower: 'A', floor: '1st', flat: '103', roomType: 'Living Room', stage: 'Units Snagging', noOfQuestions: 1, createdBy: 'G Emerald Inspector' },
  { id: 6, checklistName: 'electrical checkpoint', tower: 'A', floor: '3rd', flat: '301', roomType: 'Living Room', stage: 'Units Snagging', noOfQuestions: 1, createdBy: 'G Emerald Inspector' },
  { id: 7, checklistName: 'Electrical Checklist', tower: 'A', floor: '8th', flat: '801', roomType: 'Living Room', stage: 'Units Snagging', noOfQuestions: 1, createdBy: 'G Emerald Inspector' },
  { id: 8, checklistName: 'Living room', tower: 'A', floor: '1st', flat: '101', roomType: 'Common Checklist', stage: 'Units Snagging', noOfQuestions: 1, createdBy: 'G Emerald Inspector' }
];

export const UserSnagPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(mockData);
  const navigate = useNavigate();

  const handleSearch = () => {
    const filtered = mockData.filter(item =>
      item.checklistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tower.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.flat.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    console.log('Search triggered for:', searchTerm);
  };

  const handleFilterApply = (filters: any) => {
    let filtered = mockData;
    
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

  const handleViewDetail = (item: SnaggingItem) => {
    navigate(`/transitioning/snagging/details/${item.id}`, { state: { item } });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">SNAG LIST</h1>
        
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
                <TableHead className="font-semibold">Created By</TableHead>
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
                  <TableCell>{item.createdBy}</TableCell>
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
