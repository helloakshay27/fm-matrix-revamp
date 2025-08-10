import { useEffect, useState } from "react";
import { Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBroadcasts } from "@/store/slices/broadcastSlice";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export const BroadcastDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const { loading } = useAppSelector(state => state.fetchBroadcasts)

  const [searchTerm, setSearchTerm] = useState("");
  const [broadcasts, setBroadcasts] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(
          fetchBroadcasts({
            baseUrl,
            token,
            per_page: 10,
            page: pagination.current_page,
          })
        ).unwrap();
        setBroadcasts(response.noticeboards || []);
        setPagination({
          current_page: response.pagination.current_page,
          total_count: response.pagination.total_count,
          total_pages: response.pagination.total_pages,
        });
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch Broadcasts");
      }
    };

    fetchData();
  }, []);

  const columns: ColumnConfig[] = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      hideable: true,
      defaultVisible: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      hideable: true,
      defaultVisible: true,
    },
    {
      key: "createdOn",
      label: "Created On",
      sortable: true,
      hideable: true,
      defaultVisible: true,
    },
    {
      key: "createdBy",
      label: "Created by",
      sortable: true,
      hideable: true,
      defaultVisible: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      hideable: true,
      defaultVisible: true,
    },
    {
      key: "expiredOn",
      label: "Expired On",
      sortable: true,
      hideable: true,
      defaultVisible: true,
    },
    {
      key: "expired",
      label: "Expired",
      sortable: true,
      hideable: true,
      defaultVisible: true,
    },
    {
      key: "attachments",
      label: "Attachment",
      sortable: false,
      hideable: true,
      defaultVisible: true,
    },
  ];

  const handleViewDetails = (id: number) => {
    navigate(`/crm/broadcast/details/${id}`);
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return <span className="font-medium">{item.notice_heading}</span>;
      case "type":
        return (
          <span>
            {item.notice_type || "-"}
          </span>
        );
      case "createdOn":
        return new Date(item.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      case "createdBy":
        return item.created_by;
      case "status":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {item.status}
          </Badge>
        );
      case "expiredOn":
        return item.expire_time
          ? new Date(item.expire_time).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
          : "N/A";
      case "expired":
        return (
          <Badge
            variant={item.is_expired ? "destructive" : "secondary"}
            className={
              item.is_expired
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }
          >
            {item.is_expired ? "Yes" : "No"}
          </Badge>
        );
      case 'attachments':
        return item.attachments.length > 0 ? (
          <img
            style={{ width: "100%", height: "50px" }}
            src={item.attachments[0].document_url}
          />
        ) : (
          'None'
        );
      default:
        return item[columnKey] || "N/A";
    }
  };

  const handlePageChange = async (page: number) => {
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
    try {
      const response = await dispatch(
        fetchBroadcasts({
          baseUrl,
          token,
          per_page: 10,
          page: page,
        })
      ).unwrap();
      setBroadcasts(response.noticeboards || []);
      setPagination({
        current_page: response.pagination.current_page,
        total_count: response.pagination.total_count,
        total_pages: response.pagination.total_pages,
      });
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

  const renderActions = (item: any) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleViewDetails(item.id)}
      className="hover:bg-[#C72030]/10 hover:text-[#C72030]"
    >
      <Eye className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">BROADCAST LIST</h1>

      <EnhancedTable
        data={broadcasts}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="broadcast-table"
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search broadcasts..."
        enableSelection={true}
        getItemId={(item) => item.id.toString()}
        emptyMessage="No broadcasts found"
        pagination={true}
        pageSize={10}
        onFilterClick={() => { }}
        leftActions={
          <Button
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            onClick={() => navigate("/crm/broadcast/add")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        }
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
    </div>
  );
};