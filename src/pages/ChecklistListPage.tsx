import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, Edit, Trash2, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { useQuery } from '@tanstack/react-query';
import { fetchChecklistMaster, transformChecklistData, TransformedChecklistData } from '@/services/customFormsAPI';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
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

  const handleAddChecklist = () => {
    navigate('/master/checklist/create');
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
    navigate(`/settings/masters/checklist-master/view/${checklist.id}`, {
      state: { checklist }
    });
    
  };

  const handleEditChecklist = (id: number) => {
    navigate(`/master/checklist/edit/${id}`);
  };

  const handleDeleteChecklist = (id: number) => {
    console.log('Delete checklist:', id);
  };

  // Define selectionActions for SelectionPanel
  const selectionActions = [
  ];

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

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 items-center">
          {renderCustomActions()}
        </div>

        {/* Checklist Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-24">Actions</TableHead>
                    <TableHead className="w-16">View</TableHead>
                    <TableHead className="w-16">Id</TableHead>
                    <TableHead>Activity Name</TableHead>
                    <TableHead>Meter Category</TableHead>
                    <TableHead className="text-center">Number Of Questions</TableHead>
                    <TableHead>Scheduled For</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          <span className="ml-2">Loading checklists...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <span className="text-red-600">Error loading checklists. Please try again.</span>
                      </TableCell>
                    </TableRow>
                  ) : checklists.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <span className="text-gray-500">No checklists found.</span>
                      </TableCell>
                    </TableRow>
                  ) : (
                    checklists.map((checklist) => (
                      <TableRow key={checklist.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditChecklist(checklist.id)}
                              className="p-1 h-8 w-8"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteChecklist(checklist.id)}
                              className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewChecklist(checklist)}
                            className="p-1 h-8 w-8"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{checklist.id ?? ''}</TableCell>
                        <TableCell>{checklist.activityName || ''}</TableCell>
                        <TableCell>{checklist.meterCategory || ''}</TableCell>
                        <TableCell className="text-center">{checklist.numberOfQuestions ?? 0}</TableCell>
                        <TableCell>{checklist.scheduledFor || ''}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <BulkUploadDialog 
          open={showImportModal} 
          onOpenChange={setShowImportModal} 
          title="Bulk Upload Checklist" 
          context="checklist_master"
          onDownloadSample={handleDownloadSampleFormat}
        />
      </div>
    </div>
  );
};