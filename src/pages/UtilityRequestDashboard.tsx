// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Plus, Edit, Eye } from 'lucide-react';
// import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
// import { ColumnConfig } from '@/hooks/useEnhancedTable';
// import { Badge } from '@/components/ui/badge';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// // Define type for consumption data
// interface ConsumptionData {
//   id: string;
//   entity: string;
//   fromDate: string;
//   toDate: string;
//   totalConsumption: string;
//   rate: string;
//   amount: string;
//   plantDetail: string;
//   status: string;
//   readingType: string;
//   url?: string;
// }

// // Interface for the API response
// interface ApiConsumptionData {
//   id: number;
//   entity_id: number;
//   entity_name: string;
//   from_date: string;
//   to_date: string;
//   total_consumption: number;
//   rate: number;
//   amount: number;
//   plant_detail_id: number | null;
//   status: string;
//   reading_type: string;
//   created_at: string;
//   updated_at: string;
//   url: string;
// }

// // Column configuration for enhanced table
// const columns: ColumnConfig[] = [
//   { key: 'actions', label: 'Action', sortable: false, defaultVisible: true },
//   { key: 'view', label: 'view', sortable: false, defaultVisible: true },
//   { key: 'entity', label: 'Entity', sortable: true, defaultVisible: true },
//   { key: 'fromDate', label: 'From date', sortable: true, defaultVisible: true },
//   { key: 'toDate', label: 'To date', sortable: true, defaultVisible: true },
//   { key: 'totalConsumption', label: 'Total consumption', sortable: true, defaultVisible: true },
//   { key: 'rate', label: 'Rate', sortable: true, defaultVisible: true },
//   { key: 'amount', label: 'Amount', sortable: true, defaultVisible: true },
//   { key: 'plantDetail', label: 'Plant detail', sortable: true, defaultVisible: true },
//   { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
//   { key: 'readingType', label: 'Reading type', sortable: true, defaultVisible: true },
// ];

// export const UtilityRequestDashboard = () => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedItems, setSelectedItems] = useState<string[]>([]);
//   const [consumptionData, setConsumptionData] = useState<ConsumptionData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch entities to map entity IDs to names
//   const fetchEntities = async (baseUrl: string, token: string) => {
//     try {
//       // Always use API_BASE_URL for consistency
//       console.log('Fetching entities from:', `${API_BASE_URL}/entities.json`);
//       const response = await axios.get(`${API_BASE_URL}/entities.json`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       console.log('Entities API response:', response.data);

//       // Create a map of entity IDs to entity names
//       const entityMap = new Map();
//       const entities = response.data.entities || response.data;

//       if (Array.isArray(entities)) {
//         console.log(`Mapping ${entities.length} entities`);
//         entities.forEach((entity: any) => {
//           entityMap.set(entity.id.toString(), entity.name);
//         });
//       } else {
//         console.warn('Entities response is not an array:', entities);
//       }

//       console.log('Entity map size:', entityMap.size);
//       return entityMap;
//     } catch (err: any) {
//       console.error('Error fetching entities:', err);
//       console.error('Error details:', err.response?.data || err.message);
//       return new Map();
//     }
//   };

//   // Properly format the base URL to ensure it doesn't include localhost
//   const formatBaseUrl = (url: string): string => {
//     console.log('Original URL:', url);

//     // Direct check for the problematic URL pattern
//     if (url === 'http://localhost:5174/utility/fm-uat-api.lockated.com/compile_utilizations.json' ||
//       url.startsWith('http://localhost:') && url.includes('fm-uat-api.lockated.com')) {
//       url = 'https://fm-uat-api.lockated.com';
//       console.log('Detected specific problematic URL pattern, fixed to:', url);
//       return url;
//     }

//     // If URL doesn't have a protocol, add https://
//     if (!url.match(/^https?:\/\//)) {
//       url = 'https://' + url;
//       console.log('Added protocol:', url);
//     }

//     // Remove trailing slashes
//     url = url.replace(/\/+$/, '');
//     console.log('Removed trailing slashes:', url);

//     // Check if URL contains localhost and correct the URL structure
//     if (url.includes('localhost')) {
//       console.log('URL contains localhost, attempting to fix');

//       // Various patterns that might occur
//       let match;

//       // Pattern: http://localhost:PORT/actual-domain.com/path
//       match = url.match(/https?:\/\/localhost:[0-9]+\/([^\/]+\.[^\/]+)(\/.*)?/);
//       if (match) {
//         const domain = match[1];
//         const path = match[2] || '';
//         url = `https://${domain}${path}`;
//         console.log('Fixed localhost URL with domain pattern:', url);
//       }
//       // If the above didn't match but URL still contains fm-uat-api.lockated.com somewhere
//       else if (url.includes('fm-uat-api.lockated.com')) {
//         url = 'https://fm-uat-api.lockated.com';
//         console.log('Fixed to default API URL:', url);
//       }
//     }

//     console.log('Final formatted URL:', url);
//     return url;
//   };

//   // Hard-coded API URL to ensure we're always using the correct one
//   const API_BASE_URL = 'https://fm-uat-api.lockated.com';

//   // Set up proper base URL at component mount if needed
//   useEffect(() => {
//     const currentBaseUrl = localStorage.getItem('baseUrl');

//     if (currentBaseUrl &&
//       (currentBaseUrl.includes('localhost') ||
//         !currentBaseUrl.startsWith('http'))) {

//       console.log('Found problematic baseUrl in localStorage:', currentBaseUrl);
//       console.log('Setting fixed API URL in localStorage:', API_BASE_URL);
//       localStorage.setItem('baseUrl', API_BASE_URL);
//     }
//   }, []);

//   // Fetch data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Always use our API base URL for this component
//         const baseUrl = API_BASE_URL;
//         const token = localStorage.getItem('token');

//         console.log('Using baseUrl:', baseUrl);

//         if (!token) {
//           setError('Authentication token not found');
//           setLoading(false);
//           return;
//         }

//         // First fetch entities to get their names
//         const entityMap = await fetchEntities(baseUrl, token);

//         // Then fetch utilization data
//         console.log('Fetching utilization data from:', `${baseUrl}/compile_utilizations.json`);
//         const response = await axios.get(`${baseUrl}/compile_utilizations.json`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });

//         console.log('Utilization data API response:', response.data);

//         if (!Array.isArray(response.data.compile_utilizations
//         )) {
//           console.warn('Utilization data is not an array:', response.data);
//           setError('Invalid response format from API');
//           setLoading(false);
//           return;
//         }

//         // Map API response to our component data structure
//         const mappedData: ConsumptionData[] = response.data.compile_utilizations.map((item: ApiConsumptionData) => {
//           console.log(`Using entity_name: ${item.entity_name} for entity ID: ${item.entity_id}`);

//           return {
//             id: item.id.toString(),
//             entity: item.entity_name || `Entity ID: ${item.entity_id}`,
//             fromDate: item.from_date,
//             toDate: item.to_date,
//             totalConsumption: item.total_consumption.toString(),
//             rate: item.rate.toString(),
//             amount: item.amount.toString(),
//             plantDetail: item.plant_detail_id?.toString() || '',
//             status: item.status,
//             readingType: item.reading_type,
//             url: item.url
//           };
//         });

//         console.log('Mapped data:', mappedData);
//         setConsumptionData(mappedData);
//         setLoading(false);
//       } catch (err: any) {
//         console.error('Error fetching consumption data:', err);
//         console.error('Error details:', err.response?.data || err.message);
//         setError(`Failed to fetch consumption data: ${err.response?.data?.message || err.message}`);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const filteredData = consumptionData.filter(item =>
//     item.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.id.includes(searchTerm)
//   );

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedItems(filteredData.map(item => item.id));
//     } else {
//       setSelectedItems([]);
//     }
//   };

//   const handleSelectItem = (itemId: string, checked: boolean) => {
//     if (checked) {
//       setSelectedItems(prev => [...prev, itemId]);
//     } else {
//       setSelectedItems(prev => prev.filter(id => id !== itemId));
//     }
//   };

//   const handleEdit = (item: any) => {
//     console.log('Edit item:', item);
//     // You can use item.url for the API endpoint to edit this specific consumption record
//     navigate(`/utility/utility-request/edit/${item.id}`);
//   };

//   const handleView = (item: any) => {
//     navigate(`/utility/utility-request/details/${item.id}`);
//   };

//   const handleAdd = () => {
//     navigate('/utility/utility-request/add');
//   };

//   const handleRefresh = () => {
//     setLoading(true);
//     setError(null);
//     // Re-fetch the data
//     const fetchData = async () => {
//       try {
//         // Use the hardcoded API URL for consistency
//         const baseUrl = API_BASE_URL;
//         const token = localStorage.getItem('token');

//         if (!token) {
//           setError('Authentication token not found');
//           setLoading(false);
//           return;
//         }

//         // First fetch entities to get their names
//         const entityMap = await fetchEntities(baseUrl, token);

//         // Then fetch utilization data
//         const response = await axios.get(`${baseUrl}/compile_utilizations.json`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });

//         // Map API response to our component data structure
//         const mappedData: ConsumptionData[] = response.data.compile_utilizations.map((item: ApiConsumptionData) => ({
//           id: item.id.toString(),
//           entity: item.entity_name || `Entity ID: ${item.entity_id}`,
//           fromDate: item.from_date,
//           toDate: item.to_date,
//           totalConsumption: item.total_consumption.toString(),
//           rate: item.rate.toString(),
//           amount: item.amount.toString(),
//           plantDetail: item.plant_detail_id?.toString() || '',
//           status: item.status,
//           readingType: item.reading_type,
//           url: item.url
//         }));

//         setConsumptionData(mappedData);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching consumption data:', err);
//         setError('Failed to fetch consumption data');
//         setLoading(false);
//       }
//     };

//     fetchData();
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'approved': return 'bg-green-100 text-green-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const renderCell = (item: any, columnKey: string) => {
//     switch (columnKey) {
//       case 'actions':
//         return (
//           <div className="flex items-center justify-center gap-2">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => handleEdit(item)}
//               className="h-8 w-8 p-0"
//             >
//               <Edit className="w-4 h-4" />
//             </Button>
//           </div>
//         );
//       case 'view':
//         return (
//           <div className="flex items-center justify-center gap-2">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => handleView(item)}
//               className="h-8 w-8 p-0"
//             >
//               <Eye className="w-4 h-4" />
//             </Button>
//           </div>
//         );
//       case 'entity':
//         return <span className="font-medium text-left">{item.entity}</span>;
//       case 'fromDate':
//         return item.fromDate || '-';
//       case 'toDate':
//         return item.toDate || '-';
//       case 'totalConsumption':
//         return <span className="font-medium">{item.totalConsumption}</span>;
//       case 'rate':
//         return item.rate || '-';
//       case 'amount':
//         return <span className="font-medium">{item.amount}</span>;
//       case 'plantDetail':
//         return item.plantDetail || '-';
//       case 'status':
//         return (
//           <Badge className={getStatusColor(item.status)}>
//             {item.status}
//           </Badge>
//         );
//       case 'readingType':
//         return item.readingType || '-';
//       default:
//         return item[columnKey] || '-';
//     }
//   };

//   const leftActions = (
//     <Button
//       onClick={handleAdd}
//       className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
//     >
//       <Plus className="w-4 h-4" />
//       Add
//     </Button>
//   )


//   return (
//     <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
//       {/* Breadcrumb */}
//       <div className="text-sm text-gray-600">
//         Utility &gt; Utility Request
//       </div>

//       {/* Page Title */}
//       <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">Customer Consumption</h1>

//       {/* Action Buttons */}
//       <div className="flex flex-wrap gap-3 justify-between">

//         {/* <Button
//             onClick={handleRefresh}
//             className="bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border border-gray-300"
//             disabled={loading}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${loading ? 'animate-spin' : ''}`}>
//               <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.7 2.84" />
//               <path d="M12 3v9l4-4" />
//             </svg>
//             {loading ? 'Refreshing...' : 'Refresh'}
//           </Button> */}
//       </div>

//       {/* Display error message if any */}
//       {error && (
//         <div className="p-4 bg-red-100 text-red-800 rounded">
//           {error}
//         </div>
//       )}

//       {/* Loading state */}
//       {loading ? (
//         <div className="flex justify-center items-center p-12">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C72030]"></div>
//           <span className="ml-2">Loading...</span>
//         </div>
//       ) : (
//         /* Enhanced Data Table */
//         <div>
//           <EnhancedTable
//             data={filteredData}
//             columns={columns}
//             renderCell={renderCell}
//             // onSelectAll={handleSelectAll}
//             // onSelectItem={handleSelectItem}
//             // selectedItems={selectedItems}
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             enableSearch={false}
//             enableExport={false}
//             hideColumnsButton={false}
//             pagination={true}
//             pageSize={15}
//             emptyMessage="No customer consumption data found"
//             // selectable={true}
//             storageKey="utility-request-table"
//             leftActions={leftActions}
//           />
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Eye } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import axios from 'axios';

// Define type for consumption data
interface ConsumptionData {
  id: string;
  entity: string;
  fromDate: string;
  toDate: string;
  totalConsumption: string;
  rate: string;
  amount: string;
  plantDetail: string;
  status: string;
  readingType: string;
  url?: string;
}

// Interface for the API response
interface ApiConsumptionData {
  id: number;
  entity_id: number;
  entity_name: string;
  from_date: string;
  to_date: string;
  total_consumption: number;
  rate: number;
  amount: number;
  plant_detail_id: number | null;
  status: string;
  reading_type: string;
  created_at: string;
  updated_at: string;
  url: string;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total_entries: number;
  total_pages: number;
}

// Column configuration for enhanced table
const columns: ColumnConfig[] = [
  { key: 'actions', label: 'Action', sortable: false, defaultVisible: true },
  { key: 'view', label: 'view', sortable: false, defaultVisible: true },
  { key: 'entity', label: 'Entity', sortable: true, defaultVisible: true },
  { key: 'fromDate', label: 'From date', sortable: true, defaultVisible: true },
  { key: 'toDate', label: 'To date', sortable: true, defaultVisible: true },
  { key: 'totalConsumption', label: 'Total consumption', sortable: true, defaultVisible: true },
  { key: 'rate', label: 'Rate', sortable: true, defaultVisible: true },
  { key: 'amount', label: 'Amount', sortable: true, defaultVisible: true },
  { key: 'plantDetail', label: 'Plant detail', sortable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
  { key: 'readingType', label: 'Reading type', sortable: true, defaultVisible: true },
];

const PAGE_SIZE = 15;

export const UtilityRequestDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [consumptionData, setConsumptionData] = useState<ConsumptionData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = localStorage.getItem('baseUrl') || '-';
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${baseUrl}/compile_utilizations.json?page=${page}&per_page=${PAGE_SIZE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!Array.isArray(response.data.compile_utilizations)) {
        throw new Error('Invalid response format from API');
      }

      const mappedData: ConsumptionData[] = response.data.compile_utilizations.map((item: ApiConsumptionData) => ({
        id: item.id.toString(),
        entity: item.entity_name || `Entity ID: ${item.entity_id}`,
        fromDate: item.from_date,
        toDate: item.to_date,
        totalConsumption: item.total_consumption.toString(),
        rate: item?.rate?.toString(),
        amount: item?.amount?.toString(),
        plantDetail: item.plant_detail_id?.toString() || '',
        status: item.status,
        readingType: item.reading_type,
        url: item.url,
      }));

      const pagination = response.data.pagination as Pagination;
      setConsumptionData(mappedData);
      setCurrentPage(page);
      setTotalPages(pagination.total_pages || 1);
      setTotalEntries(pagination.total_entries || 0);
    } catch (err: any) {
      console.error('Error fetching consumption data:', err);
      setError(`Failed to fetch consumption data: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const filteredData = consumptionData.filter(
    (item) =>
      item.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.includes(searchTerm)
  );

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || loading) {
      return;
    }

    await fetchData(page);
  };

  const handleEdit = (item: any) => {
    navigate(`/utility/utility-request/edit/${item.id}`);
  };

  const handleView = (item: any) => {
    navigate(`/utility/utility-request/details/${item.id}`);
  };

  const handleAdd = () => {
    navigate('/utility/utility-request/add');
  };

  const handleRefresh = () => {
    fetchData(currentPage);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="h-8 w-8 p-0">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        );
      case 'view':
        return (
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleView(item)} className="h-8 w-8 p-0">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        );
      case 'entity':
        return <span className="font-medium text-left">{item.entity}</span>;
      case 'fromDate':
        return item.fromDate || '-';
      case 'toDate':
        return item.toDate || '-';
      case 'totalConsumption':
        return <span className="font-medium">{item.totalConsumption}</span>;
      case 'rate':
        return item.rate || '-';
      case 'amount':
        return <span className="font-medium">{item.amount}</span>;
      case 'plantDetail':
        return item.plantDetail || '-';
      case 'status':
        return <Badge className={getStatusColor(item.status)}>{item.status}</Badge>;
      case 'readingType':
        return item.readingType || '-';
      default:
        return item[columnKey] || '-';
    }
  };

  const leftActions = (
    <Button
      onClick={handleAdd}
      className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
    >
      <Plus className="w-4 h-4" />
      Add
    </Button>
  );

  const renderPaginationItems = () => {
    if (!totalPages || totalPages <= 0) {
      return null;
    }
    const items = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
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

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">Utility &gt; Utility Request</div>

      {/* Page Title */}
      <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">
        Customer Consumption
      </h1>

      {/* Action Buttons */}


      {/* Display error message if any */}
      {error && <div className="p-4 bg-red-100 text-red-800 rounded">{error}</div>}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C72030]"></div>
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <>
          {/* Enhanced Data Table */}
          <div>
            <EnhancedTable
              data={filteredData}
              columns={columns}
              renderCell={renderCell}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              enableSearch={false}
              enableExport={false}
              hideColumnsButton={false}
              pagination={false}
              emptyMessage="No customer consumption data found"
              storageKey="utility-request-table"
              leftActions={leftActions}
            />
          </div>

          {/* Custom Pagination */}
          <div className="flex justify-center mt-6">
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
          </div>
        </>
      )}
    </div>
  );
};