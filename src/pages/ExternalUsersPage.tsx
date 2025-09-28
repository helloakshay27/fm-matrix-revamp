import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Edit, Eye, Plus } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { fetchProjectExternalUsers } from '@/store/slices/projectUsersSlice';
import { toast } from 'sonner';
import ExternalUserModal from '@/components/ExternalUserModal';
import { fetchCompanies } from '@/store/slices/projectCompanySlice';
import { fetchProjectRoles } from '@/store/slices/projectRoleSlice';
import { fetchOrganizations } from '@/store/slices/organizationsSlice';
import { getFMUsers } from '@/store/slices/fmUserSlice';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface ExternalUser {
  id: number;
  firstname: string;
  lastname: string;
  organization_name: string;
  user_company_name: string;
  mobile: string;
  email: string;
  lock_role: {
    name: string;
  };
  lock_user_permission: {
    active: boolean;
  }
  invite: string;
  active: boolean;
}

const columns: ColumnConfig[] = [
  {
    key: 'userName',
    label: 'User Name',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'organisation',
    label: 'Organisation',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'company',
    label: 'Company',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'mobileNo',
    label: 'Mobile No.',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'emailId',
    label: 'Email Id',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'role',
    label: 'Role',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'invitationStatus',
    label: 'Invitation Status',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'active',
    label: 'Status',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

const transformedUser = (data) => {
  return data.map((item: ExternalUser) => {
    return {
      userName: item.firstname + ' ' + item.lastname,
      mobileNo: item.mobile,
      emailId: item.email,
      company: item?.user_company_name,
      role: item?.lock_role?.name,
      active: item?.lock_user_permission?.active ?? false,
      organization: item.organization_name,
      invitationStatus: item.invite,

    };
  });
};

export const ExternalUsersPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [record, setRecord] = useState<ExternalUser | {}>({});
  const [externalUsersData, setExternalUsersData] = useState<ExternalUser[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});
  const [organizations, setOrganizations] = useState([])
  const [companies, setCompanies] = useState([])
  const [rolesData, setRolesData] = useState([])

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });

  const fetchUsers = async (page = 1, filterParams = {}) => {
    setLoadingData(true);
    try {
      const response = await dispatch(
        getFMUsers({ baseUrl, token, perPage: 10, currentPage: page, ...filterParams })
      ).unwrap();
      setExternalUsersData(transformedUser(response.fm_users));
      setPagination({
        current_page: response.current_page,
        total_count: response.total_count,
        total_pages: response.total_pages,
      });
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to fetch users.");
    } finally {
      setLoadingData(false);
    }
  };

  const getOrganizations = async () => {
    try {
      const response = await dispatch(fetchOrganizations({ baseUrl, token })).unwrap();
      setOrganizations(response.organizations)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  const getCompanies = async () => {
    try {
      const response = await dispatch(fetchCompanies({ baseUrl, token })).unwrap();
      setCompanies(response)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  const getRoles = async () => {
    try {
      const response = await dispatch(fetchProjectRoles({ baseUrl, token })).unwrap();
      setRolesData(response)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  useEffect(() => {
    fetchUsers(1, {
      employee_type: 'external'
    });
    getOrganizations();
    // getCompanies();
    getRoles();
  }, [])

  const renderCell = (item, columnKey: string) => {
    switch (columnKey) {
      case 'invitationStatus':
        const statusStyles = {
          'Accepted': 'bg-green-100 text-green-800',
          'Pending': 'bg-yellow-100 text-yellow-800',
          'Declined': 'bg-red-100 text-red-800',
          'Expired': 'bg-gray-100 text-gray-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[item.invite as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
            {item.invite}
          </span>
        );
      case 'active':
        return (
          <Switch
            checked={item.active}
            onCheckedChange={() => { }}
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            disabled={updatingStatus[item.id]}
          />
        );
      default:
        return item[columnKey as keyof ExternalUser] || '-';
    }
  };

  const renderActions = (item: ExternalUser) => {
    return (
      <div className="flex gap-2 justify-center">
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => navigate(`/settings/manage-users/external-users/${item.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button>
        {/* <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => {
            setIsEditing(true);
            setShowAddModal(true);
            setRecord(item);
          }}
        >
          <Edit className="w-4 h-4" />
        </Button> */}
      </div>
    );
  };

  const leftActions = (
    <Button
      className="bg-[#C72030] hover:bg-[#A01020] text-white"
      onClick={() => setShowAddModal(true)}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  );

  const handlePageChange = async (page: number) => {
    console.log(page)
    if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loadingData) {
      return;
    }

    try {
      setPagination((prev) => ({ ...prev, current_page: page }));
      fetchUsers(page, {
        employee_type: 'external'
      });
    } catch (error) {
      console.error("Error changing page:", error);
      toast.error("Failed to load page data. Please try again.");
    }
  };

  const renderPaginationItems = () => {
    if (!pagination.total_pages || pagination.total_pages <= 0) {
      return null;
    }
    const items: JSX.Element[] = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      items.push(
        <PaginationItem key={1} className="cursor-pointer">
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            aria-disabled={loadingData} // accessibility-friendly way
            className={loadingData ? "pointer-events-none opacity-50" : ""}
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
                aria-disabled={loadingData} // accessibility-friendly way
                className={loadingData ? "pointer-events-none opacity-50" : ""}
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
                aria-disabled={loadingData} // accessibility-friendly way
                className={loadingData ? "pointer-events-none opacity-50" : ""}
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
                  aria-disabled={loadingData} // accessibility-friendly way
                  className={loadingData ? "pointer-events-none opacity-50" : ""}
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
              aria-disabled={loadingData} // accessibility-friendly way
              className={loadingData ? "pointer-events-none opacity-50" : ""}
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
              aria-disabled={loadingData} // accessibility-friendly way
              className={loadingData ? "pointer-events-none opacity-50" : ""}
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
    <div className="p-6">
      <EnhancedTable
        data={[...externalUsersData].reverse()}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        // leftActions={leftActions}
        pagination={true}
        pageSize={10}
        loading={loadingData}
      />

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                className={pagination.current_page === 1 || loadingData ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                className={pagination.current_page === pagination.total_pages || loadingData ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* <ExternalUserModal
        openDialog={showAddModal}
        handleCloseDialog={() => setShowAddModal(false)}
        isEditing={isEditing}
        record={record}
        fetchData={fetchUsers}
        companies={companies}
        roles={rolesData}
        organizations={organizations}
      /> */}
    </div>
  );
};