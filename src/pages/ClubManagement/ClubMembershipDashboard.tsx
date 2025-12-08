import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Plus, Download, Filter, QrCode, Edit, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { useDebounce } from '@/hooks/useDebounce';
import { Badge } from "@/components/ui/badge";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { API_CONFIG } from '@/config/apiConfig';
import { ClubMembershipFilterDialog, ClubMembershipFilters } from '@/components/ClubMembershipFilterDialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MembershipData {
  id: number;
  user_id: number;
  pms_site_id: number;
  club_member_enabled: boolean;
  membership_number: string;
  access_card_enabled: boolean;
  access_card_id: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  user_name: string;
  site_name: string;
  user_email: string;
  user_mobile: string;
  attachments: Array<{
    id: number;
    relation: string;
    relation_id: number;
    document: string;
  }>;
  identification_image: string | null;
  avatar: string;
}

export const ClubMembershipDashboard = () => {
  const navigate = useNavigate();
  const loginState = useSelector((state: RootState) => state.login);

  // State management
  const [memberships, setMemberships] = useState<MembershipData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ClubMembershipFilters>({
    search: '',
    clubMemberEnabled: '',
    accessCardEnabled: '',
    startDate: '',
    endDate: ''
  });

  const perPage = 20;

  // Fetch memberships data
  const fetchMemberships = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      console.log('Fetching club members...', { baseUrl, hasToken: !!token, page });

      // baseUrl already includes protocol (https://)
      const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/club_members.json`);
      url.searchParams.append('access_token', token || '');

      // Add search filter - search by firstname, lastname, email, or mobile
      if (filters.search) {
        url.searchParams.append('q[user_firstname_or_user_email_or_user_lastname_or_user_mobile_cont]', filters.search);
      }

      // Add club member enabled filter
      if (filters.clubMemberEnabled) {
        url.searchParams.append('q[club_member_enabled_eq]', filters.clubMemberEnabled);
      }

      // Add access card enabled filter
      if (filters.accessCardEnabled) {
        url.searchParams.append('q[access_card_enabled_eq]', filters.accessCardEnabled);
      }

      // Add start date filter
      if (filters.startDate) {
        // Convert YYYY-MM-DD to DD/MM/YYYY
        const [year, month, day] = filters.startDate.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        url.searchParams.append('q[start_date_eq]', formattedDate);
      }

      // Add end date filter
      if (filters.endDate) {
        // Convert YYYY-MM-DD to DD/MM/YYYY
        const [year, month, day] = filters.endDate.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        url.searchParams.append('q[end_date_eq]', formattedDate);
      }

      // Pagination - enable pagination
      url.searchParams.append('page', page.toString());
      url.searchParams.append('per_page', perPage.toString());

      console.log('API URL:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch club members: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (Array.isArray(data.club_members)) {
        setMemberships(data.club_members);
        setTotalMembers(data.pagination?.total_count || 0);
        setTotalPages(Math.ceil((data.pagination?.total_count || 0) / perPage));
        // toast.success(`Loaded ${data.length} members`);
      } else {
        setMemberships([]);
        setTotalMembers(0);
        setTotalPages(1);
      }

    } catch (error) {
      console.error('Error fetching memberships:', error);
      toast.error('Failed to fetch membership data');
      setMemberships([]);
      setTotalMembers(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [filters, perPage]);

  // Handle search input change
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Effect to handle debounced search
  useEffect(() => {
    const currentSearch = filters.search || '';
    const newSearch = debouncedSearchQuery.trim();

    if (currentSearch === newSearch) {
      return;
    }

    setFilters(prevFilters => ({
      ...prevFilters,
      search: newSearch
    }));

    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    console.log('Effect triggered - fetching memberships', {
      currentPage,
      filters
    });
    fetchMemberships(currentPage);
  }, [currentPage, filters, fetchMemberships]);

  // Handle export
  const handleExport = async () => {
    const loadingToast = toast.loading('Preparing Excel export...');
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      // Build the export URL
      const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/club_members.xlsx`);
      url.searchParams.append('access_token', token || '');

      // Add the same filters that are applied to the table
      if (filters.search) {
        url.searchParams.append('q[user_firstname_or_user_email_or_user_lastname_or_user_mobile_cont]', filters.search);
      }

      if (filters.clubMemberEnabled) {
        url.searchParams.append('q[club_member_enabled_eq]', filters.clubMemberEnabled);
      }

      if (filters.accessCardEnabled) {
        url.searchParams.append('q[access_card_enabled_eq]', filters.accessCardEnabled);
      }

      if (filters.startDate) {
        const [year, month, day] = filters.startDate.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        url.searchParams.append('q[start_date_eq]', formattedDate);
      }

      if (filters.endDate) {
        const [year, month, day] = filters.endDate.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        url.searchParams.append('q[end_date_eq]', formattedDate);
      }

      console.log('Export URL:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      link.download = `club_memberships_${date}.xlsx`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);

      toast.success('Excel file downloaded successfully', { id: loadingToast });

    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data', { id: loadingToast });
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
  const handleFilterApply = (newFilters: ClubMembershipFilters) => {
    console.log('Applying filters:', newFilters);
    setFilters(newFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || loading) {
      return;
    }
    setCurrentPage(page);
  };

  // Render pagination items
  const renderPaginationItems = () => {
    if (!totalPages || totalPages <= 0) {
      return null;
    }

    const items = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      // First page
      items.push(
        <PaginationItem key={1} className="cursor-pointer">
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            aria-disabled={loading}
            className={loading ? "pointer-events-none opacity-50" : ""}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Ellipsis before current page
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                aria-disabled={loading}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Current page and neighbors
      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                aria-disabled={loading}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Ellipsis after current page
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find((item) => item.key === i.toString())) {
            items.push(
              <PaginationItem key={i} className="cursor-pointer">
                <PaginationLink
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                  aria-disabled={loading}
                  className={loading ? "pointer-events-none opacity-50" : ""}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      // Last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              aria-disabled={loading}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages if less than 7
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              aria-disabled={loading}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
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
  const renderStatusBadge = (startDate: string | null, endDate: string | null, accessCardEnabled: boolean) => {
    if (!startDate && !endDate) {
      return (
        <Badge className="bg-red-100 text-red-800 border-0">
          Pending Dates
        </Badge>
      );
    }

    if (!endDate && startDate) {
      return (
        <Badge className="bg-red-100 text-red-800 border-0">
          Pending EndDate
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-800 border-0">
        Approved
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
    { key: 'membership_number', label: 'Membership Number', sortable: true },
    { key: 'user_name', label: 'Name', sortable: true },
    { key: 'user_email', label: 'Email', sortable: true },
    { key: 'user_mobile', label: 'Mobile', sortable: true },
    { key: 'site_name', label: 'Site Name', sortable: true },
    { key: 'start_date', label: 'Start Date', sortable: true },
    { key: 'end_date', label: 'End Date', sortable: true },
    { key: 'membershipStatus', label: 'Membership Status', sortable: true },
    { key: 'access_card_enabled', label: 'Card Allocated', sortable: true },
    { key: 'access_card_id', label: 'Access Card ID', sortable: true },
    { key: 'identification_image', label: 'ID Card', sortable: false },
    { key: 'avatar', label: "User Photo", sortable: false },
    { key: 'attachments', label: 'Attachments', sortable: false },
    { key: 'created_at', label: 'Created On', sortable: true }
  ];

  // Render cell content
  const renderCell = (item: MembershipData, columnKey: string) => {
    if (columnKey === 'actions') {
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate(`/club-management/membership/${item.id}`)}
            title="View Details"
            className=" p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate(`/club-management/membership/${item.id}/edit`)}
            title="Edit"
            className=" p-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
          {/* <Button 
            variant="ghost" 
            className=" text-red-600 hover:text-red-700"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button> */}
        </div>
      );
    }

    if (columnKey === 'membershipStatus') {
      return renderStatusBadge(item.start_date, item.end_date, item.access_card_enabled);
    }

    if (columnKey === 'access_card_enabled') {
      return renderCardAllocated(item.access_card_enabled);
    }

    if (columnKey === 'avatar') {
      const avatarUrl = item.avatar?.startsWith('%2F')
        ? `https://fm-uat-api.lockated.com${decodeURIComponent(item.avatar)}`
        : item.avatar;

      return avatarUrl && !avatarUrl.includes('profile.png') ? (
        <img
          src={avatarUrl}
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-xs text-gray-500">No Photo</span>
        </div>
      );
    }

    if (columnKey === 'identification_image') {
      return item.identification_image ? (
        <a href={item.identification_image} target="_blank" rel="noopener noreferrer">
          <img
            src={item.identification_image}
            alt="ID Card"
            className="w-10 h-10 object-cover cursor-pointer hover:opacity-80"
          />
        </a>
      ) : (
        <span className="text-gray-400">Not Available</span>
      );
    }

    if (columnKey === 'attachments') {
      return item.attachments.length > 0 ? (
        <Button variant="link" size="sm" className="p-0 h-auto">
          View ({item.attachments.length})
        </Button>
      ) : (
        <span className="text-gray-400">-</span>
      );
    }

    if (columnKey === 'start_date' || columnKey === 'end_date') {
      const dateValue = item[columnKey];
      if (!dateValue) return <span className="text-gray-400">-</span>;
      return new Date(dateValue).toLocaleDateString('en-GB');
    }

    if (columnKey === 'created_at') {
      return new Date(item.created_at).toLocaleDateString('en-GB');
    }

    if (columnKey === 'access_card_id') {
      return item.access_card_id || <span className="text-gray-400">-</span>;
    }

    if (!item[columnKey] || item[columnKey] === null || item[columnKey] === '') {
      return <span className="text-gray-400">--</span>;
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

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-6 pb-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            {/* Page Info */}
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} | Showing {memberships.length} of {totalMembers} members
            </div>
          </div>
        )}
      </div>

      {/* Filter Dialog */}
      <ClubMembershipFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
      />
    </div>
  );
};

export default ClubMembershipDashboard;
