import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Car,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Bike,
  Plus,
  Download,
  Upload,
  Search,
  Eye,
  Filter,
  X,
  XCircle,
  Calendar,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BulkUploadModal } from "@/components/BulkUploadModal";
import { ColumnVisibilityDropdown } from "@/components/ColumnVisibilityDropdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParkingStatisticsCard } from "@/components/parking-analytics/ParkingStatisticsCard";
import { ParkingFloorLayout } from "@/components/parking-analytics/ParkingFloorLayout";
import { ParkingOccupancyChart } from "@/components/parking-analytics/ParkingOccupancyChart";
import { FloorWiseOccupancyChart } from "@/components/parking-analytics/FloorWiseOccupancyChart";
import { ParkingAnalyticsSelector } from "@/components/ParkingAnalyticsSelector";
import { ParkingAnalyticsCard } from "@/components/ParkingAnalyticsCard";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLayout } from "@/contexts/LayoutContext";
import { toast } from "sonner";
import {
  API_CONFIG,
  getFullUrl,
  getAuthenticatedFetchOptions,
} from "@/config/apiConfig";

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999, // High z-index to ensure dropdown appears above other elements
    },
  },
  // Prevent focus conflicts with Dialog
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

// Define the data structure based on the actual API response
interface ParkingBookingUser {
  id: number;
  full_name: string;
  department_name: string;
  designation: string;
  email: string;
  emp_id: string;
}

interface ParkingCategory {
  id: number;
  name: string;
}

interface ParkingConfiguration {
  id: number;
  building_name: string;
  floor_name: string;
  parking_category: ParkingCategory;
}

interface Attendance {
  punched_in_at: string | null;
  punched_out_at: string | null;
  formatted_punched_in_at: string | null;
  formatted_punched_out_at: string | null;
}

interface QRCode {
  id: number;
  document_url: string;
}

interface CanCancel {
  allowed: boolean;
  reason: string;
}

interface ParkingBooking {
  id: number;
  user_id: number;
  booking_date: string;
  status: string;
  booking_schedule: string;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  user: ParkingBookingUser;
  parking_configuration: ParkingConfiguration;
  attendance: Attendance;
  cancelled_by: string | null;
  qr_code: QRCode;
  can_cancel: CanCancel;
  url: string;
  booking_schedule_time: string;
  booking_schedule_slot_time: string;
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
}

interface ParkingBookingApiResponse {
  cards: {
    total_slots: number;
    two_total: number;
    four_total: number;
    two_booked: number;
    four_available: number;
    two_available: number;
    alloted: number;
    vacant: number;
    four_booked: number;
  };
  parking_bookings: ParkingBooking[];
  pagination: PaginationInfo;
}

// Interface for users API response
interface User {
  id: number;
  full_name: string;
}

interface UsersApiResponse {
  users: User[];
}

// Interface for buildings API response
interface Building {
  id: number;
  name: string;
  floors?: Floor[]; // Optional floors array within building
}

interface BuildingsApiResponse {
  pms_buildings: Building[];
}

// Interface for floors API response
interface Floor {
  id: number;
  name: string;
  building_id?: number;
  wing_id?: number;
}

interface FloorsApiResponse {
  floors: Floor[];
}

// Interface for parking categories API response
interface ParkingCategoryImage {
  id: number;
  relation: string;
  relation_id: number;
  document: string;
}

interface ParkingCategoryResponse {
  id: number;
  name: string;
  resource_id: number;
  resource_type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  image_url: string;
  parking_image: ParkingCategoryImage;
}

interface ParkingCategoriesApiResponse {
  parking_categories: ParkingCategoryResponse[];
}

// Interface for API filter parameters
interface ApiFilterParams {
  category?: string;
  user_ids?: string[];
  parking_slot?: string;
  statuses?: string[];
  scheduled_date_range?: string;
  booked_date_range?: string;
  building_id?: string;
  floor_id?: string;
}

// Transform API data to match our UI structure
interface ParkingBookingSite {
  id: number;
  employee_name: string;
  employee_email: string;
  employee_id: string;
  schedule_date: string;
  booking_schedule: string;
  booking_schedule_time: string;
  booking_schedule_slot_time: string;
  category: string;
  building: string;
  floor: string;
  designation: string;
  department: string;
  slot_parking_no: string;
  status: string;
  checked_in_at: string | null;
  checked_out_at: string | null;
  created_on: string;
  cancel?: boolean;
}

interface ParkingBookingSiteSummary {
  total_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  two_wheeler_bookings: number;
  four_wheeler_bookings: number;
  checked_in_count: number;
  checked_out_count: number;
}

// Section Loader Component
const SectionLoader: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ loading, children, className }) => {
  return (
    <div className={`relative ${className ?? ""}`}>
      {children}
      {loading && (
        <div className="absolute inset-0 z-10 rounded-lg bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
        </div>
      )}
    </div>
  );
};

const ParkingBookingListSiteWise = () => {
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useLayout();
  const panelRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true); // Track if it's the first load

  // API state
  const [bookings, setBookings] = useState<ParkingBooking[]>([]);
  const [bookingData, setBookingData] = useState<ParkingBookingSite[]>([]);
  const [summary, setSummary] = useState<ParkingBookingSiteSummary | null>(
    null
  );
  const [cards, setCards] = useState<{
    total_slots: number;
    two_total: number;
    four_total: number;
    four_booked: number;
    two_available: number;
    four_available: number;
    two_booked: number;
    alloted: number;
    vacant: number;
    two_cancelled: number;
    four_cancelled: number;
  } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [parkingCategories, setParkingCategories] = useState<
    ParkingCategoryResponse[]
  >([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(false); // Separate loading state for cards
  const [error, setError] = useState<string | null>(null);
  const [apiPagination, setApiPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 1,
    per_page: 20, // Default per page
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Lazy loading state
  const [isLazyLoading, setIsLazyLoading] = useState(false);
  const [lazyLoadingEnabled, setLazyLoadingEnabled] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lazyLoadingRef = useRef(false); // Prevent multiple simultaneous lazy loads

  // Card-only filter override (applies only when clicking cards)
  const [cardFilter, setCardFilter] = useState<{
    active: boolean;
    categoryId?: string;
    status?: string;
  } | null>(null);

  // Transform API data to match UI structure
  const transformApiDataToBookings = (
    parkingBookings: ParkingBooking[]
  ): ParkingBookingSite[] => {
    return parkingBookings.map((booking, index) => ({
      id: booking.id,
      employee_name: booking.user.full_name,
      employee_email: booking.user.email,
      employee_id: booking.user.emp_id || "-",
      schedule_date: booking.booking_date,
      booking_schedule: booking.booking_schedule,
      booking_schedule_time: booking.booking_schedule_time,
      booking_schedule_slot_time: booking.booking_schedule_slot_time,
      category: booking.parking_configuration.parking_category.name,
      building: booking.parking_configuration.building_name,
      floor: booking.parking_configuration.floor_name,
      designation: booking.user.designation,
      department: booking.user.department_name,
      slot_parking_no: `Slot-${booking.id}`, // Using booking ID as slot number
      status: booking.status,
      checked_in_at: booking.attendance.formatted_punched_in_at,
      checked_out_at: booking.attendance.formatted_punched_out_at,
      created_on: booking.created_at,
      cancel: booking.can_cancel.allowed,
    }));
  };

  // Generate summary from API data
  const generateSummaryFromBookings = (
    parkingBookings: ParkingBooking[]
  ): ParkingBookingSiteSummary => {
    const total_bookings = parkingBookings.length;
    const confirmed_bookings = parkingBookings.filter(
      (b) => b.status === "confirmed"
    ).length;
    const cancelled_bookings = parkingBookings.filter(
      (b) => b.status === "cancelled"
    ).length;
    const two_wheeler_bookings = parkingBookings.filter(
      (b) =>
        b.parking_configuration.parking_category.name
          .toLowerCase()
          .includes("two") ||
        b.parking_configuration.parking_category.name
          .toLowerCase()
          .includes("bike")
    ).length;
    const four_wheeler_bookings = parkingBookings.filter(
      (b) =>
        b.parking_configuration.parking_category.name
          .toLowerCase()
          .includes("four") ||
        b.parking_configuration.parking_category.name
          .toLowerCase()
          .includes("car")
    ).length;
    const checked_in_count = parkingBookings.filter(
      (b) => b.attendance.punched_in_at !== null
    ).length;
    const checked_out_count = parkingBookings.filter(
      (b) => b.attendance.punched_out_at !== null
    ).length;

    return {
      total_bookings,
      confirmed_bookings,
      cancelled_bookings,
      two_wheeler_bookings,
      four_wheeler_bookings,
      checked_in_count,
      checked_out_count,
    };
  };

  // Helper function to convert date from YYYY-MM-DD to DD/MM/YYYY format (zero-padded)
  const formatDateForAPI = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear());
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Default today's date values
  const getTodayYMD = (): string => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Filter states - form filters (what user is typing/selecting)
  const [filters, setFilters] = useState({
    category: "all",
    user: "all",
    parking_slot: "",
    status: "all",
    building: "all",
    floor: "all",
    // Default Scheduled On to today
    scheduled_on_from: getTodayYMD(),
    scheduled_on_to: getTodayYMD(),
    booked_on_from: "",
    booked_on_to: "",
  });

  // Applied filters - actually used for API calls
  const [appliedFilters, setAppliedFilters] = useState({
    category: "all",
    user: "all",
    parking_slot: "",
    status: "all",
    building: "all",
    floor: "all",
    // Default Scheduled On to today
    scheduled_on_from: getTodayYMD(),
    scheduled_on_to: getTodayYMD(),
    booked_on_from: "",
    booked_on_to: "",
  });

  // Export date range states
  const [exportDateRange, setExportDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Column visibility state
  const [columns, setColumns] = useState(() => {
    const selectedCompany = localStorage.getItem("selectedCompany");
    const isZSAssociates = selectedCompany?.trim() === "ZS Associates";

    const allColumns = [
      { key: "sr_no", label: "Sr No.", visible: true, sortable: false },
      { key: "id", label: "Parking ID", visible: true, sortable: true },
      {
        key: "employee_name",
        label: "Employee Name",
        visible: true,
        sortable: true,
      },
      {
        key: "employee_email",
        label: "Employee Email ID",
        visible: true,
        sortable: true,
      },
      {
        key: "employee_id",
        label: "Employee ID",
        visible: true,
        sortable: true,
      },
      {
        key: "schedule_date",
        label: "Schedule Date",
        visible: true,
        sortable: true,
      },
      {
        key: "booking_schedule_time",
        label: "Booking Time",
        visible: true,
        sortable: true,
      },
      {
        key: "booking_schedule_slot_time",
        label: "Booking Slots",
        visible: true,
        sortable: true,
      },
      { key: "category", label: "Category", visible: true, sortable: true },
      { key: "building", label: "Building", visible: true, sortable: true },
      { key: "floor", label: "Floor", visible: true, sortable: true },
      { key: "designation", label: "Designation", visible: true, sortable: true },
      { key: "department", label: "Department", visible: true, sortable: true },
      // { key: 'slot_parking_no', label: 'Slot & Parking No.', visible: true, sortable: true },
      { key: "status", label: "Status", visible: true, sortable: true },
      {
        key: "checked_in_at",
        label: "Checked In At",
        visible: true,
        sortable: true,
      },
      {
        key: "checked_out_at",
        label: "Checked Out At",
        visible: true,
        sortable: true,
      },
      { key: "created_on", label: "Created On", visible: true, sortable: true },
      { key: "cancel", label: "Cancel", visible: true, sortable: false },
    ];

    if (isZSAssociates) {
      return allColumns.filter(
        (col) =>
          !["employee_email", "designation", "department"].includes(col.key)
      );
    }

    return allColumns;
  });

  // Analytics state
  const [selectedAnalytics, setSelectedAnalytics] = useState<string[]>([
    "peak_hour_trends",
    "booking_patterns",
    "occupancy_rate",
    "average_duration",
    "parking_statistics",
    "two_four_occupancy",
    "floor_wise_occupancy",
  ]);

  // Helper function to generate a label based on date range (day-wise)
  const generateDateRangeLabel = (
    startDate: string,
    endDate: string
  ): string => {
    if (!startDate || !endDate) return "";

    const start = new Date(startDate);
    const end = new Date(endDate);

    const fmt = (d: Date) => {
      const day = String(d.getDate()).padStart(2, "0");
      const month = d.toLocaleDateString("en-US", { month: "short" });
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    };

    // If same day show single date, otherwise show range
    if (start.toDateString() === end.toDateString()) return fmt(start);
    return `${fmt(start)} - ${fmt(end)}`;
  };

  // Analytics date range state - default to last 7 days (Range A) and previous 7-day window (Range B)
  const getDefaultAnalyticsDateRange = () => {
    const today = new Date();

    // Range A: single day = today
    const rangeAStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const rangeAEnd = new Date(rangeAStart);

    // Range B: previous single day = yesterday
    const rangeBEnd = new Date(rangeAStart);
    rangeBEnd.setDate(rangeAStart.getDate() - 1);
    const rangeBStart = new Date(rangeBEnd);

    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };

    const rangeAStartStr = formatDate(rangeAStart);
    const rangeAEndStr = formatDate(rangeAEnd);
    const rangeBStartStr = formatDate(rangeBStart);
    const rangeBEndStr = formatDate(rangeBEnd);

    return {
      rangeA: {
        startDate: rangeAStartStr,
        endDate: rangeAEndStr,
        label: generateDateRangeLabel(rangeAStartStr, rangeAEndStr),
      },
      rangeB: {
        startDate: rangeBStartStr,
        endDate: rangeBEndStr,
        label: generateDateRangeLabel(rangeBStartStr, rangeBEndStr),
      },
    };
  };

  const [analyticsDateRange, setAnalyticsDateRange] = useState<{
    rangeA: { startDate: string; endDate: string; label: string };
    rangeB: { startDate: string; endDate: string; label: string };
  }>(getDefaultAnalyticsDateRange());

  // Draft state used inside the Analytics filter modal so changes don't trigger API calls
  // until the user explicitly clicks Apply
  const [analyticsDraftRange, setAnalyticsDraftRange] = useState(
    getDefaultAnalyticsDateRange()
  );

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("🔍 Debounce Effect Debug:");
      console.log("Original searchTerm:", searchTerm);
      console.log("Setting debouncedSearchTerm to:", searchTerm);
      setDebouncedSearchTerm(searchTerm);
      // Reset to first page when search term changes
      if (searchTerm !== debouncedSearchTerm) {
        setCurrentPage(1);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  // Fetch parking bookings from API
  const fetchParkingBookings = async (
    page = 1,
    searchQuery = "",
    filterParams: ApiFilterParams = {}
  ) => {
    try {
      const url = getFullUrl("/pms/admin/parking_bookings.json");
      const options = getAuthenticatedFetchOptions();

      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());

      // Add search query - intelligently route to email, first name, or last name
      if (searchQuery.trim()) {
        console.log("🔍 Search Query Debug:");
        console.log("Search query value:", searchQuery);
        console.log("Search query trimmed:", searchQuery.trim());
        console.log("Search query type:", typeof searchQuery);
        const trimmedQuery = searchQuery.trim();

        // Check if it's an email (contains @)
        if (trimmedQuery.includes("@")) {
          console.log("🔍 Detected email search");
          params.append("q[user_email_eq]", trimmedQuery);
        }
        // Check if it contains a space (first name and last name)
        else if (trimmedQuery.includes(" ")) {
          const nameParts = trimmedQuery
            .split(" ")
            .filter((part) => part.length > 0);
          if (nameParts.length >= 2) {
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(" "); // Join remaining parts as last name
            console.log("🔍 Detected full name search");
            console.log("First name:", firstName);
            console.log("Last name:", lastName);
            params.append("q[user_firstname_eq]", firstName);
            params.append("q[user_last_name_eq]", lastName);
          } else {
            // Only one part after splitting, treat as first name
            console.log("🔍 Detected single name search (first name)");
            params.append("q[user_firstname_eq]", nameParts[0]);
          }
        }
        // Single word without @ - treat as first name
        else {
          console.log("🔍 Detected single name search (first name)");
          params.append("q[user_firstname_eq]", trimmedQuery);
        }
      }

      // Add filter parameters
      // Category filter
      if (filterParams.category && filterParams.category !== "all") {
        console.log("🔍 Category Filter Debug:");
        console.log("Category filter value:", filterParams.category);
        console.log("Category filter type:", typeof filterParams.category);
        // Try with _id_eq suffix since we're passing the category ID
        params.append(
          "q[parking_configuration_parking_category_id_eq]",
          filterParams.category
        );
      }

      if (filterParams.user_ids && filterParams.user_ids.length > 0) {
        filterParams.user_ids.forEach((userId) => {
          params.append("q[user_id_in][]", userId);
        });
      }

      if (filterParams.parking_slot) {
        console.log("🔍 Parking Slot Filter Debug:");
        console.log("Parking slot filter value:", filterParams.parking_slot);
        console.log(
          "Parking slot filter type:",
          typeof filterParams.parking_slot
        );
        params.append("q[parking_number_name_cont]", filterParams.parking_slot);
      }

      // Status filter
      if (filterParams.statuses && filterParams.statuses.length > 0) {
        filterParams.statuses.forEach((status) => {
          params.append("q[status_in][]", status);
        });
      }

      // Building filter
      if (filterParams.building_id && filterParams.building_id !== "all") {
        console.log("🔍 Building Filter Debug:");
        console.log("Building filter value:", filterParams.building_id);
        params.append(
          "q[parking_configuration_building_id_eq]",
          filterParams.building_id
        );
      }

      // Floor filter
      if (filterParams.floor_id && filterParams.floor_id !== "all") {
        console.log("🔍 Floor Filter Debug:");
        console.log("Floor filter value:", filterParams.floor_id);
        params.append(
          "q[parking_configuration_floor_id_eq]",
          filterParams.floor_id
        );
      }

      if (filterParams.scheduled_date_range) {
        // Cards filter needs plain date_range; keep q[date_range1] for current date filter
        params.append("date_range", filterParams.scheduled_date_range);
        params.append("q[date_range1]", filterParams.scheduled_date_range);
      }

      if (filterParams.booked_date_range) {
        // Preserve booked range under q[date_range] to avoid clashing with current date filter
        params.append("q[date_range]", filterParams.booked_date_range);
      }

      const fullUrl = `${url}?${params.toString()}`;

      console.log("🔍 API Debug Info:");
      console.log("Base URL from config:", API_CONFIG.BASE_URL);
      console.log("Full URL being called:", fullUrl);
      console.log("Query Parameters:", params.toString());
      console.log("Filter Params passed:", filterParams);
      console.log("Auth options:", options);

      const response = await fetch(fullUrl, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ParkingBookingApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching parking bookings:", error);
      throw error;
    }
  };

  // Fetch users from API for filter dropdown
  const fetchUsers = async () => {
    try {
      const url = getFullUrl("/pms/users/get_escalate_to_users.json");
      const options = getAuthenticatedFetchOptions();

      console.log("🔍 Fetching users from:", url);

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UsersApiResponse = await response.json();
      console.log("✅ Users fetched successfully:", data.users?.length || 0);
      return data.users || [];
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      // Return empty array instead of throwing to prevent blocking the UI
      return [];
    }
  };

  // Fetch parking categories from API for filter dropdown
  const fetchParkingCategories = async () => {
    try {
      const url = getFullUrl("/pms/admin/parking_categories.json");
      const options = getAuthenticatedFetchOptions();

      console.log("🔍 Fetching parking categories from:", url);

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ParkingCategoriesApiResponse = await response.json();
      return data.parking_categories;
    } catch (error) {
      console.error("Error fetching parking categories:", error);
      throw error;
    }
  };

  // Fetch buildings from API for filter dropdown
  const fetchBuildings = async () => {
    try {
      const url = getFullUrl("/pms/buildings.json");
      const options = getAuthenticatedFetchOptions();

      console.log("🔍 Fetching buildings from:", url);

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BuildingsApiResponse = await response.json();
      return data.pms_buildings;
    } catch (error) {
      console.error("Error fetching buildings:", error);
      throw error;
    }
  };

  // Fetch floors from API for filter dropdown
  const fetchFloors = async () => {
    try {
      // First, get buildings which contain floors
      const buildingsUrl = getFullUrl("/pms/buildings.json");
      const options = getAuthenticatedFetchOptions();

      console.log("🔍 Fetching floors from buildings API:", buildingsUrl);

      const response = await fetch(buildingsUrl, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BuildingsApiResponse = await response.json();

      // Extract floors from all buildings
      const allFloors: Floor[] = [];

      data.pms_buildings.forEach((building) => {
        if (building.floors && building.floors.length > 0) {
          // Add building_id to each floor for reference
          const floorsWithBuildingId = building.floors.map((floor) => ({
            ...floor,
            building_id: building.id,
          }));
          allFloors.push(...floorsWithBuildingId);
        }
      });

      console.log("🔍 Extracted floors from buildings:", allFloors.length);
      return allFloors;
    } catch (error) {
      console.error("Error fetching floors:", error);
      throw error;
    }
  };

  // Memoized function to build base filter params
  const buildApiFilterParamsBase = useCallback((): ApiFilterParams => {
    const apiParams: ApiFilterParams = {};

    // Only apply dialog category if not overridden by card filter
    if (appliedFilters.category !== 'all' && !cardFilter?.active) {
      apiParams.category = appliedFilters.category;
    }

    if (appliedFilters.user !== 'all') {
      apiParams.user_ids = [appliedFilters.user];
    }

    if (appliedFilters.parking_slot.trim()) {
      apiParams.parking_slot = appliedFilters.parking_slot.trim();
    }

    // Only dialog status in base
    if (appliedFilters.status !== "all") {
      // Map UI status to API status
      const statusMap: { [key: string]: string } = {
        Confirmed: "confirmed",
        Cancelled: "cancelled",
        confirmed: "confirmed",
        cancelled: "cancelled",
      };
      const apiStatus =
        statusMap[appliedFilters.status] || appliedFilters.status;
      apiParams.statuses = [apiStatus];
    }

    // Building filter
    if (appliedFilters.building !== 'all') {
      apiParams.building_id = appliedFilters.building;
    }

    // Floor filter
    if (appliedFilters.floor !== 'all') {
      apiParams.floor_id = appliedFilters.floor;
    }

    if (
      appliedFilters.scheduled_on_from.trim() ||
      appliedFilters.scheduled_on_to.trim()
    ) {
      // Build date range for scheduled_on with proper date formatting
      const fromDate = appliedFilters.scheduled_on_from.trim()
        ? formatDateForAPI(appliedFilters.scheduled_on_from.trim())
        : formatDateForAPI(appliedFilters.scheduled_on_to.trim());
      const toDate = appliedFilters.scheduled_on_to.trim()
        ? formatDateForAPI(appliedFilters.scheduled_on_to.trim())
        : formatDateForAPI(appliedFilters.scheduled_on_from.trim());
      apiParams.scheduled_date_range = `${fromDate} - ${toDate}`;
    }

    if (
      appliedFilters.booked_on_from.trim() ||
      appliedFilters.booked_on_to.trim()
    ) {
      // Build date range for booked_on with proper date formatting
      const fromDate = appliedFilters.booked_on_from.trim()
        ? formatDateForAPI(appliedFilters.booked_on_from.trim())
        : formatDateForAPI(appliedFilters.booked_on_to.trim());
      const toDate = appliedFilters.booked_on_to.trim()
        ? formatDateForAPI(appliedFilters.booked_on_to.trim())
        : formatDateForAPI(appliedFilters.booked_on_from.trim());
      apiParams.booked_date_range = `${fromDate} - ${toDate}`;
    }

    return apiParams;
  }, [appliedFilters, cardFilter]);

  // Memoized function to build effective filter params
  const buildApiFilterParamsEffective = useCallback((): ApiFilterParams => {
    // Use the base function's logic but apply card filter overrides
    const base = buildApiFilterParamsBase();
    const effective: ApiFilterParams = { ...base };

    if (cardFilter?.active && cardFilter.categoryId) {
      effective.category = cardFilter.categoryId;
    }
    if (cardFilter?.active && cardFilter.status) {
      effective.statuses = [cardFilter.status];
    }

    return effective;
  }, [buildApiFilterParamsBase, cardFilter]);

  // Load booking data from API
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        // Check if it's the initial load using ref
        const isInitialLoad = isInitialLoadRef.current;

        setLoading(true);
        setError(null);

        console.log('🔍 Load Debug - Is Initial Load:', isInitialLoad);

        // Convert UI filters to API filter parameters
        // Convert UI filters to API filter parameters using memoized functions
        // On initial load, prioritize parking bookings first
        if (isInitialLoad) {
          console.log("🚀 Step 1: Fetching parking bookings...");

          // STEP 1: Fetch only parking bookings first to show data quickly
          const response = await fetchParkingBookings(
            currentPage,
            debouncedSearchTerm,
            buildApiFilterParamsBase()
          );

          console.log(
            "✅ Parking bookings loaded:",
            response.parking_bookings?.length || 0
          );

          // Set cards data immediately (without cancelled counts for now)
          setCards({
            ...response.cards,
            two_cancelled: 0, // Will be updated later
            four_cancelled: 0, // Will be updated later
          });

          // Set raw API data
          setBookings(response.parking_bookings || []);

          // Transform for UI
          const transformedBookings = transformApiDataToBookings(
            response.parking_bookings || []
          );
          setBookingData(transformedBookings);

          // Generate summary
          const generatedSummary = generateSummaryFromBookings(
            response.parking_bookings || []
          );
          setSummary(generatedSummary);

          // Set pagination
          setApiPagination({
            current_page: response.pagination.current_page,
            total_count: response.pagination.total_count,
            total_pages: response.pagination.total_pages,
            per_page: 20,
          });

          // Mark initial load as complete immediately so table shows
          isInitialLoadRef.current = false;
          setLoading(false);

          // STEP 2: Fetch other data in background (non-blocking)
          console.log("🔄 Step 2: Loading additional data in background...");

          Promise.all([
            fetchUsers(),
            fetchParkingCategories(),
            fetchBuildings(),
            fetchFloors(),
          ])
            .then(([usersData, categoriesData, buildingsData, floorsData]) => {
              console.log("📊 Background data loaded:");
              console.log("- Users:", usersData?.length || 0);
              console.log("- Categories:", categoriesData?.length || 0);
              console.log("- Buildings:", buildingsData?.length || 0);
              console.log("- Floors:", floorsData?.length || 0);

              // Set all the background data
              setUsers(usersData || []);
              setParkingCategories(categoriesData || []);
              setBuildings(buildingsData || []);
              setFloors(floorsData || []);

              // STEP 3: Fetch cancelled counts after categories are loaded
              const twoWheelerCategory = categoriesData.find((cat) => {
                const lower = cat.name.toLowerCase();
                return (
                  lower.includes("two") ||
                  lower.includes("2") ||
                  lower.includes("bike")
                );
              });
              const twoWheelerCategoryIdLocal = twoWheelerCategory
                ? twoWheelerCategory.id.toString()
                : null;

              const fourWheelerCategory = categoriesData.find((cat) => {
                const lower = cat.name.toLowerCase();
                return (
                  lower.includes("four") ||
                  lower.includes("4") ||
                  lower.includes("car")
                );
              });
              const fourWheelerCategoryIdLocal = fourWheelerCategory
                ? fourWheelerCategory.id.toString()
                : null;

              // Build filter params for cancelled counts
              const buildCancelledFilterParams = (
                vehicleType: "two" | "four"
              ): ApiFilterParams => {
                const baseParams = buildApiFilterParamsBase();
                const categoryId =
                  vehicleType === "two"
                    ? twoWheelerCategoryIdLocal
                    : fourWheelerCategoryIdLocal;

                return {
                  ...baseParams,
                  category: categoryId || undefined,
                  statuses: ["cancelled"],
                };
              };

              // Fetch cancelled counts
              return Promise.all([
                twoWheelerCategoryIdLocal
                  ? fetchParkingBookings(
                    1,
                    "",
                    buildCancelledFilterParams("two")
                  )
                  : Promise.resolve({
                    pagination: { total_count: 0 },
                    parking_bookings: [],
                    cards: {},
                  }),
                fourWheelerCategoryIdLocal
                  ? fetchParkingBookings(
                    1,
                    "",
                    buildCancelledFilterParams("four")
                  )
                  : Promise.resolve({
                    pagination: { total_count: 0 },
                    parking_bookings: [],
                    cards: {},
                  }),
              ]).then(
                ([
                  twoWheelerCancelledResponse,
                  fourWheelerCancelledResponse,
                ]) => {
                  const twoWheelerCancelled =
                    twoWheelerCancelledResponse.pagination.total_count || 0;
                  const fourWheelerCancelled =
                    fourWheelerCancelledResponse.pagination.total_count || 0;

                  console.log("📊 Cancelled counts updated:", {
                    twoWheeler: twoWheelerCancelled,
                    fourWheeler: fourWheelerCancelled,
                  });

                  // Update cards with cancelled counts
                  setCards((prev) =>
                    prev
                      ? {
                        ...prev,
                        two_cancelled: twoWheelerCancelled,
                        four_cancelled: fourWheelerCancelled,
                      }
                      : null
                  );
                }
              );
            })
            .catch((error) => {
              console.error("❌ Error loading background data:", error);
              // Don't show error to user as main data is already loaded
            });
        } else {
          // For non-initial loads, only fetch table data
          console.log("🔄 Fetching updated table data...");
          const response = await fetchParkingBookings(
            currentPage,
            debouncedSearchTerm,
            buildApiFilterParamsEffective()
          );

          // Set raw API data
          setBookings(response.parking_bookings || []);

          // Transform for UI
          const transformedBookings = transformApiDataToBookings(
            response.parking_bookings || []
          );
          setBookingData(transformedBookings);

          // Generate summary
          const generatedSummary = generateSummaryFromBookings(
            response.parking_bookings || []
          );
          setSummary(generatedSummary);

          // Set pagination
          setApiPagination({
            current_page: response.pagination.current_page,
            total_count: response.pagination.total_count,
            total_pages: response.pagination.total_pages,
            per_page: 20,
          });

          console.log(
            "✅ Table updated - Page:",
            response.pagination.current_page
          );
        }
      } catch (error) {
        console.error("Error loading booking data:", error);
        setError("Failed to load parking booking data");
        toast.error("Failed to load parking booking data");
      } finally {
        // Only set loading false for non-initial loads (initial load sets it earlier)
        if (!isInitialLoadRef.current) {
          setLoading(false);
        }
      }
    };

    loadBookingData();
  }, [currentPage, debouncedSearchTerm, appliedFilters, cardFilter]);

  // Intersection Observer for Lazy Loading
  useEffect(() => {
    if (!lazyLoadingEnabled || !sentinelRef.current) {
      console.log("⚠️ Lazy loading disabled or sentinel not found");
      return;
    }

    console.log("📌 Setting up Intersection Observer for lazy loading");

    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;

        console.log("👀 Sentinel visibility:", {
          isIntersecting: entry.isIntersecting,
          currentPage: apiPagination.current_page,
          totalPages: apiPagination.total_pages,
          isLoading: lazyLoadingRef.current,
        });

        // If sentinel is visible and we have more pages to load
        if (
          entry.isIntersecting &&
          !lazyLoadingRef.current &&
          apiPagination.current_page < apiPagination.total_pages
        ) {
          lazyLoadingRef.current = true;
          setIsLazyLoading(true);

          try {
            const nextPage = apiPagination.current_page + 1;
            console.log("📥 Fetching page:", nextPage);

            const response = await fetchParkingBookings(
              nextPage,
              debouncedSearchTerm,
              buildApiFilterParamsEffective()
            );

            console.log("📊 Received data count:", response.parking_bookings?.length);

            // Append new data to existing bookings instead of replacing
            setBookings((prevBookings) => [
              ...prevBookings,
              ...(response.parking_bookings || []),
            ]);

            // Transform and append for UI
            const transformedBookings = transformApiDataToBookings(
              response.parking_bookings || []
            );
            setBookingData((prevBookingData) => [
              ...prevBookingData,
              ...transformedBookings,
            ]);

            // Update pagination state for the next page
            setApiPagination({
              current_page: response.pagination.current_page,
              total_count: response.pagination.total_count,
              total_pages: response.pagination.total_pages,
              per_page: apiPagination.per_page,
            });

            console.log("✅ Lazy loaded page:", nextPage);
          } catch (error) {
            console.error("Error lazy loading data:", error);
            toast.error("Failed to load more data");
          } finally {
            lazyLoadingRef.current = false;
            setIsLazyLoading(false);
          }
        }
      },
      {
        rootMargin: "200px", // Load 200px before reaching the bottom
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [
    apiPagination.current_page,
    apiPagination.total_pages,
    lazyLoadingEnabled,
    debouncedSearchTerm,
    buildApiFilterParamsEffective,
    fetchParkingBookings,
  ]);

  // Generate parking stats from cards data
  const parkingStats = useMemo(() => {
    if (!cards) {
      return [
        // First row - Car parking stats
        {
          title: "Total Parking Slots",
          count: 0,
          icon: Car,
          vehicle: "four" as const,
          metric: "total" as const,
        },
        {
          title: "Booked Parking",
          count: 0,
          icon: CheckCircle,
          vehicle: "four" as const,
          metric: "booked" as const,
        },
        {
          title: "Vacant Parking",
          count: 0,
          icon: AlertTriangle,
          vehicle: "four" as const,
          metric: "vacant" as const,
        },
        {
          title: "Cancelled Booking",
          count: 0,
          icon: XCircle,
          vehicle: "four" as const,
          metric: "cancelled" as const,
        },
        // Second row - Bike parking stats
        {
          title: "Total Parking Slots",
          count: 0,
          icon: Bike,
          vehicle: "two" as const,
          metric: "total" as const,
        },
        {
          title: "Booked Parking",
          count: 0,
          icon: CheckCircle,
          vehicle: "two" as const,
          metric: "booked" as const,
        },
        {
          title: "Vacant Parking",
          count: 0,
          icon: AlertTriangle,
          vehicle: "two" as const,
          metric: "vacant" as const,
        },
        {
          title: "Cancelled Booking",
          count: 0,
          icon: XCircle,
          vehicle: "two" as const,
          metric: "cancelled" as const,
        },
      ];
    }

    return [
      // First row - Car parking stats
      {
        title: "Total Parking Slots",
        count: cards.four_total,
        icon: Car,
        vehicle: "four" as const,
        metric: "total" as const,
      },
      {
        title: "Booked Slots",
        count: cards.four_booked,
        icon: CheckCircle,
        vehicle: "four" as const,
        metric: "booked" as const,
      },
      {
        title: "Vacant Slots",
        count: cards.four_available,
        icon: AlertTriangle,
        vehicle: "four" as const,
        metric: "vacant" as const,
      },
      {
        title: "Cancelled Slots",
        count: cards.four_cancelled,
        icon: XCircle,
        vehicle: "four" as const,
        metric: "cancelled" as const,
      },
      // Second row - Bike parking stats
      {
        title: "Total Parking Slots",
        count: cards.two_total,
        icon: Bike,
        vehicle: "two" as const,
        metric: "total" as const,
      },
      {
        title: "Booked Slots",
        count: cards.two_booked,
        icon: CheckCircle,
        vehicle: "two" as const,
        metric: "booked" as const,
      },
      {
        title: "Vacant Slots",
        count: cards.two_available,
        icon: AlertTriangle,
        vehicle: "two" as const,
        metric: "vacant" as const,
      },
      {
        title: "Cancelled Slots",
        count: cards.two_cancelled,
        icon: XCircle,
        vehicle: "two" as const,
        metric: "cancelled" as const,
      },
    ];
  }, [cards]);

  // Resolve category ids for two/four wheeler from loaded categories
  const twoWheelerCategoryId = useMemo(() => {
    const match = parkingCategories.find((cat) => {
      const lower = cat.name.toLowerCase();
      return (
        lower.includes("two") || lower.includes("2") || lower.includes("bike")
      );
    });
    return match ? match.id.toString() : null;
  }, [parkingCategories]);

  const fourWheelerCategoryId = useMemo(() => {
    const match = parkingCategories.find((cat) => {
      const lower = cat.name.toLowerCase();
      return (
        lower.includes("four") || lower.includes("4") || lower.includes("car")
      );
    });
    return match ? match.id.toString() : null;
  }, [parkingCategories]);

  const getCategoryIdForVehicle = (vehicle: "two" | "four"): string | null => {
    return vehicle === "two" ? twoWheelerCategoryId : fourWheelerCategoryId;
  };

  // Filter floors based on selected building
  const filteredFloors = useMemo(() => {
    if (filters.building === "all") {
      return floors; // Show all floors if no building is selected
    }

    const selectedBuildingId = parseInt(filters.building);
    return floors.filter((floor) => floor.building_id === selectedBuildingId);
  }, [floors, filters.building]);

  // Handle card clicks to filter table data
  const handleStatCardClick = (
    vehicle: "two" | "four",
    metric: "total" | "booked" | "vacant" | "cancelled"
  ) => {
    // Only apply filter for Total Booked Parking and Total Cancelled Booking cards
    if (metric !== "booked" && metric !== "cancelled") return;
    const categoryId = getCategoryIdForVehicle(vehicle) || undefined;
    const status = metric === "booked" ? "confirmed" : "cancelled";
    console.log("🔍 Card Click Debug:");
    console.log("Vehicle:", vehicle);
    console.log("Metric:", metric);
    console.log("Category ID:", categoryId);
    console.log("Status:", status);
    setCardFilter({ active: true, categoryId, status });
    setCurrentPage(1);
    // No need to set cardsLoading here - cards don't reload on card click, only table does
  };

  // Clear card filter
  const handleClearCardFilter = () => {
    setCardFilter(null);
    setCurrentPage(1);
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
    setShowActionPanel(false);
  };

  const handleExportWithDateRange = async () => {
    try {
      if (!exportDateRange.startDate || !exportDateRange.endDate) {
        toast.error("Please select both start and end dates");
        return;
      }

      if (
        new Date(exportDateRange.startDate) > new Date(exportDateRange.endDate)
      ) {
        toast.error("Start date cannot be after end date");
        return;
      }

      toast.info("Exporting parking bookings...");

      // Use the dedicated export API endpoint
      const exportUrl = getFullUrl("/parking_booking/export.xlsx");
      const options = getAuthenticatedFetchOptions();

      // Build query parameters for the export API
      const params = new URLSearchParams();
      params.append("start_date", exportDateRange.startDate);
      params.append("end_date", exportDateRange.endDate);

      // Add current applied filters to export parameters
      // Search query - intelligently route to email, first name, or last name
      if (debouncedSearchTerm.trim()) {
        const trimmedQuery = debouncedSearchTerm.trim();

        // Check if it's an email (contains @)
        if (trimmedQuery.includes("@")) {
          params.append("q[user_email_eq]", trimmedQuery);
        }
        // Check if it contains a space (first name and last name)
        else if (trimmedQuery.includes(" ")) {
          const nameParts = trimmedQuery
            .split(" ")
            .filter((part) => part.length > 0);
          if (nameParts.length >= 2) {
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(" "); // Join remaining parts as last name
            params.append("q[user_firstname_eq]", firstName);
            params.append("q[user_last_name_eq]", lastName);
          } else {
            // Only one part after splitting, treat as first name
            params.append("q[user_firstname_eq]", nameParts[0]);
          }
        }
        // Single word without @ - treat as first name
        else {
          params.append("q[user_firstname_eq]", trimmedQuery);
        }
      }

      // Category filter
      if (appliedFilters.category && appliedFilters.category !== "all") {
        params.append(
          "q[parking_configuration_parking_category_id_eq]",
          appliedFilters.category
        );
      }

      // User filter
      if (appliedFilters.user && appliedFilters.user !== "all") {
        params.append("q[user_id_in][]", appliedFilters.user);
      }

      // Parking slot filter
      if (appliedFilters.parking_slot.trim()) {
        params.append(
          "q[parking_number_name_cont]",
          appliedFilters.parking_slot.trim()
        );
      }

      // Status filter
      if (appliedFilters.status !== "all") {
        const statusMap: { [key: string]: string } = {
          Confirmed: "confirmed",
          Cancelled: "cancelled",
          confirmed: "confirmed",
          cancelled: "cancelled",
        };
        const apiStatus =
          statusMap[appliedFilters.status] || appliedFilters.status;
        params.append("q[status_in][]", apiStatus);
      }

      // Building filter
      if (appliedFilters.building && appliedFilters.building !== "all") {
        params.append(
          "q[parking_configuration_building_id_eq]",
          appliedFilters.building
        );
      }

      // Floor filter
      if (appliedFilters.floor && appliedFilters.floor !== "all") {
        params.append(
          "q[parking_configuration_floor_id_eq]",
          appliedFilters.floor
        );
      }

      // Scheduled date range filter
      if (
        appliedFilters.scheduled_on_from.trim() ||
        appliedFilters.scheduled_on_to.trim()
      ) {
        const fromDate = appliedFilters.scheduled_on_from.trim()
          ? formatDateForAPI(appliedFilters.scheduled_on_from.trim())
          : formatDateForAPI(appliedFilters.scheduled_on_to.trim());
        const toDate = appliedFilters.scheduled_on_to.trim()
          ? formatDateForAPI(appliedFilters.scheduled_on_to.trim())
          : formatDateForAPI(appliedFilters.scheduled_on_from.trim());
        params.append("q[date_range1]", `${fromDate} - ${toDate}`);
      }

      // Booked date range filter
      if (
        appliedFilters.booked_on_from.trim() ||
        appliedFilters.booked_on_to.trim()
      ) {
        const fromDate = appliedFilters.booked_on_from.trim()
          ? formatDateForAPI(appliedFilters.booked_on_from.trim())
          : formatDateForAPI(appliedFilters.booked_on_to.trim());
        const toDate = appliedFilters.booked_on_to.trim()
          ? formatDateForAPI(appliedFilters.booked_on_to.trim())
          : formatDateForAPI(appliedFilters.booked_on_from.trim());
        params.append("q[date_range]", `${fromDate} - ${toDate}`);
      }

      // Card filter overrides (if active)
      if (cardFilter?.active && cardFilter.categoryId) {
        params.set(
          "q[parking_configuration_parking_category_id_eq]",
          cardFilter.categoryId
        );
      }
      if (cardFilter?.active && cardFilter.status) {
        params.set("q[status_in][]", cardFilter.status);
      }

      const fullExportUrl = `${exportUrl}?${params.toString()}`;

      console.log("🔍 Export API Debug Info:");
      console.log("Export URL:", fullExportUrl);
      console.log("Start Date:", exportDateRange.startDate);
      console.log("End Date:", exportDateRange.endDate);
      console.log("Applied Filters:", appliedFilters);
      console.log("Card Filter:", cardFilter);
      console.log("Search Term:", debouncedSearchTerm);

      const response = await fetch(fullExportUrl, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if the response is actually an Excel file
      const contentType = response.headers.get("Content-Type");
      console.log("Response Content-Type:", contentType);

      // Get the blob data
      const blob = await response.blob();

      // Create download link
      const link = document.createElement("a");
      const downloadUrl = URL.createObjectURL(blob);
      link.setAttribute("href", downloadUrl);

      // Set filename with date range
      const filename = `parking_bookings_${exportDateRange.startDate}_to_${exportDateRange.endDate}.xlsx`;
      link.setAttribute("download", filename);

      // Trigger download
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      URL.revokeObjectURL(downloadUrl);

      toast.success("Parking bookings exported successfully!");
      setIsExportModalOpen(false);

      // Reset date range
      setExportDateRange({
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Error exporting parking bookings:", error);
      toast.error("Failed to export parking bookings. Please try again.");
    }
  };

  const handleCancelExport = () => {
    setIsExportModalOpen(false);
    setExportDateRange({
      startDate: "",
      endDate: "",
    });
  };

  const handleFileImport = async (file: File) => {
    try {
      toast.info("Importing parking bookings...");

      const formData = new FormData();
      formData.append("file", file);

      const url = getFullUrl("/pms/admin/parking_bookings/import");
      const options = getAuthenticatedFetchOptions();

      const response = await fetch(url, {
        ...options,
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(
        "✅ Site-wise parking bookings imported successfully:",
        result
      );

      toast.success("Site-wise parking bookings imported successfully!");

      // Refresh the data - fetch all necessary data including cancelled counts
      // First fetch categories to resolve category IDs
      const categoriesData = await fetchParkingCategories();

      // Resolve category IDs from the fetched categories
      const twoWheelerCategory = categoriesData.find((cat) => {
        const lower = cat.name.toLowerCase();
        return (
          lower.includes("two") || lower.includes("2") || lower.includes("bike")
        );
      });
      const twoWheelerCategoryIdLocal = twoWheelerCategory
        ? twoWheelerCategory.id.toString()
        : null;

      const fourWheelerCategory = categoriesData.find((cat) => {
        const lower = cat.name.toLowerCase();
        return (
          lower.includes("four") || lower.includes("4") || lower.includes("car")
        );
      });
      const fourWheelerCategoryIdLocal = fourWheelerCategory
        ? fourWheelerCategory.id.toString()
        : null;

      const buildCancelledFilterParamsImport = (
        vehicleType: "two" | "four"
      ): ApiFilterParams => {
        const categoryId =
          vehicleType === "two"
            ? twoWheelerCategoryIdLocal
            : fourWheelerCategoryIdLocal;
        return {
          category: categoryId || undefined,
          statuses: ["cancelled"],
        };
      };

      const [
        refreshedData,
        twoWheelerCancelledResponse,
        fourWheelerCancelledResponse,
      ] = await Promise.all([
        fetchParkingBookings(),
        twoWheelerCategoryIdLocal
          ? fetchParkingBookings(1, "", buildCancelledFilterParamsImport("two"))
          : Promise.resolve({
            pagination: { total_count: 0 },
            parking_bookings: [],
            cards: {},
          }),
        fourWheelerCategoryIdLocal
          ? fetchParkingBookings(
            1,
            "",
            buildCancelledFilterParamsImport("four")
          )
          : Promise.resolve({
            pagination: { total_count: 0 },
            parking_bookings: [],
            cards: {},
          }),
      ]);

      // Set raw API data
      setBookings(refreshedData.parking_bookings);

      // Get cancelled counts from API response total_count
      const twoWheelerCancelled =
        twoWheelerCancelledResponse.pagination.total_count || 0;
      const fourWheelerCancelled =
        fourWheelerCancelledResponse.pagination.total_count || 0;

      // Set cards data from API response
      setCards({
        ...refreshedData.cards,
        two_cancelled: twoWheelerCancelled,
        four_cancelled: fourWheelerCancelled,
      });

      // Transform for UI
      const transformedBookings = transformApiDataToBookings(
        refreshedData.parking_bookings
      );
      setBookingData(transformedBookings);

      // Generate summary
      const generatedSummary = generateSummaryFromBookings(
        refreshedData.parking_bookings
      );
      setSummary(generatedSummary);
    } catch (error) {
      console.error("❌ Error importing site-wise parking bookings:", error);
      toast.error("Failed to import parking bookings. Please try again.");
      throw error;
    }
  };

  const handleActionClick = () => {
    setShowActionPanel(!showActionPanel);
  };

  const handleClearSelection = () => {
    setShowActionPanel(false);
  };

  const handleToggleFilters = () => {
    setShowFiltersModal(!showFiltersModal);
  };

  const handleCancelBooking = async (bookingId: number) => {
    // Show custom confirmation dialog
    setBookingToCancel(bookingId);
    setShowCancelConfirmation(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      toast.info(`Cancelling booking ${bookingToCancel}...`);

      const url = getFullUrl(`/pms/admin/parking_bookings/${bookingToCancel}`);
      const options = getAuthenticatedFetchOptions();

      const response = await fetch(url, {
        ...options,
        method: "PUT",
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parking_booking: {
            status: "cancelled",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Booking cancelled successfully:", result);

      toast.success(`Booking ${bookingToCancel} cancelled successfully!`);

      // Update the local state to reflect the cancellation
      setBookingData((prevData) =>
        prevData.map((booking) =>
          booking.id === bookingToCancel
            ? { ...booking, status: "cancelled", cancel: false }
            : booking
        )
      );

      // Update summary counts
      if (summary) {
        setSummary((prev) =>
          prev
            ? {
              ...prev,
              confirmed_bookings: prev.confirmed_bookings - 1,
              cancelled_bookings: prev.cancelled_bookings + 1,
            }
            : null
        );
      }

      // Close the dialog
      setShowCancelConfirmation(false);
      setBookingToCancel(null);
    } catch (error) {
      console.error("❌ Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
      setShowCancelConfirmation(false);
      setBookingToCancel(null);
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setShowActionPanel(false);
      }
    };

    if (showActionPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showActionPanel]);

  // Client-side search filtering for immediate feedback
  // Filter data based on search term across multiple fields
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return bookingData;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    console.log("🔍 Client-side Search Debug:");
    console.log("Search term:", searchTerm);
    console.log("Search term lowercased:", searchLower);
    console.log("Total bookings to search:", bookingData.length);

    const filtered = bookingData.filter((booking) => {
      const searchableFields = [
        booking.employee_name,
        booking.employee_email,
        booking.designation,
        booking.department,
        booking.category,
        booking.building,
        booking.floor,
        booking.status,
        booking.slot_parking_no,
        booking.schedule_date,
        booking.booking_schedule,
        booking.id.toString(),
      ].filter(Boolean); // Remove null/undefined values

      const matches = searchableFields.some((field) =>
        field.toLowerCase().includes(searchLower)
      );

      if (matches) {
        console.log("🔍 Match found:", {
          id: booking.id,
          employee_name: booking.employee_name,
          designation: booking.designation,
          department: booking.department,
        });
      }

      return matches;
    });

    console.log("🔍 Filtered results count:", filtered.length);
    return filtered;
  }, [bookingData, searchTerm]);

  // Use filtered data for display
  const paginatedData = filteredData;

  // Use API pagination for total pages
  const totalPages = apiPagination.total_pages;
  const currentApiPage = apiPagination.current_page;

  // Handle page change - this will trigger API call
  const handlePageChange = async (page: number) => {
    try {
      setCurrentPage(page);
      setLoading(true);

      // Convert UI filters to API filter parameters (same logic as in useEffect)
      const buildApiFilterParams = (): ApiFilterParams => {
        const apiParams: ApiFilterParams = {};

        // Only apply dialog category if not overridden by card filter
        if (appliedFilters.category !== "all" && !cardFilter?.active) {
          console.log("🔍 Building API Filter (Page Change) - Category:");
          console.log("UI Filter category value:", appliedFilters.category);
          console.log(
            "UI Filter category type:",
            typeof appliedFilters.category
          );
          apiParams.category = appliedFilters.category;
        }

        if (appliedFilters.user !== "all") {
          apiParams.user_ids = [appliedFilters.user];
        }

        if (appliedFilters.parking_slot.trim()) {
          console.log("🔍 Building API Filter (Page Change) - Parking Slot:");
          console.log(
            "UI Filter parking_slot value:",
            appliedFilters.parking_slot
          );
          console.log(
            "UI Filter parking_slot trimmed:",
            appliedFilters.parking_slot.trim()
          );
          apiParams.parking_slot = appliedFilters.parking_slot.trim();
        }

        // Only dialog status if not overridden by card filter
        if (appliedFilters.status !== "all" && !cardFilter?.active) {
          // Map UI status to API status
          const statusMap: { [key: string]: string } = {
            Confirmed: "confirmed",
            Cancelled: "cancelled",
            confirmed: "confirmed",
            cancelled: "cancelled",
          };
          const apiStatus =
            statusMap[appliedFilters.status] || appliedFilters.status;
          apiParams.statuses = [apiStatus];
        }

        // Building filter
        if (appliedFilters.building !== "all") {
          console.log("🔍 Building API Filter (Page Change) - Building:");
          console.log("UI Filter building value:", appliedFilters.building);
          apiParams.building_id = appliedFilters.building;
        }

        // Floor filter
        if (appliedFilters.floor !== "all") {
          console.log("🔍 Building API Filter (Page Change) - Floor:");
          console.log("UI Filter floor value:", appliedFilters.floor);
          apiParams.floor_id = appliedFilters.floor;
        }

        if (
          appliedFilters.scheduled_on_from.trim() ||
          appliedFilters.scheduled_on_to.trim()
        ) {
          // Build date range for scheduled_on with proper date formatting
          const fromDate = appliedFilters.scheduled_on_from.trim()
            ? formatDateForAPI(appliedFilters.scheduled_on_from.trim())
            : formatDateForAPI(appliedFilters.scheduled_on_to.trim());
          const toDate = appliedFilters.scheduled_on_to.trim()
            ? formatDateForAPI(appliedFilters.scheduled_on_to.trim())
            : formatDateForAPI(appliedFilters.scheduled_on_from.trim());
          apiParams.scheduled_date_range = `${fromDate} - ${toDate}`;
          console.log(
            "🔍 Formatted Scheduled Date Range (Page Change):",
            apiParams.scheduled_date_range
          );
        }

        if (
          appliedFilters.booked_on_from.trim() ||
          appliedFilters.booked_on_to.trim()
        ) {
          // Build date range for booked_on with proper date formatting
          const fromDate = appliedFilters.booked_on_from.trim()
            ? formatDateForAPI(appliedFilters.booked_on_from.trim())
            : formatDateForAPI(appliedFilters.booked_on_to.trim());
          const toDate = appliedFilters.booked_on_to.trim()
            ? formatDateForAPI(appliedFilters.booked_on_to.trim())
            : formatDateForAPI(appliedFilters.booked_on_from.trim());
          apiParams.booked_date_range = `${fromDate} - ${toDate}`;
          console.log(
            "🔍 Formatted Booked Date Range (Page Change):",
            apiParams.booked_date_range
          );
        }

        // Apply card filter overrides if active
        if (cardFilter?.active && cardFilter.categoryId) {
          apiParams.category = cardFilter.categoryId;
          console.log(
            "🔍 Applied Card Filter Category (Page Change):",
            cardFilter.categoryId
          );
        }
        if (cardFilter?.active && cardFilter.status) {
          apiParams.statuses = [cardFilter.status];
          console.log(
            "🔍 Applied Card Filter Status (Page Change):",
            cardFilter.status
          );
        }

        return apiParams;
      };

      const response = await fetchParkingBookings(
        page,
        debouncedSearchTerm,
        buildApiFilterParams()
      );

      // Set raw API data
      setBookings(response.parking_bookings);

      // Cards data is NOT updated on page change - cards show overall stats and should remain stable
      // They are only updated in the main useEffect when filters change

      // Transform for UI
      const transformedBookings = transformApiDataToBookings(
        response.parking_bookings
      );
      setBookingData(transformedBookings);

      // Generate summary
      const generatedSummary = generateSummaryFromBookings(
        response.parking_bookings
      );
      setSummary(generatedSummary);

      // Set pagination - use fixed per_page of 20 for consistent serial number calculation
      setApiPagination({
        current_page: response.pagination.current_page,
        total_count: response.pagination.total_count,
        total_pages: response.pagination.total_pages,
        per_page: 20, // Fixed per_page value for consistent pagination
      });

      console.log("🔍 Page Change Debug:");
      console.log("Requested Page:", page);
      console.log(
        "API Response - Current Page:",
        response.pagination.current_page
      );
      console.log(
        "API Response - Total Pages:",
        response.pagination.total_pages
      );
      console.log(
        "API Response - Total Count:",
        response.pagination.total_count
      );
      console.log("Card Filter Active:", cardFilter?.active);
      console.log("Transformed Data Length:", transformedBookings.length);
    } catch (error) {
      console.error("Error changing page:", error);
      toast.error("Failed to load page data");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to capitalize first letter of status
  const capitalizeStatus = (status: string): string => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Handle search
  const handleSearch = (term: string) => {
    console.log("🔍 Search Handler Debug:");
    console.log("Search term received:", term);
    console.log("Search term type:", typeof term);
    console.log("Search term length:", term.length);
    setSearchTerm(term);
    // Note: The useEffect will trigger API call automatically due to dependency changes
    // Page reset happens in the debounce effect to avoid unnecessary resets
  };

  // Column visibility functions
  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible } : col))
    );
  };

  const isColumnVisible = (columnKey: string) => {
    return columns.find((col) => col.key === columnKey)?.visible ?? true;
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };

      // If building changes, reset floor selection to 'all'
      if (key === "building") {
        updated.floor = "all";
      }

      return updated;
    });
    // Don't reset page or trigger API call - only update form state
  };

  const handleApplyFilters = () => {
    let filtersToApply = { ...filters };

    // If a building is selected, ensure the selected floor belongs to that building
    if (filtersToApply.building !== "all" && filtersToApply.floor !== "all") {
      const selectedBuildingId = parseInt(filtersToApply.building);
      const selectedFloor = floors.find(
        (floor) => floor.id.toString() === filtersToApply.floor
      );

      // If the selected floor doesn't belong to the selected building, reset floor to 'all'
      if (selectedFloor && selectedFloor.building_id !== selectedBuildingId) {
        filtersToApply = { ...filtersToApply, floor: "all" };
        setFilters(filtersToApply); // Update the form state as well
      }
    }

    setAppliedFilters(filtersToApply);
    setCurrentPage(1); // Reset to first page when applying filters
    setShowFiltersModal(false);
    toast.success("Filters applied successfully!");
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: "all",
      user: "all",
      parking_slot: "",
      status: "all",
      building: "all",
      floor: "all",
      scheduled_on_from: "",
      scheduled_on_to: "",
      booked_on_from: "",
      booked_on_to: "",
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    // Also clear any card overrides
    setCardFilter(null);
    setCurrentPage(1);
  };

  // Handle analytics filter apply
  const handleAnalyticsFilterApply = (filters: {
    rangeA: { startDate: string; endDate: string; label: string };
    rangeB: { startDate: string; endDate: string; label: string };
  }) => {
    setAnalyticsDateRange(filters);
    // You can add additional logic here to fetch analytics data with the new date range
    console.log("Analytics date range updated:", filters);
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (key: keyof ParkingBookingSite) => {
    return Array.from(
      new Set(
        bookingData
          .map((item) => {
            const value = item[key];
            return typeof value === "string" ? value : "";
          })
          .filter(Boolean)
      )
    );
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">PARKING BOOKING LIST</h1>
      </div> */}

      {/* Tabs */}
      <Tabs defaultValue="parking" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="parking"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={2}
              className="lucide lucide-car w-4 h-4 stroke-black group-data-[state=active]:stroke-[#C72030]"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            Parking List
          </TabsTrigger>

          <TabsTrigger
            value="analytics"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={2}
              className="lucide lucide-chart-column w-4 h-4 stroke-black group-data-[state=active]:stroke-[#C72030]"
            >
              <path d="M3 3v16a2 2 0 0 0 2 2h16" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Parking List Tab Content */}
        <TabsContent value="parking" className="mt-6 space-y-6">
          {/* Stats Cards */}
          <SectionLoader
            loading={cardsLoading}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6"
          >
            {!cards
              ? // Show skeleton loading only on initial load when cards are null
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 animate-pulse"
                >
                  <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-400">
                      0
                    </div>
                    <div className="text-sm font-medium text-gray-400">
                      Loading...
                    </div>
                  </div>
                </div>
              ))
              : // Show actual card data once loaded
              parkingStats.map((stat, index) => {
                const IconComponent = stat.icon;
                const isClickable =
                  stat.metric === "booked" || stat.metric === "cancelled";
                return (
                  <div
                    key={index}
                    className={`bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 ${isClickable ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}`}
                    onClick={() =>
                      isClickable &&
                      handleStatCardClick(stat.vehicle, stat.metric)
                    }
                  >
                    <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-[#C72030]" />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-[#1A1A1A]">
                        {stat.count}
                      </div>
                      <div className="text-sm font-medium text-[#1A1A1A]">
                        {stat.title}
                      </div>
                    </div>
                  </div>
                );
              })}
          </SectionLoader>

          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left Side Controls */}
            <div className="flex gap-2">
              {/* Card Filter Indicator */}
              {/* {cardFilter?.active && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 border border-blue-300 rounded-md text-sm">
              <span className="text-blue-800 font-medium">
                Card Filter: {cardFilter.categoryId ? 
                  parkingCategories.find(c => c.id.toString() === cardFilter.categoryId)?.name || 'Unknown Category' : 
                  'Active'
                } - {cardFilter.status === 'confirmed' ? 'Confirmed' : cardFilter.status}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCardFilter}
                className="h-5 w-5 p-0 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )} */}
              {/* <Button 
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none border-none shadow-none" 
            onClick={handleActionClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Action
          </Button> */}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-10 w-64"
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {/* Search Results Counter */}
                {searchTerm.trim() && (
                  <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
                    {filteredData.length} result
                    {filteredData.length !== 1 ? "s" : ""} found
                  </div>
                )}
              </div>

              {/* Filter Button */}
              <Button
                variant="outline"
                onClick={handleToggleFilters}
                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 w-10 h-10 p-0"
              >
                <Filter className="w-4 h-4" />
              </Button>

              {/* Export Button */}

              {/* Column Visibility */}
              <ColumnVisibilityDropdown
                columns={columns}
                onColumnToggle={handleColumnToggle}
              />

              <Button
                variant="outline"
                onClick={handleExport}
                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 w-10 h-10 p-0"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filters Section */}
          {/* Filters are now in a modal - see below */}

          {/* Data Table with EnhancedTable */}
          <div className="overflow-x-auto animate-fade-in">
            <EnhancedTable
              data={paginatedData || []}
              columns={columns.filter(col => col.visible)}
              renderCell={(item, columnKey) => {
                if (columnKey === "sr_no") {
                  // For lazy loading, calculate index directly from current paginatedData
                  const index = paginatedData.findIndex(
                    (booking) => booking.id === item.id
                  );
                  return index + 1; // Simple 1-based index for lazy loading
                }
                if (columnKey === "status") {
                  return (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${item.status.toLowerCase() === "confirmed" ||
                        item.status.toLowerCase() === "approved"
                        ? "bg-green-100 text-green-800"
                        : item.status.toLowerCase() === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {capitalizeStatus(item.status)}
                    </span>
                  );
                }
                if (columnKey === "category") {
                  return (
                    <div className="flex items-center gap-1">
                      {item.category}
                    </div>
                  );
                }
                if (columnKey === "department") {
                  return item.department || "-";
                }
                if (columnKey === "checked_in_at") {
                  return item.checked_in_at || "-";
                }
                if (columnKey === "checked_out_at") {
                  return item.checked_out_at || "-";
                }
                if (columnKey === "cancel") {
                  return item.cancel ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelBooking(item.id);
                      }}
                    >
                      Cancel
                    </Button>
                  ) : null;
                }
                return item[columnKey];
              }}
              selectable={false}
              pagination={false}
              enableExport={false}
              storageKey="parking-bookings-table"
              loading={loading && cards !== null}
              loadingMessage="Loading parking booking data..."
              hideTableExport={true}
              hideColumnsButton={true}
              hideTableSearch={true}
              className="transition-all duration-500 ease-in-out"
            />
          </div>

          {/* Lazy Loading Sentinel */}
          <div
            ref={sentinelRef}
            className="flex justify-center items-center py-8"
          >
            {isLazyLoading && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-[#C72030] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-600">Loading more bookings...</p>
              </div>
            )}
            {!isLazyLoading &&
              apiPagination.current_page >= apiPagination.total_pages && (
                <p className="text-sm text-gray-500">
                  No more bookings to load
                </p>
              )}
          </div>

          <BulkUploadModal
            isOpen={isBulkUploadOpen}
            onClose={() => setIsBulkUploadOpen(false)}
            title="Import Site-wise Parking Bookings"
            description="Upload a file to import site-wise parking booking data"
            onImport={handleFileImport}
          />

          {/* Export Modal */}
          <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
            <DialogContent className="max-w-md bg-white">
              <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
                <DialogTitle className="text-xl font-bold text-[hsl(var(--analytics-text))]">
                  Export Parking Bookings
                </DialogTitle>
                <Button variant="ghost" size="sm" onClick={handleCancelExport}>
                  <X className="w-4 h-4" />
                </Button>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Show applied filters info */}
                {(appliedFilters.category !== "all" ||
                  appliedFilters.user !== "all" ||
                  appliedFilters.status !== "all" ||
                  appliedFilters.building !== "all" ||
                  appliedFilters.floor !== "all" ||
                  appliedFilters.parking_slot.trim() ||
                  debouncedSearchTerm.trim() ||
                  cardFilter?.active) && (
                    <div className="">
                      {/* <p className="text-sm font-medium text-blue-800 mb-2">Current Filters Applied:</p> */}
                      {/* <div className="text-xs text-blue-700 space-y-1">
                  {appliedFilters.category !== 'all' && <div>• Category: {parkingCategories.find(c => c.id.toString() === appliedFilters.category)?.name || appliedFilters.category}</div>}
                  {appliedFilters.user !== 'all' && <div>• User: {users.find(u => u.id.toString() === appliedFilters.user)?.full_name || appliedFilters.user}</div>}
                  {appliedFilters.status !== 'all' && <div>• Status: {appliedFilters.status}</div>}
                  {appliedFilters.building !== 'all' && <div>• Building: {buildings.find(b => b.id.toString() === appliedFilters.building)?.name || appliedFilters.building}</div>}
                  {appliedFilters.floor !== 'all' && <div>• Floor: {floors.find(f => f.id.toString() === appliedFilters.floor)?.name || appliedFilters.floor}</div>}
                  {appliedFilters.parking_slot.trim() && <div>• Parking Slot: {appliedFilters.parking_slot}</div>}
                  {debouncedSearchTerm.trim() && <div>• Search: "{debouncedSearchTerm}"</div>}
                  {cardFilter?.active && <div>• Card Filter: Active</div>}
                </div> */}
                      {/* <p className="text-xs text-blue-600 mt-2 italic">Export will include only the filtered data.</p> */}
                    </div>
                  )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[hsl(var(--analytics-text))]">
                    Start Date *
                  </Label>
                  <Input
                    type="date"
                    value={exportDateRange.startDate}
                    onChange={(e) =>
                      setExportDateRange((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="h-10 rounded-md border border-[hsl(var(--analytics-border))] bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[hsl(var(--analytics-text))]">
                    End Date *
                  </Label>
                  <Input
                    type="date"
                    value={exportDateRange.endDate}
                    onChange={(e) =>
                      setExportDateRange((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="h-10 rounded-md border border-[hsl(var(--analytics-border))] bg-white"
                    required
                  />
                </div>
              </div>

              <DialogFooter className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleCancelExport}
                  className="text-[hsl(var(--analytics-text))] border-[hsl(var(--analytics-border))]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExportWithDateRange}
                  className="bg-[hsl(var(--analytics-primary))] hover:bg-[hsl(var(--analytics-primary))]/90 text-white"
                  disabled={
                    !exportDateRange.startDate || !exportDateRange.endDate
                  }
                >
                  Export
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Action Panel */}
          {showActionPanel && (
            <div
              className={`fixed z-50 flex items-end justify-center pb-8 sm:pb-[16rem] pointer-events-none transition-all duration-300 ${isSidebarCollapsed ? "left-16" : "left-64"
                } right-0 bottom-0`}
            >
              <div className="flex max-w-full pointer-events-auto bg-white border border-gray-200 rounded-lg shadow-lg mx-4 overflow-hidden">
                <div className="hidden sm:flex w-8 bg-[#C4B89D54] items-center justify-center text-red-600 font-semibold text-sm"></div>

                <div ref={panelRef} className="p-4 sm:p-6 w-full sm:w-auto">
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 sm:gap-12">
                    <button
                      onClick={handleExport}
                      className="flex flex-col items-center justify-center cursor-pointer text-[#374151] hover:text-black w-16 sm:w-auto"
                    >
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-sm font-medium text-center">
                        Import
                      </span>
                    </button>

                    <div className="w-px h-8 bg-black opacity-20 mx-2 sm:mx-4" />

                    <div
                      onClick={handleClearSelection}
                      className="flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 w-16 sm:w-auto"
                    >
                      <X className="w-6 h-6 mb-1" />
                      <span className="text-sm font-medium text-center">
                        Close
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters Modal */}
          <Dialog
            open={showFiltersModal}
            onOpenChange={setShowFiltersModal}
            modal={false}
          >
            <DialogContent
              className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white"
              aria-describedby="parking-filter-dialog-description"
            >
              <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  FILTER BY
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFiltersModal(false)}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
                <div id="parking-filter-dialog-description" className="sr-only">
                  Filter parking bookings by category, user, parking slot,
                  status, and date ranges
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Filter Options Section */}
                <div>
                  <h3 className="text-sm font-medium text-[#C72030] mb-4">
                    Filter Options
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    {/* Category */}
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="category-label" shrink>
                        Category
                      </InputLabel>
                      <MuiSelect
                        labelId="category-label"
                        label="Category"
                        value={filters.category}
                        onChange={(e) =>
                          handleFilterChange("category", e.target.value)
                        }
                        displayEmpty
                        sx={fieldStyles}
                        MenuProps={selectMenuProps}
                      >
                        <MenuItem value="all">
                          <em>All Categories</em>
                        </MenuItem>
                        {parkingCategories.map((category) => (
                          <MenuItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>

                    {/* User */}
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="user-label" shrink>
                        User
                      </InputLabel>
                      <MuiSelect
                        labelId="user-label"
                        label="User"
                        value={filters.user}
                        onChange={(e) =>
                          handleFilterChange("user", e.target.value)
                        }
                        displayEmpty
                        sx={fieldStyles}
                        MenuProps={selectMenuProps}
                      >
                        <MenuItem value="all">
                          <em>All Users</em>
                        </MenuItem>
                        {users.map((user) => (
                          <MenuItem key={user.id} value={user.id.toString()}>
                            {user.full_name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>

                    {/* Parking Slot */}
                    <TextField
                      label="Parking Slot"
                      placeholder="Enter parking slot"
                      value={filters.parking_slot}
                      onChange={(e) =>
                        handleFilterChange("parking_slot", e.target.value)
                      }
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                    />
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="status-label" shrink>
                        Status
                      </InputLabel>
                      <MuiSelect
                        labelId="status-label"
                        label="Status"
                        value={filters.status}
                        onChange={(e) =>
                          handleFilterChange("status", e.target.value)
                        }
                        displayEmpty
                        sx={fieldStyles}
                        MenuProps={selectMenuProps}
                      >
                        <MenuItem value="all">
                          <em>All Statuses</em>
                        </MenuItem>
                        <MenuItem value="confirmed">Confirmed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </MuiSelect>
                    </FormControl>

                    {/* Building */}
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="building-label" shrink>
                        Building
                      </InputLabel>
                      <MuiSelect
                        labelId="building-label"
                        label="Building"
                        value={filters.building}
                        onChange={(e) =>
                          handleFilterChange("building", e.target.value)
                        }
                        displayEmpty
                        sx={fieldStyles}
                        MenuProps={selectMenuProps}
                      >
                        <MenuItem value="all">
                          <em>All Buildings</em>
                        </MenuItem>
                        {buildings?.map((building) => (
                          <MenuItem
                            key={building.id}
                            value={building.id.toString()}
                          >
                            {building.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>

                    {/* Floor */}
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="floor-label" shrink>
                        Floor
                      </InputLabel>
                      <MuiSelect
                        labelId="floor-label"
                        label="Floor"
                        value={filters.floor}
                        onChange={(e) =>
                          handleFilterChange("floor", e.target.value)
                        }
                        displayEmpty
                        sx={fieldStyles}
                        MenuProps={selectMenuProps}
                      >
                        <MenuItem value="all">
                          <em>All Floors</em>
                        </MenuItem>
                        {filteredFloors?.map((floor) => (
                          <MenuItem key={floor.id} value={floor.id.toString()}>
                            {floor.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mt-4">
                    {/* Status */}
                  </div>
                </div>

                {/* Date Filters Section */}
                <div>
                  <h3 className="text-sm font-medium text-[#C72030] mb-4">
                    Date Filters
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Scheduled On */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700">
                        Scheduled On
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <TextField
                          label="From Date"
                          type="date"
                          value={filters.scheduled_on_from}
                          onChange={(e) =>
                            handleFilterChange(
                              "scheduled_on_from",
                              e.target.value
                            )
                          }
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ max: "9999-12-31" }}
                          InputProps={{ sx: fieldStyles }}
                        />
                        <TextField
                          label="To Date"
                          type="date"
                          value={filters.scheduled_on_to}
                          onChange={(e) =>
                            handleFilterChange(
                              "scheduled_on_to",
                              e.target.value
                            )
                          }
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          inputProps={{
                            min: filters.scheduled_on_from || undefined,
                            max: "9999-12-31",
                          }}
                          InputProps={{ sx: fieldStyles }}
                        />
                      </div>
                    </div>

                    {/* Booked On */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700">
                        Booked On
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <TextField
                          label="From Date"
                          type="date"
                          value={filters.booked_on_from}
                          onChange={(e) =>
                            handleFilterChange("booked_on_from", e.target.value)
                          }
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ max: "9999-12-31" }}
                          InputProps={{ sx: fieldStyles }}
                        />
                        <TextField
                          label="To Date"
                          type="date"
                          value={filters.booked_on_to}
                          onChange={(e) =>
                            handleFilterChange("booked_on_to", e.target.value)
                          }
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          inputProps={{
                            min: filters.booked_on_from || undefined,
                            max: "9999-12-31",
                          }}
                          InputProps={{ sx: fieldStyles }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Filters Display */}
                {/* {(filters.category !== 'all' || filters.user !== 'all' || filters.parking_slot.trim() || filters.status !== 'all' || filters.scheduled_on_from.trim() || filters.scheduled_on_to.trim() || filters.booked_on_from.trim() || filters.booked_on_to.trim()) && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
                <div className="flex flex-wrap gap-2">
                  {filters.category !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      Category: {parkingCategories.find(cat => cat.id.toString() === filters.category)?.name || filters.category}
                      <button onClick={() => handleFilterChange('category', 'all')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.user !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      User: {users.find(u => u.id.toString() === filters.user)?.full_name || filters.user}
                      <button onClick={() => handleFilterChange('user', 'all')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.parking_slot.trim() && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      Parking Slot: {filters.parking_slot}
                      <button onClick={() => handleFilterChange('parking_slot', '')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.status !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      Status: {filters.status}
                      <button onClick={() => handleFilterChange('status', 'all')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {(filters.scheduled_on_from.trim() || filters.scheduled_on_to.trim()) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      Scheduled On: {filters.scheduled_on_from && filters.scheduled_on_to ? `${filters.scheduled_on_from} to ${filters.scheduled_on_to}` : filters.scheduled_on_from || filters.scheduled_on_to}
                      <button onClick={() => {
                        handleFilterChange('scheduled_on_from', '');
                        handleFilterChange('scheduled_on_to', '');
                      }}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {(filters.booked_on_from.trim() || filters.booked_on_to.trim()) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      Booked On: {filters.booked_on_from && filters.booked_on_to ? `${filters.booked_on_from} to ${filters.booked_on_to}` : filters.booked_on_from || filters.booked_on_to}
                      <button onClick={() => {
                        handleFilterChange('booked_on_from', '');
                        handleFilterChange('booked_on_to', '');
                      }}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )} */}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    variant="secondary"
                    onClick={handleApplyFilters}
                    className="flex-1 h-11"
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="flex-1 h-11"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Cancel Booking Confirmation Modal */}
          {showCancelConfirmation &&
            (() => {
              const bookingDetails = bookingData.find(
                (b) => b.id === bookingToCancel
              );
              return (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Cancel Booking
                        </h3>
                        <p className="text-gray-600">
                          Are you sure you want to cancel booking #
                          {bookingToCancel}?
                        </p>
                        {bookingDetails && (
                          <div className="mt-3 text-sm text-gray-500">
                            <p>
                              <span className="font-medium">Date:</span>{" "}
                              {bookingDetails.schedule_date}
                            </p>
                            <p>
                              <span className="font-medium">Booking Time:</span>{" "}
                              {bookingDetails.booking_schedule_time}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={confirmCancelBooking}
                          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCancelConfirmation(false);
                            setBookingToCancel(null);
                          }}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
        </TabsContent>

        {/* Analytics Tab Content */}
        <TabsContent value="analytics" className="mt-6 space-y-6">
          {/* Header with Filter and Analytics Selector */}
          <div className="flex justify-end items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                // Initialize draft from the committed range and open the dialog
                setAnalyticsDraftRange(analyticsDateRange);
                setIsAnalyticsFilterOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-gray-300"
            >
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {analyticsDateRange.rangeA.label} vs{" "}
                {analyticsDateRange.rangeB.label}
              </span>
              <Filter className="w-4 h-4 text-gray-600" />
            </Button>

            <ParkingAnalyticsSelector
              onSelectionChange={(selected) => setSelectedAnalytics(selected)}
            />
          </div>

          {/* Statistics Overview */}
          {selectedAnalytics.includes("parking_statistics") && (
            <ParkingStatisticsCard
              data={{
                total_slots: cards?.total_slots || 0,
                occupied: (cards?.two_booked || 0) + (cards?.four_booked || 0),
                vacant:
                  (cards?.two_available || 0) + (cards?.four_available || 0),
                checked_in: bookingData.filter((b) => b.checked_in_at !== null)
                  .length,
                checked_out: bookingData.filter(
                  (b) => b.checked_out_at !== null
                ).length,
                utilization: cards?.total_slots
                  ? Math.round(
                    (((cards?.two_booked || 0) + (cards?.four_booked || 0)) /
                      cards.total_slots) *
                    100
                  )
                  : 0,
                two_wheeler: {
                  total: cards?.two_total || 0,
                  occupied: cards?.two_booked || 0,
                  vacant: cards?.two_available || 0,
                },
                four_wheeler: {
                  total: cards?.four_total || 0,
                  occupied: cards?.four_booked || 0,
                  vacant: cards?.four_available || 0,
                },
              }}
              startDate={analyticsDateRange.rangeA.startDate}
              endDate={analyticsDateRange.rangeA.endDate}
            />
          )}

          {/* Analytics Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedAnalytics.includes("peak_hour_trends") && (
              <ParkingAnalyticsCard
                title="Peak Hour Trends"
                data={{}}
                type="peakHourTrends"
                startDate={analyticsDateRange.rangeA.startDate}
                endDate={analyticsDateRange.rangeA.endDate}
              />
            )}
            {selectedAnalytics.includes("booking_patterns") && (
              <ParkingAnalyticsCard
                title="2-Year Parking Comparison"
                data={{}}
                type="bookingPatterns"
                startDate={analyticsDateRange.rangeA.startDate}
                endDate={analyticsDateRange.rangeA.endDate}
              />
            )}

            {selectedAnalytics.includes("two_four_occupancy") && (
              <ParkingOccupancyChart
                data={[
                  {
                    category: "2W",
                    lastYearOccupied: Math.round(
                      (cards?.two_booked || 0) * 0.9
                    ),
                    lastYearVacant: Math.round(
                      (cards?.two_available || 0) * 1.2
                    ),
                    thisYearOccupied: cards?.two_booked || 0,
                    thisYearVacant: cards?.two_available || 0,
                  },
                  {
                    category: "4W",
                    lastYearOccupied: Math.round(
                      (cards?.four_booked || 0) * 0.95
                    ),
                    lastYearVacant: Math.round(
                      (cards?.four_available || 0) * 1.1
                    ),
                    thisYearOccupied: cards?.four_booked || 0,
                    thisYearVacant: cards?.four_available || 0,
                  },
                ]}
                startDate={analyticsDateRange.rangeA.startDate}
                endDate={analyticsDateRange.rangeA.endDate}
                onDownload={async () => {
                  console.log("Downloading occupancy data...");
                  // Implement download logic here
                }}
              />
            )}
            {selectedAnalytics.includes("floor_wise_occupancy") && (
              <FloorWiseOccupancyChart
                data={[
                  {
                    floor: "B2",
                    twoWheeler: 12,
                    fourWheeler: 8,
                    percentage: 11.1,
                  },
                  {
                    floor: "B1",
                    twoWheeler: 10,
                    fourWheeler: 13,
                    percentage: 10.0,
                  },
                  {
                    floor: "G",
                    twoWheeler: 8,
                    fourWheeler: 17,
                    percentage: 14.3,
                  },
                  {
                    floor: "1",
                    twoWheeler: 6,
                    fourWheeler: 10,
                    percentage: 14.3,
                  },
                  {
                    floor: "2",
                    twoWheeler: 4,
                    fourWheeler: 9,
                    percentage: 7.7,
                  },
                ]}
                startDate={analyticsDateRange.rangeA.startDate}
                endDate={analyticsDateRange.rangeA.endDate}
                onDownload={async () => {
                  console.log("Downloading floor-wise occupancy data...");
                  // Implement download logic here
                }}
              />
            )}
            {selectedAnalytics.includes("occupancy_rate") && (
              <ParkingAnalyticsCard
                title="Cancelled (Daily)"
                data={{}}
                type="occupancyRate"
                startDate={analyticsDateRange.rangeA.startDate}
                endDate={analyticsDateRange.rangeA.endDate}
              />
            )}
            {/* {selectedAnalytics.includes('average_duration') && (
              <ParkingAnalyticsCard
                title="Auto-Releases by Department"
                data={{}}
                type="averageDuration"
              />
            )} */}
          </div>

          {/* Floor Layout */}
          {/* <ParkingFloorLayout
            floor="G (Live)"
            building="Main Building"
            slots={bookingData.slice(0, 36).map((booking, index) => ({
              id: `S-${index + 1}`,
              number: `S-${index + 1}`,
              status: booking.status === 'confirmed' ? 'occupied' : 'vacant',
              type: booking.category.toLowerCase().includes('two') || booking.category.toLowerCase().includes('bike') ? 'bike' : 'car',
              bookingId: booking.id,
              userName: booking.employee_name,
              scheduledDate: booking.schedule_date,
            }))}
            onSlotClick={(slot) => {
              console.log('Slot clicked:', slot);
              // You can add navigation to booking details or show a modal here
            }}
          /> */}
        </TabsContent>
      </Tabs>

      {/* Analytics Filter Dialog */}
      <Dialog
        open={isAnalyticsFilterOpen}
        onOpenChange={(open) => {
          if (open)
            setIsAnalyticsFilterOpen(
              true
            ); /* ignore close from overlay/escape - close only via Cancel */
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Filter Parking Analytics</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Range A (This Year) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  Range A
                </label>
                <Input
                  type="text"
                  value={analyticsDraftRange.rangeA.label}
                  onChange={(e) => {
                    setAnalyticsDraftRange((prev) => ({
                      ...prev,
                      rangeA: { ...prev.rangeA, label: e.target.value },
                    }));
                  }}
                  className="h-8 w-32 text-xs"
                  placeholder="Label"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={analyticsDraftRange.rangeA.startDate}
                    onChange={(e) => {
                      const newStartDate = e.target.value;
                      setAnalyticsDraftRange((prev) => {
                        // If endDate exists and new start is after end, reject and notify
                        if (prev.rangeA.endDate) {
                          const end = new Date(prev.rangeA.endDate);
                          const start = new Date(newStartDate);
                          if (start.getTime() > end.getTime()) {
                            toast.info("Start date cannot be after end date");
                            return prev; // ignore invalid change
                          }
                        }

                        // Calculate the duration of Range A
                        const rangeAEnd = prev.rangeA.endDate
                          ? new Date(prev.rangeA.endDate)
                          : new Date();
                        const rangeAStart = new Date(newStartDate);
                        // Inclusive duration (count both start and end day)
                        const durationInDays =
                          Math.ceil(
                            (rangeAEnd.getTime() - rangeAStart.getTime()) /
                            (1000 * 60 * 60 * 24)
                          ) + 1;

                        // Calculate Range B: previous period of same duration
                        const rangeBEnd = new Date(rangeAStart);
                        rangeBEnd.setDate(rangeBEnd.getDate() - 1); // Day before Range A starts

                        const rangeBStart = new Date(rangeBEnd);
                        rangeBStart.setDate(
                          rangeBStart.getDate() - durationInDays + 1
                        );

                        const formatDate = (date: Date) => {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0"
                          );
                          const day = String(date.getDate()).padStart(2, "0");
                          return `${year}-${month}-${day}`;
                        };

                        const rangeBStartStr = formatDate(rangeBStart);
                        const rangeBEndStr = formatDate(rangeBEnd);

                        return {
                          rangeA: {
                            ...prev.rangeA,
                            startDate: newStartDate,
                            label: generateDateRangeLabel(
                              newStartDate,
                              prev.rangeA.endDate
                            ),
                          },
                          rangeB: {
                            ...prev.rangeB,
                            startDate: rangeBStartStr,
                            endDate: rangeBEndStr,
                            label: generateDateRangeLabel(
                              rangeBStartStr,
                              rangeBEndStr
                            ),
                          },
                        };
                      });
                    }}
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500">
                    {analyticsDraftRange.rangeA.startDate &&
                      new Date(
                        analyticsDraftRange.rangeA.startDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={analyticsDraftRange.rangeA.endDate}
                    onChange={(e) => {
                      const newEndDate = e.target.value;
                      setAnalyticsDraftRange((prev) => {
                        // If startDate exists and new end is before start, reject and notify
                        if (prev.rangeA.startDate) {
                          const start = new Date(prev.rangeA.startDate);
                          const end = new Date(newEndDate);
                          if (end.getTime() < start.getTime()) {
                            toast.info("End date cannot be before start date");
                            return prev; // ignore invalid change
                          }
                        }

                        // Calculate the duration of Range A
                        const rangeAStart = prev.rangeA.startDate
                          ? new Date(prev.rangeA.startDate)
                          : new Date();
                        const rangeAEnd = new Date(newEndDate);
                        // Inclusive duration (count both start and end day)
                        const durationInDays =
                          Math.ceil(
                            (rangeAEnd.getTime() - rangeAStart.getTime()) /
                            (1000 * 60 * 60 * 24)
                          ) + 1;

                        // Calculate Range B: previous period of same duration
                        const rangeBEnd = new Date(rangeAStart);
                        rangeBEnd.setDate(rangeBEnd.getDate() - 1); // Day before Range A starts

                        const rangeBStart = new Date(rangeBEnd);
                        rangeBStart.setDate(
                          rangeBStart.getDate() - durationInDays + 1
                        );

                        const formatDate = (date: Date) => {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0"
                          );
                          const day = String(date.getDate()).padStart(2, "0");
                          return `${year}-${month}-${day}`;
                        };

                        const rangeBStartStr = formatDate(rangeBStart);
                        const rangeBEndStr = formatDate(rangeBEnd);

                        return {
                          rangeA: {
                            ...prev.rangeA,
                            endDate: newEndDate,
                            label: generateDateRangeLabel(
                              prev.rangeA.startDate,
                              newEndDate
                            ),
                          },
                          rangeB: {
                            ...prev.rangeB,
                            startDate: rangeBStartStr,
                            endDate: rangeBEndStr,
                            label: generateDateRangeLabel(
                              rangeBStartStr,
                              rangeBEndStr
                            ),
                          },
                        };
                      });
                    }}
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500">
                    {analyticsDraftRange.rangeA.endDate &&
                      new Date(
                        analyticsDraftRange.rangeA.endDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Range B (Last Year) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  Range B
                </label>
                <Input
                  type="text"
                  value={analyticsDraftRange.rangeB.label}
                  onChange={(e) => {
                    setAnalyticsDraftRange((prev) => ({
                      ...prev,
                      rangeB: { ...prev.rangeB, label: e.target.value },
                    }));
                  }}
                  className="h-8 w-32 text-xs"
                  placeholder="Label"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={analyticsDraftRange.rangeB.startDate}
                    onChange={(e) => {
                      const newStartDate = e.target.value;
                      setAnalyticsDraftRange((prev) => {
                        // If endDate exists and new start is after end, reject and notify
                        if (prev.rangeB.endDate) {
                          const end = new Date(prev.rangeB.endDate);
                          const start = new Date(newStartDate);
                          if (start.getTime() > end.getTime()) {
                            toast.info("Start date cannot be after end date");
                            return prev; // ignore invalid change
                          }
                        }

                        return {
                          ...prev,
                          rangeB: {
                            ...prev.rangeB,
                            startDate: newStartDate,
                            label: generateDateRangeLabel(
                              newStartDate,
                              prev.rangeB.endDate
                            ),
                          },
                        };
                      });
                    }}
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500">
                    {analyticsDraftRange.rangeB.startDate &&
                      new Date(
                        analyticsDraftRange.rangeB.startDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={analyticsDraftRange.rangeB.endDate}
                    onChange={(e) => {
                      const newEndDate = e.target.value;
                      setAnalyticsDraftRange((prev) => {
                        // If startDate exists and new end is before start, reject and notify
                        if (prev.rangeB.startDate) {
                          const start = new Date(prev.rangeB.startDate);
                          const end = new Date(newEndDate);
                          if (end.getTime() < start.getTime()) {
                            toast.info("End date cannot be before start date");
                            return prev; // ignore invalid change
                          }
                        }

                        return {
                          ...prev,
                          rangeB: {
                            ...prev.rangeB,
                            endDate: newEndDate,
                            label: generateDateRangeLabel(
                              prev.rangeB.startDate,
                              newEndDate
                            ),
                          },
                        };
                      });
                    }}
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500">
                    {analyticsDraftRange.rangeB.endDate &&
                      new Date(
                        analyticsDraftRange.rangeB.endDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              onClick={() => {
                // Commit draft to active range and trigger analytics reload
                setAnalyticsDateRange(analyticsDraftRange);
                handleAnalyticsFilterApply(analyticsDraftRange);
                setIsAnalyticsFilterOpen(false);
              }}
              className="flex-1 h-11 bg-[#C72030] hover:bg-[#A01020]"
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Discard draft changes and just close modal
                setAnalyticsDraftRange(analyticsDateRange);
                setIsAnalyticsFilterOpen(false);
              }}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setAnalyticsDraftRange(getDefaultAnalyticsDateRange());
              }}
              className="flex-1 h-11"
            >
              Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParkingBookingListSiteWise;
