import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Eye, Upload, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { toast, Toaster } from "sonner";
import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';

const checklistData = [
  {
    id: 440,
    activityName: 'qawertyhuhjkjkjjkjjkjubjbjbj',
    meterCategory: '',
    numberOfQuestions: 1,
    scheduledFor: 'Asset'
  },
  {
    id: 435,
    activityName: 'VI Repair Preparedness Checklist',
    meterCategory: '',
    numberOfQuestions: 5,
    scheduledFor: 'Service'
  },
  {
    id: 309,
    activityName: 'Daily Meeting Room Readiness Checklist',
    meterCategory: '',
    numberOfQuestions: 21,
    scheduledFor: 'Service'
  }
];

export const ChecklistMasterDashboard = () => {
  const navigate = useNavigate();
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleAddChecklist = () => {
    navigate('/settings/masters/checklist-master/add');
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

  const handleEditClick = (id: number) => {
    navigate(`/settings/masters/checklist-master/edit/${id}`);
  };

  const handleViewClick = (id: number) => {
    navigate(`/settings/masters/checklist-master/view/${id}`);
  };

  // Define selectionActions for SelectionPanel
  const selectionActions = [
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Sonner Toaster for notifications */}
      <Toaster position="top-right" richColors closeButton />

      {/* Action Panel */}
      {showActionPanel && (
        <SelectionPanel
          actions={selectionActions}
          onAdd={handleAddChecklist}
          onClearSelection={() => setShowActionPanel(false)}
          onImport={() => setShowImportModal(true)}
        />
      )}

      {/* Custom Actions */}
      <div className="flex items-center gap-3 mb-6">
        {renderCustomActions()}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Actions</TableHead>
              <TableHead>View</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Activity Name</TableHead>
              <TableHead>Meter Category</TableHead>
              <TableHead>Number Of Questions</TableHead>
              <TableHead>Scheduled For</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checklistData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditClick(item.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewClick(item.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-blue-600 font-medium">{item.id}</TableCell>
                <TableCell>{item.activityName}</TableCell>
                <TableCell>{item.meterCategory}</TableCell>
                <TableCell>{item.numberOfQuestions}</TableCell>
                <TableCell>{item.scheduledFor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BulkUploadDialog 
        open={showImportModal} 
        onOpenChange={setShowImportModal} 
        title="Bulk Upload Checklist" 
        context="checklist_master"
        onDownloadSample={handleDownloadSampleFormat}
      />
    </div>
  );
};
