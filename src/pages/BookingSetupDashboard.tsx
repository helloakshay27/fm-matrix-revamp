import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Filter, Eye, Pencil } from "lucide-react";
import { BookingSetupFilterModal } from "@/components/BookingSetupFilterModal";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { editFacilityBookingSetup } from "@/store/slices/facilityBookingsSlice";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface BookingSetup {
  id: string;
  name: string;
  type: string;
  department: string;
  bookBy: string;
  bookBefore: string;
  advanceBooking: string;
  createdOn: string;
  createdBy: string;
  location: string;
  status: boolean;
}

const BOOKING_PER_PAGE = 10;

export const BookingSetupDashboard = () => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [bookingSetupData, setBookingSetupData] = useState<BookingSetup[]>([]);
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });

  const handleFilterApply = (filters: any) => {
    console.log("Applied booking setup filters:", filters);
  };

  // Format dhm object to string like "0D • 0H • 4M"
  const formatDHM = (dhm: { d: number; h: number; m: number } | null) => {
    if (!dhm) return "0 DD • 0 HH • 0 MM";
    return `${dhm.d ?? 0} DD • ${dhm.h ?? 0} HH • ${dhm.m ?? 0} MM`;
  };

  // Format date string to "22-11-2022" format
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    try {
      const isoFormatted = dateString.replace(" ", "T");
      const date = new Date(isoFormatted);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

  // Fetch booking setup data from API with pagination
  const fetchBookingSetupData = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/pms/admin/facility_setups.json?page=${page}&per_page=${BOOKING_PER_PAGE}`);
      setBookingData(response.data.facility_setups);
      if (response.data && response.data.facility_setups) {
        const formattedData = response.data.facility_setups.map(
          (item: any) => ({
            id: item.id.toString(),
            name: item.fac_name || "",
            type: item.fac_type || "",
            department: item.department_name || "",
            bookBy: item.book_by || "",
            bookBefore: formatDHM(item.bb_dhm),
            advanceBooking: formatDHM(item.ab_dhm),
            createdOn: item.created_at.split(" ")[0],
            createdBy: item.create_by_user || "",
            status: item.active || false,
            location: item.location || "",
          })
        );
        setBookingSetupData(formattedData);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (error) {
      console.error("Error fetching booking setup data:", error);
      toast.error("Failed to fetch booking setup data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingSetupData(currentPage);
  }, [currentPage]);

  const handleAddBooking = () => {
    navigate("/settings/vas/booking/setup/add");
  };

  const handleStatusToggle = async (id: string) => {
    const bookingToUpdate = bookingSetupData.find(
      (booking) => booking.id === id
    );
    if (!bookingToUpdate) return;

    const updatedBooking = !bookingToUpdate.status;

    const dataToSubmit = {
      facility_setup: {
        active: updatedBooking,
      },
    };

    try {
      await dispatch(
        editFacilityBookingSetup({
          token,
          baseUrl,
          id: id.toString(),
          data: dataToSubmit,
        })
      ).unwrap();

      toast.success("Booking status updated successfully!");
      setBookingSetupData((prevData) =>
        prevData.map((booking) =>
          booking.id === id
            ? { ...booking, status: updatedBooking }
            : booking
        )
      );
    } catch (error) {
      console.error("Failed to update booking status:", error);
      toast.error("Failed to update booking status");
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/settings/vas/booking/setup/details/${id}`);
  };

  const columns: ColumnConfig[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      draggable: true,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      draggable: true,
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      draggable: true,
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      draggable: true,
    },
    {
      key: 'bookBefore',
      label: 'Book before',
      sortable: true,
      draggable: true,
    },
    {
      key: 'advanceBooking',
      label: 'Advance Booking',
      sortable: true,
      draggable: true,
    },
    {
      key: 'createdOn',
      label: 'Created On',
      sortable: true,
      draggable: true,
    },
    {
      key: 'createdBy',
      label: 'Created by',
      sortable: true,
      draggable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      draggable: true,
    },
  ];

  const renderCell = (item: BookingSetup, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return item.id || '';
      case 'name':
        return item.name || '';
      case 'type':
        return item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : '';
      case 'location':
        return item?.location;
      case 'bookBy':
        return item.bookBy || '';
      case 'bookBefore':
        return item.bookBefore || '';
      case 'advanceBooking':
        return item.advanceBooking || '';
      case 'createdOn': {
        if (!item.createdOn) return '';
        // If format is YYYY-MM-DD, convert to DD/MM/YYYY directly
        if (/^\d{4}-\d{2}-\d{2}$/.test(item.createdOn)) {
          const [year, month, day] = item.createdOn.split('-');
          return `${day}/${month}/${year}`;
        }
        return item.createdOn;
      }
      case 'createdBy':
        return item.createdBy || '';
      case 'status':
        return (
          <div className="flex items-center justify-center">
            <div
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${item.status ? 'bg-green-500' : 'bg-gray-300'
                }`}
              onClick={() => handleStatusToggle(item.id)}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.status ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </div>
          </div>
        );
      default:
        return item[columnKey as keyof BookingSetup]?.toString() || '';
    }
  };

  // const handdleEditDetails = (id: string) => {
  //   navigate(`/settings/vas/booking/setup/edit/${id}`);
  // }

  const renderActions = (booking: BookingSetup) => (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleViewDetails(booking.id)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      {/* <Button
        size="sm"
        variant="ghost"
        onClick={() => handdleEditDetails(booking.id)}
      >
        <Pencil className="w-4 h-4" />
      </Button> */}
    </div>
  );

  const paginationItems = useMemo(() => {
    const items: Array<number | 'ellipsis'> = [];
    const totalPages = pagination.total_pages || 1;
    const current = currentPage;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
      return items;
    }

    items.push(1);

    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    if (start > 2) items.push('ellipsis');
    for (let i = start; i <= end; i++) items.push(i);
    if (end < totalPages - 1) items.push('ellipsis');

    items.push(totalPages);
    return items;
  }, [pagination.total_pages, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1) return;
    const totalPages = pagination.total_pages || 1;
    if (page > totalPages) return;
    setCurrentPage(page);
  };

  const leftActions = (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => setShowActionPanel(true)}
        className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 border-0"
      >
        <Plus className="w-4 h-4" />
        Action
      </Button>
      {/* <Button
        variant="outline"
        onClick={() => setIsFilterOpen(true)}
        className="flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        Filter
      </Button> */}
    </div>
  );

  return (
    <div className="p-6 bg-white">
      {showActionPanel && (
        <SelectionPanel
          // actions={selectionActions}
          onAdd={handleAddBooking}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}
      <div className="rounded-lg shadow-sm p-1 bg-transparent">
        <EnhancedTable
          data={bookingSetupData}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          storageKey="booking-setup-table"
          className="min-w-full"
          emptyMessage={loading ? "Loading booking data..." : "No booking data found"}
          leftActions={leftActions}
          enableSearch={true}
          // onFilterClick={() => setIsFilterOpen(true)}
          enableSelection={false}
          hideTableExport={true}
          pagination={false}
        />

        {(pagination.total_pages || 1) > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {paginationItems.map((p, idx) => (
                <PaginationItem key={`${p}-${idx}`}>
                  {p === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      className="cursor-pointer"
                      isActive={currentPage === p}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === (pagination.total_pages || 1) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <BookingSetupFilterModal
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          onApply={handleFilterApply}
        />
      </div>
    </div>
  );
};