


import React, { useState, useEffect, Fragment } from 'react';
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { apiClient } from "@/utils/apiClient";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface AuditConductedOccurrence {
  id: number;
  form_name: string;
  start_date: string;
  conducted_by: string;
  status: string;
  site: string;
  duration: number | null;
  percentage: number;
  has_response: boolean;
  print_pdf_url: string | null;
  delete_url: string | null;
}

interface AuditConductedResponse {
  occurrences: AuditConductedOccurrence[];
  total_count: number;
  current_page: number;
  per_page: number;
  total_pages: number;
}

export const VendorAuditConductedDashboard = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [conductedData, setConductedData] = useState<AuditConductedOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchAuditsConducted();
  }, [currentPage]);

  const fetchAuditsConducted = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<AuditConductedResponse>(
        '/pms/custom_forms/audits_conducted.json',
        {
          params: {
            page: currentPage,
            per_page: 20,
            'q[custom_form_checklist_for_eq]': 'Pms::Supplier',
          },
        }
      );
      setConductedData(response.data.occurrences);
      setTotalPages(response.data.total_pages);
      setTotalCount(response.data.total_count);
    } catch (error) {
      console.error("Error fetching audits conducted:", error);
      toast.error("Failed to fetch audits conducted data");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReport = async (auditId: number, printPdfUrl: string | null) => {
    if (!printPdfUrl) {
      toast.error("PDF report not available for this audit");
      return;
    }

    try {
      const response = await apiClient.get(printPdfUrl, {
        responseType: 'blob',
      });

      // Create a blob URL and open it in a new window
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');

      // Clean up the blob URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);

      toast.success("Opening PDF report...");
    } catch (error) {
      console.error("Error opening PDF:", error);
      toast.error("Failed to open PDF report");
    }
  };

  const handleDeleteReport = async (auditId: number, deleteUrl: string | null) => {
    if (!deleteUrl) {
      toast.error("Cannot delete report for this audit");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      await apiClient.delete(`/pms/asset_task_occurrences/${auditId}/delete_print_pdf`);
      toast.success("Report deleted successfully");
      fetchAuditsConducted(); // Refresh data
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast.error("Failed to delete report");
    }
  };

  const formatDuration = (duration: number | null): string => {
    if (!duration) return "-";
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const columns = [
    { key: 'actions', label: 'Actions', sortable: false, draggable: false },
    { key: 'report', label: 'Report', sortable: true, draggable: true },
    { key: 'id', label: 'ID', sortable: true, draggable: true },
    { key: 'auditName', label: 'Audit Name', sortable: true, draggable: true },
    { key: 'startDateTime', label: 'Start Date & Time', sortable: true, draggable: true },
    { key: 'conductedBy', label: 'Conducted By', sortable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, draggable: true },
    { key: 'site', label: 'Site', sortable: true, draggable: true },
    { key: 'duration', label: 'Duration', sortable: true, draggable: true },
    { key: 'percentage', label: '%', sortable: true, draggable: true },
    { key: 'delete', label: 'Delete', sortable: false, draggable: true },
  ];

  const renderCell = (item: AuditConductedOccurrence, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <Button variant="ghost" size="sm" onClick={() => console.log('View conducted audit:', item.id)}>
            <Eye className="w-4 h-4" />
          </Button>
        );
      case 'report':
        return item.has_response && item.print_pdf_url ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePrintReport(item.id, item.print_pdf_url)}
            className="p-1 h-auto hover:bg-gray-100"
            title="Print PDF"
          >
            <FileText className="w-4 h-4 text-blue-600" />
          </Button>
        ) : null;
      case 'id':
        return <span className="text-blue-600 font-medium">{item.id}</span>;
      case 'auditName':
        return item.form_name;
      case 'startDateTime':
        return item.start_date;
      case 'conductedBy':
        return item.conducted_by || "-";
      case 'status':
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
            {item.status}
          </span>
        );
      case 'site':
        return item.site;
      case 'duration':
        return formatDuration(item.duration);
      case 'percentage':
        return item.percentage ? `${item.percentage}%` : "-";
      case 'delete':
        return item.has_response && item.delete_url ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteReport(item.id, item.delete_url)}
            className="text-red-600 hover:bg-red-50"
            title="Delete Report"
          >
            Delete
          </Button>
        ) : null;
      default:
        return null;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(conductedData.map(item => item.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Audits Conducted &gt; Audits Conducted List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">AUDITS CONDUCTED LIST</h1>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {!loading && (
        <>
          <div className="overflow-x-auto">
            <EnhancedTable
              data={conductedData}
              columns={columns}
              renderCell={renderCell}
              selectable={true}
              selectedItems={selectedItems}
              onSelectAll={handleSelectAll}
              onSelectItem={handleSelectItem}
              getItemId={(item) => item.id.toString()}
              storageKey="conducted-audit-table"
              className="w-full"
              pagination={false}
            />
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(1)}
                      isActive={currentPage === 1}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>

                  {currentPage > 4 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                    .filter((page) => page > 1 && page < totalPages)
                    .map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                  {currentPage < totalPages - 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {totalPages > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                        isActive={currentPage === totalPages}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="text-center mt-2 text-sm text-gray-600">
                Showing page {currentPage} of {totalPages} ({totalCount} total audits)
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

