
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Filter, Eye, Edit, FileText, QrCode, Search, Trash2 } from 'lucide-react';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { StaffsFilterModal } from '@/components/StaffsFilterModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { fetchSocietyStaffs, searchSocietyStaffs, SocietyStaff, PaginationInfo } from '@/services/societyStaffsAPI';
import { staffService } from '@/services/staffService';
import { toast } from 'sonner';

// Sample data for different views
const allStaffsData = [
  {
    id: '38969',
    name: 'Avdesh Tiwari',
    unit: '512',
    department: 'Operations',
    email: 'avdesh.tiwari@example.com',
    mobile: '9987654390',
    workType: 'Other',
    vendorName: '',
    status: 'Approved',
    validTill: '01/02/2023',
    checkIn: null,
    checkOut: null,
    isIn: false
  },
  {
    id: '37764',
    name: 'Avdesh Tiwari',
    unit: 'HELP DESK',
    department: 'HR',
    email: 'avdesh.tiwari@vodafoneidea.com',
    mobile: '9876567665',
    workType: 'Vendor',
    vendorName: '',
    status: 'Approved',
    validTill: '01/02/2023',
    checkIn: '28/07/2023 3:47 PM',
    checkOut: '28/07/2023 3:48 PM',
    isIn: true
  },
  {
    id: '37143',
    name: 'Sohail Ansari',
    unit: 'HELP DESK',
    department: 'Operations',
    email: '',
    mobile: '7715088437',
    workType: 'Other',
    vendorName: '',
    status: 'Approved',
    validTill: '01/02/2023',
    checkIn: '28/07/2023 3:45 PM',
    checkOut: '28/07/2023 3:47 PM',
    isIn: true
  },
  {
    id: '36954',
    name: 'Chandan Kumar',
    unit: 'Reception',
    department: 'ACCOUNTS',
    email: 'chandanthakur22988@gmail.com',
    mobile: '8489599800',
    workType: 'Other',
    vendorName: '',
    status: 'Approved',
    validTill: '01/02/2023',
    checkIn: null,
    checkOut: null,
    isIn: false
  }
];

const historyData = [
  {
    name: 'Jems J',
    mobile: '9483728392',
    workType: 'Vendor',
    unit: '',
    department: '',
    vendorName: '',
    validTill: '01/02/2023',
    checkIn: '28/07/2023 3:47 PM',
    checkOut: '28/07/2023 3:48 PM',
    gate: 'Gate'
  },
  {
    name: 'Jems J',
    mobile: '9483728392',
    workType: 'Vendor',
    unit: '',
    department: '',
    vendorName: '',
    validTill: '01/02/2023',
    checkIn: '28/07/2023 3:45 PM',
    checkOut: '28/07/2023 3:47 PM',
    gate: 'Gate'
  }
];

// Column configuration for the enhanced table
const columns: ColumnConfig[] = [
  { key: 'actions', label: 'Action', sortable: false, hideable: false, draggable: false },
  { key: 'id', label: 'Staff ID', sortable: true, hideable: true, draggable: true },
  { key: 'name', label: 'Name', sortable: true, hideable: true, draggable: true },
  { key: 'unit', label: 'Unit', sortable: true, hideable: true, draggable: true },
  { key: 'department', label: 'Department', sortable: true, hideable: true, draggable: true },
  { key: 'email', label: 'Email', sortable: true, hideable: true, draggable: true },
  { key: 'mobile', label: 'Mobile', sortable: true, hideable: true, draggable: true },
  { key: 'workType', label: 'Work Type', sortable: true, hideable: true, draggable: true },
  { key: 'vendorName', label: 'Vendor Name', sortable: true, hideable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
  { key: 'validTill', label: 'Valid Till', sortable: true, hideable: true, draggable: true },
  { key: 'checkIn', label: 'Check In', sortable: true, hideable: true, draggable: true },
  { key: 'checkOut', label: 'Check Out', sortable: true, hideable: true, draggable: true }
];

const getStatusBadgeColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-600 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-600 border-yellow-200';
    case 'rejected':
      return 'bg-red-100 text-red-600 border-red-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

export const StaffsDashboard = () => {
  const navigate = useNavigate();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaffs, setSelectedStaffs] = useState<string[]>([]);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
  
  // API state management
  const [apiStaffsData, setApiStaffsData] = useState<SocietyStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    total_count: 0,
    total_pages: 1
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch staff data from API
  useEffect(() => {
    const loadStaffsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching society staffs data:');
        console.log('  - Current page (local state):', currentPage);
        console.log('  - Active search query:', activeSearchQuery);
        
        let response;
        if (activeSearchQuery.trim()) {
          // Use search API when there's an active search query
          console.log('🔍 Using search API');
          response = await searchSocietyStaffs(activeSearchQuery, currentPage);
        } else {
          // Use regular fetch API when no search
          console.log('📋 Using regular fetch API');
          response = await fetchSocietyStaffs(currentPage);
        }
        
        console.log('📊 API Response:', {
          totalCount: response.pagination.total_count,
          totalPages: response.pagination.total_pages,
          currentPageFromAPI: response.pagination.current_page,
          staffsCount: response.society_staffs.length
        });
        
        setApiStaffsData(response.society_staffs);
        setPagination(response.pagination);
      } catch (err) {
        console.error('❌ Error loading staffs data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load staffs data');
        toast.error('Failed to load staffs data');
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };

    loadStaffsData();
  }, [currentPage, activeSearchQuery]);

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      console.log('⬅️ Moving to previous page:', newPage);
      setCurrentPage(newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.total_pages) {
      const newPage = currentPage + 1;
      console.log('➡️ Moving to next page:', newPage);
      setCurrentPage(newPage);
    }
  };

  const handlePageClick = (page: number) => {
    console.log('🔢 Clicking page:', page, '(current:', currentPage, ')');
    setCurrentPage(page);
  };

  // Generate pagination items like other dashboards
  const renderPaginationItems = () => {
    const items = [];
    const totalPages = pagination.total_pages;
    const currentPageState = currentPage; // Use local state instead of API response

    if (totalPages <= 10) {
      // Show all pages if total is 10 or less
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageClick(i)}
              isActive={currentPageState === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show smart pagination for more than 10 pages
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageClick(1)}
            isActive={currentPageState === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is far from start
      if (currentPageState > 4) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPageState - 1);
      const end = Math.min(totalPages - 1, currentPageState + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageClick(i)}
                isActive={currentPageState === i}
                className="cursor-pointer"
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show ellipsis if current page is far from end
      if (currentPageState < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page (if different from first)
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageClick(totalPages)}
              isActive={currentPageState === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const handlePrintQR = async () => {
    if (selectedStaffs.length === 0) {
      toast.error('Please select staff members to print QR codes');
      return;
    }

    try {
      console.log('Printing QR codes for selected staff:', selectedStaffs);
      
      // Convert string IDs to numbers for the API
      const staffIds = selectedStaffs.map(id => parseInt(id, 10));
      
      await staffService.printQRCodes(staffIds);
      
      // Clear selections after successful print
      setSelectedStaffs([]);
    } catch (error) {
      console.error('Failed to print QR codes:', error);
      // Error is already handled in the service with toast
    }
  };

  const handleSearch = () => {
    console.log('🔍 Search triggered for:', searchTerm);
    
    // Only proceed if there's a search term or we're clearing
    if (searchTerm.trim() || activeSearchQuery) {
      setIsSearching(true);
      setCurrentPage(1); // Reset to first page when searching
      setActiveSearchQuery(searchTerm.trim());
      setSelectedStaffs([]); // Clear selections when searching
      
      console.log('🔄 Search state updated:');
      console.log('  - New search query:', searchTerm.trim());
      console.log('  - Page reset to: 1');
    }
  };

  const handleClearSearch = () => {
    console.log('🔄 Clearing search');
    setSearchTerm('');
    setActiveSearchQuery('');
    setCurrentPage(1);
    setSelectedStaffs([]);
    setIsSearching(false);
  };

  const handleViewStaff = (staffId: string) => {
    navigate(`/security/staff/details/${staffId}`);
  };

  const handleEditStaff = (staffId: string) => {
    navigate(`/security/staff/edit/${staffId}`);
  };

  const handleDeleteStaff = (staffId: string) => {
    console.log('Deleting staff:', staffId);
    // Add delete functionality here
  };

  const handleStaffSelection = (staffId: string, checked: boolean) => {
    setSelectedStaffs(prev => 
      checked 
        ? [...prev, staffId]
        : prev.filter(id => id !== staffId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedStaffs(checked ? transformedApiData().map(staff => staff.id) : []);
  };

  // Transform API data to match table format
  const transformedApiData = () => {
    return apiStaffsData.map(staff => ({
      id: staff.id.toString(),
      name: staff.full_name,
      unit: staff.unit_name || '--',
      department: staff.department_name,
      email: staff.email,
      mobile: staff.mobile,
      workType: staff.work_type_name,
      vendorName: staff.vendor_name || '--',
      status: staff.status_text,
      validTill: staff.valid_from || '--',
      checkIn: null as string | null, // This would come from staff_workings if needed
      checkOut: null as string | null, // This would come from staff_workings if needed
      isIn: false, // This would be calculated from staff_workings if needed
      staffId: staff.soc_staff_id,
      numberVerified: staff.number_verified,
      imageUrl: staff.staff_image_url,
      qrCodeUrl: staff.qr_code_url,
      expiry: staff.expiry,
      createdAt: staff.created_at,
      updatedAt: staff.updated_at
    }));
  };

  const filteredData = (activeTab: string = 'all') => {
    const transformedData = transformedApiData();
    
    // Since search is now handled by API, we only filter by tab type
    // No need for local search filtering
    const baseData = activeTab === 'in' 
      ? transformedData.filter(staff => staff.isIn)
      : activeTab === 'out'
      ? transformedData.filter(staff => !staff.isIn)
      : transformedData;
    
    return baseData;
  };

  const filteredHistoryData = () => {
    return historyData.filter(staff =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.mobile.includes(searchTerm)
    );
  };

  const renderRow = (staff: ReturnType<typeof transformedApiData>[0]) => ({
    actions: (
      <div className="flex justify-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleViewStaff(staff.id);
          }}
          className="p-2 h-8 w-8 hover:bg-accent"
          title="View staff"
        >
          <Eye className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleEditStaff(staff.id);
          }}
          className="p-2 h-8 w-8 hover:bg-accent"
          title="Edit staff"
        >
          <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
        </Button>
        {/* <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteStaff(staff.id);
          }}
          className="p-2 h-8 w-8 hover:bg-accent"
          title="Delete staff"
        >
          <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
        </Button> */}
      </div>
    ),
    id: <span className="font-medium text-blue-600">{staff.id}</span>,
    name: staff.name,
    unit: staff.unit,
    department: staff.department,
    email: staff.email ? <span className="text-blue-600">{staff.email}</span> : '--',
    mobile: staff.mobile,
    workType: staff.workType,
    vendorName: staff.vendorName || '--',
    status: (
      <Badge className={getStatusBadgeColor(staff.status)}>
        {staff.status}
      </Badge>
    ),
    validTill: staff.validTill || '--',
    checkIn: staff.checkIn || '--',
    checkOut: staff.checkOut || '--'
  });

  // History columns configuration
  const historyColumns: ColumnConfig[] = [
    { key: 'name', label: 'Name', sortable: true, hideable: true, draggable: true },
    { key: 'mobile', label: 'Mobile Number', sortable: true, hideable: true, draggable: true },
    { key: 'workType', label: 'Work Type', sortable: true, hideable: true, draggable: true },
    { key: 'unit', label: 'Unit', sortable: true, hideable: true, draggable: true },
    { key: 'department', label: 'Department', sortable: true, hideable: true, draggable: true },
    { key: 'vendorName', label: 'Vendor Name', sortable: true, hideable: true, draggable: true },
    { key: 'validTill', label: 'Valid Till', sortable: true, hideable: true, draggable: true },
    { key: 'checkIn', label: 'Check-In', sortable: true, hideable: true, draggable: true },
    { key: 'checkOut', label: 'Check-Out', sortable: true, hideable: true, draggable: true },
    { key: 'in', label: 'In', sortable: false, hideable: true, draggable: true },
    { key: 'out', label: 'Out', sortable: false, hideable: true, draggable: true }
  ];

  const renderHistoryRow = (staff: typeof historyData[0]) => ({
    name: <span className="text-blue-600">{staff.name}</span>,
    mobile: staff.mobile,
    workType: staff.workType,
    unit: staff.unit,
    department: staff.department,
    vendorName: staff.vendorName || '--',
    validTill: staff.validTill,
    checkIn: staff.checkIn,
    checkOut: staff.checkOut,
    in: <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">{staff.gate}</span>,
    out: <span className="text-gray-600">{staff.gate}</span>
  });

  const renderCardView = (activeTab: string) => {
    const data = filteredData(activeTab);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {data.map((staff, index) => (
          <div key={staff.id || index} className="bg-white rounded-none border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-none flex items-center justify-center">
              <span className="text-white font-bold">👤</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{staff.name}</h3>
              <p className="text-sm text-gray-600">{staff.mobile}</p>
              <p className="text-sm font-medium text-gray-800">{staff.workType}</p>
              <p className="text-sm text-gray-600">{staff.department}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="bg-green-500 text-white px-2 py-1 rounded-none text-xs font-medium">
                {activeTab === 'in' ? 'In' : 'Out'}
              </span>
              {activeTab === 'out' && (
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded-none"
                >
                  Check In
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* <h1 className="text-2xl font-bold text-gray-900 mb-6">Society Staffs</h1> */}
      
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-lg text-gray-600">
            {isSearching ? 'Searching staffs...' : 'Loading staffs data...'}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-800 font-medium">Error loading staffs data</div>
          <div className="text-red-600 text-sm mt-1">{error}</div>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-600 hover:bg-red-700 text-white"
            size="sm"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <Tabs defaultValue="all" className="w-full">
        {/* Tab Navigation */}
        <div className="mb-4 pb-4">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger
              value="history"
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              History
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="in"
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              In
            </TabsTrigger>
            <TabsTrigger
              value="out"
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              Out
            </TabsTrigger>
          </TabsList>
        </div>

        {/* History Tab Content */}
        <TabsContent value="history">
          <EnhancedTable
            data={filteredHistoryData()}
            columns={historyColumns}
            renderRow={renderHistoryRow}
            enableSearch={true}
            enableSelection={false}
            enableExport={true}
            storageKey="staff-history-table"
            emptyMessage="No history found"
            exportFileName="staff-history"
            searchPlaceholder="Search..."
            hideTableExport={false}
            hideColumnsButton={false}
          />
        </TabsContent>

        {/* All Tab Content */}
        <TabsContent value="all">
          {/* Search Bar for API Search */}
         

          {/* Search Results Summary */}
          {activeSearchQuery && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <span className="font-medium">Search results for:</span> "{activeSearchQuery}"
                {pagination.total_count > 0 && (
                  <span className="ml-2">({pagination.total_count} results found)</span>
                )}
                <div className="text-xs text-blue-600 mt-1">
                  Page {currentPage} of {pagination.total_pages} • {apiStaffsData.length} items on this page
                </div>
              </div>
            </div>
          )}

          <EnhancedTable
            data={filteredData('all')}
            columns={columns}
            renderRow={renderRow}
            selectable={true}
            enableSearch={false} // Disable built-in search since we're using API search
            enableSelection={true}
            enableExport={true}
            storageKey="staff-table"
            emptyMessage={activeSearchQuery ? "No staff found for your search" : "No staff found"}
            exportFileName="staff-records"
            selectedItems={selectedStaffs}
            getItemId={(staff) => staff.id}
            onSelectItem={handleStaffSelection}
            onSelectAll={handleSelectAll}
            leftActions={
              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate('/security/staff/add')}
                  style={{ backgroundColor: '#C72030' }}
                  className="hover:bg-[#C72030]/90 text-white px-4 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
                {selectedStaffs.length > 0 && (
                  <Button 
                    onClick={handlePrintQR}
                    style={{ backgroundColor: '#C72030' }}
                    className="hover:bg-[#C72030]/90 text-white px-4 py-2"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Print QR 
                    {/* ({selectedStaffs.length}) */}
                  </Button>
                )}
              </div>
            }
            onFilterClick={() => setIsFilterModalOpen(true)}
            searchPlaceholder="Search..."
            hideTableExport={false}
            hideColumnsButton={false}
          />
        </TabsContent>

        {/* In Tab Content */}
        <TabsContent value="in">
          {/* Search Bar */}
          <div className="flex gap-4 items-center mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search using staff's name or mobile number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
            <Button 
              onClick={handleSearch}
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#C72030]/90 text-white px-6 py-2 h-10 rounded-lg text-sm font-medium border-0"
            >
              Go!
            </Button>
          </div>
          {renderCardView('in')}
        </TabsContent>

        {/* Out Tab Content */}
        <TabsContent value="out">
          {/* Search Bar */}
          <div className="flex gap-4 items-center mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search using staff's name or mobile number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
            <Button 
              onClick={handleSearch}
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#C72030]/90 text-white px-6 py-2 h-10 rounded-lg text-sm font-medium border-0"
            >
              Go!
            </Button>
          </div>
          {renderCardView('out')}
        </TabsContent>
      </Tabs>
      )}
      
      {/* Pagination Controls */}
      {!loading && !error && pagination.total_pages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  className={
                    currentPage === 1 
                      ? "pointer-events-none opacity-50" 
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  className={
                    currentPage === pagination.total_pages 
                      ? "pointer-events-none opacity-50" 
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Results Summary */}
      {/* {!loading && !error && pagination.total_count > 0 && (
        <div className="text-center mt-2 text-sm text-gray-600">
          Showing page {currentPage} of {pagination.total_pages} ({pagination.total_count} total staff members)
        </div>
      )} */}

      {/* Filter Modal */}
      <StaffsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
