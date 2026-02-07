import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Search,
  Eye,
  Trophy,
  Circle,
  Ban,
  AlertCircle,
  Plus,
  Filter as FilterIcon,
  Download,
  LayoutGrid,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TextField, InputAdornment } from "@mui/material";

interface ContestRecord {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  contestType: "Spin Wheel" | "Card Flip" | "Scratch Card";
  attempt: number;
  status: "Active" | "Inactive" | "Expired";
}

const statusCards = [
  {
    title: "Total Contest",
    count: 20,
    icon: Trophy,
    status: null,
  },
  {
    title: "Active",
    count: 15,
    icon: Circle,
    status: "Active",
  },
  {
    title: "Inactive",
    count: 13,
    icon: Ban,
    status: "Inactive",
  },
  {
    title: "Expired",
    count: 2,
    icon: AlertCircle,
    status: "Expired",
  },
];

const dummyContests: ContestRecord[] = [
  {
    id: 1,
    name: "Spin",
    description: "spin the wheel to get reward",
    startDate: "02/02/2026",
    endDate: "20/02/2026",
    contestType: "Spin Wheel",
    attempt: 1,
    status: "Active",
  },
  {
    id: 2,
    name: "Scratch",
    description: "Scratch the card to get reward",
    startDate: "10/02/2026",
    endDate: "30/03/2026",
    contestType: "Card Flip",
    attempt: 1,
    status: "Expired",
  },
  {
    id: 3,
    name: "Flip",
    description: "Flip the card to know your reward",
    startDate: "15/02/2026",
    endDate: "15/03/2026",
    contestType: "Scratch Card",
    attempt: 1,
    status: "Inactive",
  },
];

export const ContestListPage: React.FC = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState<ContestRecord[]>(dummyContests);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [filteredContests, setFilteredContests] =
    useState<ContestRecord[]>(dummyContests);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusCounts, setStatusCounts] = useState({
    total: 20,
    active: 15,
    inactive: 13,
    expired: 2,
  });

  useEffect(() => {
    let filtered = contests;

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter(
        (contest) => contest.status === selectedStatus
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (contest) =>
          contest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contest.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContests(filtered);
  }, [searchQuery, selectedStatus, contests]);

  const handleStatusCardClick = (status: string | null) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  const handleViewContest = (contestId: number) => {
    navigate(`/contests/${contestId}`);
  };

  const handleCreateContest = () => {
    navigate("/contests/create");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusCount = (status: string | null) => {
    switch (status) {
      case null:
        return statusCounts.total;
      case "Active":
        return statusCounts.active;
      case "Inactive":
        return statusCounts.inactive;
      case "Expired":
        return statusCounts.expired;
      default:
        return 0;
    }
  };

  // Table columns configuration
  const columns: ColumnConfig[] = [
    { key: "actions", label: "Action", sortable: false, defaultVisible: true },
    { key: "name", label: "Name", sortable: true, defaultVisible: true },
    {
      key: "description",
      label: "Description",
      sortable: true,
      defaultVisible: true,
    },
    {
      key: "startDate",
      label: "Start Date",
      sortable: true,
      defaultVisible: true,
    },
    { key: "endDate", label: "End Date", sortable: true, defaultVisible: true },
    {
      key: "contestType",
      label: "Contest Type",
      sortable: true,
      defaultVisible: true,
    },
    { key: "attempt", label: "Attempt", sortable: true, defaultVisible: true },
    { key: "status", label: "Status", sortable: true, defaultVisible: true },
  ];

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
        {statusCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              onClick={() => handleStatusCardClick(card.status)}
              className={`bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow ${
                selectedStatus === card.status
                  ? "transition-shadow shadow-[0px_1px_8px_rgba(45,45,45,0.05)]"
                  : ""
              }`}
            >
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#1A1A1A]">
                  {getStatusCount(card.status)}
                </div>
                <div className="text-sm font-medium text-[#1A1A1A]">
                  {card.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <Button
          onClick={handleCreateContest}
          className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Contest
        </Button>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="w-4 h-4 text-gray-400" />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                "& fieldset": {
                  borderColor: "#e5e7eb",
                },
                "&:hover fieldset": {
                  borderColor: "#C72030",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#C72030",
                },
              },
            }}
          />

          {/* Filter Button */}
          <Button
            variant="outline"
            className="border-gray-300 hover:border-[#C72030] hover:text-[#C72030]"
          >
            <FilterIcon className="w-4 h-4" />
          </Button>

          {/* Grid View Button */}
          <Button
            variant="outline"
            className="border-gray-300 hover:border-[#C72030] hover:text-[#C72030]"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Contest Table */}
      <div className="rounded-lg bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading contests...</div>
          </div>
        ) : (
          <EnhancedTable
            data={filteredContests}
            columns={columns}
            renderRow={(contest) => ({
              actions: (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewContest(contest.id);
                  }}
                  className="p-2 h-8 w-8 hover:bg-accent"
                >
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </Button>
              ),
              name: contest.name,
              description: contest.description,
              startDate: contest.startDate,
              endDate: contest.endDate,
              contestType: contest.contestType,
              attempt: String(contest.attempt).padStart(2, "0"),
              status: (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(contest.status)}`}
                >
                  {contest.status}
                </span>
              ),
            })}
            enableSearch={false}
            enableSelection={false}
            selectable={false}
            enableExport={false}
            hideTableSearch={true}
            storageKey="contests-table"
            emptyMessage="No contests found"
            searchPlaceholder="Search contests..."
            exportFileName="contests"
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Pagination Info */}
      {totalPages > 1 && (
        <div className="text-center mt-2 text-sm text-gray-600">
          Showing page {currentPage} of {totalPages} ({filteredContests.length}{" "}
          total contests)
        </div>
      )}
    </div>
  );
};

export default ContestListPage;
