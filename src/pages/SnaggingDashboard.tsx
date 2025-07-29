import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Filter } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SnaggingFilterDialog } from '@/components/SnaggingFilterDialog';
import { SearchWithSuggestions } from '@/components/SearchWithSuggestions';

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

  const checklistSuggestions = Array.from(new Set(mockData.map(item => item.checklistName))).sort();

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
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setAppliedFilters(filters);
  };

  return (
    <div className="p-4 sm:p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">SNAG LIST</h1>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-3 mb-6">
          <SearchWithSuggestions
            placeholder="Search"
            onSearch={handleSearch}
            suggestions={checklistSuggestions}
            className="w-full sm:w-[290px]"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => handleSearch(searchTerm)}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 sm:px-6 py-2 h-[36px] text-sm font-medium"
            >
              Search
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white px-4 py-2 h-[36px] text-sm font-medium"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* View title */}
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">
            {activeView === 'User Snag' ? 'User Snagging Items' : 'My Snagging Items'}
          </h2>
        </div>

        {/* Table - Responsive */}
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 text-xs sm:text-sm">
                <TableHead>Sr.no.</TableHead>
                <TableHead>Checklist Name</TableHead>
                <TableHead>Tower</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Flat</TableHead>
                <TableHead>Room Type</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>No. Of Questions</TableHead>
                <TableHead>View Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-gray-50 text-xs sm:text-sm">
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
