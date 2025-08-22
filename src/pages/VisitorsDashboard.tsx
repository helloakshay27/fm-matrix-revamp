import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RefreshCw, Plus, Search, RotateCcw, Eye, Edit, Trash2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NewVisitorDialog } from '@/components/NewVisitorDialog';
import { UpdateNumberDialog } from '@/components/UpdateNumberDialog';
import { VisitorFilterDialog, VisitorFilters } from '@/components/VisitorFilterDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { toast } from 'sonner';

// API Service using apiConfig
const getUnexpectedVisitors = async (siteId: number, page: number = 1, perPage: number = 20) => {
  try {
    const url = getFullUrl(API_CONFIG.ENDPOINTS.UNEXPECTED_VISITORS);
    const options = getAuthenticatedFetchOptions();
    
    // Add query parameters
    const urlWithParams = new URL(url);
    urlWithParams.searchParams.append('site_id', siteId.toString());
    urlWithParams.searchParams.append('page', page.toString());
    urlWithParams.searchParams.append('per_page', perPage.toString());
    
    console.log('🚀 Fetching unexpected visitors from:', urlWithParams.toString());
    
    const response = await fetch(urlWithParams.toString(), options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch unexpected visitors: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Response received:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching unexpected visitors:', error);
    throw error;
  }
};

const getVisitorHistory = async (siteId: number, page: number = 1, perPage: number = 20) => {
  try {
    const url = getFullUrl(API_CONFIG.ENDPOINTS.VISITOR_HISTORY);
    const options = getAuthenticatedFetchOptions();
    
    // Add query parameters
    const urlWithParams = new URL(url);
    urlWithParams.searchParams.append('site_id', siteId.toString());
    urlWithParams.searchParams.append('page', page.toString());
    urlWithParams.searchParams.append('per_page', perPage.toString());
    
    console.log('🚀 Fetching visitor history from:', urlWithParams.toString());
    
    const response = await fetch(urlWithParams.toString(), options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch visitor history: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Visitor history response received:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching visitor history:', error);
    throw error;
  }
};

const getExpectedVisitors = async (siteId: number, page: number = 1, perPage: number = 20) => {
  try {
    const url = getFullUrl(API_CONFIG.ENDPOINTS.EXPECTED_VISITORS);
    const options = getAuthenticatedFetchOptions();
    
    // Add query parameters
    const urlWithParams = new URL(url);
    urlWithParams.searchParams.append('site_id', siteId.toString());
    urlWithParams.searchParams.append('page', page.toString());
    urlWithParams.searchParams.append('per_page', perPage.toString());
    
    console.log('🚀 Fetching expected visitors from:', urlWithParams.toString());
    
    const response = await fetch(urlWithParams.toString(), options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch expected visitors: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Expected visitors response received:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching expected visitors:', error);
    throw error;
  }
};
import { VisitorAnalyticsContent } from '@/components/VisitorAnalyticsContent';

const getVisitorsOut = async (siteId: number, page: number = 1, perPage: number = 20) => {
  try {
    const url = getFullUrl('/pms/admin/visitors/visitors_out.json');
    const options = getAuthenticatedFetchOptions();
    
    // Add query parameters
    const urlWithParams = new URL(url);
    urlWithParams.searchParams.append('site_id', siteId.toString());
    urlWithParams.searchParams.append('page', page.toString());
    urlWithParams.searchParams.append('per_page', perPage.toString());
    
    console.log('🚀 Fetching visitors out from:', urlWithParams.toString());
    
    const response = await fetch(urlWithParams.toString(), options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch visitors out: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Visitors out response received:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching visitors out:', error);
    throw error;
  }
};

export const VisitorsDashboard = () => {
  const [selectedPerson, setSelectedPerson] = useState('');
  const [isNewVisitorDialogOpen, setIsNewVisitorDialogOpen] = useState(false);
  const [isUpdateNumberDialogOpen, setIsUpdateNumberDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visitorFilters, setVisitorFilters] = useState<VisitorFilters>({});
  const [currentVisitorNumber, setCurrentVisitorNumber] = useState('');
  const [activeVisitorType, setActiveVisitorType] = useState('unexpected');
  const [mainTab, setMainTab] = useState('visitor');
  const [visitorSubTab, setVisitorSubTab] = useState('visitor-in');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisitors, setSelectedVisitors] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  // API State
  const [unexpectedVisitors, setUnexpectedVisitors] = useState<any[]>([]);
  const [expectedVisitors, setExpectedVisitors] = useState<any[]>([]);
  const [visitorsOutData, setVisitorsOutData] = useState<any[]>([]);
  const [visitorHistoryData, setVisitorHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expectedLoading, setExpectedLoading] = useState(false);
  const [visitorsOutLoading, setVisitorsOutLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [disabledOTPButtons, setDisabledOTPButtons] = useState<Record<number, boolean>>({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEntries: 0,
    perPage: 20
  });
  const [expectedPagination, setExpectedPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEntries: 0,
    perPage: 20
  });
  const [visitorsOutPagination, setVisitorsOutPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEntries: 0,
    perPage: 20
  });
  const [historyPagination, setHistoryPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEntries: 0,
    perPage: 20
  });

  // Mock visitor data for expected visitors
  const expectedVisitorData = [
    {
      id: "1",
      visitorName: "Expected Visitor",
      details: "Meeting Host",
      purpose: "Business Meeting",
      status: "Confirmed",
      avatar: "/placeholder.svg"
    }
  ];

  // Mock visitor out data
  const visitorOutData = [
    {
      id: 1,
      name: 'Test visitor',
      visitorName: 'Test visitor',
      host: 'Sohail Ansari',
      purpose: 'Meeting',
      checkedInAt: '21/02/25, 10:56 AM',
      status: 'Approved',
      avatar: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'SY',
      visitorName: 'SY',
      host: 'Saumir Yadav',
      purpose: 'Personal',
      checkedInAt: '18/02/25, 2:29 PM',
      status: 'Approved',
      avatar: '/placeholder.svg'
    }
  ];

  // Fetch unexpected visitors
  const fetchUnexpectedVisitors = async (page: number = 1) => {
    setLoading(true);
    try {
      const data = await getUnexpectedVisitors(2189, page); // Replace 2189 with your actual site ID
      setUnexpectedVisitors(data.unexpected_visitors);
      setPagination({
        currentPage: data.pagination.current_page,
        totalPages: data.pagination.total_pages,
        totalEntries: data.pagination.total_entries,
        perPage: data.pagination.per_page
      });
    } catch (error) {
      console.error('Error fetching unexpected visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch expected visitors
  const fetchExpectedVisitors = async (page: number = 1) => {
    setExpectedLoading(true);
    try {
      const data = await getExpectedVisitors(2189, page); // Replace 2189 with your actual site ID
      setExpectedVisitors(data.expected_visitors);
      setExpectedPagination({
        currentPage: data.pagination.current_page,
        totalPages: data.pagination.total_pages,
        totalEntries: data.pagination.total_entries,
        perPage: data.pagination.per_page
      });
    } catch (error) {
      console.error('Error fetching expected visitors:', error);
    } finally {
      setExpectedLoading(false);
    }
  };

  // Fetch visitor history
  const fetchVisitorHistory = async (page: number = 1) => {
    setHistoryLoading(true);
    try {
      const data = await getVisitorHistory(2189, page); // Replace 2189 with your actual site ID
      setVisitorHistoryData(data.visitors);
      setHistoryPagination({
        currentPage: data.pagination?.current_page || 1,
        totalPages: data.pagination?.total_pages || 1,
        totalEntries: data.pagination?.total_entries || data.visitors?.length || 0,
        perPage: data.pagination?.per_page || 20
      });
    } catch (error) {
      console.error('Error fetching visitor history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Fetch visitors out
  const fetchVisitorsOut = async (page: number = 1) => {
    setVisitorsOutLoading(true);
    try {
      const data = await getVisitorsOut(2189, page); // Replace 2189 with your actual site ID
      // Flatten checked_in_at to checked_in_at.formatted for table display
      const mapped = (data.visitors || []).map((v: any) => ({
        ...v,
        checked_in_at: v.checked_in_at?.formatted || '',
      }));
      setVisitorsOutData(mapped);
      setVisitorsOutPagination({
        currentPage: data.pagination?.current_page || 1,
        totalPages: data.pagination?.total_pages || 1,
        totalEntries: data.pagination?.total_entries || data.visitors?.length || 0,
        perPage: data.pagination?.per_page || 20
      });
    } catch (error) {
      console.error('Error fetching visitors out:', error);
    } finally {
      setVisitorsOutLoading(false);
    }
  };

  useEffect(() => {
    if (visitorSubTab === 'visitor-in' && activeVisitorType === 'unexpected') {
      fetchUnexpectedVisitors();
    } else if (visitorSubTab === 'visitor-in' && activeVisitorType === 'expected') {
      fetchExpectedVisitors();
    } else if (visitorSubTab === 'visitor-out') {
      fetchVisitorsOut();
    } else if (visitorSubTab === 'history') {
      fetchVisitorHistory();
    }
  }, [visitorSubTab, activeVisitorType]);

  // Filter handlers
  const handleFilterOpen = () => {
    setIsFilterOpen(true);
  };

  const handleFilterApply = (filters: VisitorFilters) => {
    setVisitorFilters(filters);
    setIsFilterOpen(false);
    // TODO: Apply filters to the visitor data based on current tab
    if (visitorSubTab === 'visitor-in' && activeVisitorType === 'unexpected') {
      fetchUnexpectedVisitors();
    } else if (visitorSubTab === 'visitor-in' && activeVisitorType === 'expected') {
      fetchExpectedVisitors();
    } 
    else if (visitorSubTab === 'visitor-out') {
      fetchVisitorsOut();
    } else if (visitorSubTab === 'history') {
      fetchVisitorHistory();
    }
  };

  const handleFilterReset = () => {
    setVisitorFilters({});
    setIsFilterOpen(false);
    // Refresh data without filters
    if (visitorSubTab === 'visitor-in' && activeVisitorType === 'unexpected') {
      fetchUnexpectedVisitors();
    } else if (visitorSubTab === 'visitor-in' && activeVisitorType === 'expected') {
      fetchExpectedVisitors();
    } else if (visitorSubTab === 'visitor-out') {
      fetchVisitorsOut();
    } else if (visitorSubTab === 'history') {
      fetchVisitorHistory();
    }
  };

  // Column configuration for unexpected visitors table
  const unexpectedVisitorColumns: ColumnConfig[] = [
    // { key: 'actions', label: 'Actions', sortable: false, hideable: false, draggable: false },
    // { key: 'id', label: 'ID', sortable: true, hideable: true, draggable: true },
    // { key: 'sNo', label: 'S No.', sortable: false, hideable: false, draggable: false },
    { key: 'visitor_image', label: 'Visitor Image', sortable: false, hideable: true, draggable: true },
    { key: 'guest_name', label: 'Visitor Name', sortable: true, hideable: true, draggable: true },
    { key: 'guest_from', label: 'From', sortable: true, hideable: true, draggable: true },
    { key: 'primary_host', label: 'Host', sortable: true, hideable: true, draggable: true },
    { key: 'visit_purpose', label: 'Purpose', sortable: true, hideable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
    { key: 'created_at_formatted', label: 'Check-in Time', sortable: true, hideable: true, draggable: true },
    { key: 'tableActions', label: 'Actions', sortable: false, hideable: false, draggable: false }
  ];

  // Column configuration for expected visitors table
  const expectedVisitorColumns: ColumnConfig[] = [
    { key: 'visitor_image', label: 'Visitor Image', sortable: false, hideable: true, draggable: true },
    { key: 'guest_name', label: 'Visitor Name', sortable: true, hideable: true, draggable: true },
    { key: 'guest_from', label: 'Location', sortable: true, hideable: true, draggable: true },
    { key: 'primary_host', label: 'Host', sortable: true, hideable: true, draggable: true },
    { key: 'visit_purpose', label: 'Purpose', sortable: true, hideable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
    { key: 'created_at_formatted', label: 'Check-in Time', sortable: true, hideable: true, draggable: true },
    { key: 'expected_at_formatted', label: 'Expected At', sortable: true, hideable: true, draggable: true },
    { key: 'tableActions', label: 'Actions', sortable: false, hideable: false, draggable: false }
  ];

  // Column configuration for visitor out table
  const visitorOutColumns: ColumnConfig[] = [
    { key: 'visitor_image', label: 'Visitor Image', sortable: false, hideable: true, draggable: true },
    { key: 'guest_name', label: 'Visitor Name', sortable: true, hideable: true, draggable: true },
    { key: 'primary_host', label: 'Host', sortable: true, hideable: true, draggable: true },
    { key: 'visit_purpose', label: 'Purpose', sortable: true, hideable: true, draggable: true },
    { key: 'guest_from', label: 'Location', sortable: true, hideable: true, draggable: true },
    { key: 'checked_in_at', label: 'Checked In At', sortable: true, hideable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
    { key: 'checkOut', label: 'Check Out', sortable: false, hideable: false, draggable: false }
  ];

  // Column configuration for visitor history table
  const visitorHistoryColumns: ColumnConfig[] = [
    // { key: 'id', label: 'ID', sortable: true, hideable: true, draggable: true },
    { key: 'visitor_image', label: 'Visitor Image', sortable: false, hideable: true, draggable: true },
    { key: 'guest_name', label: 'Visitor Name', sortable: true, hideable: true, draggable: true },
    { key: 'primary_host', label: 'Host', sortable: true, hideable: true, draggable: true },
    { key: 'guest_from', label: 'Location', sortable: true, hideable: true, draggable: true },
    { key: 'visit_purpose', label: 'Purpose', sortable: true, hideable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
    { key: 'check_in_time', label: 'Check-in Time', sortable: true, hideable: true, draggable: true },
    { key: 'pass_number', label: 'Pass Number', sortable: true, hideable: true, draggable: true }
  ];

  // Filter visitors based on search term
  const filteredVisitors = visitorHistoryData.filter(visitor => 
    visitor.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.pass_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.primary_host?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render functions for enhanced tables
 const renderUnexpectedVisitorCell = (visitor: any, columnKey: string) => {
  switch (columnKey) {
    case 'sNo':
      return visitor.sNo;
    case 'actions':
      return (
        <button 
          className="w-4 h-4 text-black hover:text-gray-700"
          onClick={() => handleEditClick(visitor.guest_number)}
        >
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
          </svg>
        </button>
      );
    case 'id':
      return visitor.id;
    case 'visitor_image':
      return (
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {visitor.visitor_image && visitor.visitor_image !== 'person.png' ? (
              <img 
                src={visitor.visitor_image.startsWith('http') ? visitor.visitor_image : '/placeholder.svg'} 
                alt={visitor.guest_name || 'Visitor'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      );
    case 'guest_name':
      return visitor.guest_name || '--';
    case 'guest_from':
      return visitor.guest_from || '--';
    case 'primary_host':
      return visitor.primary_host || '--';
    case 'visit_purpose':
      return visitor.visit_purpose || '--';
    case 'created_at_formatted':
      return visitor.created_at_formatted || '--';
    case 'status':
      return (
        <Badge className={`${
          visitor.status === 'Approved' ? 'bg-green-100 text-green-800' : 
          visitor.status === 'Pending' ? 'bg-orange-100 text-orange-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {visitor.status}
        </Badge>
      );
    case 'tableActions':
  return (
    <div className="flex gap-2">
      <Button 
        className={`px-3 py-1 text-xs rounded ${
          disabledOTPButtons[visitor.id] 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-orange-500 hover:bg-orange-600'
        } text-white`}
        onClick={() => handleResendOTP(visitor.id)}
        disabled={disabledOTPButtons[visitor.id]}
      >
        {disabledOTPButtons[visitor.id] ? 'Disabled for 1 min' : 'Resend OTP'}
      </Button>
      <Button 
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs rounded"
        onClick={() => handleSkipApproval(visitor.id)}
      >
        Skip Host Approval
      </Button>
    </div>
  );
default:
  const value = visitor[columnKey as keyof typeof visitor];
  return value ? String(value) : '--';
  }
};

 const renderExpectedVisitorCell = (visitor: any, columnKey: string) => {
  switch (columnKey) {
    case 'id':
      return visitor.id;
    case 'visitor_image':
      return (
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {visitor.visitor_image ? (
              <img
                src={visitor.visitor_image}
                alt="Visitor"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-xs">No Photo</span>
            )}
          </div>
        </div>
      );
    case 'guest_name':
      return <span className="font-medium">{visitor.guest_name || '--'}</span>;
    case 'guest_from':
      return visitor.guest_from || '--';
    case 'primary_host':
      return visitor.primary_host || '--';
    case 'visit_purpose':
      return visitor.visit_purpose || '--';
    case 'status':
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            visitor.status === 'Expected'
              ? 'bg-yellow-100 text-yellow-800'
              : visitor.status === 'Checked In'
              ? 'bg-green-100 text-green-800'
              : visitor.status === 'Checked Out'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {visitor.status || 'Unknown'}
        </span>
      );
    case 'expected_at_formatted':
      return visitor.expected_at_formatted || '--';
    case 'tableActions':
      return (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewVisitor(visitor.id)}
          >
            View
          </Button>
          {visitor.check_in_available && (
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => handleCheckIn(visitor.id)}
            >
              Check In
            </Button>
          )}
        </div>
      );
    default:
      const value = visitor[columnKey as keyof typeof visitor];
      return value ? String(value) : '--';
  }
 };

 const renderVisitorOutCell = (visitor: any, columnKey: string) => {
  switch (columnKey) {
    case 'visitor_image':
      return (
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {visitor.visitor_image && visitor.visitor_image !== 'person.png' ? (
              <img 
                src={visitor.visitor_image.startsWith('http') ? visitor.visitor_image : '/placeholder.svg'} 
                alt={visitor.guest_name || 'Visitor'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      );
    case 'guest_name':
      return visitor.guest_name || '--';
    case 'primary_host':
      return visitor.primary_host || '--';
    case 'visit_purpose':
      return visitor.visit_purpose || '--';
    case 'guest_from':
      return visitor.guest_from || '--';
    case 'checked_in_at':
      return visitor.checked_in_at || '--';
    case 'status':
      return (
        <Badge className={`${
          visitor.status === 'Approved' ? 'bg-green-100 text-green-800' : 
          visitor.status === 'Pending' ? 'bg-orange-100 text-orange-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {visitor.status}
        </Badge>
      );
    case 'checkOut':
      return (
        <Button 
          onClick={() => handleCheckOut(visitor.id)}
          className="bg-[#F97316] hover:bg-[#F97316]/90 text-white px-3 py-1 text-sm rounded"
        >
          Check Out
        </Button>
      );
    default:
      const value = visitor[columnKey as keyof typeof visitor];
      return value ? String(value) : '--';
  }
};

 const renderVisitorHistoryCell = (visitor: any, columnKey: string) => {
  switch (columnKey) {
    case 'id':
      return visitor.id;
    case 'visitor_image':
      return (
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {visitor.visitor_image && visitor.visitor_image !== 'person.png' ? (
              <img 
                src={visitor.visitor_image.startsWith('http') ? visitor.visitor_image : '/placeholder.svg'} 
                alt={visitor.guest_name || 'Visitor'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      );
    case 'guest_name':
      return visitor.guest_name || '--';
    case 'primary_host':
      return visitor.primary_host || '--';
    case 'guest_from':
      return visitor.guest_from || '--';
    case 'visit_purpose':
      return visitor.visit_purpose || '--';
    case 'check_in_time':
      return visitor.check_in_time || '--';
    case 'pass_number':
      return visitor.pass_number || '--';
    case 'status':
      return (
        <Badge className={`${
          visitor.status === 'Approved' ? 'bg-green-100 text-green-800' : 
          visitor.status === 'Pending' ? 'bg-orange-100 text-orange-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {visitor.status}
        </Badge>
      );
    default:
      const value = visitor[columnKey as keyof typeof visitor];
      return value ? String(value) : '--';
  }
};

  const renderExpectedVisitorRow = (visitor: any) => {
    const row: { [key: string]: any } = {};
    expectedVisitorColumns.forEach((column) => {
      row[column.key] = renderExpectedVisitorCell(visitor, column.key);
    });
    return row;
  };

  const renderVisitorOutRow = (visitor: any) => ({
    sNo: visitor.sNo,
    visitorName: visitor.visitorName,
    host: visitor.host,
    purpose: visitor.purpose,
    location: visitor.location || '--',
    checkedInAt: visitor.checkedInAt,
    status: (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        {visitor.status}
      </Badge>
    ),
    checkOut: (
      <Button 
        onClick={() => handleCheckOut(visitor.id)}
        className="bg-[#F97316] hover:bg-[#F97316]/90 text-white px-3 py-1 text-sm rounded"
      >
        Check Out
      </Button>
    )
  });

  // Add index to data for S No.
  const unexpectedVisitorDataWithIndex = unexpectedVisitors; // Use API data directly since we have ID

  const expectedVisitorDataWithIndex = expectedVisitorData.map((visitor, index) => ({
    ...visitor,
    sNo: index + 1
  }));

  const visitorOutDataWithIndex = visitorOutData.map((visitor, index) => ({
    ...visitor,
    sNo: index + 1
  }));

  const visitorHistoryDataWithIndex = visitorHistoryData.map((visitor, index) => ({
    ...visitor,
    sNo: index + 1
  }));

  // Event handlers
  const handleRefresh = () => {
    if (visitorSubTab === 'visitor-in' && activeVisitorType === 'unexpected') {
      fetchUnexpectedVisitors(pagination.currentPage);
    } else if (visitorSubTab === 'visitor-out') {
      fetchVisitorsOut(visitorsOutPagination.currentPage);
    } else if (visitorSubTab === 'history') {
      fetchVisitorHistory(historyPagination.currentPage);
    }
    console.log('Refreshing data...');
  };

  const handleEditClick = (currentNumber: string) => {
    setCurrentVisitorNumber(currentNumber);
    setIsUpdateNumberDialogOpen(true);
  };

  const handleNumberUpdate = (newNumber: string) => {
    console.log('Updating number from', currentVisitorNumber, 'to', newNumber);
    // Handle number update logic here
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // Handle search logic here
  };

  const handleReset = () => {
    setSearchTerm('');
    console.log('Search reset');
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedVisitors(visitorOutData.map(visitor => visitor.id));
    } else {
      setSelectedVisitors([]);
    }
  };

  const handleSelectVisitor = (visitorId: number, checked: boolean) => {
    if (checked) {
      setSelectedVisitors(prev => [...prev, visitorId]);
    } else {
      setSelectedVisitors(prev => prev.filter(id => id !== visitorId));
      setSelectAll(false);
    }
  };

  const handleCheckOut = async (visitorId: number) => {
    try {
      console.log('Checking out visitor:', visitorId);
      
      // Show loading toast
      toast.info('Processing checkout...');
      
      // Construct the API URL using the visitor ID
      const url = getFullUrl(`/pms/visitors/${visitorId}.json`);
      const options = getAuthenticatedFetchOptions();
      
      // Create request body for checkout with current timestamp
      const requestBody = {
        gatekeeper: {
          guest_exit_time: new Date().toISOString().slice(0, 19) + "+05:30", // Format: 2025-08-22T19:07:37+05:30
          exit_gate_id: "",
          status: "checked_out"
        }
      };
      
      // Set the request method to PUT and add the request body
      const requestOptions = {
        ...options,
        method: 'PUT',
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      };
      
      console.log('🚀 Calling checkout API:', url);
      console.log('📋 Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to checkout visitor: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Visitor checked out successfully:', data);
      
      // Show success toast
      toast.success('Visitor checked out successfully!');
      
      // Refresh the visitors out data to reflect the checkout
      if (visitorSubTab === 'visitor-out') {
        fetchVisitorsOut(visitorsOutPagination.currentPage);
      }
      
    } catch (error) {
      console.error('❌ Error checking out visitor:', error);
      toast.error('Failed to checkout visitor. Please try again.');
    }
  };

  const handleViewVisitor = (visitorId: number) => {
    console.log('Viewing visitor:', visitorId);
    // Handle view visitor logic here
  };

  const handleEditVisitor = (visitorId: number) => {
    console.log('Editing visitor:', visitorId);
    // Handle edit visitor logic here
  };

  const handleDeleteVisitor = (visitorId: number) => {
    console.log('Deleting visitor:', visitorId);
    // Handle delete visitor logic here
  };

  const handleResendOTP = async (visitorId: number) => {
    try {
      console.log('Resending OTP for visitor:', visitorId);
      
      // Show loading toast
      toast.info('Sending OTP...');
      
      // Disable the button
      setDisabledOTPButtons(prev => ({ ...prev, [visitorId]: true }));
      
      // Construct the API URL using the new endpoint
      const url = getFullUrl(API_CONFIG.ENDPOINTS.RESEND_OTP);
      const options = getAuthenticatedFetchOptions();
      
      // Add query parameter for visitor ID
      const urlWithParams = new URL(url);
      urlWithParams.searchParams.append('id', visitorId.toString());
      
      console.log('🚀 Calling resend OTP API:', urlWithParams.toString());
      
      const response = await fetch(urlWithParams.toString(), options);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to resend OTP: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ OTP sent successfully:', data);
      
      // Show success toast
      toast.success('OTP sent successfully!');
      
      // Re-enable the button after 1 minute (60000ms)
      setTimeout(() => {
        setDisabledOTPButtons(prev => ({ ...prev, [visitorId]: false }));
      }, 60000);
      
      // Optionally refresh the unexpected visitors data
      if (visitorSubTab === 'visitor-in' && activeVisitorType === 'unexpected') {
        fetchUnexpectedVisitors(pagination.currentPage);
      }
      
    } catch (error) {
      console.error('❌ Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
      
      // Re-enable the button on error
      setDisabledOTPButtons(prev => ({ ...prev, [visitorId]: false }));
    }
  };

  const handleSkipApproval = async (visitorId: number) => {
    try {
      console.log('Skipping approval for visitor:', visitorId);
      
      // Show loading toast
      toast.info('Processing approval...');
      
      // Construct the API URL
      const url = getFullUrl(`/pms/visitors/${visitorId}.json`);
      const options = getAuthenticatedFetchOptions();
      
      // Set the request method to PUT and add the request body
      const requestOptions = {
        ...options,
        method: 'PUT',
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: API_CONFIG.TOKEN,
          approval: "true",
          gatekeeper: {
            approve: "1"
          }
        })
      };
      
      console.log('🚀 Calling skip approval API:', url);
      console.log('📋 Request body:', requestOptions.body);
      
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        throw new Error(`Failed to skip approval: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Approval skipped successfully:', data);
      
      // Show success toast
      toast.success('Host approval skipped successfully!');
      
      // Optionally refresh the data
      if (visitorSubTab === 'visitor-in' && activeVisitorType === 'unexpected') {
        fetchUnexpectedVisitors(pagination.currentPage);
      }
      
    } catch (error) {
      console.error('❌ Error skipping approval:', error);
      toast.error('Failed to skip approval. Please try again.');
    }
  };

  const handleCheckIn = (visitorId: number) => {
    console.log('Checking in visitor:', visitorId);
    // Handle check in logic here
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <div className="mb-4">
            <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
              <TabsTrigger
                value="visitor"
                className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
              >
              <svg
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.875 4.25L3 5.375L5.25 3.125M1.875 9.5L3 10.625L5.25 8.375M1.875 14.75L3 15.875L5.25 13.625M7.875 9.5H16.125M7.875 14.75H16.125M7.875 4.25H16.125"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Visitor
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
              >
                <path
                  d="M7.66681 11.6106C6.59669 11.5192 5.69719 11.0831 4.96831 10.3024C4.23944 9.52162 3.875 8.5875 3.875 7.5C3.875 6.35413 4.27606 5.38019 5.07819 4.57819C5.88019 3.77606 6.85413 3.375 8 3.375C9.0875 3.375 10.0216 3.73825 10.8024 4.46475C11.5831 5.19112 12.0192 6.08944 12.1106 7.15969L10.9179 6.80625C10.7557 6.13125 10.4066 5.57812 9.87031 5.14688C9.33419 4.71563 8.71075 4.5 8 4.5C7.175 4.5 6.46875 4.79375 5.88125 5.38125C5.29375 5.96875 5 6.675 5 7.5C5 8.2125 5.21681 8.8375 5.65044 9.375C6.08406 9.9125 6.636 10.2625 7.30625 10.425L7.66681 11.6106ZM8.56681 14.5946C8.47231 14.6149 8.37788 14.625 8.2835 14.625H8C7.01438 14.625 6.08812 14.438 5.22125 14.064C4.35437 13.69 3.60031 13.1824 2.95906 12.5413C2.31781 11.9002 1.81019 11.1463 1.43619 10.2795C1.06206 9.41275 0.875 8.48669 0.875 7.50131C0.875 6.51581 1.062 5.5895 1.436 4.72237C1.81 3.85525 2.31756 3.101 2.95869 2.45962C3.59981 1.81825 4.35375 1.31044 5.2205 0.936187C6.08725 0.562062 7.01331 0.375 7.99869 0.375C8.98419 0.375 9.9105 0.562062 10.7776 0.936187C11.6448 1.31019 12.399 1.81781 13.0404 2.45906C13.6818 3.10031 14.1896 3.85437 14.5638 4.72125C14.9379 5.58812 15.125 6.51438 15.125 7.5V7.77975C15.125 7.873 15.1149 7.96631 15.0946 8.05969L14 7.725V7.5C14 5.825 13.4187 4.40625 12.2563 3.24375C11.0938 2.08125 9.675 1.5 8 1.5C6.325 1.5 4.90625 2.08125 3.74375 3.24375C2.58125 4.40625 2 5.825 2 7.5C2 9.175 2.58125 10.5938 3.74375 11.7563C4.90625 12.9187 6.325 13.5 8 13.5H8.225L8.56681 14.5946ZM14.1052 14.7332L10.7043 11.325L9.88944 13.7884L8 7.5L14.2884 9.38944L11.825 10.2043L15.2332 13.6052L14.1052 14.7332Z"
                  fill="currentColor"
                />
              </svg>
              Analytics
            </TabsTrigger>
          </TabsList>
          </div>

          <TabsContent value="visitor" className="bg-white rounded-lg border border-gray-200">
            <Tabs value={visitorSubTab} onValueChange={setVisitorSubTab} className="w-full">
              <div className="p-4 pb-0">
                <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
                  <TabsTrigger
                    value="visitor-in"
                    className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
                  >
                    Visitor In
                  </TabsTrigger>
                  <TabsTrigger
                    value="visitor-out"
                    className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
                  >
                    Visitor Out
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
                  >
                    History
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Visitor In tab content */}
              <TabsContent value="visitor-in" className="p-4">
                {/* Visitor Type Tabs */}
                <div className="flex bg-white p-1 rounded-lg mb-6">
                  <Button 
                    onClick={() => setActiveVisitorType('unexpected')}
                    className={`px-6 py-2 text-sm font-medium transition-colors rounded-md border-none ${
                      activeVisitorType === 'unexpected' 
                        ? 'bg-[#EDEAE3] text-[#C72030] shadow-sm' 
                        : 'bg-transparent text-gray-600 hover:bg-white/50'
                    }`}
                    variant="ghost"
                  >
                    Unexpected Visitor
                  </Button>
                  <Button 
                    onClick={() => setActiveVisitorType('expected')}
                    className={`px-6 py-2 text-sm font-medium transition-colors rounded-md border-none ${
                      activeVisitorType === 'expected' 
                        ? 'bg-[#EDEAE3] text-[#C72030] shadow-sm' 
                        : 'bg-transparent text-gray-600 hover:bg-white/50'
                    }`}
                    variant="ghost"
                  >
                    Expected Visitor
                  </Button>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                  {activeVisitorType === 'unexpected' && (
                    <EnhancedTable
                   data={unexpectedVisitors}
                   columns={unexpectedVisitorColumns}
                   renderCell={renderUnexpectedVisitorCell}
                      enableSearch={true}
                      enableSelection={false}
                      // enableExport={true}
                      enablePagination={true}
                      pagination={pagination}
                      onPageChange={fetchUnexpectedVisitors}
                      loading={loading}
                      storageKey="unexpected-visitors-table"
                      emptyMessage="No unexpected visitors available"
                      exportFileName="unexpected-visitors"
                      searchPlaceholder="Search by visitor name, host, or purpose"
                      hideTableExport={false}
                      hideColumnsButton={false}
                      onFilterClick={handleFilterOpen}
                      leftActions={
                        <div className="flex gap-3">
                          <Button
                            onClick={() => setIsNewVisitorDialogOpen(true)}
                            className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium"
                          >
                            <Plus className="w-4 h-4 mr-2" /> Add
                          </Button>
                        </div>
                      }
                    />
                  )}
                  
                  {activeVisitorType === 'expected' && (
                    <EnhancedTable
                      data={expectedVisitors}
                      columns={expectedVisitorColumns}
                      renderRow={renderExpectedVisitorRow}
                      enableSearch={true}
                      enableSelection={false}
                      // enableExport={true}
                      storageKey="expected-visitors-table"
                      emptyMessage="No expected visitors available"
                      exportFileName="expected-visitors"
                      searchPlaceholder="Search by visitor name, details, or purpose"
                      hideTableExport={false}
                      hideColumnsButton={false}
                      onFilterClick={handleFilterOpen}
                      leftActions={
                        <div className="flex gap-3">
                          <Button
                            onClick={() => setIsNewVisitorDialogOpen(true)}
                            className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium"
                          >
                            <Plus className="w-4 h-4 mr-2" /> Add
                          </Button>
                        </div>
                      }
                    />
                  )}
                </div>
              </TabsContent>

              {/* Visitor Out tab content */}
              <TabsContent value="visitor-out" className="p-4 min-h-[400px]">
                <EnhancedTable
                  data={visitorsOutData}
                  columns={visitorOutColumns}
                  renderCell={renderVisitorOutCell}
                  enableSearch={true}
                  enableSelection={false}
                  // enableExport={true}
                  enablePagination={true}
                  pagination={visitorsOutPagination}
                  onPageChange={fetchVisitorsOut}
                  loading={visitorsOutLoading}
                  storageKey="visitor-out-table"
                  emptyMessage="No visitors to check out"
                  exportFileName="visitor-out"
                  searchPlaceholder="Search by visitor name, host, or purpose"
                  hideTableExport={false}
                  hideColumnsButton={false}
                  // onFilterClick={handleFilterOpen}
                  leftActions={
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setIsNewVisitorDialogOpen(true)}
                        className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add
                      </Button>
                    </div>
                  }
                />
              </TabsContent>

              {/* History tab content */}
              <TabsContent value="history" className="p-4 min-h-[400px] space-y-4">
                {/* Visitor History Table */}
                <EnhancedTable
                  data={visitorHistoryData}
                  columns={visitorHistoryColumns}
                  renderCell={renderVisitorHistoryCell}
                  enableSearch={true}
                  enableSelection={false}
                  // enableExport={true}
                  enablePagination={true}
                  pagination={historyPagination}
                  onPageChange={fetchVisitorHistory}
                  loading={historyLoading}
                  storageKey="visitor-history-table"
                  emptyMessage="No visitor history available"
                  exportFileName="visitor-history"
                  searchPlaceholder="Search by visitor name, host, or pass number"
                  hideTableExport={false}
                  hideColumnsButton={false}
                  // onFilterClick={handleFilterOpen}
                  leftActions={
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setIsNewVisitorDialogOpen(true)}
                        className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add
                      </Button>
                    </div>
                  }
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <VisitorAnalyticsContent />
          </TabsContent>
        </Tabs>
      </div>

      <NewVisitorDialog 
        isOpen={isNewVisitorDialogOpen}
        onClose={() => setIsNewVisitorDialogOpen(false)}
      />
      
      <UpdateNumberDialog 
        isOpen={isUpdateNumberDialogOpen}
        onClose={() => setIsUpdateNumberDialogOpen(false)}
        currentNumber={currentVisitorNumber}
        onUpdate={handleNumberUpdate}
      />

      <VisitorFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleFilterApply}
        onResetFilters={handleFilterReset}
      />
    </div>
  );
};