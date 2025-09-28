import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Edit, Eye, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { fetchProjectRoles } from '@/store/slices/projectRoleSlice';
import { fetchFMUsers, getFMUsers } from '@/store/slices/fmUserSlice';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface InternalUser {
  id: number;
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
  user_company_name: string;
  lock_role: {
    name: string;
  };
  report_to: {
    name: string;
  };
  associated_projects_count: string;
  lock_user_permission: {
    active: boolean;
  };
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
    key: 'company',
    label: 'Company',
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
    key: 'reportsTo',
    label: 'Reports To',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'associatedProjects',
    label: 'Associated Projects',
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
  return data.map((item: InternalUser) => {
    return {
      userName: item.firstname + ' ' + item.lastname,
      mobileNo: item.mobile,
      emailId: item.email,
      company: item?.user_company_name,
      role: item?.lock_role?.name,
      reportsTo: item?.report_to?.name,
      associatedProjects: item?.associated_projects_count,
      active: item?.lock_user_permission?.active ?? false,
    };
  });
};

export const InternalUsersPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [record, setRecord] = useState<InternalUser | {}>({});
  const [internalUsersData, setInternalUsersData] = useState<InternalUser[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});
  const [companies, setCompanies] = useState([])
  const [rolesData, setRolesData] = useState([])
  const [users, setUsers] = useState([])

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
      setInternalUsersData(transformedUser(response.fm_users));
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

  const getRoles = async () => {
    try {
      const response = await dispatch(fetchProjectRoles({ baseUrl, token })).unwrap();
      setRolesData(response)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  const getUsers = async () => {
    try {
      const response = await dispatch(fetchFMUsers()).unwrap();
      setUsers(response.users)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  useEffect(() => {
    fetchUsers(1, {
      employee_type: 'internal'
    });
    getRoles();
    getUsers();
  }, []);

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
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
        return item[columnKey as keyof InternalUser] || '-';
    }
  };

  const renderActions = (item: InternalUser) => {
    return (
      <div className="flex justify-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => navigate(`/settings/manage-users/internal-users/${item.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button>
        {/* <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => {
            setIsEditing(true);
            setShowModal(true);
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
      onClick={() => setShowModal(true)}
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
        employee_type: 'internal'
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
        data={[...internalUsersData].reverse()}
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

      {/* <InternalUsersModal
        openDialog={showModal}
        handleCloseDialog={() => setShowModal(false)}
        isEditing={isEditing}
        record={record}
        fetchData={fetchUsers}
        roles={rolesData}
        users={users}
      /> */}
    </div>
  );
};