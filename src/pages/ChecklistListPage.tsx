import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Eye, Edit, Trash2, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { useQuery } from '@tanstack/react-query';
import { fetchChecklistMaster, transformChecklistData, TransformedChecklistData } from '@/services/customFormsAPI';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { toast, Toaster } from "sonner";
import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';

export const ChecklistListPage = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    setCurrentSection('Master');
  }, [setCurrentSection]);

  // Fetch checklist master data from API
  const {
    data: checklistData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['checklist-master'],
    queryFn: fetchChecklistMaster
  });

  // Transform the data
  const checklists = checklistData ? transformChecklistData(checklistData) : [];
  
  // Debug: Log the transformed data
  // useEffect(() => {
  //   if (checklists.length > 0) {
  //     console.log('First checklist item:', checklists[0]);
  //     console.log('All checklist keys:', Object.keys(checklists[0]));
  //   }
  // }, [checklists]);

  const handleAddChecklist = () => {
    navigate('/master/checklist-master/add');
  };

  const handleDownloadSampleFormat = async () => {
    console.log('Downloading checklist sample format...');

    try {
      // Call the API to download the sample file
      const response = await apiClient.get(ENDPOINTS.CHECKLIST_SAMPLE_FORMAT, {
        responseType: 'blob'
      });

      // Create blob URL and trigger download
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'checklist_sample_format.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Sample format downloaded successfully', {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#10b981',
          color: 'white',
          border: 'none',
        },
      });
    } catch (error) {
      console.error('Error downloading sample file:', error);
      toast.error('Failed to download sample file. Please try again.', {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    }
  };

  const handleActionClick = () => {
    setShowActionPanel((prev) => !prev);
  };

  const renderCustomActions = () => (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <Button
        onClick={handleActionClick}
        className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium"
      >
        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        Action
      </Button>
    </div>
  );

  const handleViewChecklist = (checklist: TransformedChecklistData) => {
    // Navigate to view checklist page with checklist data
    navigate(`/master/checklist-master/view/${checklist.id}`, {
      state: { checklist }
    });
  };

  const handleEditChecklist = (id: number) => {
    navigate(`/master/checklist-master/edit/${id}`);
  };

  const handleDeleteChecklist = (id: number) => {
    console.log('Delete checklist:', id);
  };

  // Define columns for EnhancedTable
  const columns = [
    {
      key: 'actions',
      label: 'Actions',
      sortable: false
    },
    {
      key: 'view',
      label: 'View',
      sortable: false
    },
    {
      key: 'id',
      label: 'Id',
      sortable: true
    },
    {
      key: 'activityName',
      label: 'Activity Name',
      sortable: true
    },
    {
      key: 'meterCategory',
      label: 'Meter Category',
      sortable: true
    },
    {
      key: 'numberOfQuestions',
      label: 'Number Of Questions',
      sortable: true
    },
    {
      key: 'scheduleType',
      label: 'Type',
      sortable: true
    },
    {
      key: 'scheduledFor',
      label: 'Scheduled For',
      sortable: true
    }
  ];

  // Render cell content
  const renderCell = (item: TransformedChecklistData, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditChecklist(item.id)}
              className="p-1 h-8 w-8"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteChecklist(item.id)}
              className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      case 'view':
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewChecklist(item)}
            className="p-1 h-8 w-8"
          >
            <Eye className="w-4 h-4" />
          </Button>
        );
      case 'numberOfQuestions':
        return <div className="text-center">{item.numberOfQuestions ?? 0}</div>;
      default:
        return item[columnKey as keyof TransformedChecklistData] ?? '';
    }
  };

  // Define selectionActions for SelectionPanel
  const selectionActions = [];

  return (
    <div className="w-full min-h-screen bg-[#fafafa] p-6">
      {/* Sonner Toaster for notifications */}
      <Toaster position="top-right" richColors closeButton />

      <div className="w-full max-w-none space-y-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">CHECKLIST MASTER</h1>

        {/* Action Panel */}
        {showActionPanel && (
          <SelectionPanel
            actions={selectionActions}
            onAdd={handleAddChecklist}
            onClearSelection={() => setShowActionPanel(false)}
            onImport={() => setShowImportModal(true)}
          />
        )}

        {/* Enhanced Table with Search */}
        <div className="space-y-4">
          <EnhancedTable
            data={checklists}
            columns={columns}
            renderCell={renderCell}
            pagination={false}
            enableExport={false}
            storageKey="checklist-table"
            enableSearch={true}
            searchPlaceholder="Search checklists..."
            leftActions={renderCustomActions()}
            loading={isLoading}
            emptyMessage={error ? "Error loading checklists. Please try again." : "No checklists found."}
          />
        </div>

        <BulkUploadDialog
          open={showImportModal}
          onOpenChange={setShowImportModal}
          title="Bulk Upload Checklist"
          context="custom_forms"
        />
      </div>
    </div>
  );
};