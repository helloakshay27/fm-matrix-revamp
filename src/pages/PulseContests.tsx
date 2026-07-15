import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    Eye,
    Trophy,
    Circle,
    Ban,
    AlertCircle,
    Plus,
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
import { TextField, InputAdornment, Switch } from "@mui/material";
import { useDebounce } from "@/hooks/useDebounce";
import { useRef } from "react";

interface ContestRecord {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    contestType: string;
    attempt: number;
    status: "Active" | "Inactive" | "Expired";
    isActive: boolean;
    contentStatus: string;
}

const statusCards = [
    { title: "Total Contest", icon: Trophy, status: null, queryParam: null },
    { title: "Active", icon: Circle, status: "Active", queryParam: "q[active_cont]=true" },
    { title: "Inactive", icon: Ban, status: "Inactive", queryParam: "q[active_cont]=false" },
    { title: "Expired", icon: AlertCircle, status: "Expired", queryParam: "q[status_cont]=expired" },
];

const columns: ColumnConfig[] = [
    { key: "actions", label: "Action", sortable: false, defaultVisible: true },
    { key: "name", label: "Name", sortable: true, defaultVisible: true },
    { key: "description", label: "Description", sortable: true },
    { key: "startDate", label: "Start Date", sortable: true },
    { key: "endDate", label: "End Date", sortable: true },
    { key: "contestType", label: "Contest Type", sortable: true },
    { key: "attempt", label: "Attempt", sortable: true },
    { key: "contestStatus", label: "Contest Status", sortable: true },
    { key: "status", label: "Status", sortable: true },
];

const PulseContests: React.FC = () => {
    const navigate = useNavigate();

    const [contests, setContests] = useState<ContestRecord[]>([]);
    const [filteredContests, setFilteredContests] = useState<ContestRecord[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    // Debounce the search input to avoid excessive API calls
    const debouncedSearchQuery = useDebounce(searchInput, 800);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages] = useState(1);

    const [statusCounts, setStatusCounts] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        expired: 0,
    });
    const [togglingId, setTogglingId] = useState<number | null>(null);

    /* ---------------- API FETCH ---------------- */

    const fetchContests = useCallback(async () => {
        try {
            // Use different loading states based on whether it's a search operation
            const isSearch = searchQuery.trim() !== "";
            if (isSearch) {
                setSearchLoading(true);
            } else {
                setLoading(true);
            }

            const baseUrl = localStorage.getItem('baseUrl');
            const token = localStorage.getItem('token');

            if (!baseUrl || !token) {
                throw new Error("Base URL or token not set in localStorage");
            }

            // Ensure protocol is present
            const url = `https://${baseUrl}`;

            // Build URL with query parameters based on selected status and search query
            const queryParams = new URLSearchParams();
            queryParams.append('source', 'web');

            // Add search query parameter if exists
            if (searchQuery.trim()) {
                queryParams.append(
                    'q[name_or_description_or_content_type_or_status_or_attemp_required_text_or_start_at_text_or_end_at_text_or_prizes_title_cont]',
                    searchQuery.trim()
                );
            }

            // Add status filter if selected
            if (selectedStatus) {
                const card = statusCards.find(c => c.status === selectedStatus);
                if (card?.queryParam) {
                    const [key, value] = card.queryParam.split('=');
                    queryParams.append(key, value);
                }
            }

            const apiUrl = `${url}/contests.json?${queryParams.toString()}`;

            const response = await axios.get(
                apiUrl,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = response.data;
            const today = new Date();

            // Handle both array and object response
            const contestArray = Array.isArray(data)
                ? data
                : Array.isArray(data.contests)
                    ? data.contests
                    : [];

            if (!contestArray.length) {
                setContests([]);
                setFilteredContests([]);
                setStatusCounts({ total: 0, active: 0, inactive: 0, expired: 0 });
                return;
            }

            const formatted: ContestRecord[] = contestArray.map((item: any) => {
                const start = new Date(item.start_at);
                const end = new Date(item.end_at);
                return {
                    id: item.id,
                    name: item.name,
                    description: item.description ?? "-",
                    startDate: start.toLocaleDateString(),
                    endDate: end.toLocaleDateString(),
                    contestType:
                        item.content_type === "spin"
                            ? "Spin"
                            : item.content_type === "random"
                                ? "Random"
                                : "Special Discount",
                    attempt: item.attemp_required ?? 1,
                    status: item.status ?? "Inactive",
                    isActive: item.active ?? false,
                    contentStatus: item.status ?? "-",
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
            // Clear loading states immediately
            if (searchQuery.trim() !== "") {
                setSearchLoading(false);
            } else {
                setLoading(false);
            }
        }
    }, [searchQuery, selectedStatus]);

    // Initial load
    useEffect(() => {
        fetchContests();
    }, []);

    /* ---------------- FILTER & SEARCH ---------------- */

    // Handle search input change
    const handleSearch = useCallback((query: string) => {
        setSearchInput(query);
    }, []);

    // Effect to handle debounced search
    useEffect(() => {
        // Update search query when debounced input changes
        const trimmedQuery = debouncedSearchQuery.trim();

        if (searchQuery !== trimmedQuery) {
            setSearchQuery(trimmedQuery);
            setCurrentPage(1);
            // Trigger fetch after state update
            const timer = setTimeout(() => {
                fetchContests();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [debouncedSearchQuery]);

    // Effect to handle status filter changes
    useEffect(() => {
        fetchContests();
    }, [selectedStatus]);

    useEffect(() => {
        // Backend handles both search and status filtering
        // No client-side filtering needed
        setFilteredContests(contests);
    }, [contests]);

    /* ---------------- HELPERS ---------------- */

    const getStatusCount = (status: string | null) => {
        if (status === "Active") return statusCounts.active;
        if (status === "Inactive") return statusCounts.inactive;
        if (status === "Expired") return statusCounts.expired;
        return statusCounts.total;
    };

    const handleToggleActive = async (contestId: number, currentIsActive: boolean) => {
        try {
            setTogglingId(contestId);
            const baseUrl = localStorage.getItem("baseUrl");
            const token = localStorage.getItem("token");

            if (!baseUrl || !token) {
                throw new Error("Base URL or token not set in localStorage");
            }

            const url = `https://${baseUrl}`;
            const newActiveState = !currentIsActive;

            const formData = new FormData();
            formData.append("contest[active]", String(newActiveState));
            formData.append("contest[id]", String(contestId));

            const response = await axios.put(
                `${url}/contests/${contestId}.json`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Optimistic UI update
            const updatedContests = contests.map(contest => {
                if (contest.id === contestId) {
                    return {
                        ...contest,
                        isActive: newActiveState,
                        status: (newActiveState ? "Active" : "Inactive") as "Active" | "Inactive" | "Expired",
                    };
                }
                return contest;
            });

            setContests(updatedContests);

            // Update status counts
            const activeCounts = updatedContests.filter(c => c.status === "Active").length;
            const inactiveCounts = updatedContests.filter(c => c.status === "Inactive").length;
            setStatusCounts(prev => ({
                ...prev,
                active: activeCounts,
                inactive: inactiveCounts,
            }));

        } catch (error) {
            console.error("Error toggling contest status", error);
        } finally {
            setTogglingId(null);
        }
    };

    const getShortText = (text: string, wordLimit = 10) => {
        if (!text) return "-";
        const words = text.split(" ");
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(" ") + "...";
    };

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

            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            </div>

            {/* TABLE */}
            <div className="rounded-lg shadow-sm">
                <EnhancedTable
                    data={filteredContests}
                    columns={columns}
                    renderRow={contest => ({
                        actions: (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/pulse/contests/${contest.id}`)}
                            >
                                <Eye className="w-4 h-4" />
                            </Button>
                        ),
                        name: contest.name,
                        description: (
                            <span
                                title={contest.description}
                                className="cursor-pointer"
                            >
                                {getShortText(contest.description, 10)}
                            </span>
                        ),

                        startDate: contest.startDate,
                        endDate: contest.endDate,
                        contestType: contest.contestType,
                        attempt: String(contest.attempt).padStart(2, "0"),
                        contestStatus: (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                {contest.status}
                            </span>
                        ),
                        status: (
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={contest.isActive}
                                    onChange={() => handleToggleActive(contest.id, contest.isActive)}
                                    disabled={togglingId === contest.id || contest.status === "Expired"}
                                    size="small"
                                    sx={{
                                        "& .MuiSwitch-switchBase.Mui-checked": {
                                            color: "#22c55e",
                                        },
                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                            backgroundColor: "#22c55e",
                                        },
                                    }}
                                />
                                <span className="text-sm font-medium">
                                    {contest.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                        ),
                    })}
                    enableSearch={true}
                    enableGlobalSearch={true}
                    onGlobalSearch={handleSearch}
                    searchPlaceholder="Search contests..."
                    enableSelection={false}
                    enableExport={false}
                    loading={loading || searchLoading}
                    loadingMessage={searchLoading ? "Searching contests..." : "Loading contests..."}
                    leftActions={
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => navigate("/pulse/contests/create")}
                                className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create Contest
                            </Button>
                        </div>
                    }
                    storageKey="contest-table"
                    emptyMessage="No contests found"
                />
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

export default PulseContests;