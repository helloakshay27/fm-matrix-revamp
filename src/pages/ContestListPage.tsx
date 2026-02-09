import React, { useEffect, useState } from "react";
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
  LayoutGrid,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
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
  { title: "Total Contest", icon: Trophy, status: null },
  { title: "Active", icon: Circle, status: "Active" },
  { title: "Inactive", icon: Ban, status: "Inactive" },
  { title: "Expired", icon: AlertCircle, status: "Expired" },
];

export const ContestListPage: React.FC = () => {
  const navigate = useNavigate();

  const [contests, setContests] = useState<ContestRecord[]>([]);
  const [filteredContests, setFilteredContests] = useState<ContestRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1);

  const [statusCounts, setStatusCounts] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    expired: 0,
  });

  /* ---------------- API FETCH ---------------- */

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);

      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');

      if (!baseUrl || !token) {
        throw new Error("Base URL or token not set in localStorage");
      }

      // Ensure protocol is present
      const url = /^https?:\/\//i.test(baseUrl) ? baseUrl : `https://${baseUrl}`;

      const response = await fetch(
        `${url}/contests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      const today = new Date();

      const formatted: ContestRecord[] = data.map((item: any) => {
        const start = new Date(item.start_at);
        const end = new Date(item.end_at);

        let status: "Active" | "Inactive" | "Expired" = "Inactive";

        if (end < today) {
          status = "Expired";
        } else if (item.active) {
          status = "Active";
        }

        return {
          id: item.id,
          name: item.name,
          description: item.description ?? "-",
          startDate: start.toLocaleDateString(),
          endDate: end.toLocaleDateString(),
          contestType:
            item.content_type === "spin"
              ? "Spin Wheel"
              : item.content_type === "scratch"
                ? "Scratch Card"
                : "Card Flip",
          attempt: item.attemp_required ?? 1,
          status,
        };
      });

      setContests(formatted);
      setFilteredContests(formatted);

      setStatusCounts({
        total: formatted.length,
        active: formatted.filter(c => c.status === "Active").length,
        inactive: formatted.filter(c => c.status === "Inactive").length,
        expired: formatted.filter(c => c.status === "Expired").length,
      });
    } catch (error) {
      console.error("Error fetching contests", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER & SEARCH ---------------- */

  useEffect(() => {
    let filtered = contests;

    if (selectedStatus) {
      filtered = filtered.filter(c => c.status === selectedStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContests(filtered);
  }, [searchQuery, selectedStatus, contests]);

  /* ---------------- HELPERS ---------------- */

  const getStatusCount = (status: string | null) => {
    if (status === "Active") return statusCounts.active;
    if (status === "Inactive") return statusCounts.inactive;
    if (status === "Expired") return statusCounts.expired;
    return statusCounts.total;
  };

  const getStatusBadgeColor = (status: string) => {
    if (status === "Active") return "bg-green-100 text-green-800";
    if (status === "Inactive") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  /* ---------------- TABLE CONFIG ---------------- */

  const columns: ColumnConfig[] = [
    { key: "actions", label: "Action", sortable: false, defaultVisible: true },
    { key: "name", label: "Name", sortable: true, defaultVisible: true },
    { key: "description", label: "Description", sortable: true },
    { key: "startDate", label: "Start Date", sortable: true },
    { key: "endDate", label: "End Date", sortable: true },
    { key: "contestType", label: "Contest Type", sortable: true },
    { key: "attempt", label: "Attempt", sortable: true },
    { key: "status", label: "Status", sortable: true },
  ];

  /* ---------------- UI ---------------- */

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      {/* STATUS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statusCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              onClick={() =>
                setSelectedStatus(
                  selectedStatus === card.status ? null : card.status
                )
              }
              className="bg-[#F6F4EE] p-6 rounded-lg cursor-pointer shadow hover:shadow-md flex gap-4"
            >
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                <Icon className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-semibold">
                  {getStatusCount(card.status)}
                </div>
                <div className="text-sm">{card.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <Button
          onClick={() => navigate("/contests/create")}
          className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Contest
        </Button>

        {/* <div className="flex gap-3">
          <TextField
            size="small"
            placeholder="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="w-4 h-4 text-gray-400" />
                </InputAdornment>
              ),
            }}
          />

          <Button variant="outline">
            <FilterIcon className="w-4 h-4" />
          </Button>

          <Button variant="outline">
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div> */}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Loading contests...
          </div>
        ) : (
          <EnhancedTable
            data={filteredContests}
            columns={columns}
            renderRow={contest => ({
              actions: (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/contests/${contest.id}`)}
                >
                  <Eye className="w-4 h-4" />
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
                  className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeColor(
                    contest.status
                  )}`}
                >
                  {contest.status}
                </span>
              ),
            })}
            enableSearch={false}
            enableSelection={false}
            enableExport={false}
            storageKey="contest-table"
            emptyMessage="No contests found"
          />
        )}
      </div>

      {/* PAGINATION (READY FOR BACKEND) */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage(prev => Math.max(1, prev - 1))
                  }
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink isActive>{currentPage}</PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(prev => Math.min(totalPages, prev + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ContestListPage;
