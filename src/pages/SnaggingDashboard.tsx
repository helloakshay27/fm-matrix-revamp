import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Filter } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SnaggingFilterDialog } from '@/components/SnaggingFilterDialog';
import { SearchWithSuggestions } from '@/components/SearchWithSuggestions';
import { apiClient } from '@/utils/apiClient';
import { API_CONFIG } from '@/config/apiConfig';

interface SnaggingItem {
  id: number;
  name: string;
  snag_audit_category: string;
  questions_count: number;
  check_type: string;
  active: number;
}

export const SnaggingDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('User Snag');
  const [showFilters, setShowFilters] = useState(false);
  const [snaggingData, setSnaggingData] = useState<SnaggingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const checklistSuggestions = Array.from(new Set(snaggingData.map(item => item.name))).sort();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const view = searchParams.get('view');
    if (view === 'my') {
      setActiveView('My Snags');
    } else {
      setActiveView('User Snag');
    }
  }, [location.search]);

  useEffect(() => {
    fetchSnaggingData();
  }, []);

  const fetchSnaggingData = async () => {
    try {
      setLoading(true);
      // Get the site_id from localStorage or use a default value
      const siteId = localStorage.getItem('site_id') || '2189';
      const response = await apiClient.get(`/pms/admin/snag_checklists.json?site_id=${siteId}`);
      console.log('Snagging data response:', response.data);
      setSnaggingData(response.data || []);
    } catch (error) {
      console.error('Error fetching snagging data:', error);
      setSnaggingData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data: SnaggingItem[]) => {
    return data.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.snag_audit_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.check_type.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  };

  const filteredData = applyFilters(snaggingData);

  const handleViewDetail = (item: SnaggingItem) => {
    navigate(`/transitioning/snagging/details/${item.id}`, { state: { item } });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
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
          </div>
        </div>

        {/* View title */}
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">
            {activeView === 'User Snag' ? 'User Snagging Items' : 'My Snagging Items'}
          </h2>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          /* Table - Responsive */
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 text-xs sm:text-sm">
                  <TableHead>Sr.no.</TableHead>
                  <TableHead>Survey List</TableHead>
                  <TableHead>Ticket Category</TableHead>
                  <TableHead>No. of Association</TableHead>
                  <TableHead>Check Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>View Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 text-xs sm:text-sm">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.snag_audit_category}</TableCell>
                    <TableCell>{item.questions_count}</TableCell>
                    <TableCell>{item.check_type}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${item.active === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.active === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
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
        )}
      </div>
    </div>
  );
};
