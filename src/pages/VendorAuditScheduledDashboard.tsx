import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Plus, Eye } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

export const VendorAuditScheduledDashboard = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    per_page: 20,
    total_pages: 1,
    total_entries: 0
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchScheduleData(currentPage);
  }, [currentPage]);

  const fetchScheduleData = async (page: number) => {
    try {
      setLoading(true);
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');

      if (!baseUrl || !token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(
        `https://${baseUrl}/pms/custom_forms/audit_checklists.json?page=${page}&q[checklist_for_eq]=Pms::Supplier

`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch schedule data');
      }

      const data = await response.json();
      setScheduleData(data.schedule_list || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      toast.error('Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'actions', label: 'Actions', sortable: false, draggable: false, defaultVisible: true },
    { key: 'id', label: 'ID', sortable: true, draggable: true, defaultVisible: true },
    { key: 'form_name', label: 'Activity Name', sortable: true, draggable: true, defaultVisible: true },
    { key: 'no_of_associations', label: 'No. Of Association', sortable: true, draggable: true, defaultVisible: true },
    { key: 'create_ticket', label: 'Task', sortable: true, draggable: true, defaultVisible: true },
    { key: 'task_assigned_to', label: 'Task Assigned To', sortable: true, draggable: true, defaultVisible: true },
    { key: 'created_at', label: 'Created on', sortable: true, draggable: true, defaultVisible: true },
  ];

  const handleAddSchedule = () => {
    navigate('/maintenance/audit/vendor/scheduled/add');
  };

  const renderCell = (item: any, columnKey: string) => {
    if (columnKey === 'actions') {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/maintenance/audit/vendor/scheduled/view/${item.id}`, {
            state: { formCode: item.custom_form_code }
          })}
        >
          <Eye className="w-4 h-4" />
        </Button>
      );
    }
    if (columnKey === 'id') {
      return <span className="text-blue-600 font-medium">{item.id}</span>;
    }
    if (columnKey === 'task_assigned_to') {
      return item.task_assigned_to || '-';
    }
    return item[columnKey];
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(scheduleData.map(item => item.id.toString()));
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
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>

          <h1 className="text-2xl font-bold text-[#1a1a1a]">SCHEDULE LIST</h1>
        </div>
      </div>


      <div className="overflow-x-auto">
        <EnhancedTable
          data={scheduleData}
          columns={columns}
          renderCell={renderCell}
          selectable={true}
          selectedItems={selectedItems}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
          getItemId={(item) => item.id.toString()}
          storageKey="vendor-schedule-list-table"
          className="w-full"
          loading={loading}
          leftActions={
            <Button
              onClick={handleAddSchedule}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          }
        />
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {pagination.total_pages} ({pagination.total_entries} total)
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
            disabled={currentPage === pagination.total_pages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
