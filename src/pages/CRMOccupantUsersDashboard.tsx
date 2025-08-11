import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Eye } from 'lucide-react';
import { CRMOccupantUsersFilterDialog } from '@/components/CRMOccupantUsersFilterDialog';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { exportOccupantUsers, fetchOccupantUsers } from '@/store/slices/occupantUsersSlice';
import { toast } from 'sonner';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

// Define column configuration for EnhancedTable
const columns: ColumnConfig[] = [
  { key: 'id', label: 'ID', sortable: true, defaultVisible: true },
  { key: 'name', label: 'User Name', sortable: true, defaultVisible: true },
  { key: 'gender', label: 'Gender', sortable: true, defaultVisible: true },
  { key: 'mobile', label: 'Mobile Number', sortable: true, defaultVisible: true },
  { key: 'email', label: 'Email', sortable: true, defaultVisible: true },
  { key: 'unit', label: 'Unit', sortable: true, defaultVisible: true },
  { key: 'department', label: 'Department', sortable: true, defaultVisible: true },
  { key: 'employeeId', label: 'Employee ID', sortable: true, defaultVisible: true },
  { key: 'accessLevel', label: 'Access Level', sortable: true, defaultVisible: true },
  { key: 'type', label: 'User Type', sortable: true, defaultVisible: true },
  { key: 'active', label: 'Active', sortable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
  { key: 'faceRecognition', label: 'Face Recognition', sortable: true, defaultVisible: true },
  { key: 'appDownloaded', label: 'App Download', sortable: true, defaultVisible: true },
];

const CRMOccupantUsersDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const { users: occupantUsersData, loading } = useAppSelector((state: RootState) => state.occupantUsers);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [occupantUsers, setOccupantUsers] = useState([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });

  console.log(occupantUsersData)

  useEffect(() => {
    if (occupantUsersData?.transformedUsers) {
      setOccupantUsers(occupantUsersData?.transformedUsers)
      setPagination({
        current_page: occupantUsersData.pagination?.current_page,
        total_count: occupantUsersData.pagination?.total_count,
        total_pages: occupantUsersData.pagination?.total_pages
      })
    }
  }, [occupantUsersData.transformedUsers])

  useEffect(() => {
    dispatch(fetchOccupantUsers({ page: pagination.current_page, perPage: 10 }));
  }, [dispatch]);

  const handleExport = async () => {
    try {
      const data = await dispatch(
        exportOccupantUsers({ token, baseUrl })
      ).unwrap();

      const blob = new Blob(
        [data],
        {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      );
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'occupant_users.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Export failed');
    }
  };


  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

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
            disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                  disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const renderCell = (user: any, columnKey: string) => {
    switch (columnKey) {
      case "status":
        return (
          <Badge
            variant={
              user.status === 'approved' ? 'default' :
                user.status === 'pending' ? 'secondary' :
                  'destructive'
            }
            className={
              user.status === 'approved' ? 'bg-green-100 text-green-800' :
                user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
            }
          >
            {user.status}
          </Badge>
        );
      default:
        return user[columnKey];
    }
  };

  // Render actions for each row
  const renderActions = (user: any) => (
    <Button variant="ghost" size="sm" onClick={() => navigate(`/crm/occupant-users/${user.id}`)}>
      <Eye className="w-4 h-4" />
    </Button>
  );

  console.log(occupantUsers)

  return (
    <div className="p-6 space-y-6">
      <EnhancedTable
        data={occupantUsers}
        columns={columns}
        renderActions={renderActions}
        renderCell={renderCell}
        storageKey="crm-occupant-users-table"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search users..."
        enableExport={true}
        exportFileName="occupant_users"
        enableSearch={true}
        enableSelection={true}
        loading={loading}
        handleExport={handleExport}
        onFilterClick={() => setFilterDialogOpen(true)}
      />

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

      <CRMOccupantUsersFilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
      />
    </div>
  );
};

export default CRMOccupantUsersDashboard;