import React, { useState, useEffect, useCallback, useRef } from "react";
import AddChartofAccountModal from "./AddChartofAccountModal";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Plus,
  Download,
  Filter,
  QrCode,
  Edit,
  Trash2,
  Users,
  CreditCard,
  ChevronRight,
  ChevronDown,
  ListTree,
  LayoutList,
  LayoutGrid,
  Folder,
  Settings2,
  Search,
  ArrowLeft,
  Move,
  Copy,
  Share2,
  FileText,
  ToggleRight,
  MoreVertical,
  DownloadCloud,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { useDebounce } from "@/hooks/useDebounce";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { API_CONFIG } from "@/config/apiConfig";
import {
  ClubMembershipFilterDialog,
  ClubMembershipFilters,
} from "@/components/ClubMembershipFilterDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AddChartofAccountGroupModal from "./AddChartofAccountGroupModal";

interface ClubMember {
  id: number;
  user_id: number;
  pms_site_id: number;
  club_member_enabled: boolean;
  membership_number: string;
  access_card_enabled: boolean;
  access_card_id: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  user_name: string;
  site_name: string;
  user_email: string;
  user_mobile: string;
  identification_image: string | null;
  avatar: string;
  attachments: unknown[];
  snag_answers: unknown[];
  user: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    mobile: string;
    gender: string | null;
    birth_date: string | null;
    full_name: string;
    addresses: unknown[];
  };
}

interface GroupMembershipData {
  id: number;
  membership_plan_id: number;
  pms_site_id: number;
  start_date: string | null;
  end_date: string | null;
  preferred_start_date?: string | null;
  referred_by?: string;
  total_members?: number;
  group_leader_mobile?: string;
  created_at: string;
  updated_at: string;
  club_members: ClubMember[];
  allocation_payment_detail?: {
    id: number;
    club_member_allocation_id: number;
    base_amount: string;
    discount: string;
    cgst: string;
    sgst: string;
    total_tax: string;
    total_amount: string;
    landed_amount: string;
    payment_mode: string;
    payment_status: string;
    created_at: string;
    updated_at: string;
  } | null;
  // Account specific fields for Tree View
  account_name?: string;
  account_code?: string;
  account_type?: string;
  parent_account_name?: string;
  type?: "folder" | "file";
  file_size?: string;
  created_by?: string;
}

const DUMMY_ACCOUNTS: GroupMembershipData[] = [
  {
    id: 1001,
    account_name: "Tendor Folder",
    account_code: "TF-001",
    account_type: "Folder",
    type: "folder",
    file_size: "0 B 0 Files",
    club_members: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pms_site_id: 1,
    membership_plan_id: 1,
    start_date: null,
    end_date: null,
  },
  {
    id: 1002,
    account_name: "new test",
    account_code: "NT-001",
    account_type: "Folder",
    type: "folder",
    file_size: "1 MB 1 File",
    club_members: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pms_site_id: 1,
    membership_plan_id: 1,
    start_date: null,
    end_date: null,
  },
  {
    id: 10021,
    account_name: "Test Pulse Document",
    account_type: "Document",
    type: "file",
    parent_account_name: "new test",
    created_by: "Sumitra Patil",
    file_size: "13 KB",
    club_members: [],
    created_at: "2026-01-22T00:00:00.000Z",
    updated_at: new Date().toISOString(),
    pms_site_id: 1,
    membership_plan_id: 1,
    start_date: null,
    end_date: null,
  },
  {
    id: 1003,
    account_name: "new folder 2026",
    account_code: "NF-2026",
    account_type: "Folder",
    type: "folder",
    file_size: "13 MB 13 Files",
    club_members: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pms_site_id: 1,
    membership_plan_id: 1,
    start_date: null,
    end_date: null,
  },
  {
    id: 1004,
    account_name: "Identity_Documents",
    account_code: "ID-DOC",
    account_type: "Folder",
    type: "folder",
    file_size: "0 B 0 Files",
    club_members: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pms_site_id: 1,
    membership_plan_id: 1,
    start_date: null,
    end_date: null,
  },
];

interface TreeNode extends GroupMembershipData {
  children: TreeNode[];
}

export const ChartOfAccountsDashboard = () => {
  // Render cell content for Lock Account Ledgers table
  const renderLockLedgerCell = (item: any, columnKey: string) => {
    if (columnKey === "actions") {
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() =>
              navigate(`/accounting/chart-journal/details/${item.id}`)
            }
            title="View Details"
            className="p-1 h-8 w-8 text-blue-600 hover:bg-blue-50"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              navigate(`/club-management/group-membership/${item.id}/edit`)
            }
            title="Edit"
            className="p-1 h-8 w-8 text-gray-600 hover:bg-gray-100"
          >
            {/* <Edit className="w-4 h-4" /> */}
          </Button>
        </div>
      );
    }
    if (columnKey === "created_at" || columnKey === "updated_at") {
      return item[columnKey] ? new Date(item[columnKey]).toLocaleString() : "--";
    }
    return item[columnKey] ?? "--";
  };


  // Columns for Lock Account Ledgers table
  const lockLedgerColumns = [
    // { key: "id", label: "ID", sortable: true },
    { key: "actions", label: "Action", sortable: false },
    { key: "name", label: "Account Name", sortable: true },
    { key: "account_code", label: "Account Code", sortable: true },
    // { key: "lock_account_group_id", label: "Group ID", sortable: true },
    { key: "base_group_type", label: "Account Type", sortable: true },
    // { key: "documents", label: "Documents", sortable: false },
    {
      key: "lock_account_group_name",
      label: "Parent Account Name",
      sortable: true,
    },
    { key: "created_at", label: "Created At", sortable: true },
    { key: "updated_at", label: "Updated At", sortable: true },
  ];
  const navigate = useNavigate();
  const loginState = useSelector((state: RootState) => state.login);

  // State management
  // Add lockLedgers state
  const [lockLedgers, setLockLedgers] = useState<any[]>([]);
  // Add lock account groups tree state
  const [lockAccountGroupsTree, setLockAccountGroupsTree] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<GroupMembershipData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAddAccountOpenGroup, setIsAddAccountOpenGroup] = useState(false);
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    items: string[];
  }>({ isOpen: false, title: "", items: [] });
  const [viewType, setViewType] = useState<"table" | "tree">("table");
  const [filters, setFilters] = useState<ClubMembershipFilters>({
    search: "",
    clubMemberEnabled: "",
    accessCardEnabled: "",
    startDate: "",
    endDate: "",
  });

  const perPage = 20;

  // Fetch lock account ledgers and lock account groups tree
  useEffect(() => {
    const fetchLockLedgers = async () => {
      try {
        const baseUrl = API_CONFIG.BASE_URL;
        const token = API_CONFIG.TOKEN;
        // Fetch ledgers for table view
        const url = new URL(`${baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`}/lock_accounts.json`);
        url.searchParams.append("access_token", token || "");
        const response = await fetch(url.toString(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`Failed to fetch lock accounts: ${response.status}`);
        const data = await response.json();
        setLockLedgers(data.lock_account_ledgers || []);
      } catch (error) {
        console.error("Error fetching lock account ledgers:", error);
        setLockLedgers([]);
      }
    };
    const fetchLockAccountGroupsTree = async () => {
      try {
        const baseUrl = API_CONFIG.BASE_URL;
        const token = API_CONFIG.TOKEN;
        // Use lock_account_id = 1 for now (could be dynamic)
        const url = new URL(`${baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`}/lock_accounts/1/lock_account_groups`);
        url.searchParams.append("access_token", token || "");
        url.searchParams.append("format", "tree");
        const response = await fetch(url.toString(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`Failed to fetch lock account groups tree: ${response.status}`);
        const data = await response.json();
        setLockAccountGroupsTree(data.data || []);
      } catch (error) {
        console.error("Error fetching lock account groups tree:", error);
        setLockAccountGroupsTree([]);
      }
    };
    fetchLockLedgers();
    fetchLockAccountGroupsTree();
  }, []);

  // Fetch memberships data
  const fetchMemberships = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      try {
        const baseUrl = API_CONFIG.BASE_URL;
        const token = API_CONFIG.TOKEN;

        console.log("Fetching club member allocations...", {
          baseUrl,
          hasToken: !!token,
          page,
        });

        const url = new URL(
          `${baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`}/club_member_allocations.json`,
        );
        url.searchParams.append("access_token", token || "");

        // Add search filter
        if (filters.search) {
          url.searchParams.append(
            "q[club_members_user_firstname_or_club_members_user_email_or_club_members_user_lastname_or_club_members_user_mobile_cont]",
            filters.search,
          );
        }

        // Add club member enabled filter
        if (filters.clubMemberEnabled) {
          url.searchParams.append(
            "q[club_members_club_member_enabled_eq]",
            filters.clubMemberEnabled,
          );
        }

        // Add access card enabled filter
        if (filters.accessCardEnabled) {
          url.searchParams.append(
            "q[club_members_access_card_enabled_eq]",
            filters.accessCardEnabled,
          );
        }

        // Add start date filter
        if (filters.startDate) {
          const [year, month, day] = filters.startDate.split("-");
          const formattedDate = `${day}/${month}/${year}`;
          url.searchParams.append("q[start_date_eq]", formattedDate);
        }

        // Add end date filter
        if (filters.endDate) {
          const [year, month, day] = filters.endDate.split("-");
          const formattedDate = `${day}/${month}/${year}`;
          url.searchParams.append("q[end_date_eq]", formattedDate);
        }

        // Pagination
        url.searchParams.append("page", page.toString());
        url.searchParams.append("per_page", perPage.toString());

        console.log("API URL:", url.toString());

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch club member allocations: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        console.log("Received data:", data);

        if (Array.isArray(data.club_member_allocations)) {
          setMemberships(data.club_member_allocations);
          setTotalMembers(data.pagination?.total_count || 0);
          setTotalPages(
            Math.ceil((data.pagination?.total_count || 0) / perPage),
          );
        } else {
          setMemberships([]);
          setTotalMembers(0);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching memberships:", error);
        toast.error("Failed to fetch membership data");
        setMemberships([]);
        setTotalMembers(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [filters, perPage],
  );

  // Handle search input change
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Effect to handle debounced search
  useEffect(() => {
    const currentSearch = filters.search || "";
    const newSearch = debouncedSearchQuery.trim();

    if (currentSearch === newSearch) {
      return;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      search: newSearch,
    }));

    setCurrentPage(1);
  }, [debouncedSearchQuery, filters.search]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    console.log("Effect triggered - fetching memberships", {
      currentPage,
      filters,
    });
    fetchMemberships(currentPage);
  }, [currentPage, filters, fetchMemberships]);

  // Handle export
  const handleExport = async () => {
    const loadingToast = toast.loading("Preparing Excel export...");
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      // Build the export URL
      const url = new URL(
        `${baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`}/club_members.xlsx`,
      );
      url.searchParams.append("access_token", token || "");

      // Add the same filters that are applied to the table
      if (filters.search) {
        url.searchParams.append(
          "q[user_firstname_or_user_email_or_user_lastname_or_user_mobile_cont]",
          filters.search,
        );
      }

      if (filters.clubMemberEnabled) {
        url.searchParams.append(
          "q[club_member_enabled_eq]",
          filters.clubMemberEnabled,
        );
      }

      if (filters.accessCardEnabled) {
        url.searchParams.append(
          "q[access_card_enabled_eq]",
          filters.accessCardEnabled,
        );
      }

      if (filters.startDate) {
        const [year, month, day] = filters.startDate.split("-");
        const formattedDate = `${day}/${month}/${year}`;
        url.searchParams.append("q[start_date_eq]", formattedDate);
      }

      if (filters.endDate) {
        const [year, month, day] = filters.endDate.split("-");
        const formattedDate = `${day}/${month}/${year}`;
        url.searchParams.append("q[end_date_eq]", formattedDate);
      }

      console.log("Export URL:", url.toString());

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Export failed: ${response.status} ${response.statusText}`,
        );
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0];
      link.download = `club_memberships_${date}.xlsx`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Excel file downloaded successfully", { id: loadingToast });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data", { id: loadingToast });
    }
  };

  // Handle download society QR
  const handleDownloadSocietyQR = async () => {
    try {
      toast.loading("Generating Society QR Code...");

      // TODO: Replace with actual API call
      // const response = await apiClient.get('/club-management/society-qr', {
      //   responseType: 'blob'
      // });

      // Mock download
      setTimeout(() => {
        toast.success("Society QR Code downloaded successfully");
      }, 1000);
    } catch (error) {
      console.error("Error downloading Society QR:", error);
      toast.error("Failed to download Society QR");
    }
  };

  // Handle filter apply
  const handleFilterApply = (newFilters: ClubMembershipFilters) => {
    console.log("Applying filters:", newFilters);
    setFilters(newFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || loading) {
      return;
    }
    setCurrentPage(page);
  };

  // Render pagination items
  const renderPaginationItems = () => {
    if (!totalPages || totalPages <= 0) {
      return null;
    }

    const items = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      // First page
      items.push(
        <PaginationItem key={1} className="cursor-pointer">
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            aria-disabled={loading}
            className={loading ? "pointer-events-none opacity-50" : ""}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      // Ellipsis before current page
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                aria-disabled={loading}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>,
          );
        }
      }

      // Current page and neighbors
      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                aria-disabled={loading}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>,
          );
        }
      }

      // Ellipsis after current page
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find((item) => item.key === i.toString())) {
            items.push(
              <PaginationItem key={i} className="cursor-pointer">
                <PaginationLink
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                  aria-disabled={loading}
                  className={loading ? "pointer-events-none opacity-50" : ""}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>,
            );
          }
        }
      }

      // Last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              aria-disabled={loading}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      // Show all pages if less than 7
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              aria-disabled={loading}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    }

    return items;
  };

  // Handle member selection
  const handleMemberSelection = (
    memberIdString: string,
    isSelected: boolean,
  ) => {
    const memberId = parseInt(memberIdString);
    setSelectedMembers((prev) =>
      isSelected ? [...prev, memberId] : prev.filter((id) => id !== memberId),
    );
  };

  // Handle select all
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allMemberIds = memberships.map((m) => m.id);
      setSelectedMembers(allMemberIds);
    } else {
      setSelectedMembers([]);
    }
  };

  // Handle clear selection
  const handleClearSelection = () => {
    setSelectedMembers([]);
  };

  // Handle membership type selection and navigation
  const handleAddAccount = () => {
    setIsAddAccountOpen(true);
  };
  const handleAddAccountGroup = () => {
    setIsAddAccountOpenGroup(true);
  };

  const handleSaveAccount = (data: GroupMembershipData) => {
    // TODO: Implement save logic (API call)
    setIsAddAccountOpen(false);
    toast.success("Account created successfully!");
  };

  const handleSaveAccountGroup = (data: GroupMembershipData) => {
    // TODO: Implement save logic (API call)
    setIsAddAccountOpenGroup(false);
    toast.success("Group created successfully!");
  };

  // Render membership status badge
  const renderStatusBadge = (
    startDate: string | null,
    endDate: string | null,
    accessCardEnabled: boolean,
  ) => {
    if (!startDate && !endDate) {
      return (
        <Badge className="bg-red-100 text-red-800 border-0">
          Pending Dates
        </Badge>
      );
    }

    if (!endDate && startDate) {
      return (
        <Badge className="bg-red-100 text-red-800 border-0">
          Pending EndDate
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-800 border-0">Approved</Badge>
    );
  };

  // Render card allocated toggle
  const renderCardAllocated = (allocated: boolean) => {
    return (
      <div className="flex items-center justify-center">
        <div
          className={`w-10 h-5 rounded-full relative transition-colors ${allocated ? "bg-green-500" : "bg-gray-300"}`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${allocated ? "right-0.5" : "left-0.5"}`}
          />
        </div>
      </div>
    );
  };

  // Define columns for EnhancedTable
  const columns = [
    { key: "actions", label: "Action", sortable: false },
    { key: "account_name", label: "Account Name", sortable: true },
    { key: "account_code", label: "Account Code", sortable: true },
    { key: "account_type", label: "Account Type", sortable: true },
    { key: "documents", label: "Documents", sortable: false },
    {
      key: "parent_account_name",
      label: "Parent Account Name",
      sortable: true,
    },
  ];

  // Render cell content
  const renderCell = (item: GroupMembershipData, columnKey: string) => {
    if (columnKey === "actions") {
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() =>
              navigate(`/club-management/membership/group-details/${item.id}`)
            }
            title="View Details"
            className="p-1 h-8 w-8 text-blue-600 hover:bg-blue-50"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              navigate(`/club-management/group-membership/${item.id}/edit`)
            }
            title="Edit"
            className="p-1 h-8 w-8 text-gray-600 hover:bg-gray-100"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    if (columnKey === "member_count") {
      return (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#C72030]" />
          <span className="font-medium">{item.club_members?.length || 0}</span>
        </div>
      );
    }

    if (columnKey === "member_names") {
      const names = item.club_members?.map((m) => m.user_name).filter(Boolean);
      if (!names || names.length === 0)
        return <span className="text-gray-400">-</span>;

      return (
        <div className="flex flex-col gap-1">
          {names.slice(0, 2).map((name, idx) => (
            <span key={idx} className="text-sm">
              {name}
            </span>
          ))}
          {names.length > 2 && (
            <span
              className="text-xs text-blue-600 cursor-pointer hover:underline"
              onClick={() => {
                setModalData({
                  isOpen: true,
                  title: "Member Names",
                  items: names,
                });
              }}
            >
              +{names.length - 2} more
            </span>
          )}
        </div>
      );
    }

    if (columnKey === "member_emails") {
      const emails = item.club_members
        ?.map((m) => m.user_email)
        .filter(Boolean);
      if (!emails || emails.length === 0)
        return <span className="text-gray-400">-</span>;

      return (
        <div className="flex flex-col gap-1">
          {emails.slice(0, 2).map((email, idx) => (
            <span key={idx} className="text-sm">
              {email}
            </span>
          ))}
          {emails.length > 2 && (
            <span
              className="text-xs text-blue-600 cursor-pointer hover:underline"
              onClick={() => {
                setModalData({
                  isOpen: true,
                  title: "Member Emails",
                  items: emails,
                });
              }}
            >
              +{emails.length - 2} more
            </span>
          )}
        </div>
      );
    }

    if (columnKey === "member_mobiles") {
      const mobiles = item.club_members
        ?.map((m) => m.user_mobile)
        .filter(Boolean);
      if (!mobiles || mobiles.length === 0)
        return <span className="text-gray-400">-</span>;

      return (
        <div className="flex flex-col gap-1">
          {mobiles.slice(0, 2).map((mobile, idx) => (
            <span key={idx} className="text-sm">
              {mobile}
            </span>
          ))}
          {mobiles.length > 2 && (
            <span
              className="text-xs text-blue-600 cursor-pointer hover:underline"
              onClick={() => {
                setModalData({
                  isOpen: true,
                  title: "Member Mobiles",
                  items: mobiles,
                });
              }}
            >
              +{mobiles.length - 2} more
            </span>
          )}
        </div>
      );
    }

    if (columnKey === "site_name") {
      const siteName = item.club_members?.[0]?.site_name;
      return siteName || <span className="text-gray-400">-</span>;
    }

    if (columnKey === "membershipStatus") {
      return renderStatusBadge(item.start_date, item.end_date, false);
    }

    if (columnKey === "start_date" || columnKey === "end_date") {
      const dateValue = item[columnKey];
      if (!dateValue) return <span className="text-gray-400">-</span>;
      return new Date(dateValue).toLocaleDateString("en-GB");
    }

    if (columnKey === "created_at") {
      const createdAt = item.club_members?.[0]?.created_at;
      if (!createdAt) return <span className="text-gray-400">-</span>;
      return new Date(createdAt).toLocaleDateString("en-GB");
    }

    if (columnKey === "referred_by") {
      return item.referred_by || <span className="text-gray-400">-</span>;
    }

    if (
      !item[columnKey] ||
      item[columnKey] === null ||
      item[columnKey] === ""
    ) {
      return <span className="text-gray-400">--</span>;
    }

    return item[columnKey];
  };

  // Custom left actions for table
  const renderCustomActions = () => (
    <div className="flex gap-3">
      <Button
        className="bg-[#f7f2eb] hover:bg-[#efe6d8] text-[#C72030] border-none px-6 py-2 h-auto rounded-lg font-bold transition-all duration-200"
        onClick={handleAddAccountGroup}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Group
      </Button>
       <Button
        className="bg-[#f7f2eb] hover:bg-[#efe6d8] text-[#C72030] border-none px-6 py-2 h-auto rounded-lg font-bold transition-all duration-200"
        onClick={handleAddAccount}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Account
      </Button>
    </div>
  );

  // Custom right actions with view toggle
  const renderRightActions = () => (
    <div className="flex items-center gap-2">
      {/* Single Tree View Toggle Button */}
      <Button
        variant={viewType === "tree" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewType(viewType === "tree" ? "table" : "tree")}
        className={`h-9 w-9 p-0 transition-all duration-200 ${viewType === "tree"
          ? "bg-[#C72030] text-white hover:bg-[#a01a26]"
          : "border-[#C72030] text-[#C72030] hover:bg-red-50"
          }`}
      >
        <ListTree className="w-4 h-4" />
      </Button>
    </div>
  );

  // Tree building helper: builds tree from lock_account_groups API (format: tree)
  const buildAccountTreeFromGroups = (groups: any[]): TreeNode[] => {
    // Recursively map API group/ledger structure to TreeNode
    const mapGroup = (group: any): TreeNode => ({
      id: group.id,
      account_name: group.group_name,
      account_code: '',
      account_type: 'Group',
      type: 'folder',
      file_size: '',
      club_members: [],
      created_at: group.created_at,
      updated_at: group.updated_at,
      membership_plan_id: 0,
      pms_site_id: 0,
      start_date: null,
      end_date: null,
      children: [
        // Ledgers as files
        ...(Array.isArray(group.ledgers)
          ? group.ledgers.map((ledger: any) => ({
              id: ledger.id,
              account_name: ledger.name,
              account_code: ledger.account_code || '',
              account_type: 'Ledger',
              type: 'file',
              file_size: '',
              club_members: [],
              created_at: ledger.created_at,
              updated_at: ledger.updated_at,
              membership_plan_id: 0,
              pms_site_id: 0,
              start_date: null,
              end_date: null,
              children: [],
            }))
          : []),
        // Children groups as subfolders
        ...(Array.isArray(group.children)
          ? group.children.map(mapGroup)
          : []),
      ],
    });
    return groups.map(mapGroup);
  };

  const TreeViewNode = ({
    node,
    level = 0,
  }: {
    node: TreeNode;
    level?: number;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = node.children.length > 0;
    const isFile = node.type === "file";

    const handleNodeClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isFile && hasChildren) {
        setIsExpanded(!isExpanded);
      }
    };

    if (isFile) {
      return (
        <div className="flex flex-col animate-in fade-in slide-in-from-top-1 duration-300 relative">
          {/* Vertical dash line connector from parent */}
          <div className="absolute -left-5 top-0 bottom-1/2 w-4 border-l border-b border-dashed border-slate-300 rounded-bl-lg"></div>

          <div
            className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer group transition-all"
            onClick={() => navigate(`/accounting/chart-journal/details/${node.id}`)}
            title="View Ledger Details"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#C72030]" />
            </div>
            <span className="text-sm font-medium text-slate-700 group-hover:text-[#C72030] transition-colors">
              {node.account_name}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col mb-2 animate-in fade-in slide-in-from-top-1 duration-300">
        <div
          className="flex items-center bg-[#fdfaf5] border border-[#f0e6d2] rounded-lg p-5 transition-all duration-200 hover:shadow-md cursor-pointer group"
          onClick={handleNodeClick}
        >
          {/* Leading Icon Box */}
          <div className="mr-6">
            <div className="w-14 h-14 bg-[#f7efdf] rounded-lg border border-[#e8dac0] flex items-center justify-center shadow-sm group-hover:bg-[#f2e7d0] transition-colors">
              <Folder className="w-7 h-7 text-[#C72030]" />
            </div>
          </div>

          {/* Account Details */}
          <div className="flex-1 flex flex-col justify-center">
            <h4 className="text-lg font-bold text-slate-800 leading-tight mb-1">
              {node.account_name}
            </h4>
            <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
              {/* <span>{node.file_size || "0 B 0 Files"}</span> */}
              {/* <span className="w-1 h-1 rounded-full bg-slate-300" /> */}
              {/* <span className="capitalize">{node.account_type || "Folder"}</span> */}
            </div>
          </div>

          {/* Right Section: Expand/Collapse Chevron - Always show for folders */}
          <div className="flex items-center gap-4">
            <div
              className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            >
              <ChevronDown className="w-6 h-6 text-slate-400 group-hover:text-slate-600" />
            </div>
          </div>
        </div>

        {/* Child Nodes Container */}
        {isExpanded && hasChildren && (
          <div className="mt-2 ml-10 pl-6 border-l border-dashed border-slate-300 flex flex-col gap-1">
            {node.children.map((child) => (
              <TreeViewNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      <div className="animate-fade-in">
        {searchLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-center">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Searching ...</span>
            </div>
          </div>
        )}

        {/* Toggle for Lock Ledgers Table/Tree View */}
        <div className="mb-4 flex gap-2">
          <Button
            variant={viewType === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("table")}
            className={viewType === "table" ? "bg-[#C72030] text-white" : "border-[#C72030] text-[#C72030]"}
          >
            Table View
          </Button>
          <Button
            variant={viewType === "tree" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("tree")}
            className={viewType === "tree" ? "bg-[#C72030] text-white" : "border-[#C72030] text-[#C72030]"}
          >
            Tree View
          </Button>
        </div>

        {viewType === "table" ? (
          <>
            <h3 className="text-lg font-semibold mb-2">Chart Of Accounts List</h3>
            <EnhancedTable
              data={lockLedgers}
              columns={lockLedgerColumns}
              renderCell={renderLockLedgerCell}
              pagination={false}
              enableExport={true}
              exportFileName="lock-account-ledgers"
              storageKey="lock-account-ledgers-table"
              hideTableExport={true}
              hideColumnsButton={false}
              className="transition-all duration-500 ease-in-out mb-8"
              loading={false}
              loadingMessage="Loading lock ledgers..."
               leftActions={
            <div className="flex gap-3">
              {renderCustomActions()}
            </div>
          }
            />
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-2">Chart Of Accounts (Tree View)</h3>
            <div className="min-h-[300px] max-h-[600px] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3 mb-8">
              {buildAccountTreeFromGroups(lockAccountGroupsTree).map((root) => (
                <TreeViewNode key={root.id} node={root} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-6 pb-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1 || loading
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages || loading
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Page Info */}
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} | Showing{" "}
            {memberships.length +
              (viewType === "tree" ? DUMMY_ACCOUNTS.length : 0)}{" "}
            items
          </div>
        </div>
      )}
      {/* Filter Dialog */}
      <ClubMembershipFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
      />

      {/* Member Details Modal */}
      <Dialog
        open={modalData.isOpen}
        onOpenChange={(open) => setModalData({ ...modalData, isOpen: open })}
      >
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{modalData.title}</DialogTitle>
            <DialogDescription>
              Total: {modalData.items.length} items
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {modalData.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              onClick={() =>
                setModalData({ isOpen: false, title: "", items: [] })
              }
              variant="outline"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Account Modal */}
      <AddChartofAccountModal
        open={isAddAccountOpen}
        // onClose={() => setIsAddAccountOpen(false)}
        onOpenChange={setIsAddAccountOpen}
        onSave={handleSaveAccount}
      />
       {/* Add Account Modal */}
      <AddChartofAccountGroupModal
        open={isAddAccountOpenGroup}
        // onClose={() => setIsAddAccountOpen(false)}
        onOpenChange={setIsAddAccountOpenGroup}
        onSave={handleSaveAccountGroup}
      />
    </div>
  );
};

export default ChartOfAccountsDashboard;
