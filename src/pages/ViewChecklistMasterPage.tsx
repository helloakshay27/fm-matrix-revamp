import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Box } from 'lucide-react';
import { API_CONFIG, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { useQuery } from '@tanstack/react-query';
import { fetchAssetTypes } from '@/services/assetTypesAPI';

export const ViewChecklistMasterPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [checklistData, setChecklistData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  // Fetch asset types data from API
  const {
    data: assetTypes,
    isLoading: isLoadingAssetTypes,
    error: assetTypesError
  } = useQuery({
    queryKey: ['asset-types'],
    queryFn: fetchAssetTypes
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const fetchChecklist = async () => {
      try {
        const url = `${API_CONFIG.BASE_URL}/master_checklist_detail.json?id=${id}`;
        const response = await fetch(url, getAuthenticatedFetchOptions('GET'));
        if (!response.ok) {
          throw new Error('Failed to fetch checklist details');
        }
        const data = await response.json();
        setChecklistData(data);
      } catch (err) {
        setError(err.message || 'Error fetching checklist details');
        setChecklistData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchChecklist();
  }, [id]);

  const handleEditDetails = () => {
    navigate(`/master/checklist-master/edit/${id}`);
  };

  // Format date function
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!checklistData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          {loading ? (
            <p className="text-gray-500">Loading checklist details...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-gray-500">No checklist details found.</p>
          )}
        </div>
      </div>
    );
  }

  // Get asset type name from ID
  const getAssetTypeName = (assetTypeId: number) => {
    if (!assetTypes || !assetTypeId) return '';
    const assetType = assetTypes.find(type => type.id === assetTypeId);
    return assetType ? assetType.name : '';
  };

  // Parse schedule for from checklist_for
  const getScheduleFor = (checklistFor: string) => {
    if (!checklistFor) return '';
    const parts = checklistFor.split('::');
    if (parts.length > 1) {
      const scheduleForPart = parts[1].toLowerCase();
      if (scheduleForPart.includes('asset')) {
        return 'Asset';
      } else if (scheduleForPart.includes('service')) {
        return 'Service';
      } else if (scheduleForPart.includes('vendor')) {
        return 'Vendor';
      } else if (scheduleForPart.includes('amc')) {
        return 'AMC';
      }
    }
    return '';
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/master/checklist')}
          className="flex items-center gap-1 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Checklist Master
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                {checklistData.form_name || 'Checklist Master'}
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              ID: {checklistData.id || '--'} • Type: {checklistData.schedule_type || '--'} • Schedule For: {getScheduleFor(checklistData.checklist_for) || '--'} • Created: {formatDate(checklistData.created_at)}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleEditDetails}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              Edit Details
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="basic" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
            <TabsTrigger
              value="basic"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Basic Information
            </TabsTrigger>

            <TabsTrigger
              value="tasks"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Tasks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Basic Information Card */}
              <Card className="w-full">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                    <span className="uppercase tracking-wide">Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Type</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{checklistData.schedule_type || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Schedule For</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{getScheduleFor(checklistData.checklist_for) || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Form Name</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{checklistData.form_name || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Create Ticket</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{checklistData.create_ticket ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Ticket Level</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{checklistData.ticket_level || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Company ID</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{checklistData.company_id || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Created At</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{formatDate(checklistData.created_at)}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Updated At</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{formatDate(checklistData.updated_at)}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Weightage Enabled</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{checklistData.weightage_enabled ? 'Yes' : 'No'}</span>
                    </div>
                    {getScheduleFor(checklistData.checklist_for) === 'Asset' && checklistData.asset_meter_type_id && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Asset Type</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{getAssetTypeName(checklistData.asset_meter_type_id) || '--'}</span>
                      </div>
                    )}
                    {checklistData.description && (
                      <div className="flex items-start col-span-2">
                        <span className="text-gray-500 min-w-[140px]">Description</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{checklistData.description}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Tasks Card */}
              <Card className="w-full">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <Box className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                    <span className="uppercase tracking-wide">Task Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {Array.isArray(checklistData.content) && checklistData.content.length > 0 ? (
                      checklistData.content.map((task, taskIndex) => (
                        <div key={taskIndex} className="p-4 border rounded-lg bg-gray-50">
                          <h4 className="font-medium mb-4 text-gray-900">Task {taskIndex + 1}</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-4">
                            <div className="flex items-start">
                              <span className="text-gray-500 min-w-[140px]">Task Name</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{task.label || '--'}</span>
                            </div>
                            <div className="flex items-start">
                              <span className="text-gray-500 min-w-[140px]">Input Type</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">
                                {task.type === 'radio-group' ? 'Radio Button' :
                                 task.type === 'text' ? 'Text' :
                                 task.type === 'checkbox-group' ? 'Checkbox' :
                                 task.type === 'select' ? 'Dropdown' :
                                 task.type === 'number' ? 'Number' :
                                 task.type === 'date' ? 'Date' :
                                 task.type === 'options-inputs' ? 'Multiple Options' :
                                 task.type}
                              </span>
                            </div>
                            <div className="flex items-start">
                              <span className="text-gray-500 min-w-[140px]">Mandatory</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{task.required === 'true' ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="flex items-start">
                              <span className="text-gray-500 min-w-[140px]">Reading</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{task.is_reading === 'true' ? 'Yes' : 'No'}</span>
                            </div>
                            {task.rating_enabled === 'true' && (
                              <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Rating Enabled</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">Yes</span>
                              </div>
                            )}
                            {task.weightage && (
                              <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Weightage</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{task.weightage}</span>
                              </div>
                            )}
                            {task.hint && (
                              <div className="flex items-start col-span-2">
                                <span className="text-gray-500 min-w-[140px]">Help Text</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{task.hint}</span>
                              </div>
                            )}
                          </div>

                          {/* Task Values */}
                          {Array.isArray(task.values) && task.values.length > 0 && (
                            <div className="mt-4">
                              <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Available Options</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <div className="flex flex-wrap gap-2">
                                  {task.values.map((value, valueIndex) => (
                                    <span key={valueIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                      {value.label} ({value.type === 'positive' ? 'P' : 'N'})
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        No tasks found
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};