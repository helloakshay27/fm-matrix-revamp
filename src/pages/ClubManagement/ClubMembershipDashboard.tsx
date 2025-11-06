import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Plus, Download, Filter, QrCode, MoreVertical, Edit, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { useDebounce } from '@/hooks/useDebounce';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface MembershipData {
  id: number;
  tower: string;
  flat: string;
  name: string;
  age: number;
  gender: string;
  mobile: string;
  email: string;
  relationWithOwner: string;
  residentType: string;
  membershipNumber: string;
  startDate: string;
  endDate: string;
  membershipStatus: string;
  cardAllocated: boolean;
  accessCard: string;
  idCard: string;
  residentPhoto: string;
  attachments: string[];
  createdOn: string;
}

export const ClubMembershipDashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [memberships, setMemberships] = useState<MembershipData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const isSearchingRef = useRef(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    tower: '',
    residentType: '',
    membershipStatus: '',
    dateRange: ''
  });
  
  const perPage = 20;

  // Fetch memberships data
  const fetchMemberships = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/club-management/memberships', {
      //   params: {
      //     page,
      //     per_page: perPage,
      //     search: searchQuery,
      //     ...filters
      //   }
      // });
      
      // Mock data for now
      const mockData: MembershipData[] = [
        {
          id: 1,
          tower: 'Tower 9',
          flat: 'T9-2503',
          name: 'Jyoti Nikam',
          age: 39,
          gender: 'Female',
          mobile: '7977963223',
          email: 'jyoti.endtm@gmail.com',
          relationWithOwner: 'Sister',
          residentType: 'Owner',
          membershipNumber: '3040-1555A',
          startDate: '31/10/2025',
          endDate: '30/10/2026',
          membershipStatus: 'Approved',
          cardAllocated: true,
          accessCard: 'Not Available',
          idCard: 'Not Available',
          residentPhoto: '/placeholder.jpg',
          attachments: [],
          createdOn: '31/10/2025'
        },
        {
          id: 2,
          tower: 'T3-PINE',
          flat: 'T3-A-0901',
          name: 'Vikas Gupta',
          age: 32,
          gender: 'Male',
          mobile: '8097638947',
          email: 'vikas.gupta@gmail.com',
          relationWithOwner: 'Self',
          residentType: 'Owner',
          membershipNumber: '3040-1465T',
          startDate: '30/10/2025',
          endDate: '',
          membershipStatus: 'Pending EndDate',
          cardAllocated: false,
          accessCard: 'Not Available',
          idCard: 'Not Available',
          residentPhoto: '/placeholder.jpg',
          attachments: [],
          createdOn: '30/10/2025'
        },
        {
          id: 3,
          tower: 'T1-PALM',
          flat: 'T1-1702',
          name: 'Sejadh Singh',
          age: 0,
          gender: '',
          mobile: '9986310520',
          email: 'sejadh.singh@gmail.com',
          relationWithOwner: '',
          residentType: 'Tenant',
          membershipNumber: '3040-1452',
          startDate: '29/10/2025',
          endDate: '28/10/2026',
          membershipStatus: 'Approved',
          cardAllocated: true,
          accessCard: 'Not Available',
          idCard: 'Not Available',
          residentPhoto: '/placeholder.jpg',
          attachments: [],
          createdOn: '29/10/2025'
        }
      ];
      
      setMemberships(mockData);
      setTotalMembers(mockData.length);
      setTotalPages(Math.ceil(mockData.length / perPage));
      
    } catch (error) {
      console.error('Error fetching memberships:', error);
      toast.error('Failed to fetch membership data');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, perPage]);

  // Handle search input change
  const handleSearch = useCallback((query: string) => {
    isSearchingRef.current = true;
    setSearchQuery(query);
  }, []);

  // Effect to handle debounced search
  useEffect(() => {
    const currentSearch = filters.tower || ''; // Use tower as search filter for now
    const newSearch = debouncedSearchQuery.trim();

    if (currentSearch === newSearch) {
      return;
    }

    setFilters(prevFilters => ({
      ...prevFilters,
      tower: newSearch
    }));

    if (isSearchingRef.current || (newSearch && !currentSearch)) {
      setCurrentPage(1);
      isSearchingRef.current = false;
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    fetchMemberships(currentPage);
  }, [currentPage, filters, fetchMemberships]);

  // Handle export
  const handleExport = async () => {
    try {
      toast.loading('Preparing export file...');
      
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/club-management/memberships/export', {
      //   responseType: 'blob'
      // });
      
      // Mock export
      setTimeout(() => {
        toast.success('Export completed successfully');
      }, 1000);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  // Handle download society QR
  const handleDownloadSocietyQR = async () => {
    try {
      toast.loading('Generating Society QR Code...');
      
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/club-management/society-qr', {
      //   responseType: 'blob'
      // });
      
      // Mock download
      setTimeout(() => {
        toast.success('Society QR Code downloaded successfully');
      }, 1000);
      
    } catch (error) {
      console.error('Error downloading Society QR:', error);
      toast.error('Failed to download Society QR');
    }
  };

  // Handle filter apply
  const handleFilterApply = () => {
    setCurrentPage(1);
    fetchMemberships(1);
    setIsFilterOpen(false);
  };

  // Handle member selection
  const handleMemberSelection = (memberIdString: string, isSelected: boolean) => {
    const memberId = parseInt(memberIdString);
    setSelectedMembers(prev => 
      isSelected 
        ? [...prev, memberId]
        : prev.filter(id => id !== memberId)
    );
  };

  // Handle select all
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allMemberIds = memberships.map(m => m.id);
      setSelectedMembers(allMemberIds);
    } else {
      setSelectedMembers([]);
    }
  };

  // Handle clear selection
  const handleClearSelection = () => {
    setSelectedMembers([]);
  };

  // Render membership status badge
  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      'Approved': { color: 'bg-green-100 text-green-800', icon: '✓' },
      'Pending EndDate': { color: 'bg-red-100 text-red-800', icon: '⏱' },
      'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      'Rejected': { color: 'bg-gray-100 text-gray-800', icon: '✗' }
    };

    const config = statusConfig[status] || statusConfig['Pending'];
    
    return (
      <Badge className={`${config.color} border-0`}>
        {status}
      </Badge>
    );
  };

  // Render card allocated toggle
  const renderCardAllocated = (allocated: boolean) => {
    return (
      <div className="flex items-center justify-center">
        <div className={`w-10 h-5 rounded-full relative transition-colors ${allocated ? 'bg-green-500' : 'bg-gray-300'}`}>
          <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${allocated ? 'right-0.5' : 'left-0.5'}`} />
        </div>
      </div>
    );
  };

  // Define columns for EnhancedTable
  const columns = [
    { key: 'actions', label: 'Actions', sortable: false },
    { key: 'tower', label: 'Tower', sortable: true },
    { key: 'flat', label: 'Flat', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
    { key: 'gender', label: 'Gender', sortable: true },
    { key: 'mobile', label: 'Mobile', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'relationWithOwner', label: 'Relation With Owner', sortable: true },
    { key: 'residentType', label: 'Resident Type', sortable: true },
    { key: 'membershipNumber', label: 'Membership Number', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'endDate', label: 'End Date', sortable: true },
    { key: 'membershipStatus', label: 'Membership Status', sortable: true },
    { key: 'cardAllocated', label: 'Card Allocated', sortable: true },
    { key: 'accessCard', label: 'Access Card', sortable: true },
    { key: 'idCard', label: 'ID Card', sortable: true },
    { key: 'residentPhoto', label: "Resident's Photo", sortable: false },
    { key: 'attachments', label: 'Attachments', sortable: false },
    { key: 'createdOn', label: 'Created On', sortable: true }
  ];

  // Render cell content
  const renderCell = (item: MembershipData, columnKey: string) => {
    if (columnKey === 'actions') {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/club-management/membership/${item.id}`)}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/club-management/membership/${item.id}/edit`)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (columnKey === 'membershipStatus') {
      return renderStatusBadge(item.membershipStatus);
    }

    if (columnKey === 'residentType') {
      return <Badge variant="outline">{item.residentType}</Badge>;
    }

    if (columnKey === 'cardAllocated') {
      return renderCardAllocated(item.cardAllocated);
    }

    if (columnKey === 'residentPhoto') {
      return item.residentPhoto ? (
        <img 
          src={item.residentPhoto} 
          alt="Resident" 
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-xs text-gray-500">No Photo</span>
        </div>
      );
    }

    if (columnKey === 'attachments') {
      return item.attachments.length > 0 ? (
        <Button variant="link" size="sm">
          View ({item.attachments.length})
        </Button>
      ) : '-';
    }

    if (columnKey === 'age' && !item.age) return '-';
    if (columnKey === 'gender' && !item.gender) return '-';
    if (columnKey === 'relationWithOwner' && !item.relationWithOwner) return '-';
    if (columnKey === 'endDate' && !item.endDate) return '-';
    
    if (!item[columnKey] || item[columnKey] === null || item[columnKey] === '') {
      return '--';
    }
    
    return item[columnKey];
  };

  // Custom left actions
  const renderCustomActions = () => (
    <div className="flex gap-3">
      <Button
        className="bg-[#C72030] hover:bg-[#A01020] text-white"
        onClick={() => navigate('/club-management/membership/add')}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </div>
  );

  // Custom right actions
  const renderRightActions = () => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={handleDownloadSocietyQR}
        className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
      >
        <QrCode className="w-4 h-4 " />
      </Button>
    </div>
  );

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Club Membership</h1>
        <p className="text-sm text-gray-500 mt-1">
          Total Members: {totalMembers.toLocaleString()}
        </p>
      </div>

      {/* Memberships Table */}
      <div className="overflow-x-auto animate-fade-in">
        {searchLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-center">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Searching members...</span>
            </div>
          </div>
        )}
        <EnhancedTable
          data={memberships || []}
          columns={columns}
          renderCell={renderCell}
          selectable={true}
          pagination={false}
          enableExport={true}
          exportFileName="club-memberships"
          handleExport={handleExport}
          storageKey="club-memberships-table"
          enableSelection={true}
          selectedItems={selectedMembers.map(id => id.toString())}
          onSelectItem={handleMemberSelection}
          onSelectAll={handleSelectAll}
          getItemId={(member) => member.id.toString()}
          leftActions={
            <div className="flex gap-3">
              {renderCustomActions()}
            </div>
          }
          onFilterClick={() => setIsFilterOpen(true)}
          rightActions={renderRightActions()}
          searchPlaceholder="Search Members"
          onSearchChange={handleSearch}
          hideTableExport={false}
          hideColumnsButton={false}
          className="transition-all duration-500 ease-in-out"
          loading={loading}
          loadingMessage="Loading members..."
        />

        {/* Custom Pagination */}
        <div className="flex items-center justify-center mt-6 px-4 py-3 bg-white border-t border-gray-200 animate-fade-in">
          <div className="flex items-center space-x-1">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading || searchLoading}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {/* First page */}
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={loading || searchLoading}
                    className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                  >
                    1
                  </button>
                  {currentPage > 4 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                </>
              )}

              {/* Previous pages */}
              {currentPage > 2 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 2)}
                  disabled={loading || searchLoading}
                  className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  {currentPage - 2}
                </button>
              )}

              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={loading || searchLoading}
                  className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  {currentPage - 1}
                </button>
              )}

              {/* Current page */}
              <button
                disabled
                className="w-8 h-8 flex items-center justify-center text-sm font-medium bg-[#C72030] text-white rounded"
              >
                {currentPage}
              </button>

              {/* Next pages */}
              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={loading || searchLoading}
                  className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  {currentPage + 1}
                </button>
              )}

              {currentPage < totalPages - 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage + 2)}
                  disabled={loading || searchLoading}
                  className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  {currentPage + 2}
                </button>
              )}

              {/* Last page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={loading || searchLoading}
                    className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || loading || searchLoading}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Page Info */}
          <div className="ml-4 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubMembershipDashboard;
