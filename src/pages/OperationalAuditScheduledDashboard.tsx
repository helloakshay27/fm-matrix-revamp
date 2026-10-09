import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { PostHogAuditActivity } from "@/components/PostHogAuditActivity";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ScheduleItem {
  id: number;
  form_name: string;
  no_of_associations: number;
  create_ticket: string;
  task_assigned_to: string | null;
  created_at: string;
  custom_form_code: string;
  description: string;
  checklist_for: string;
  schedule_type: string;
  tasks_count: number;
}

interface PaginationData {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_entries: number;
}

export const OperationalAuditScheduledDashboard = () => {
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    per_page: 20,
    total_pages: 1,
    total_entries: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchScheduleData(currentPage);
  }, [currentPage]);

  const fetchScheduleData = async (page: number) => {
    try {
      setLoading(true);
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");

      if (!baseUrl || !token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(
        `https://${baseUrl}/pms/custom_forms/audit_checklists.json?page=${page}&q[checklist_type_eq]=Operational`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch schedule data");
      }

      const data = await response.json();
      setScheduleData(data.schedule_list || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      toast.error("Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
    {
      key: "id",
      label: "ID",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "form_name",
      label: "Activity Name",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "no_of_associations",
      label: "No. Of Association",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "create_ticket",
      label: "Task",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "task_assigned_to",
      label: "Task Assigned To",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "created_at",
      label: "Created on",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
  ];

  const handleAddSchedule = () => {
    navigate("/maintenance/audit/operational/scheduled/add");
  };

  const renderCell = (item: any, columnKey: string) => {
    if (columnKey === "actions") {
      return shouldShow("Audit", "show") && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-black hover:bg-gray-100"
          onClick={() =>
            navigate(
              `/maintenance/audit/operational/scheduled/view/${item.id}`,
              {
                state: { formCode: item.custom_form_code },
              }
            )
          }
        >
          <Eye className="w-4 h-4" />
        </Button>
      );
    }
    if (columnKey === "id") {
      return <span className="text-gray-900 font-medium">{item.id}</span>;
    }
    if (columnKey === "task_assigned_to") {
      return item.task_assigned_to || "-";
    }
    return item[columnKey];
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(scheduleData.map((item) => item.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <PostHogAuditActivity event="Audit Schedule List Viewed" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Schedule List
        </h1>
      </div>

      <EnhancedTable
        data={scheduleData}
        columns={columns}
        renderCell={renderCell}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        getItemId={(item) => item.id.toString()}
        storageKey="schedule-list-table"
        loading={loading}
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search schedules..."
        pagination={false}
        leftActions={
          shouldShow("Audit", "create") ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddSchedule}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          ) : undefined
        }
      />

      <div className="mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (currentPage > 1 && !loading) {
                    setCurrentPage(currentPage - 1);
                  }
                }}
                className={
                  currentPage === 1 || loading
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                onClick={() => !loading && setCurrentPage(1)}
                isActive={currentPage === 1}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                1
              </PaginationLink>
            </PaginationItem>

            {currentPage > 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {Array.from(
              { length: 3 },
              (_, index) => currentPage - 1 + index
            )
              .filter(
                (page) => page > 1 && page < pagination.total_pages
              )
              .map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => !loading && setCurrentPage(page)}
                    isActive={currentPage === page}
                    className={loading ? "pointer-events-none opacity-50" : ""}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

            {currentPage < pagination.total_pages - 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {pagination.total_pages > 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() =>
                    !loading && setCurrentPage(pagination.total_pages)
                  }
                  isActive={currentPage === pagination.total_pages}
                  className={loading ? "pointer-events-none opacity-50" : ""}
                >
                  {pagination.total_pages}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (currentPage < pagination.total_pages && !loading) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                className={
                  currentPage === pagination.total_pages || loading
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="mt-2 text-center text-sm text-gray-600">
          Showing page {currentPage} of {pagination.total_pages} (
          {pagination.total_entries} total schedules)
        </div>
      </div>
    </div>
  );
};
