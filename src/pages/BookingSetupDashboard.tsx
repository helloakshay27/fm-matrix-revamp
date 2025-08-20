import { useState, useEffect } from "react";
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
  status: boolean;
}

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

  const handleFilterApply = (filters: any) => {
    console.log("Applied booking setup filters:", filters);
  };

  // Format dhm object to string like "0D • 0H • 4M"
  const formatDHM = (dhm: { d: number; h: number; m: number } | null) => {
    if (!dhm) return "";
    return `${dhm.d}D • ${dhm.h}H • ${dhm.m}M`;
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

  // Fetch booking setup data from API
  const fetchBookingSetupData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/pms/admin/facility_setups.json");
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
          })
        );
        setBookingSetupData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching booking setup data:", error);
      toast.error("Failed to fetch booking setup data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingSetupData();
  }, []);

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
      key: 'department',
      label: 'Department',
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
      case 'department':
        return item.department || 'All';
      case 'bookBy':
        return item.bookBy || '';
      case 'bookBefore':
        return item.bookBefore || '';
      case 'advanceBooking':
        return item.advanceBooking || '';
      case 'createdOn':
        return item.createdOn || '';
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
          pagination={true}
          pageSize={10}
        />

        <BookingSetupFilterModal
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          onApply={handleFilterApply}
        />
      </div>
    </div>
  );
};