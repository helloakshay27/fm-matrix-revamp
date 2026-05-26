
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface GDNRequest {
  id: number;
  gdn_date: string;
  inventory_count: number;
  status: string;
  created_at: string;
  created_by: string;
  handed_over_to: string | null;
}

interface GDNPagination {
  current_page: number;
  total_pages: number;
  total_entries: number;
  per_page: number;
}

const GDN_REQUEST_LIST_ENDPOINT = "/pms/srns/gdn_request_list.json";

export const GDNDashboard = () => {
  const navigate = useNavigate();
  const [gdnData, setGdnData] = useState<GDNRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<GDNPagination>({
    current_page: 1,
    total_pages: 0,
    total_entries: 0,
    per_page: 15,
  });

  const fetchGdnRequests = async (page = 1) => {
    setLoading(true);

    try {
      const baseUrl = API_CONFIG.BASE_URL;
      if (!baseUrl) {
        throw new Error("Base URL is not configured.");
      }

      const url = new URL(GDN_REQUEST_LIST_ENDPOINT, baseUrl);
      url.searchParams.set("page", String(page));

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch GDN request list (${response.status})`);
      }

      const result = await response.json();
      setGdnData(Array.isArray(result.data) ? result.data : []);
      setPagination({
        current_page: Number(result.pagination?.current_page || page),
        total_pages: Number(result.pagination?.total_pages || 0),
        total_entries: Number(result.pagination?.total_entries || 0),
        per_page: Number(result.pagination?.per_page || 15),
      });
    } catch (error) {
      console.error("Error fetching GDN request list:", error);
      toast.error("Failed to load GDN request list. Please try again.");
      setGdnData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGdnRequests();
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-black';
      case 'dispatched':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handlePageChange = (page: number) => {
    if (
      loading ||
      page < 1 ||
      page > pagination.total_pages ||
      page === pagination.current_page
    ) {
      return;
    }

    fetchGdnRequests(page);
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
            onClick={() => handlePageChange(1)}
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
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let page = start; page <= end; page += 1) {
        items.push(
          <PaginationItem key={page} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(page)}
              isActive={currentPage === page}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages} className="cursor-pointer">
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            className={loading ? "pointer-events-none opacity-50" : ""}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    } else {
      for (let page = 1; page <= totalPages; page += 1) {
        items.push(
          <PaginationItem key={page} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(page)}
              isActive={currentPage === page}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        GDN Generation &gt; GDN List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">GDN LIST</h1>

      {/* Add Button */}
      <div className="mb-6">
        <Button 
          className="fm-button-fix fm-button-brand px-4 py-2"
          onClick={() => navigate("/finance/gdn/request-add")}
        >
          + Add
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Actions</TableHead>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">GDN Date</TableHead>
              <TableHead className="font-semibold">Inventory Count</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Created On</TableHead>
              <TableHead className="font-semibold">Created By</TableHead>
              <TableHead className="font-semibold">Handed Over To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  Loading GDN requests...
                </TableCell>
              </TableRow>
            ) : gdnData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No GDN requests found
                </TableCell>
              </TableRow>
            ) : (
              gdnData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-1"
                      onClick={() => navigate(`/finance/gdn/details/${item.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.gdn_date || "-"}</TableCell>
                  <TableCell>{item.inventory_count ?? "-"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status || "-"}
                    </span>
                  </TableCell>
                  <TableCell>{item.created_at || "-"}</TableCell>
                  <TableCell>{item.created_by || "-"}</TableCell>
                  <TableCell>{item.handed_over_to || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.total_pages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                  className={pagination.current_page === 1 || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                  className={pagination.current_page === pagination.total_pages || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

    </div>
  );
};
