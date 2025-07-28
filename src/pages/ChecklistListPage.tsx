import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, Edit, Trash2, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { useQuery } from '@tanstack/react-query';
import { fetchChecklistMaster, transformChecklistData, TransformedChecklistData } from '@/services/customFormsAPI';

export const ChecklistListPage = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();

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

  const handleViewChecklist = (checklist: TransformedChecklistData) => {
    // Navigate to view checklist page with checklist data
    navigate(`/master/checklist/view/${checklist.id}`, {
      state: { checklist }
    });
  };

  const handleEditChecklist = (id: number) => {
    navigate(`/master/checklist/edit/${id}`);
  };

  const handleDeleteChecklist = (id: number) => {
    console.log('Delete checklist:', id);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
    }
  };

  const handleDownloadSampleFormat = () => {
    console.log('Download sample format');
  };

  const handleImportQuestions = () => {
    console.log('Import questions');
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa] p-6">
      <div className="w-full max-w-none space-y-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">CHECKLIST MASTER</h1>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 items-center">
          <Button 
            onClick={handleAddChecklist}
            className="bg-[#6B46C1] hover:bg-[#6B46C1]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Choose file
              </label>
              <span className="text-sm text-gray-500">No file chosen</span>
            </div>

            <Button
              variant="secondary"
              onClick={handleDownloadSampleFormat}
              className="bg-[#6B46C1] hover:bg-[#6B46C1]/90 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Sample Format
            </Button>

            <Button
              variant="secondary"
              onClick={handleImportQuestions}
              className="bg-[#6B46C1] hover:bg-[#6B46C1]/90 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Questions
            </Button>
          </div>
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
      </div>
    </div>
  );
};