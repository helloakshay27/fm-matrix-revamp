import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SnaggingFilterDialog } from '@/components/SnaggingFilterDialog';
import { SearchWithSuggestions } from '@/components/SearchWithSuggestions';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';

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

interface FilterValues {
  tower: string;
  floor: string;
  flat: string;
  stage: string;
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
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({
    tower: '',
    floor: '',
    flat: '',
    stage: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Generate suggestions from the mock data
  const suggestions = useSearchSuggestions({
    data: mockData,
    searchFields: ['checklistName', 'tower', 'floor', 'flat', 'roomType', 'stage']
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const view = searchParams.get('view');
    if (view === 'my') {
      setActiveView('My Snags');
    } else {
      setActiveView('User Snag');
    }
  }, [location.search]);

  const applyFilters = (data: SnaggingItem[]) => {
    return data.filter(item => {
      const matchesSearch = item.checklistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tower.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.flat.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTower = !appliedFilters.tower || item.tower === appliedFilters.tower;
      const matchesFloor = !appliedFilters.floor || item.floor === appliedFilters.floor;
      const matchesFlat = !appliedFilters.flat || item.flat === appliedFilters.flat;
      const matchesStage = !appliedFilters.stage || item.stage === appliedFilters.stage;

      return matchesSearch && matchesTower && matchesFloor && matchesFlat && matchesStage;
    });
  };

  const filteredData = applyFilters(mockData);

  const handleViewDetail = (item: SnaggingItem) => {
    navigate(`/transitioning/snagging/details/${item.id}`, { state: { item } });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    console.log('Search triggered for:', value);
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setAppliedFilters(filters);
  };

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">SNAG LIST</h1>
        
        {/* Search Section with Filters Button */}
        <div className="flex gap-3 mb-6">
          <SearchWithSuggestions
            placeholder="Search"
            onSearch={handleSearch}
            suggestions={suggestions}
            className="max-w-md"
          />
          <Button 
            onClick={() => handleSearch(searchTerm)}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
          >
            Search
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2"
          >
            <span className="text-sm">⊞</span>
            Filters
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

      {/* Filters Dialog */}
      <SnaggingFilterDialog
        open={showFilters}
        onOpenChange={setShowFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
