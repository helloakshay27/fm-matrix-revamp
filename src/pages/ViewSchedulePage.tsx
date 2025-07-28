import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SetApprovalModal } from '@/components/SetApprovalModal';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomFormDetails } from '@/services/customFormsAPI';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

const [taskGroups, setTaskGroups] = useState([]);
const [taskSubGroups, setTaskSubGroups] = useState([]);
const [loading, setLoading] = useState({ taskGroups: false, taskSubGroups: false });

const loadTaskGroups = async () => {
  setLoading(prev => ({ ...prev, taskGroups: true }));
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASK_GROUPS}`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    setTaskGroups(data);
  } catch (error) {
    setTaskGroups([]);
  } finally {
    setLoading(prev => ({ ...prev, taskGroups: false }));
  }
};

const loadTaskSubGroups = async (groupId) => {
  if (!groupId) return;
  setLoading(prev => ({ ...prev, taskSubGroups: true }));
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASK_SUB_GROUPS}?group_id=${groupId}`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    setTaskSubGroups(data.asset_groups || []);
  } catch (error) {
    setTaskSubGroups([]);
  } finally {
    setLoading(prev => ({ ...prev, taskSubGroups: false }));
  }
};

useEffect(() => {
  loadTaskGroups();
}, []);



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
      backgroundColor: '#FFFFFF',
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

  // Get the form_code from navigation state
  const formCode = location.state?.formCode;

  // Modal states
  const [showSetApprovalModal, setShowSetApprovalModal] = useState(false);

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
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading schedule details...</p>
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


  useEffect(() => {
    const groupId = customForm?.content?.[0]?.group_id;
    if (groupId) loadTaskSubGroups(groupId);
  }, [customForm]);

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">View Schedule</h1>
        <div className="flex gap-3 mb-6">
          {/* Create Ticket Toggle */}
          <div className="flex items-center space-x-2">
            <RadioGroup value={createTicketEnabled ? "enabled" : "disabled"}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enabled" id="create-ticket-enabled" />
                <Label htmlFor="create-ticket-enabled">Create Ticket</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Weightage Toggle */}
          <div className="flex items-center space-x-2">
            <RadioGroup value={weightageEnabled ? "enabled" : "disabled"}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enabled" id="weightage-enabled" />
                <Label htmlFor="weightage-enabled">Weightage</Label>
              </div>
            </RadioGroup>
          </div>

          {/* <Button 
            onClick={handleSetApproval}
            style={{ backgroundColor: '#C72030' }} 
            className="text-white"
          >
            Set Approval
          </Button> */}
          {/* <Button 
            onClick={handleViewPerformance}
            variant="outline" 
            className="border-[#C72030] text-[#C72030]"
          >
            View Performance
          </Button> */}
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[#C72030] flex items-center gap-2 text-lg font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-7 h-7 flex items-center justify-center text-base">1</span>
              Basic Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="flex justify-between gap-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">Type</Label>
                <RadioGroup value={customForm?.schedule_type || 'PPM'} className="flex gap-4" disabled>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PPM" id="type-ppm" disabled />
                    <Label htmlFor="type-ppm" className="text-sm">PPM</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="AMC" id="type-amc" disabled />
                    <Label htmlFor="type-amc" className="text-sm">AMC</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Preparedness" id="type-preparedness" disabled />
                    <Label htmlFor="type-preparedness" className="text-sm">Preparedness</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Routine" id="type-routine" disabled />
                    <Label htmlFor="type-routine" className="text-sm">Routine</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-3 ml-5">
                <Label className="text-base font-medium">Schedule For</Label>
                <RadioGroup value={customForm?.sch_type || 'Asset'} className="flex gap-6" disabled>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Asset" id="schedule-asset" disabled />
                    <Label htmlFor="schedule-asset" className="text-sm">Asset</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Service" id="schedule-service" disabled />
                    <Label htmlFor="schedule-service" className="text-sm">Service</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Vendor" id="schedule-vendor" disabled />
                    <Label htmlFor="schedule-vendor" className="text-sm">Vendor</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="space-y-3">
              <TextField
                label="Activity Name"
                value={customForm?.form_name || ''}
                InputProps={{ readOnly: true, disabled: true }}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ ...muiFieldStyles, fontSize: '1rem', borderRadius: '8px' }}
              />
            </div>
            <div className="space-y-3">
              <TextField
                label="Description"
                value={customForm?.description || ''}
                InputProps={{ readOnly: true, disabled: true }}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Enter description"
                InputLabelProps={{ shrink: true }}
                sx={{ ...multilineFieldStyles, fontSize: '1rem', borderRadius: '8px' }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Task */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center gap-2">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Task
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Group and Sub Group Dropdowns with selected value from master data */}
            {(() => {
              // Map taskGroups and taskSubGroups to options for Select components
              const groupOptions = Array.isArray(taskGroups) ? taskGroups : [];
              const subGroupOptions = Array.isArray(taskSubGroups) ? taskSubGroups : [];
              const selectedGroupId = customForm?.content?.[0]?.group_id || '';
              const selectedSubGroupId = customForm?.content?.[0]?.sub_group_id || '';

              return (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormControl fullWidth variant="outlined" disabled>
                      <InputLabel shrink>Group</InputLabel>
                      <Select
                        value={selectedGroupId || ''}
                        label="Group"
                        disabled
                        sx={muiFieldStyles}
                      >
                        {groupOptions.map(group => (
                          <MenuItem key={group.id} value={group.id}>
                            {group.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="space-y-2">
                    <FormControl fullWidth variant="outlined" disabled>
                      <InputLabel shrink>Sub Group</InputLabel>
                      <Select
                        value={selectedSubGroupId || ''}
                        label="Sub Group"
                        disabled
                        sx={muiFieldStyles}
                      >
                        {subGroupOptions.map(subGroup => (
                          <MenuItem key={subGroup.id} value={subGroup.id}>
                            {subGroup.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              );
            })()}

            {/* Dynamic Task Content */}
            {customForm?.content && customForm.content.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Tasks:</h4>
                {customForm.content.map((task, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                    <div className="space-y-2">
                      <TextField
                        label={`Task ${index + 1}`}
                        value={task.label}
                        InputProps={{ readOnly: true, disabled: true }}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={muiFieldStyles}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormControl fullWidth variant="outlined" disabled>
                        <InputLabel shrink>Input Type</InputLabel>
                        <Select
                          value={task.type === 'text' ? 'Text' : task.type === 'radio-group' ? 'Radio' : task.type}
                          label="Input Type"
                          disabled
                          sx={muiFieldStyles}
                        >
                          <MenuItem value={task.type === 'text' ? 'Text' : task.type === 'radio-group' ? 'Radio' : task.type}>
                            {task.type === 'text' ? 'Text' : task.type === 'radio-group' ? 'Radio' : task.type}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="space-y-2 flex items-center  gap-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          checked={task.required === 'true'}
                          disabled
                          className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030] data-[state=checked]:text-white bg-[#F5F5F5] border-[#D1D5DB]"
                        />
                        <Label className="text-gray-400">Mandatory</Label>
                      </div>
                      <div className="flex items-start space-x-2 m-0">
                        <Checkbox
                          checked={task.is_reading === 'true'}
                          disabled
                          className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030] data-[state=checked]:text-white bg-[#F5F5F5] border-[#D1D5DB]"
                        />
                        <Label className="text-gray-400">Reading</Label>
                      </div>
                    </div>

                    {/* Conditional Value Sections */}
                    <div className="col-span-3">
                      {task.type === 'dropdown' && Array.isArray(task.values) && task.values.length > 0 && (
                        <div className="space-y-2">
                          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                            <Label className="block text-sm font-semibold mb-2 text-gray-700">Enter Value</Label>
                            {task.values.map((value, valueIndex) => (
                              <div key={valueIndex} className="flex items-center gap-2 mb-2">
                                <input
                                  value={value.label}
                                  readOnly
                                  disabled
                                  className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-gray-700 text-sm"
                                />
                                <select
                                  value={value.type}
                                  disabled
                                  className="w-20 bg-white border border-gray-300 rounded px-2 py-2 text-gray-700 text-sm"
                                >
                                  <option value="positive">P</option>
                                  <option value="negative">N</option>
                                </select>
                                {task.values.length > 1 && (
                                  <span className="text-red-600 cursor-not-allowed">&#10005;</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {task.type === 'radio-group' && Array.isArray(task.values) && task.values.length > 0 && (
                        <div className="space-y-2">
                          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <Label className="text-sm font-semibold text-gray-700">Selected</Label>
                              <Label className="text-sm font-semibold text-gray-700">Enter Value</Label>
                            </div>
                            {task.values.map((value, valueIndex) => (
                              <div key={valueIndex} className="flex items-center gap-2 mb-2">
                                <input
                                  type="radio"
                                  name={`radio-${index}`}
                                  checked={valueIndex === 0}
                                  disabled
                                  className="text-red-600"
                                  readOnly
                                />
                                <input
                                  value={value.label}
                                  readOnly
                                  disabled
                                  className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-gray-700 text-sm"
                                />
                                <select
                                  value={value.type}
                                  disabled
                                  className="w-20 bg-white border border-gray-300 rounded px-2 py-2 text-gray-700 text-sm"
                                >
                                  <option value="positive">P</option>
                                  <option value="negative">N</option>
                                </select>
                                {task.values.length > 1 && (
                                  <span className="text-red-600 cursor-not-allowed">&#10005;</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {task.type === 'checkbox' && Array.isArray(task.values) && task.values.length > 0 && (
                        <div className="space-y-2">
                          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <Label className="text-sm font-semibold text-gray-700">Selected</Label>
                              <Label className="text-sm font-semibold text-gray-700">Enter Value</Label>
                            </div>
                            {task.values.map((value, valueIndex) => (
                              <div key={valueIndex} className="flex items-center gap-2 mb-2">
                                <input
                                  type="checkbox"
                                  checked={valueIndex === 0}
                                  disabled
                                  className="text-red-600"
                                  readOnly
                                />
                                <input
                                  value={value.label}
                                  readOnly
                                  disabled
                                  className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-gray-700 text-sm"
                                />
                                {task.values.length > 1 && (
                                  <span className="text-red-600 cursor-not-allowed">&#10005;</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {task.type === 'options-inputs' && Array.isArray(task.values) && task.values.length > 0 && (
                        <div className="space-y-2">
                          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                            <Label className="block text-sm font-semibold mb-2 text-gray-700 text-center">Enter Value</Label>
                            {task.values.map((value, valueIndex) => (
                              <div key={valueIndex} className="flex items-center gap-2 mb-2">
                                <input
                                  value={value.label}
                                  readOnly
                                  disabled
                                  className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-gray-700 text-sm"
                                />
                                {task.values.length > 1 && (
                                  <span className="text-red-600 cursor-not-allowed">&#10005;</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center gap-2">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Time Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Parse cron expression and show as MUI Table */}
            {(() => {
              const cron = (assetTask && ((assetTask as any).cron_expression || (assetTask as any).cron || (assetTask as any).schedule_cron)) || '';
              let minutes: string[] = [], hours: string[] = [], months: string[] = [], weekdays: string[] = [];
              if (cron) {
                const parts = cron.split(' ');
                if (parts.length >= 5) {
                  minutes = parts[0].split(',');
                  hours = parts[1].split(',');
                  months = parts[3] === '*' ? ['All'] : parts[3].split(',');
                  weekdays = parts[4] === '*' ? ['All'] : parts[4].split(',');
                }
              }
              if (!hours.length || (hours.length === 1 && hours[0] === '*')) hours = ['All'];
              if (!minutes.length || (minutes.length === 1 && minutes[0] === '*')) minutes = ['All'];
              if (!months.length) months = ['All'];
              if (!weekdays.length) weekdays = ['All'];
              const weekdayMap: Record<string, string> = { '1': 'Sunday', '2': 'Monday', '3': 'Tuesday', '4': 'Wednesday', '5': 'Thursday', '6': 'Friday', '7': 'Saturday' };
              const weekdayNames = weekdays.map(wd => weekdayMap[wd] || wd);
              return (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hours</TableHead>
                      <TableHead>Minutes</TableHead>
                      <TableHead>Day of Week</TableHead>
                      <TableHead>Month</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{hours.join(', ')}</TableCell>
                      <TableCell>{minutes.join(', ')}</TableCell>
                      <TableCell>{weekdayNames.join(', ')}</TableCell>
                      <TableCell>{months.join(', ')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              );
            })()}
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center gap-2">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Checklist Type</Label>
              <RadioGroup value={assetTask?.assignment_type === 'people' ? 'Individual' : 'Asset Group'} className="flex gap-4" disabled>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Individual" id="checklist-individual" disabled />
                  <Label htmlFor="checklist-individual" className="text-gray-400">Individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Asset Group" id="checklist-asset-group" disabled />
                  <Label htmlFor="checklist-asset-group" className="text-gray-400">Asset Group</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Dynamic Asset/Service Display */}
            {/* <div className="space-y-2">
              <Label>{customForm?.sch_type === 'Service' ? 'Services' : 'Assets'}</Label>
              <div className="bg-red-50 p-2 rounded border border-red-200">
                {customForm?.sch_type === 'Service' ? (
                  assetTask?.services?.map((service, index) => (
                    <div key={index} className="text-red-600 text-sm mb-2">
                      {service.service_name}[{service.service_code}]
                    </div>
                  ))
                ) : (
                  assetTask?.assets?.map((asset, index) => (
                    <div key={index} className="text-red-600 text-sm mb-2">
                      {asset.name}                    </div>
                  ))
                )}
                {(!assetTask?.services || assetTask.services.length === 0) && 
                 (!assetTask?.assets || assetTask.assets.length === 0) && (
                  <div className="text-red-600 text-sm">No assets or services assigned</div>
                )}
              </div>
            </div> */}

            <div className="grid grid-cols-3 gap-4 mt-3">
              <div className="space-y-2">
                <TextField
                  label="Assign to"
                  value={customForm?.supervisors?.[0] || 'Not assigned'}
                  InputProps={{ readOnly: true, disabled: true }}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={muiFieldStyles}
                />
              </div>
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined" disabled>
                  <InputLabel shrink>Scan Type</InputLabel>
                  <Select
                    value={assetTask?.scan_type || 'Select Scan Type'}
                    label="Scan Type"
                    disabled
                    sx={muiFieldStyles}
                  >
                    <MenuItem value={assetTask?.scan_type || 'Select Scan Type'}>
                      {assetTask?.scan_type || 'Select Scan Type'}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined" disabled>
                  <InputLabel shrink>Plan Duration Type</InputLabel>
                  <Select
                    value={assetTask?.plan_type || 'Day'}
                    label="Plan Duration Type"
                    disabled
                    sx={muiFieldStyles}
                  >
                    <MenuItem value={assetTask?.plan_type || 'Day'}>
                      {assetTask?.plan_type || 'Day'}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <TextField
                  label="Plan value"
                  value={assetTask?.plan_value || '1'}
                  InputProps={{ readOnly: true, disabled: true }}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={muiFieldStyles}
                />
              </div>
              <div className="space-y-2">
                <TextField
                  label="Email Trigger Rule"
                  value={customForm?.rule_ids?.[0] || 'No rules'}
                  InputProps={{ readOnly: true, disabled: true }}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={muiFieldStyles}
                />
              </div>
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined" disabled>
                  <InputLabel shrink>Supervisors</InputLabel>
                  <Select
                    value={customForm?.supervisors?.join(', ') || 'Select Supervisors'}
                    label="Supervisors"
                    disabled
                    sx={muiFieldStyles}
                  >
                    <MenuItem value={customForm?.supervisors?.join(', ') || 'Select Supervisors'}>
                      {customForm?.supervisors?.join(', ') || 'Select Supervisors'}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined" disabled>
                  <InputLabel shrink>Priority</InputLabel>
                  <Select
                    value={assetTask?.priority || 'Select Priority'}
                    label="Priority"
                    disabled
                    sx={muiFieldStyles}
                  >
                    <MenuItem value={assetTask?.priority || 'Select Priority'}>
                      {assetTask?.priority || 'Select Priority'}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <TextField
                  label="Submission Type"
                  value={customForm?.submission_time_type || ''}
                  InputProps={{ readOnly: true, disabled: true }}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={muiFieldStyles}
                />
              </div>
              <div className="space-y-2">
                <TextField
                  label="Submission Time Value"
                  value={customForm?.submission_time_value?.toString() || ''}
                  InputProps={{ readOnly: true, disabled: true }}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={muiFieldStyles}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined" disabled>
                  <InputLabel shrink>Category</InputLabel>
                  <Select
                    value={assetTask?.category || 'Technical'}
                    label="Category"
                    disabled
                    sx={muiFieldStyles}
                  >
                    <MenuItem value={assetTask?.category || 'Technical'}>
                      {assetTask?.category || 'Technical'}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <TextField
                  label="Grace Time Value"
                  value={assetTask?.grace_time_value || '3'}
                  InputProps={{ readOnly: true, disabled: true }}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={muiFieldStyles}
                />
              </div>
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined" disabled>
                  <InputLabel shrink>Grace Time</InputLabel>
                  <Select
                    value={assetTask?.grace_time_type || 'Hour'}
                    label="Grace Time"
                    disabled
                    sx={muiFieldStyles}
                  >
                    <MenuItem value={assetTask?.grace_time_type || 'Hour'}>
                      {assetTask?.grace_time_type || 'Hour'}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>

            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined" disabled>
                  <InputLabel shrink>Lock Overdue Task</InputLabel>
                  <Select
                    value={assetTask?.overdue_task_start_status ? 'Enabled' : 'Disabled'}
                    label="Lock Overdue Task"
                    disabled
                    sx={muiFieldStyles}
                  >
                    <MenuItem value={assetTask?.overdue_task_start_status ? 'Enabled' : 'Disabled'}>
                      {assetTask?.overdue_task_start_status ? 'Enabled' : 'Disabled'}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined" disabled>
                  <InputLabel shrink>Frequency</InputLabel>
                  <Select
                    value={assetTask?.frequency || 'Select Frequency'}
                    label="Frequency"
                    disabled
                    sx={muiFieldStyles}
                  >
                    <MenuItem value={assetTask?.frequency || 'Select Frequency'}>
                      {assetTask?.frequency || 'Select Frequency'}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined" disabled>
                  <InputLabel shrink>Select Supplier</InputLabel>
                  <Select
                    value={customForm?.supplier_id ? `Supplier ID: ${customForm.supplier_id}` : 'Select Supplier'}
                    label="Select Supplier"
                    disabled
                    sx={muiFieldStyles}
                  >
                    <MenuItem value={customForm?.supplier_id ? `Supplier ID: ${customForm.supplier_id}` : 'Select Supplier'}>
                      {customForm?.supplier_id ? `Supplier ID: ${customForm.supplier_id}` : 'Select Supplier'}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextField
                  label="Start Date"
                  value={formatDate(assetTask?.start_date)}
                  InputProps={{ readOnly: true, disabled: true }}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={muiFieldStyles}
                />
              </div>
              <div className="space-y-2">
                <TextField
                  label="End Date"
                  value={formatDate(assetTask?.end_date)}
                  InputProps={{ readOnly: true, disabled: true }}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={muiFieldStyles}
                />
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Association */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center gap-2">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
              Association
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customForm?.sch_type === 'Service' ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Service Code</TableHead>
                    <TableHead>Created on</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetTask?.services && assetTask.services.length > 0 ? (
                    assetTask.services.map((service, index) => (
                      <TableRow key={index}>
                        <TableCell>{service.service_name}</TableCell>
                        <TableCell>{service.service_code}</TableCell>
                        <TableCell>{formatDateTime(assetTask.start_date)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-500">
                        No services associated
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Asset Code</TableHead>
                    <TableHead>Model Number</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Purchase Cost</TableHead>
                    <TableHead>Created on</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetTask?.assets && assetTask.assets.length > 0 ? (
                    assetTask.assets.map((asset, index) => (
                      <TableRow key={index}>
                        <TableCell>{asset.name || 'N/A'}</TableCell>
                        <TableCell>{asset.asset_code || 'N/A'}</TableCell>
                        <TableCell>{asset.model_number || 'N/A'}</TableCell>
                        <TableCell>{asset.purchase_date ? formatDateTime(asset.purchase_date) : 'N/A'}</TableCell>
                        <TableCell>{asset.purchase_cost || 'N/A'}</TableCell>
                        <TableCell>{asset.created_on ? formatDateTime(asset.created_on) : 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        No assets associated
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Email Trigger Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center gap-2">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
              Email Trigger Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Trigger Type</TableHead>
                  <TableHead>Trigger To</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Period Value</TableHead>
                  <TableHead>Period Type</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Created By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emailRules && emailRules.length > 0 ? (
                  emailRules.map((rule, index) => (
                    <TableRow key={index}>
                      <TableCell>{rule.rule_name || 'N/A'}</TableCell>
                      <TableCell>{rule.trigger_type || 'N/A'}</TableCell>
                      <TableCell>{rule.trigger_to || 'N/A'}</TableCell>
                      <TableCell>{rule.role || 'N/A'}</TableCell>
                      <TableCell>{rule.period_value || 'N/A'}</TableCell>
                      <TableCell>{rule.period_type || 'N/A'}</TableCell>
                      <TableCell>{rule.created_on ? formatDateTime(rule.created_on) : 'N/A'}</TableCell>
                      <TableCell>{rule.created_by || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500">
                      No email trigger rules found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Asset Mapping List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center gap-2">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
              Asset Mapping List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{customForm?.sch_type === 'Service' ? 'Service Name' : 'Asset Name'}</TableHead>
                  <TableHead>Tasks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customForm?.sch_type === 'Service' ? (
                  assetTask?.services && assetTask.services.length > 0 ? (
                    assetTask.services.map((service, index) => (
                      <TableRow key={index}>
                        <TableCell>{service.service_name}</TableCell>
                        <TableCell>
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
                      <TableCell colSpan={2} className="text-center text-gray-500">
                        No service mappings found
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  assetTask?.assets && assetTask.assets.length > 0 ? (
                    assetTask.assets.map((asset, index) => (
                      <TableRow key={index}>
                        <TableCell>{asset.asset_name || 'N/A'}</TableCell>
                        <TableCell>
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
                      <TableCell colSpan={2} className="text-center text-gray-500">
                        No asset mappings found
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button
            onClick={() => navigate('/maintenance/schedule')}
            variant="outline"
            className="px-8"
          >
            Back to List
          </Button>
          {/* <Button 
            onClick={() => navigate(`/maintenance/schedule/edit/${id}`)}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-8"
          >
            Edit Schedule
          </Button> */}
        </div>
      </div>

      {/* Set Approval Modal */}
      <SetApprovalModal
        isOpen={showSetApprovalModal}
        onClose={() => setShowSetApprovalModal(false)}
      />
    </div>
  );
};
