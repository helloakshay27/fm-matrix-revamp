
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Calendar,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
} from "lucide-react";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";

interface Asset {
  id: number;
  name: string;
}

interface Occurrence {
  id: number;
  checklist_name: string;
  type: string;
  schedule: string;
  assigned_to: string;
  task_status: string;
  grace_time: string;
  per: number;
}

interface PPMTabProps {
  asset: Asset;
  assetId?: string | number;
}

export const PPMTab: React.FC<PPMTabProps> = ({ assetId }) => {
  const [ppmData, setPpmData] = useState<Occurrence[]>([]);
  const [filteredData, setFilteredData] = useState<Occurrence[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Scheduled");
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const statusCards = [
    { label: "Scheduled", icon: Calendar },
    { label: "Open", icon: Lock },
    { label: "In Progress", icon: AlertTriangle },
    { label: "Closed", icon: CheckCircle },
    { label: "Overdue", icon: Clock },
  ];

  const fetchPPMData = async (page = 1) => {
    if (!assetId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_CONFIG.BASE_URL}/pms/assets/${assetId}/occurrences.json?page=${page}`,
        {
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );
      const occurrences: Occurrence[] = res.data.occurrences;
      setPpmData(occurrences);
      setCurrentPage(res.data.pagination.current_page);
      setTotalPages(res.data.pagination.total_pages);
      setTotalCount(res.data.pagination.total_count || occurrences.length);
    } catch (error) {
      console.error("Failed to fetch PPM data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPPMData(currentPage);
  }, [assetId, currentPage]);

  useEffect(() => {
    const filtered = ppmData.filter(
      (occ) =>
        occ.task_status === statusFilter &&
        (occ.checklist_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          occ.schedule.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredData(filtered);
  }, [ppmData, statusFilter, searchTerm]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate pagination items with ellipsis logic
  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis or pages 2-3
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show current page area
      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show ellipsis or pages before last
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find(item => item.key === i)) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statusCards.map((card, index) => {
          const IconComponent = card.icon;
          const count = ppmData.filter(
            (item) => item.task_status === card.label
          ).length;
          return (
            <div
              key={index}
              className={`p-4 rounded-lg cursor-pointer ${
                statusFilter === card.label ? "ring-2 ring-red-600" : ""
              }`}
              style={{ backgroundColor: "#F6F4EE" }}
              onClick={() => setStatusFilter(card.label)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <IconComponent
                    className="w-5 h-5"
                    style={{ color: "#C72030" }}
                  />
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">
                    {count.toString().padStart(2, "0")}
                  </div>
                  <div className="text-sm font-medium text-black">
                    {card.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64 min-w-[200px]"
          />
        </div>
      </div>

      {/* PPM Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Checklist</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Assign To</TableHead>
              <TableHead>Grace Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No data found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.checklist_name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.schedule}</TableCell>
                  <TableCell>{item.assigned_to || "—"}</TableCell>
                  <TableCell>{item.grace_time}</TableCell>
                  <TableCell>
                    <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium inline-flex items-center gap-1">
                      {item.task_status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-700">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{item.per}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (currentPage < totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
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
          Showing page {currentPage} of {totalPages} ({totalCount} total items)
        </div>
      )}
    </div>
  );
};
