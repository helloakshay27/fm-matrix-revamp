
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SnaggingItem {
  id: number;
  checklistName: string;
  tower: string;
  floor: string;
  flat: string;
  roomType: string;
  stage: string;
  noOfQuestions: number;
}

const mockData: SnaggingItem[] = [
  { id: 1, checklistName: 'civil point', tower: 'A', floor: '3rd', flat: '301', roomType: 'Living Room', stage: 'Units Snagging', noOfQuestions: 6 },
  { id: 2, checklistName: 'plumbing', tower: 'A', floor: '1st', flat: '101', roomType: 'Living Room Balcony', stage: 'Units Snagging', noOfQuestions: 1 },
  { id: 3, checklistName: 'cleaning checklist', tower: 'A', floor: '6th', flat: '601', roomType: 'Living Room', stage: 'Units Snagging', noOfQuestions: 1 },
  { id: 4, checklistName: 'XYZ checklist', tower: 'B', floor: '5th', flat: '501', roomType: 'Living Room', stage: 'Units Snagging', noOfQuestions: 1 },
  { id: 5, checklistName: 'gdydy', tower: 'A', floor: '1st', flat: '103', roomType: 'Living Room', stage: 'Units Snagging', noOfQuestions: 1 },
  { id: 6, checklistName: 'electrical checkpoint', tower: 'A', floor: '3rd', flat: '301', roomType: 'Living Room', stage: 'Units Snagging', noOfQuestions: 1 },
  { id: 7, checklistName: 'Electrical Checklist', tower: 'A', floor: '8th', flat: '801', roomType: 'Living Room', stage: 'Units Snagging', noOfQuestions: 1 },
  { id: 8, checklistName: 'Living room', tower: 'A', floor: '1st', flat: '101', roomType: 'Common Checklist', stage: 'Units Snagging', noOfQuestions: 1 }
];

export const SnaggingDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('User Snag');
  const navigate = useNavigate();

  const filteredData = mockData.filter(item =>
    item.checklistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tower.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.flat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetail = (item: SnaggingItem) => {
    navigate(`/transitioning/snagging/details/${item.id}`, { state: { item } });
  };

  const handleSearch = () => {
    // Search functionality is already handled by the filter
    console.log('Search triggered for:', searchTerm);
  };

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">SNAG LIST</h1>
          
          {/* Dropdown Navigation */}
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  {activeView}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border shadow-lg">
                <DropdownMenuItem 
                  onClick={() => setActiveView('User Snag')}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  User Snag
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setActiveView('My Snags')}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  My Snags
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Search Section */}
        <div className="flex gap-3 mb-6">
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Button 
            onClick={handleSearch}
            style={{ backgroundColor: '#C72030' }}
            className="hover:bg-[#C72030]/90 text-white"
          >
            Search
          </Button>
        </div>

        {/* Content based on active view */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            {activeView === 'User Snag' ? 'User Snagging Items' : 'My Snagging Items'}
          </h2>
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
    </div>
  );
};
