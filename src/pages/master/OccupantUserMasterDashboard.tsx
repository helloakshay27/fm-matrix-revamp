// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useLayout } from '@/contexts/LayoutContext';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/store/store';
// import { fetchOccupantUsers } from '@/store/slices/occupantUsersSlice';
// import { fetchOccupantUserCounts } from '@/store/slices/occupantUserCountsSlice';
// import { StatsCard } from '@/components/StatsCard';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { Users, Download, X, Eye, Plus } from 'lucide-react';
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from '@/components/ui/pagination';
// import { ColumnConfig } from '@/hooks/useEnhancedTable';
// import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
// import { toast } from 'sonner';
// import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
// import axios from 'axios';


// export const OccupantUserMasterDashboard = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const [filterDialogOpen, setFilterDialogOpen] = useState(false);
//   const [occupantUser, setOccupantUser] = useState([])
//   const [pagination, setPagination] = useState({
//     current_page: 1,
//     total_count: 0,
//     total_pages: 0,
//   });
//   const [filters, setFilters] = useState({
//     name: '',
//     email: '',
//     mobile: '',
//     status: '',
//     entity: ''
//   });

//   const { users: occupantUsersData, pagination: statePagination, loading } = useSelector((state: RootState) => state.occupantUsers as any);
//   const occupantUserCounts = useSelector((state: RootState) => state.occupantUserCounts);
//   const { total: totalUsers = 0, approved: approvedUsers = 0, pending: pendingUsers = 0, rejected: rejectedUsers = 0, appDownloaded = 0 } = occupantUserCounts || {};

//   const [showActionPanel, setShowActionPanel] = useState<boolean>(false);

//   useEffect(() => {
//     const data: any = occupantUsersData;
//     if (data?.transformedUsers) {
//       setOccupantUser(data.transformedUsers);
//       setPagination({
//         current_page: statePagination?.current_page ?? data.pagination?.current_page ?? 1,
//         total_count: statePagination?.total_count ?? data.pagination?.total_count ?? 0,
//         total_pages: statePagination?.total_pages ?? data.pagination?.total_pages ?? 0,
//       });
//     } else if (Array.isArray(data)) {
//       setOccupantUser(data);
//       setPagination((prev) => ({
//         current_page: statePagination?.current_page ?? prev.current_page,
//         total_count: statePagination?.total_count ?? prev.total_count,
//         total_pages: statePagination?.total_pages ?? prev.total_pages,
//       }));
//     }
//   }, [occupantUsersData, statePagination])

//   const handleFilterChange = (field: string, value: string) => {
//     setFilters(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleApplyFilters = () => {
//     toast.success('Filters applied successfully');
//     setFilterDialogOpen(false);
//   };

//   const handleResetFilters = () => {
//     setFilters({
//       name: '',
//       email: '',
//       mobile: '',
//       status: '',
//       entity: ''
//     });
//     toast.success('Filters reset successfully');
//     setFilterDialogOpen(false);
//   };

//   const handleExport = async () => {
//     try {
//       // Create CSV data
//       const response = await axios.get(
//         `https://${localStorage.getItem("baseUrl")}/pms/account_setups/export_occupant_users.xlsx`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           responseType: "blob",
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "occupant_users.xlsx");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       toast.success('Data exported successfully');
//     } catch (error) {
//       toast.error('Failed to export data');
//     }
//   };

//   const { setCurrentSection } = useLayout();

//   useEffect(() => {
//     setCurrentSection('Master');
//     dispatch(fetchOccupantUsers({ page: pagination.current_page, perPage: 10 }));
//     dispatch(fetchOccupantUserCounts());
//   }, [setCurrentSection, dispatch]);

//   const columns: ColumnConfig[] = [
//     { key: "id", label: "ID", sortable: true, draggable: true },
//     { key: "company", label: "Company", sortable: true, draggable: true },
//     { key: "name", label: "Name", sortable: true, draggable: true },
//     { key: "mobile", label: "Mobile Number", sortable: true, draggable: true },
//     { key: "email", label: "Email", sortable: true, draggable: true },
//     { key: "status", label: "Status", sortable: true, draggable: true },
//   ];

//   const handlePageChange = async (page: number) => {
//     setPagination((prev) => ({
//       ...prev,
//       current_page: page,
//     }));
//     try {
//       dispatch(fetchOccupantUsers({ page: page, perPage: 10 }));
//     } catch (error) {
//       toast.error('Failed to fetch bookings');
//     }
//   };

//   const renderPaginationItems = () => {
//     if (!pagination.total_pages || pagination.total_pages <= 0) {
//       return null;
//     }
//     const items = [];
//     const totalPages = pagination.total_pages;
//     const currentPage = pagination.current_page;
//     const showEllipsis = totalPages > 7;

//     if (showEllipsis) {
//       items.push(
//         <PaginationItem key={1} className='cursor-pointer'>
//           <PaginationLink
//             onClick={() => handlePageChange(1)}
//             isActive={currentPage === 1}
//             className={loading ? 'pointer-events-none opacity-50' : ''}
//           >
//             1
//           </PaginationLink>
//         </PaginationItem>
//       );

//       if (currentPage > 4) {
//         items.push(
//           <PaginationItem key="ellipsis1" >
//             <PaginationEllipsis />
//           </PaginationItem>
//         );
//       } else {
//         for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
//           items.push(
//             <PaginationItem key={i} className='cursor-pointer'>
//               <PaginationLink
//                 onClick={() => handlePageChange(i)}
//                 isActive={currentPage === i}
//                 className={loading ? 'pointer-events-none opacity-50' : ''}
//               >
//                 {i}
//               </PaginationLink>
//             </PaginationItem>
//           );
//         }
//       }

//       if (currentPage > 3 && currentPage < totalPages - 2) {
//         for (let i = currentPage - 1; i <= currentPage + 1; i++) {
//           items.push(
//             <PaginationItem key={i} className='cursor-pointer'>
//               <PaginationLink
//                 onClick={() => handlePageChange(i)}
//                 isActive={currentPage === i}
//                 className={loading ? 'pointer-events-none opacity-50' : ''}
//               >
//                 {i}
//               </PaginationLink>
//             </PaginationItem>
//           );
//         }
//       }

//       if (currentPage < totalPages - 3) {
//         items.push(
//           <PaginationItem key="ellipsis2">
//             <PaginationEllipsis />
//           </PaginationItem>
//         );
//       } else {
//         for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
//           if (!items.find((item) => item.key === i.toString())) {
//             items.push(
//               <PaginationItem key={i} className='cursor-pointer'>
//                 <PaginationLink
//                   onClick={() => handlePageChange(i)}
//                   isActive={currentPage === i}
//                   className={loading ? 'pointer-events-none opacity-50' : ''}
//                 >
//                   {i}
//                 </PaginationLink>
//               </PaginationItem>
//             );
//           }
//         }
//       }

//       if (totalPages > 1) {
//         items.push(
//           <PaginationItem key={totalPages} className='cursor-pointer'>
//             <PaginationLink
//               onClick={() => handlePageChange(totalPages)}
//               isActive={currentPage === totalPages}
//               className={loading ? 'pointer-events-none opacity-50' : ''}
//             >
//               {totalPages}
//             </PaginationLink>
//           </PaginationItem>
//         );
//       }
//     } else {
//       for (let i = 1; i <= totalPages; i++) {
//         items.push(
//           <PaginationItem key={i} className='cursor-pointer'>
//             <PaginationLink
//               onClick={() => handlePageChange(i)}
//               isActive={currentPage === i}
//               className={loading ? 'pointer-events-none opacity-50' : ''}
//             >
//               {i}
//             </PaginationLink>
//           </PaginationItem>
//         );
//       }
//     }

//     return items;
//   };

//   const renderCell = (user: any, columnKey: string) => {
//     switch (columnKey) {
//       case "status":
//         return (
//           <Badge
//             variant={
//               user.status === 'approved' ? 'default' :
//                 (user.status === 'pending' || user.status === null) ? 'secondary' :
//                   'destructive'
//             }
//             className={
//               user.status === 'approved' ? 'bg-green-100 text-green-800' :
//                 (user.status === 'pending' || user.status === null) ? 'bg-yellow-100 text-yellow-800' :
//                   'bg-red-100 text-red-800'
//             }
//           >
//             {user.status === null
//               ? 'Pending'
//               : user.status.charAt(0).toUpperCase() + user.status.slice(1)}
//           </Badge>
//         );
//       default:
//         return user[columnKey];
//     }
//   };

//   const leftActions = (
//     <>
//       <Button
//         onClick={() => setShowActionPanel(true)}
//         className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 border-0"
//       >
//         <Plus className="w-4 h-4" />
//         Action
//       </Button>
//     </>
//   );

//   return (
//     <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
//       <div className="w-full space-y-6">

//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-semibold text-[#1a1a1a]">Occupant Users</h1>
//         </div>

//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//           <StatsCard
//             title="Total Users"
//             value={totalUsers}
//             icon={<Users className="w-6 h-6" />}
//           />
//           <StatsCard
//             title="Approved"
//             value={approvedUsers}
//             icon={<Users className="w-6 h-6" />}
//           />
//           <StatsCard
//             title="Pending"
//             value={pendingUsers}
//             icon={<Users className="w-6 h-6" />}
//           />
//           <StatsCard
//             title="Rejected"
//             value={rejectedUsers}
//             icon={<Users className="w-6 h-6" />}
//           />
//           <StatsCard
//             title="App Downloaded"
//             value={appDownloaded}
//             icon={<Download className="w-6 h-6" />}
//           />
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <EnhancedTable
//             data={occupantUser}
//             columns={columns}
//             renderCell={renderCell}
//             renderActions={(item: any) => (
//               <div className="flex justify-center">
//                 <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); navigate(`/master/user/occupant-users/view/${item.id}`); }} title="View">
//                   <Eye className="w-4 h-4" />
//                 </Button>
//               </div>
//             )}
//             onFilterClick={() => setFilterDialogOpen(true)}
//             enableExport
//             handleExport={handleExport}
//             storageKey="fm-user-master-table"
//             searchPlaceholder="Search users..."
//             loading={loading}
//             leftActions={leftActions}
//           />
//         </div>

//         <div className="flex justify-center mt-6">
//           <Pagination>
//             <PaginationContent>
//               <PaginationItem>
//                 <PaginationPrevious
//                   onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
//                   className={pagination.current_page === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
//                 />
//               </PaginationItem>
//               {renderPaginationItems()}
//               <PaginationItem>
//                 <PaginationNext
//                   onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
//                   className={pagination.current_page === pagination.total_pages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
//                 />
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </div>
//       </div>

//       {showActionPanel && (
//         <SelectionPanel
//           onAdd={() => navigate('/master/user/occupant-users/add')}
//           onImport={() => { }}
//           onClearSelection={() => setShowActionPanel(false)}
//         />
//       )}

//       {/* Filter Dialog */}
//       <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
//         <DialogContent className="sm:max-w-[600px] p-0 bg-white">
//           <DialogHeader className="p-6 pb-4 border-b">
//             <div className="flex items-center justify-between">
//               <DialogTitle className="text-xl font-semibold">FILTER</DialogTitle>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setFilterDialogOpen(false)}
//                 className="h-6 w-6 p-0"
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </DialogHeader>

//           <div className="p-6 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Name Field */}
//               <div>
//                 <Label className="text-sm font-medium text-gray-700 mb-2 block">Name</Label>
//                 <Input
//                   value={filters.name}
//                   onChange={(e) => handleFilterChange('name', e.target.value)}
//                   placeholder=""
//                   className="w-full"
//                 />
//               </div>

//               {/* Email Field */}
//               <div>
//                 <Label className="text-sm font-medium text-gray-700 mb-2 block">Email</Label>
//                 <Input
//                   value={filters.email}
//                   onChange={(e) => handleFilterChange('email', e.target.value)}
//                   placeholder=""
//                   className="w-full"
//                 />
//               </div>

//               {/* Mobile Number Field */}
//               <div>
//                 <Label className="text-sm font-medium text-gray-700 mb-2 block">Mobile Number</Label>
//                 <Input
//                   value={filters.mobile}
//                   onChange={(e) => handleFilterChange('mobile', e.target.value)}
//                   placeholder=""
//                   className="w-full"
//                 />
//               </div>

//               {/* Status Field */}
//               <div>
//                 <Label className="text-sm font-medium text-gray-700 mb-2 block">Status</Label>
//                 <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
//                   <SelectTrigger className="w-full bg-white">
//                     <SelectValue placeholder="Select Status" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white border shadow-lg z-50">
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="approved">Approved</SelectItem>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="rejected">Rejected</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Entity Field */}
//               <div className="md:col-span-1">
//                 <Label className="text-sm font-medium text-gray-700 mb-2 block">Entity</Label>
//                 <Select value={filters.entity} onValueChange={(value) => handleFilterChange('entity', value)}>
//                   <SelectTrigger className="w-full bg-white">
//                     <SelectValue placeholder="Select Entity" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white border shadow-lg z-50">
//                     <SelectItem value="all">All Entities</SelectItem>
//                     <SelectItem value="entity1">Entity 1</SelectItem>
//                     <SelectItem value="entity2">Entity 2</SelectItem>
//                     <SelectItem value="entity3">Entity 3</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end gap-3 pt-4 border-t">
//               <Button
//                 onClick={handleResetFilters}
//                 variant="outline"
//                 className="bg-white text-gray-700 hover:bg-gray-50 border-gray-300 px-6 py-2"
//               >
//                 Reset
//               </Button>
//               <Button
//                 onClick={handleApplyFilters}
//                 className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2"
//               >
//                 Apply
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };




import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchOccupantUsers } from '@/store/slices/occupantUsersSlice';
import { fetchOccupantUserCounts } from '@/store/slices/occupantUserCountsSlice';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, Download, X, Eye, Plus } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { toast } from 'sonner';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import axios from 'axios';

export const OccupantUserMasterDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [occupantUser, setOccupantUser] = useState([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    mobile: '',
    status: '',
    entity: ''
  });

  const { users: occupantUsersData, pagination: statePagination, loading } = useSelector((state: RootState) => state.occupantUsers as any);
  const occupantUserCounts = useSelector((state: RootState) => state.occupantUserCounts);
  const { total: totalUsers = 0, approved: approvedUsers = 0, pending: pendingUsers = 0, rejected: rejectedUsers = 0, appDownloaded = 0 } = occupantUserCounts || {};

  const [showActionPanel, setShowActionPanel] = useState<boolean>(false);

  useEffect(() => {
    const data: any = occupantUsersData;
    if (data?.transformedUsers) {
      setOccupantUser(data.transformedUsers);
      setPagination({
        current_page: statePagination?.current_page ?? data.pagination?.current_page ?? 1,
        total_count: statePagination?.total_count ?? data.pagination?.total_count ?? 0,
        total_pages: statePagination?.total_pages ?? data.pagination?.total_pages ?? 0,
      });
    } else if (Array.isArray(data)) {
      setOccupantUser(data);
      setPagination((prev) => ({
        current_page: statePagination?.current_page ?? prev.current_page,
        total_count: statePagination?.total_count ?? prev.total_count,
        total_pages: statePagination?.total_pages ?? prev.total_pages,
      }));
    }
  }, [occupantUsersData, statePagination])

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    toast.success('Filters applied successfully');
    setFilterDialogOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      name: '',
      email: '',
      mobile: '',
      status: '',
      entity: ''
    });
    toast.success('Filters reset successfully');
    setFilterDialogOpen(false);
  };

  const handleExport = async () => {
    try {
      // Create CSV data
      const response = await axios.get(
        `https://${localStorage.getItem("baseUrl")}/pms/account_setups/export_occupant_users.xlsx`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "occupant_users.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const { setCurrentSection } = useLayout();

  useEffect(() => {
    setCurrentSection('Master');
    dispatch(fetchOccupantUsers({ page: pagination.current_page, perPage: 10 }));
    dispatch(fetchOccupantUserCounts());
  }, [setCurrentSection, dispatch]);

  const columns: ColumnConfig[] = [
    { key: "id", label: "ID", sortable: true, draggable: true },
    { key: "company", label: "Company", sortable: true, draggable: true },
    { key: "name", label: "Name", sortable: true, draggable: true },
    { key: "mobile", label: "Mobile Number", sortable: true, draggable: true },
    { key: "email", label: "Email", sortable: true, draggable: true },
    { key: "status", label: "Status", sortable: true, draggable: true },
  ];

  const handlePageChange = async (page: number) => {
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
    try {
      dispatch(fetchOccupantUsers({ page: page, perPage: 10 }));
    } catch (error) {
      toast.error('Failed to fetch bookings');
    }
  };

  const renderPaginationItems = () => {
    if (!pagination.total_pages || pagination.total_pages <= 0) {
      return null;
    }
    const items = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      items.push(
        <PaginationItem key={1} className='cursor-pointer'>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className={loading ? 'pointer-events-none opacity-50' : ''}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1" >
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i} className='cursor-pointer'>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                className={loading ? 'pointer-events-none opacity-50' : ''}
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
            <PaginationItem key={i} className='cursor-pointer'>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                className={loading ? 'pointer-events-none opacity-50' : ''}
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
              <PaginationItem key={i} className='cursor-pointer'>
                <PaginationLink
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                  className={loading ? 'pointer-events-none opacity-50' : ''}
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
          <PaginationItem key={totalPages} className='cursor-pointer'>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              className={loading ? 'pointer-events-none opacity-50' : ''}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className='cursor-pointer'>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={loading ? 'pointer-events-none opacity-50' : ''}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  // Status update functionality
  const getStatusBadgeProps = (status: string | null) => {
    if (status === "approved" || status === "active") {
      return {
        variant: "default" as const,
        className: "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer",
        children: "Approved",
      };
    } else if (status === "pending") {
      return {
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer",
        children: "Pending",
      };
    } else if (status === "rejected") {
      return {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer",
        children: "Rejected",
      };
    } else {
      return {
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer",
        children: "Pending",
      };
    }
  };

  const handleStatusClick = (user: any) => {
    console.log(user)
    setSelectedUser(user);
    setSelectedStatus(user.status ?? "pending");
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedUser?.lockUserId) return;

    try {
      const baseUrl = localStorage.getItem("baseUrl") ?? "";
      const token = localStorage.getItem("token") ?? "";

      const response = await fetch(
        `https://${baseUrl}/pms/users/status_update?id=${selectedUser.lockUserId}&status=${selectedStatus}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      // Update local state
      setOccupantUser((prevUsers: any[]) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
              ...user,
              status: selectedStatus,
            }
            : user
        )
      );

      toast.success("User status updated successfully!");
      dispatch(fetchOccupantUserCounts()); // Refresh counts
      setStatusDialogOpen(false);
      setSelectedUser(null);
      setSelectedStatus("");
    } catch (error: unknown) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status.");
    }
  };

  const renderCell = (user: any, columnKey: string) => {
    switch (columnKey) {
      case "status":
        return (
          <Badge
            {...getStatusBadgeProps(user.status)}
            onClick={() => handleStatusClick(user)}
          />
        );
      default:
        return user[columnKey];
    }
  };

  const leftActions = (
    <>
      <Button
        onClick={() => setShowActionPanel(true)}
        className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 border-0"
      >
        <Plus className="w-4 h-4" />
        Action
      </Button>
    </>
  );

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="w-full space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">Occupant Users</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatsCard
            title="Total Users"
            value={totalUsers}
            icon={<Users className="w-6 h-6" />}
          />
          <StatsCard
            title="Approved"
            value={approvedUsers}
            icon={<Users className="w-6 h-6" />}
          />
          <StatsCard
            title="Pending"
            value={pendingUsers}
            icon={<Users className="w-6 h-6" />}
          />
          <StatsCard
            title="Rejected"
            value={rejectedUsers}
            icon={<Users className="w-6 h-6" />}
          />
          <StatsCard
            title="App Downloaded"
            value={appDownloaded}
            icon={<Download className="w-6 h-6" />}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <EnhancedTable
            data={occupantUser}
            columns={columns}
            renderCell={renderCell}
            renderActions={(item: any) => (
              <div className="flex justify-center">
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); navigate(`/master/user/occupant-users/view/${item.id}`); }} title="View">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            )}
            onFilterClick={() => setFilterDialogOpen(true)}
            enableExport
            handleExport={handleExport}
            storageKey="fm-user-master-table"
            searchPlaceholder="Search users..."
            loading={loading}
            leftActions={leftActions}
          />
        </div>

        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                  className={pagination.current_page === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                  className={pagination.current_page === pagination.total_pages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {showActionPanel && (
        <SelectionPanel
          onAdd={() => navigate('/master/user/occupant-users/add')}
          onImport={() => { }}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 bg-white">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">FILTER</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterDialogOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Name</Label>
                <Input
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  placeholder=""
                  className="w-full"
                />
              </div>

              {/* Email Field */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Email</Label>
                <Input
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  placeholder=""
                  className="w-full"
                />
              </div>

              {/* Mobile Number Field */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Mobile Number</Label>
                <Input
                  value={filters.mobile}
                  onChange={(e) => handleFilterChange('mobile', e.target.value)}
                  placeholder=""
                  className="w-full"
                />
              </div>

              {/* Status Field */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Status</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Entity Field */}
              <div className="md:col-span-1">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Entity</Label>
                <Select value={filters.entity} onValueChange={(value) => handleFilterChange('entity', value)}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Entity" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="all">All Entities</SelectItem>
                    <SelectItem value="entity1">Entity 1</SelectItem>
                    <SelectItem value="entity2">Entity 2</SelectItem>
                    <SelectItem value="entity3">Entity 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="bg-white text-gray-700 hover:bg-gray-50 border-gray-300 px-6 py-2"
              >
                Reset
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2"
              >
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 bg-white">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                Update Status
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusDialogOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="px-6 py-3 space-y-6">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                <SelectItem value="Select Status" disabled className="text-gray-400">
                  Select Status
                </SelectItem>
                <SelectItem value="approved" className="hover:bg-blue-50">
                  Approved
                </SelectItem>
                <SelectItem value="rejected" className="hover:bg-blue-50">
                  Rejected
                </SelectItem>
                <SelectItem value="pending" className="hover:bg-blue-50">
                  Pending
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex justify-center">
              <Button
                onClick={handleStatusUpdate}
                className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2 rounded-md"
                disabled={!selectedStatus || selectedStatus === "Select Status"}
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};