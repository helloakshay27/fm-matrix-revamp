import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Box, Clock, Calendar, Link, Mail, MapPin, Loader2, Eye, Download, File, FileSpreadsheet } from 'lucide-react';
import { SetApprovalModal } from '@/components/SetApprovalModal';
import { AttachmentPreviewModal } from '@/components/AttachmentPreviewModal';
import { TextField, Select, MenuItem, FormControl, InputLabel, Autocomplete, Typography, Tooltip } from '@mui/material';
import AttachFile from '@mui/icons-material/AttachFile';
import { assetService } from '@/services/assetService';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomFormDetails } from '@/services/customFormsAPI';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

const muiFieldStyles = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    height: { xs: '36px', md: '45px' },
    borderRadius: '2px',
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#E0E0E0',
    },
    '&:hover fieldset': {
      borderColor: '#1A1A1A',
    },  
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
      borderWidth: 2,
    },
    // Disabled state styling
    '&.Mui-disabled': {
      backgroundColor: '#F5F5F5',
      color: '#A0A0A0',
      borderRadius: '2px',
    },
    '&.Mui-disabled fieldset': {
      borderColor: '#D1D5DB',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    fontSize: '16px',
    '&.Mui-focused': {
      color: '#C72030',
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: 'transparent', // <-- Make label background transparent
      padding: '0 4px',
    },
    '&.Mui-disabled': {
      color: '#A0A0A0',
    },
  },
  '& .MuiOutlinedInput-input, & .MuiSelect-select': {
    color: '#1A1A1A',
    fontSize: '14px',
    padding: { xs: '8px 14px', md: '12px 14px' },
    height: 'auto',
    '&::placeholder': {
      color: '#999999',
      opacity: 1,
    },
    '&.Mui-disabled': {
      color: '#A0A0A0',
    },
  },
};

const multilineFieldStyles = {
  ...muiFieldStyles,
  '& .MuiOutlinedInput-root': {
    ...muiFieldStyles['& .MuiOutlinedInput-root'],
    height: 'auto',
    alignItems: 'flex-start',
    borderRadius: '0',
  },
};

export const ViewSchedulePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Tab state
  const [activeTab, setActiveTab] = useState("basic");

  // Get the form_code from navigation state
  const formCode = location.state?.formCode;

  // Modal states
  const [showSetApprovalModal, setShowSetApprovalModal] = useState(false);
  const [groupOptions, setGroupOptions] = useState<any[]>([]);
  const [subGroupOptions, setSubGroupOptions] = useState<any[]>([]);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  // Supervisor and Supplier state
  const [users, setUsers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState<{ users: boolean; suppliers: boolean }>({ users: false, suppliers: false });

  // Load users for supervisors
  const loadUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ESCALATION_USERS}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      const mockUsers = [
        { id: 1, full_name: 'John Doe' },
        { id: 2, full_name: 'Jane Smith' },
        { id: 3, full_name: 'Mike Johnson' }
      ];
      setUsers(mockUsers);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  // Load suppliers
  const loadSuppliers = async () => {
    setLoading(prev => ({ ...prev, suppliers: true }));
    try {
      const data = await assetService.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to load suppliers:', error);
    } finally {
      setLoading(prev => ({ ...prev, suppliers: false }));
    }
  };

  // Call both APIs on mount
  useEffect(() => {
    loadUsers();
    loadSuppliers();
  }, []);



  // Fetch custom form details
  const {
    data: formDetailsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['custom-form-details', formCode],
    queryFn: () => fetchCustomFormDetails(formCode),
    enabled: !!formCode
  });

  // Extract data from API response
  const customForm = formDetailsData?.custom_form;
  const assetTask = formDetailsData?.asset_task;
  const emailRules = formDetailsData?.email_rules || [];


  // Toggle states for Create Ticket and Weightage
  const createTicketEnabled = customForm?.create_ticket || false;
  const weightageEnabled = customForm?.weightage_enabled || false;

  const selectedGroupId = customForm?.content?.[0]?.group_id || '';
  const selectedSubGroupId = customForm?.content?.[0]?.sub_group_id || '';

  // Fetch group options on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASK_GROUPS}`,
          {
            headers: {
              Authorization: getAuthHeader(),
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await res.json();
        // The API returns { asset_groups: [...] }
        setGroupOptions(data || []);
      } catch (err) {
        setGroupOptions([]);
      }
    };
    fetchGroups();
  }, []);


  // Fetch subgroup options when selectedGroupId changes
  useEffect(() => {
    if (!selectedGroupId) {
      setSubGroupOptions([]);
      return;
    }
    const fetchSubGroups = async () => {
      try {
        const res = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASK_SUB_GROUPS}?group_id=${selectedGroupId}`,
          {
            headers: {
              Authorization: getAuthHeader(),
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await res.json();
        // The API returns { asset_groups: [...] }
        setSubGroupOptions(data.asset_groups || []);
      } catch (err) {
        setSubGroupOptions([]);
      }
    };
    fetchSubGroups();
  }, [selectedGroupId]);


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

  // Format date with time
  const formatDateTime = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 mx-auto">
        <div className="flex items-center justify-center h-32">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading schedule details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !formCode) {
    return (
      <div className="p-6 mx-auto">
        <div className="flex items-center justify-center h-32">
          <p className="text-sm text-red-600">
            {error ? 'Error loading schedule details. Please try again.' : 'Invalid schedule ID or missing form code.'}
          </p>
        </div>
      </div>
    );
  }

  const handleSetApproval = () => {
    setShowSetApprovalModal(true);
  };

  const handleViewPerformance = () => {
    navigate(`/maintenance/schedule/performance/${id}`, { state: { formCode } });
  };

  const handleBack = () => navigate('/maintenance/schedule');

  console.log("Selected Group ID:", selectedGroupId);
  console.log("Selected Sub Group ID:", selectedSubGroupId);
  console.log("groupOptions:", groupOptions);
  

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Schedule
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                {customForm?.form_name}
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Schedule #{assetTask?.id || id} • Created by {assetTask?.created_by || 'Unknown'} • Last updated {formatDate(assetTask?.start_date || assetTask?.services?.[0]?.created_at)}
            </div>
          </div>
          
          <div className="flex gap-3">
            {/* Create Ticket Toggle */}
            <div className="flex items-center space-x-2">
              <RadioGroup value={createTicketEnabled ? "enabled" : "disabled"}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enabled" id="create-ticket-enabled" disabled />
                  <Label htmlFor="create-ticket-enabled">Create Ticket</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Weightage Toggle */}
            <div className="flex items-center space-x-2">
              <RadioGroup value={weightageEnabled ? "enabled" : "disabled"}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enabled" id="weightage-enabled" disabled />
                  <Label htmlFor="weightage-enabled">Weightage</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              onClick={handleViewPerformance}
              variant="outline" 
              className="border-[#C72030] text-[#C72030]"
            >
              View Performance
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
              Basic Configuration
            </TabsTrigger>

            <TabsTrigger
              value="task"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Task
            </TabsTrigger>

            <TabsTrigger
              value="time"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Time Setup
            </TabsTrigger>

            <TabsTrigger
              value="schedule"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Schedule
            </TabsTrigger>

            <TabsTrigger
              value="association"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Association
            </TabsTrigger>

            <TabsTrigger
              value="email"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Email Trigger Rules
            </TabsTrigger>

            <TabsTrigger
              value="mapping"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Asset Mapping List
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Basic Configuration Card */}
              <Card className="w-full">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                    <span className="uppercase tracking-wide">Basic Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Type</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{customForm?.schedule_type || 'PPM'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Schedule For</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{customForm?.sch_type || 'Asset'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Activity Name</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{customForm?.form_name || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Form Code</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{customForm?.custom_form_code || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Create Ticket</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{customForm?.create_ticket ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Weightage</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{customForm?.weightage_enabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Ticket Level</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{customForm?.ticket_level || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Observations</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{customForm?.observations_enabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    {customForm?.description && (
                      <div className="flex items-start col-span-2">
                        <span className="text-gray-500 min-w-[140px]">Description</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{customForm.description}</span>
                      </div>
                    )}
                    {customForm?.attachments && customForm.attachments.length > 0 && (
                      <div className="flex items-start col-span-2">
                        <span className="text-gray-500 min-w-[140px]">Attachments</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <div className="flex flex-wrap gap-4">
                          {customForm.attachments.map((attachment: any, index: number) => {
                            const url = attachment.document || attachment.url || attachment.file_url;
                            const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
                            const isPdf = /\.pdf$/i.test(url);
                            const isExcel = /\.(xls|xlsx|csv)$/i.test(url);
                            const isWord = /\.(doc|docx)$/i.test(url);
                            const isDownloadable = isPdf || isExcel || isWord;

                            return (
                              <div
                                key={attachment.id || index}
                                className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-[#F6F4EE] shadow-md"
                              >
                                {isImage ? (
                                  <>
                                    <button
                                      className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                                      title="View"
                                      onClick={() => {
                                        setSelectedDoc({
                                          id: attachment.id || 0,
                                          document_name: attachment.document_name || attachment.file_name || `Attachment ${index + 1}`,
                                          url: url,
                                          document_url: url,
                                          document: url,
                                        });
                                        setShowImagePreview(true);
                                      }}
                                      type="button"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <img
                                      src={url}
                                      alt={attachment.document_name || attachment.file_name || `Attachment ${index + 1}`}
                                      className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                                      onClick={() => {
                                        setSelectedDoc({
                                          id: attachment.id || 0,
                                          document_name: attachment.document_name || attachment.file_name || `Attachment ${index + 1}`,
                                          url: url,
                                          document_url: url,
                                          document: url,
                                        });
                                        setShowImagePreview(true);
                                      }}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  </>
                                ) : isPdf ? (
                                  <div className="w-14 h-14 flex items-center justify-center border rounded-md text-red-600 bg-white mb-2">
                                    <FileText className="w-6 h-6" />
                                  </div>
                                ) : isExcel ? (
                                  <div className="w-14 h-14 flex items-center justify-center border rounded-md text-green-600 bg-white mb-2">
                                    <FileSpreadsheet className="w-6 h-6" />
                                  </div>
                                ) : isWord ? (
                                  <div className="w-14 h-14 flex items-center justify-center border rounded-md text-blue-600 bg-white mb-2">
                                    <FileText className="w-6 h-6" />
                                  </div>
                                ) : (
                                  <div className="w-14 h-14 flex items-center justify-center border rounded-md text-gray-600 bg-white mb-2">
                                    <File className="w-6 h-6" />
                                  </div>
                                )}
                                <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">
                                  {attachment.document_name ||
                                    attachment.file_name ||
                                    url?.split('/').pop() ||
                                    `Attachment ${index + 1}`}
                                </span>
                                {isDownloadable && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                    onClick={() => {
                                      setSelectedDoc({
                                        id: attachment.id || 0,
                                        document_name: attachment.document_name || attachment.file_name || `Attachment ${index + 1}`,
                                        url: url,
                                        document_url: url,
                                        document: url,
                                      });
                                      setShowImagePreview(true);
                                    }}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="task" className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Task Information Card */}
              <Card className="w-full">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <Box className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                    <span className="uppercase tracking-wide">Task Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Group</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">
                        {groupOptions.find(group => group.id === Number(selectedGroupId))?.name || '--'}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Sub Group</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">
                        {subGroupOptions.find(subGroup => subGroup.id === Number(selectedSubGroupId))?.name || '--'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dynamic Tasks Card */}
              {customForm?.content && customForm.content.length > 0 && (
                <Card className="w-full">
                  <CardHeader className="pb-4 lg:pb-6">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                      </div>
                      <span className="uppercase tracking-wide">Task Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {customForm.content.map((task, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-gray-50">
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
                                {task.type === 'text' ? 'Text' : 
                                 task.type === 'radio-group' ? 'Radio' : 
                                 task.type === 'numeric' ? 'Numeric' :
                                 task.type === 'select' ? 'Dropdown' : 
                                 task.type === 'checkbox' ? 'Checkbox' :
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

                          {/* Help Text Images */}
                          {task.question_hint_image_url && task.question_hint_image_url.length > 0 && (
                            <div className="mt-4">
                              <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Help Images</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <div className="flex flex-wrap gap-2">
                                  {task.question_hint_image_url.map((image: any, imgIndex: number) => (
                                    <a 
                                      key={image.id || imgIndex} 
                                      href={image.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      {image.filename || `Image ${imgIndex + 1}`}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="time" className="p-4 sm:p-6">
            {/* Time Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <Clock className="w-6 h-6" style={{ color: '#C72030' }} />
                  </div>
                  <span className="uppercase tracking-wide">Time Setup</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Parse cron expression and show as MUI Table */}
                {(() => {
                  const cron = (assetTask && ((assetTask as any).cron_expression || (assetTask as any).cron || (assetTask as any).schedule_cron)) || '';
                  let minutes: string[] = [], hours: string[] = [], dayOfMonth: string[] = [], months: string[] = [], weekdays: string[] = [];
                  let isDayOfMonth = false;
                  if (cron) {
                    const parts = cron.split(' ');
                    if (parts.length >= 5) {
                      minutes = parts[0].split(',');
                      hours = parts[1].split(',');
                      dayOfMonth = parts[2] === '*' ? [] : parts[2].split(',');
                      months = parts[3] === '*' ? ['All'] : parts[3].split(',');
                      weekdays = parts[4] === '*' ? [] : parts[4].split(',');
                      
                      // Check if we have specific days of month (dates like 14, 20)
                      isDayOfMonth = parts[2] !== '*' && dayOfMonth.length > 0;
                    }
                  }
                  if (!hours.length || (hours.length === 1 && hours[0] === '*')) hours = ['All'];
                  if (!minutes.length || (minutes.length === 1 && minutes[0] === '*')) minutes = ['All'];
                  if (!months.length) months = ['All'];
                  
                  // Determine what to show in the day column
                  let dayColumnHeader = '';
                  let dayColumnValue = '';
                  
                  if (isDayOfMonth) {
                    dayColumnHeader = 'Date of Month';
                    dayColumnValue = dayOfMonth.join(', ');
                  } else {
                    dayColumnHeader = 'Day of Week';
                    if (weekdays.length === 0) {
                      dayColumnValue = 'All';
                    } else {
                      const weekdayMap: Record<string, string> = { 
                        '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday', '4': 'Thursday', 
                        '5': 'Friday', '6': 'Saturday', '7': 'Sunday' 
                      };
                      dayColumnValue = weekdays.map(wd => weekdayMap[wd] || wd).join(', ');
                    }
                  }
                  
                  return (
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <Table className="border-separate">
                        <TableHeader>
                          <TableRow className="hover:bg-gray-50" style={{ backgroundColor: '#e6e2d8' }}>
                            <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Hours</TableHead>
                            <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Minutes</TableHead>
                            <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>{dayColumnHeader}</TableHead>
                            <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: '#fff' }}>Month</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="hover:bg-gray-50 transition-colors">
                            <TableCell className="py-3 px-4 font-medium">{hours.join(', ')}</TableCell>
                            <TableCell className="py-3 px-4">{minutes.join(', ')}</TableCell>
                            <TableCell className="py-3 px-4">{dayColumnValue}</TableCell>
                            <TableCell className="py-3 px-4">{months.join(', ')}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Schedule Configuration Card */}
              <Card className="w-full">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                    <span className="uppercase tracking-wide">Schedule Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Assignment Type</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{assetTask?.assignment_type === 'people' ? 'Individual' : 'Asset Group'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Assigned To</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">
                        {Array.isArray(assetTask?.assigned_to) && assetTask.assigned_to.length > 0
                          ? assetTask.assigned_to.map((user: any) => user.name).join(', ')
                          : 'Not assigned'}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Scan Type</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{assetTask?.scan_type?.toUpperCase() || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Plan Duration</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{assetTask?.plan_value} {assetTask?.plan_type}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Priority</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{assetTask?.priority || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Grace Time</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{assetTask?.grace_time_value} {assetTask?.grace_time_type}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Lock Overdue Task</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{assetTask?.overdue_task_start_status ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Category</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{assetTask?.category || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Backup Assigned To</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{assetTask?.backup_assigned?.name || 'No backup assigned'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Submission Time</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{customForm?.submission_time_value} {customForm?.submission_time_type}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Start Date</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{formatDate(assetTask?.start_date)}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">End Date</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{formatDate(assetTask?.end_date)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="association" className="p-4 sm:p-6">
            {/* Association */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <Link className="w-6 h-6" style={{ color: '#C72030' }} />
                  </div>
                  <span className="uppercase tracking-wide">Association</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {customForm?.sch_type === 'Service' ? (
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <Table className="border-separate">
                      <TableHeader>
                        <TableRow className="hover:bg-gray-50" style={{ backgroundColor: '#e6e2d8' }}>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Service Name</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Service Code</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: '#fff' }}>Created on</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assetTask?.services && assetTask.services.length > 0 ? (
                          assetTask.services.map((service, index) => (
                            <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                              <TableCell className="py-3 px-4 font-medium">{service.service_name}</TableCell>
                              <TableCell className="py-3 px-4">{service.service_code}</TableCell>
                              <TableCell className="py-3 px-4">{formatDateTime(service.created_at)}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                              No services associated
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <Table className="border-separate">
                      <TableHeader>
                        <TableRow className="hover:bg-gray-50" style={{ backgroundColor: '#e6e2d8' }}>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Asset Name</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Model Number</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Purchase Cost</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: '#fff' }}>Created on</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assetTask?.assets && assetTask.assets.length > 0 ? (
                          assetTask.assets.map((asset, index) => (
                            <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                              <TableCell className="py-3 px-4 font-medium">{asset.name || 'N/A'}</TableCell>
                              <TableCell className="py-3 px-4">{asset.model_number || 'N/A'}</TableCell>
                              <TableCell className="py-3 px-4">{asset.purchase_cost || 'N/A'}</TableCell>
                              <TableCell className="py-3 px-4">{asset.created_at ? formatDateTime(asset.created_at) : 'N/A'}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                              No assets associated
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="p-4 sm:p-6">
            {/* Email Trigger Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <Mail className="w-6 h-6" style={{ color: '#C72030' }} />
                  </div>
                  <span className="uppercase tracking-wide">Email Trigger Rules</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <Table className="border-separate">
                    <TableHeader>
                      <TableRow className="hover:bg-gray-50" style={{ backgroundColor: '#e6e2d8' }}>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Rule Name</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Trigger Type</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Trigger To</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Period Value</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Period Type</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: '#fff' }}>Created By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emailRules && emailRules.length > 0 ? (
                        emailRules.map((rule, index) => (
                          <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="py-3 px-4 font-medium">{rule.rule_name || 'N/A'}</TableCell>
                            <TableCell className="py-3 px-4">{rule.trigger_type || 'N/A'}</TableCell>
                            <TableCell className="py-3 px-4">{rule.trigger_to || 'N/A'}</TableCell>
                            <TableCell className="py-3 px-4">{rule.period_value || 'N/A'}</TableCell>
                            <TableCell className="py-3 px-4">{rule.period_type || 'N/A'}</TableCell>
                            <TableCell className="py-3 px-4">{rule.created_by || 'N/A'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                            No email trigger rules found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mapping" className="p-4 sm:p-6">
            {/* Asset Mapping List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <MapPin className="w-6 h-6" style={{ color: '#C72030' }} />
                  </div>
                  <span className="uppercase tracking-wide">Asset Mapping List</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <Table className="border-separate">
                    <TableHeader>
                      <TableRow className="hover:bg-gray-50" style={{ backgroundColor: '#e6e2d8' }}>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>{customForm?.sch_type === 'Service' ? 'Service Name' : 'Asset Name'}</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: '#fff' }}>Tasks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customForm?.sch_type === 'Service' ? (
                        assetTask?.services && assetTask.services.length > 0 ? (
                          assetTask.services.map((service, index) => (
                            <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                              <TableCell className="py-3 px-4 font-medium">{service.service_name}</TableCell>
                              <TableCell className="py-3 px-4">
                                {customForm?.content?.map((task, taskIndex) => (
                                  <span key={taskIndex} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                                    {task.label}
                                  </span>
                                ))}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center text-gray-500 py-8">
                              No service mappings found
                            </TableCell>
                          </TableRow>
                        )
                      ) : (
                        assetTask?.assets && assetTask.assets.length > 0 ? (
                          assetTask.assets.map((asset, index) => (
                            <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                              <TableCell className="py-3 px-4 font-medium">{asset.name || asset.asset_name || 'N/A'}</TableCell>
                              <TableCell className="py-3 px-4">
                                {customForm?.content?.map((task, taskIndex) => (
                                  <span key={taskIndex} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                                    {task.label}
                                  </span>
                                ))}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center text-gray-500 py-8">
                              No asset mappings found
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Buttons */}
      {/* <div className="flex gap-3 pt-6">
        <Button
          onClick={() => navigate('/maintenance/schedule')}
          variant="outline"
          className="px-8"
        >
          Back to List
        </Button>
      </div> */}

      {/* Set Approval Modal */}
      <SetApprovalModal
        isOpen={showSetApprovalModal}
        onClose={() => setShowSetApprovalModal(false)}
      />

      {/* Attachment Preview Modal */}
      <AttachmentPreviewModal
        isModalOpen={showImagePreview}
        setIsModalOpen={setShowImagePreview}
        selectedDoc={selectedDoc}
        setSelectedDoc={setSelectedDoc}
      />
    </div>
  );
};