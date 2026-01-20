import { useEffect, useState } from "react";
import {
  Plus,
  Eye,
  Edit,
  Rows4,
  Star,
  CalendarX,
  ThumbsUp,
  ThumbsDown,
  CalendarOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchBroadcasts,
  updateBroadcast,
} from "@/store/slices/broadcastSlice";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BroadcastFilterModal } from "@/components/BroadcastFilterModal";
import { Switch } from "@/components/ui/switch";

const columns: ColumnConfig[] = [
  {
    key: "sr_no",
    label: "Sr. No.",
    sortable: true,
    hideable: true,
    defaultVisible: true,
  },
  {
    key: "notice_heading",
    label: "Title",
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
    key: "created_at",
    label: "Created On",
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
    key: "show_on_home_screen",
    label: "Show on Home Screen",
    sortable: true,
    hideable: true,
    defaultVisible: true,
  },
  {
    key: "visible_after_expire",
    label: "Visible After Expire",
    sortable: true,
    hideable: true,
    defaultVisible: true,
  },
];

export const BroadcastDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const { loading } = useAppSelector((state) => state.fetchBroadcasts);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [broadcasts, setBroadcasts] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});
  const [cardData, setCardData] = useState({
    total_notices: "",
    important_notices: "",
    expiring_soon_notices: "",
    active_notices: "",
    inactive_notices: "",
    expired_notices: ""
  })

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
        setCardData({
          total_notices: response.total_notices,
          important_notices: response.important_notices,
          expiring_soon_notices: response.expiring_soon_notices,
          active_notices: response.active_notices,
          inactive_notices: response.inactive_notices,
          expired_notices: response.expired_notices
        })
        setPagination({
          current_page: response.pagination.current_page,
          total_count: response.pagination.total_count,
          total_pages: response.pagination.total_pages,
        });
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch Notices");
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (item: any, checked: boolean) => {
    // 1: Published, 2: Disabled
    const newStatus = checked ? 1 : 0;

    // Optimistic update
    setUpdatingStatus((prev) => ({ ...prev, [item.id]: true }));

    try {
      await dispatch(
        updateBroadcast({
          id: item.id,
          data: { noticeboard: { active: newStatus } },
          baseUrl,
          token,
        })
      ).unwrap();

      toast.success("Notice status updated successfully");

      // Refresh list to ensure consistency
      handlePageChange(pagination.current_page);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update notice status");
    } finally {
      setUpdatingStatus((prev) => {
        const newState = { ...prev };
        delete newState[item.id];
        return newState;
      });
    }
  };

  const handleImportantClick = async (item: any) => {
    const newStatus = item.is_important ? 0 : 1;

    // Optimistic update
    setUpdatingStatus((prev) => ({ ...prev, [`important_${item.id}`]: true }));

    try {
      await dispatch(
        updateBroadcast({
          id: item.id,
          data: { noticeboard: { is_important: newStatus } },
          baseUrl,
          token,
        })
      ).unwrap();

      toast.success("Notice importance status updated successfully");

      // Refresh list to ensure consistency
      handlePageChange(pagination.current_page);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update notice importance status");
    } finally {
      setUpdatingStatus((prev) => {
        const newState = { ...prev };
        delete newState[`important_${item.id}`];
        return newState;
      });
    }
  }

  const handleShowOnHomeScreenChange = async (item: any, checked: boolean) => {
    const newStatus = checked ? 1 : 0;

    // Optimistic update
    setUpdatingStatus((prev) => ({ ...prev, [`home_${item.id}`]: true }));

    try {
      await dispatch(
        updateBroadcast({
          id: item.id,
          data: { noticeboard: { show_on_home_screen: newStatus } },
          baseUrl,
          token,
        })
      ).unwrap();

      toast.success("Show on home screen status updated successfully");

      // Refresh list to ensure consistency
      handlePageChange(pagination.current_page);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update show on home screen status");
    } finally {
      setUpdatingStatus((prev) => {
        const newState = { ...prev };
        delete newState[`home_${item.id}`];
        return newState;
      });
    }
  };

  const handleVisibleAfterExpireChange = async (item: any, checked: boolean) => {
    const newStatus = checked ? 1 : 0;

    // Optimistic update
    setUpdatingStatus((prev) => ({ ...prev, [`expire_${item.id}`]: true }));

    try {
      await dispatch(
        updateBroadcast({
          id: item.id,
          data: { noticeboard: { flag_expire: newStatus } },
          baseUrl,
          token,
        })
      ).unwrap();

      toast.success("Visible after expire status updated successfully");

      // Refresh list to ensure consistency
      handlePageChange(pagination.current_page);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update visible after expire status");
    } finally {
      setUpdatingStatus((prev) => {
        const newState = { ...prev };
        delete newState[`expire_${item.id}`];
        return newState;
      });
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "sr_no":
        return (
          <div>
            {pagination.current_page * 10 - 9 + broadcasts.indexOf(item)}
          </div>
        );
      case "created_at":
        return new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(item.created_at));
      case "createdBy":
        return item.created_by;
      case "status":
        const isChecked = item.active;

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isChecked}
              onCheckedChange={(checked) => handleStatusChange(item, checked)}
              disabled={updatingStatus[item.id]}
              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            />
            {isChecked ? "Active" : "Inactive"}
          </div>
        );
      case "show_on_home_screen":
        const isShowOnHomeScreenChecked = item.show_on_home_screen;

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isShowOnHomeScreenChecked}
              onCheckedChange={(checked) => handleShowOnHomeScreenChange(item, checked)}
              disabled={updatingStatus[`home_${item.id}`]}
              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            />
            {isShowOnHomeScreenChecked ? "Active" : "Inactive"}
          </div>
        );
      case "visible_after_expire":
        const isVisibleAfterExpireChecked = item.flag_expire;

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isVisibleAfterExpireChecked}
              onCheckedChange={(checked) => handleVisibleAfterExpireChange(item, checked)}
              disabled={updatingStatus[`expire_${item.id}`]}
              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            />
            {isVisibleAfterExpireChecked ? "Active" : "Inactive"}
          </div>
        );
      default:
        return item[columnKey] || "-";
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
      toast.error("Failed to fetch bookings");
    }
  };

  const handleAdd = () => {
    navigate("/pulse/notices/add");
  };

  const handleView = (id: number) => {
    navigate(`/pulse/notices/details/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/pulse/notices/edit/${id}`);
  };

  const handleApplyFilter = async (data: {
    status?: string;
    created_by?: string;
    created_at?: string;
  }) => {
    const params = new URLSearchParams();

    if (data.status) {
      params.append("q[publish_eq]", data.status);
    }

    if (data.created_by) {
      params.append("q[created_by_eq]", data.created_by);
    }

    if (data.created_at) {
      params.append("q[created_at_eq]", data.created_at);
    }

    try {
      const response = await dispatch(
        fetchBroadcasts({
          baseUrl,
          token,
          per_page: 10,
          page: pagination.current_page,
          params: params.toString() || undefined,
        })
      ).unwrap();

      setBroadcasts(response.noticeboards || []);
      setPagination({
        current_page: response.pagination.current_page,
        total_count: response.pagination.total_count,
        total_pages: response.pagination.total_pages,
      });
    } catch (error) {
      toast.error("Failed to fetch notices");
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
        <PaginationItem key={1} className="cursor-pointer">
          <PaginationLink
            onClick={() => !loading && handlePageChange(1)}
            isActive={currentPage === 1}
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
                onClick={() => !loading && handlePageChange(i)}
                isActive={currentPage === i}
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
                onClick={() => !loading && handlePageChange(i)}
                isActive={currentPage === i}
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
                  onClick={() => !loading && handlePageChange(i)}
                  isActive={currentPage === i}
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
              onClick={() => !loading && handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
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
              onClick={() => !loading && handlePageChange(i)}
              isActive={currentPage === i}
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

  const renderActions = (item: any) => (
    <div className="flex">
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-[#C72030]/10 hover:text-[#C72030]"
        onClick={() => handleImportantClick(item)}
        disabled={updatingStatus[`important_${item.id}`]}
      >
        <Star
          className="w-4 h-4"
          stroke={item.is_important ? "rgb(234, 179, 8)" : "#000"}
          fill={item.is_important ? "rgb(234, 179, 8)" : "#fff"}
        />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleView(item.id)}
        className="hover:bg-[#C72030]/10 hover:text-[#C72030]"
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(item.id)}
        className="hover:bg-[#C72030]/10 hover:text-[#C72030]"
      >
        <Edit className="w-4 h-4" />
      </Button>
    </div>
  );

  const cardValues = [
    { title: "Total Notices", value: cardData.total_notices, icon: <Rows4 className="w-5 h-5" color="#C72030" /> },
    { title: "Pop-up Notices", value: cardData.important_notices, icon: <Star className="w-5 h-5" color="#C72030" /> },
    { title: "Expiring Soon", value: cardData.expiring_soon_notices, icon: <CalendarX className="w-5 h-5" color="#C72030" /> },
    { title: "Active Now", value: cardData.active_notices, icon: <ThumbsUp className="w-5 h-5" color="#C72030" /> },
    { title: "Inactive", value: cardData.inactive_notices, icon: <ThumbsDown className="w-5 h-5" color="#C72030" /> },
    { title: "Expired", value: cardData.expired_notices, icon: <CalendarOff className="w-5 h-5" color="#C72030" /> },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardValues.map((card, index) => (
          <div key={index}>
            <div
              className={`bg-[#F6F4EE] p-6 rounded-lg shadow-sm flex items-center gap-4`}
            >
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded-[3px]">
                {card.icon}
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#1A1A1A]">
                  {card.value || 0}
                </div>
                <div className="text-sm font-medium text-[#1A1A1A]">
                  {card.title}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <EnhancedTable
        data={broadcasts}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="broadcast-table"
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search notices..."
        emptyMessage="No notices found"
        pagination={true}
        pageSize={10}
        onFilterClick={() => setIsFilterModalOpen(true)}
        leftActions={
          <Button
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            onClick={handleAdd}
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
                onClick={() =>
                  handlePageChange(Math.max(1, pagination.current_page - 1))
                }
                className={
                  pagination.current_page === 1 || loading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(
                    Math.min(
                      pagination.total_pages,
                      pagination.current_page + 1
                    )
                  )
                }
                className={
                  pagination.current_page === pagination.total_pages || loading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <BroadcastFilterModal
        onOpenChange={setIsFilterModalOpen}
        open={isFilterModalOpen}
        onApply={handleApplyFilter}
      />
    </div>
  );
};
