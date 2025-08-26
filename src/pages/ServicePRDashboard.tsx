import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ServicePRFilterDialog } from "@/components/ServicePRFilterDialog";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getServicePr } from "@/store/slices/servicePRSlice";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const columns: ColumnConfig[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "external_id",
    label: "PR No.",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "reference_number",
    label: "Reference No.",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "supplier",
    label: "Supplier Name",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "created_by",
    label: "Created By",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "created_on",
    label: "Created On",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "last_approved_by",
    label: "Last Approved By",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "approved_status",
    label: "Approved Status",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "total_amount",
    label: "PR Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "active",
    label: "Active/Inactive",
    sortable: false,
    draggable: true,
    defaultVisible: true,
  },
];

export const ServicePRDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const { loading } = useAppSelector(state => state.getServicePr)

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [servicePR, setServicePR] = useState([]);
  const [filters, setFilters] = useState({
    referenceNumber: '',
    prNumber: '',
    supplierName: '',
    approvalStatus: 'Select'
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });

  const fetchData = async (filterParams = {}) => {
    try {
      const response = await dispatch(
        getServicePr({ baseUrl, token, page: pagination.current_page, per_page: 10, ...filterParams })
      ).unwrap();
      setServicePR(response.work_orders);
      setPagination({
        current_page: response.current_page,
        total_count: response.total_count,
        total_pages: response.total_pages
      })
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyFilters = (newFilters: {
    referenceNumber: string;
    prNumber: string;
    supplierName: string;
    approvalStatus: string;
  }) => {
    setFilters(newFilters);
    fetchData({
      reference_number: newFilters.referenceNumber,
      external_id: newFilters.prNumber,
      supplier_name: newFilters.supplierName,
      approval_status: newFilters.approvalStatus,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "pending":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "approved_status":
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
              item.approved_status
            )}`}
          >
            {item.approved_status}
          </span>
        );
      case "active":
        return (
          <input
            type="checkbox"
            checked={item.active}
            readOnly
            className="w-4 h-4"
          />
        );
      case "prAmount":
        return <span className="font-medium">{item.prAmount}</span>;
      default:
        return item[columnKey] || "-";
    }
  };

  const renderActions = (item: any) => (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/finance/service-pr/edit/${item.id}`);
        }}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/finance/service-pr/details/${item.id}`);
        }}
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <>
      <Button
        className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium"
        onClick={() => navigate("/finance/service-pr/add")}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </>
  );

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) {
      return;
    }

    try {
      setPagination((prev) => ({ ...prev, current_page: page }));
      await fetchData({ page: page });
    } catch (error) {
      console.error("Error changing page:", error);
      toast.error("Failed to load page data. Please try again.");
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
            aria-disabled={loading}
            className={loading ? "pointer-events-none opacity-50" : ""}
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
            <PaginationItem key={i} className='cursor-pointer'>
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
              <PaginationItem key={i} className='cursor-pointer'>
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
          <PaginationItem key={totalPages} className='cursor-pointer'>
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
          <PaginationItem key={i} className='cursor-pointer'>
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
    <div className="p-4 sm:p-6">
      <EnhancedTable
        data={servicePR || []}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="service-pr-dashboard-columns"
        className="min-w-[1000px]"
        emptyMessage="No service PR data available"
        searchTerm={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search..."
        exportFileName="service-prs"
        enableSearch={true}
        enableSelection={true}
        leftActions={leftActions}
        onFilterClick={() => setIsFilterDialogOpen(true)}
        loading={loading}
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

      <ServicePRFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
