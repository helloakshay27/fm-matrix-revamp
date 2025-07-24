import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Filter, Eye } from "lucide-react";
import { BookingSetupFilterModal } from "@/components/BookingSetupFilterModal";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { editFacilityBookingSetup } from "@/store/slices/facilityBookingsSlice";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";

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

  console.log(bookingData)

  const handleViewDetails = (id: string) => {
    navigate(`/vas/booking/setup/details/${id}`);
  };

  const columns: ColumnConfig<BookingSetup>[] = [
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => handleViewDetails(row.id)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      )
    },
    { id: 'id', header: 'ID', accessorKey: 'id' },
    { id: 'name', header: 'Name', accessorKey: 'name' },
    { id: 'type', header: 'Type', accessorKey: 'type' },
    { id: 'department', header: 'Department', accessorKey: 'department' },
    { id: 'bookBy', header: 'Book by', accessorKey: 'bookBy' },
    { id: 'bookBefore', header: 'Book before', accessorKey: 'bookBefore' },
    { id: 'advanceBooking', header: 'Advance Booking', accessorKey: 'advanceBooking' },
    { id: 'createdOn', header: 'Created On', accessorKey: 'createdOn' },
    { id: 'createdBy', header: 'Created by', accessorKey: 'createdBy' },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <Switch 
          checked={row.status} 
          onCheckedChange={() => handleStatusToggle(row.id)} 
        />
      )
    }
  ];

  return <div className="p-6 bg-gray-50 min-h-screen">
      <div className="rounded-lg shadow-sm p-1 bg-transparent">

        <div className="flex items-center gap-2 mb-6">
          <Button onClick={handleAddBooking} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Action
          </Button>
          <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
          <EnhancedTable
            data={bookingSetupData}
            columns={columns}
            loading={loading}
          />
        </div>

        {/* Filter Modal */}
        <BookingSetupFilterModal open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={handleFilterApply} />
      </div>
    </div>
  };