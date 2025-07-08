import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useParams, useNavigate } from 'react-router-dom';
import { SetApprovalModal } from '@/components/SetApprovalModal';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export const ViewSchedulePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Modal states
  const [showSetApprovalModal, setShowSetApprovalModal] = useState(false);

  // Toggle states for Create Ticket and Weightage
  const [createTicketEnabled, setCreateTicketEnabled] = useState(false);
  const [weightageEnabled, setWeightageEnabled] = useState(false);

  // Static data for viewing
  const scheduleData = {
    type: 'PPM',
    activityName: 'meter reading',
    description: '',
    scheduleFor: 'Asset',
    checklistType: 'Individual',
    asset: 'Energy Meter 1[584931186764c2f8b565]',
    assignTo: 'Ashiq Rasul',
    scanType: 'Select Scan Type',
    planDurationType: 'Day',
    planValue: '1',
    priority: 'Select Priority',
    emailTriggerRule: '',
    supervisors: 'Select Supervisors',
    category: 'Technical',
    submissionType: '',
    submissionTimeValue: '',
    graceTime: 'Day',
    graceTimeValue: '3',
    lockOverdueTask: 'Select Lock Status',
    frequency: 'Select Frequency',
    cronExpression: '0 0 * * *',
    startTime: '01/05/2025',
    endAt: '31/05/2025',
    selectSupplier: 'Select Supplier'
  };

  // Association data
  const associationData = [
    {
      assetName: 'Energy Meter 1',
      assetCode: '584931186764c2f8b565',
      modelNumber: '',
      purchaseDate: '14/02/2022, 04:54 PM',
      purchaseCost: '',
      createdOn: ''
    },
    {
      assetName: 'Energy Meter 23',
      assetCode: '03835269926136105d:1',
      modelNumber: 'EM-001',
      purchaseDate: '31/05/2023, 06:18 PM',
      purchaseCost: '',
      createdOn: ''
    }
  ];

  // Email trigger rules data
  const emailTriggerRules = [];

  // Asset mapping data
  const assetMappingData = [
    {
      assetName: 'Energy Meter 1',
      kwah: 'Electric Meter'
    },
    {
      assetName: 'Energy Meter 23',
      kwah: 'Start Reading'
    }
  ];

  const handleSetApproval = () => {
    setShowSetApprovalModal(true);
  };

  const handleViewPerformance = () => {
    navigate(`/maintenance/schedule/performance/${id}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
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

          <Button 
            onClick={handleSetApproval}
            style={{ backgroundColor: '#C72030' }} 
            className="text-white"
          >
            Set Approval
          </Button>
          <Button 
            onClick={handleViewPerformance}
            variant="outline" 
            className="border-[#C72030] text-[#C72030]"
          >
            View Performance
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center gap-2">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <RadioGroup value={scheduleData.type} className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PPM" id="type-ppm" />
                    <Label htmlFor="type-ppm">PPM</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="AMC" id="type-amc" />
                    <Label htmlFor="type-amc">AMC</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Preparedness" id="type-preparedness" />
                    <Label htmlFor="type-preparedness">Preparedness</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Hoto" id="type-hoto" />
                    <Label htmlFor="type-hoto">Hoto</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Routine" id="type-routine" />
                    <Label htmlFor="type-routine">Routine</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Audit" id="type-audit" />
                    <Label htmlFor="type-audit">Audit</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Schedule for</Label>
                <RadioGroup value={scheduleData.scheduleFor} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Asset" id="schedule-asset" />
                    <Label htmlFor="schedule-asset">Asset</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Service" id="schedule-service" />
                    <Label htmlFor="schedule-service">Service</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Vendor" id="schedule-vendor" />
                    <Label htmlFor="schedule-vendor">Vendor</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Activity Name</Label>
              <TextField
                value={scheduleData.activityName}
                InputProps={{ readOnly: true }}
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: { xs: '36px', sm: '45px' },
                    '& input': {
                      padding: { xs: '8px 14px', sm: '10px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                    },
                  },
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <TextField
                value={scheduleData.description}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Enter description"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& textarea': {
                      padding: '10px 14px',
                    },
                  },
                }}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Checklist Group</Label>
                <TextField
                  value="Select Group"
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', sm: '45px' },
                      '& input': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    },
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Checklist Group</Label>
                <TextField
                  value="Select Sub Group"
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', sm: '45px' },
                      '& input': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    },
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Task</Label>
                <TextField
                  value="Kwah"
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', sm: '45px' },
                      '& input': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    },
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Input Type</Label>
                <TextField
                  value="Numeric"
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', sm: '45px' },
                      '& input': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    },
                  }}
                />
              </div>
              <div className="space-y-2 flex items-center gap-4 pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox checked disabled />
                  <Label>Mandatory</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked disabled />
                  <Label>Reading</Label>
                </div>
              </div>
            </div>
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
              <RadioGroup value={scheduleData.checklistType} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Individual" id="checklist-individual" />
                  <Label htmlFor="checklist-individual">Individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Asset Group" id="checklist-asset-group" />
                  <Label htmlFor="checklist-asset-group">Asset Group</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Asset</Label>
              <div className="bg-red-50 p-2 rounded border border-red-200">
                <div className="text-red-600 text-sm mb-2">Energy Meter 1[584931186764c2f8b565]</div>
                <div className="text-red-600 text-sm">Energy Meter 23[03835269926136105d:1]</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Assign to</Label>
                <TextField
                  value={scheduleData.assignTo}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', sm: '45px' },
                      '& input': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    },
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Scan Type</Label>
                <FormControl fullWidth size="small">
                  <Select
                    value={scheduleData.scanType}
                    readOnly
                    sx={{
                      height: { xs: '36px', sm: '45px' },
                      '& .MuiSelect-select': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                  >
                    <MenuItem value={scheduleData.scanType}>{scheduleData.scanType}</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <Label>Plan Duration Type</Label>
                <FormControl fullWidth size="small">
                  <Select
                    value={scheduleData.planDurationType}
                    readOnly
                    sx={{
                      height: { xs: '36px', sm: '45px' },
                      '& .MuiSelect-select': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                  >
                    <MenuItem value={scheduleData.planDurationType}>{scheduleData.planDurationType}</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Plan value</Label>
                <TextField
                  value={scheduleData.planValue}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', sm: '45px' },
                      '& input': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    },
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Email Trigger Rule</Label>
                <TextField
                  value={scheduleData.emailTriggerRule}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', sm: '45px' },
                      '& input': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    },
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Supervisors</Label>
                <FormControl fullWidth size="small">
                  <Select
                    value={scheduleData.supervisors}
                    readOnly
                    sx={{
                      height: { xs: '36px', sm: '45px' },
                      '& .MuiSelect-select': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                  >
                    <MenuItem value={scheduleData.supervisors}>{scheduleData.supervisors}</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <FormControl fullWidth size="small">
                  <Select
                    value={scheduleData.priority}
                    readOnly
                    sx={{
                      height: { xs: '36px', sm: '45px' },
                      '& .MuiSelect-select': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                  >
                    <MenuItem value={scheduleData.priority}>{scheduleData.priority}</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <Label>Submission Type</Label>
                <TextField
                  value={scheduleData.submissionType}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', sm: '45px' },
                      '& input': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    },
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Submission Time Value</Label>
                <TextField
                  value={scheduleData.submissionTimeValue}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', sm: '45px' },
                      '& input': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <FormControl fullWidth size="small">
                  <Select
                    value={scheduleData.category}
                    readOnly
                    sx={{
                      height: { xs: '36px', sm: '45px' },
                      '& .MuiSelect-select': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                  >
                    <MenuItem value={scheduleData.category}>{scheduleData.category}</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <Label>Grace Time Value</Label>
                <TextField
                  value={scheduleData.graceTimeValue}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', sm: '45px' },
                      '& input': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    },
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Lock Overdue Task</Label>
                <FormControl fullWidth size="small">
                  <Select
                    value={scheduleData.lockOverdueTask}
                    readOnly
                    sx={{
                      height: { xs: '36px', sm: '45px' },
                      '& .MuiSelect-select': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                  >
                    <MenuItem value={scheduleData.lockOverdueTask}>{scheduleData.lockOverdueTask}</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Grace Time</Label>
                <FormControl fullWidth size="small">
                  <Select
                    value={scheduleData.graceTime}
                    readOnly
                    sx={{
                      height: { xs: '36px', sm: '45px' },
                      '& .MuiSelect-select': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                  >
                    <MenuItem value={scheduleData.graceTime}>{scheduleData.graceTime}</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <FormControl fullWidth size="small">
                  <Select
                    value={scheduleData.frequency}
                    readOnly
                    sx={{
                      height: { xs: '36px', sm: '45px' },
                      '& .MuiSelect-select': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                  >
                    <MenuItem value={scheduleData.frequency}>{scheduleData.frequency}</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <TextField
                  value={scheduleData.startTime}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', sm: '45px' },
                      '& input': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>End At</Label>
                <TextField
                  value={scheduleData.endAt}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', sm: '45px' },
                      '& input': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    },
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Select Supplier</Label>
                <FormControl fullWidth size="small">
                  <Select
                    value={scheduleData.selectSupplier}
                    readOnly
                    sx={{
                      height: { xs: '36px', sm: '45px' },
                      '& .MuiSelect-select': {
                        padding: { xs: '8px 14px', sm: '10px 14px' },
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                  >
                    <MenuItem value={scheduleData.selectSupplier}>{scheduleData.selectSupplier}</MenuItem>
                  </Select>
                </FormControl>
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
                {associationData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.assetName}</TableCell>
                    <TableCell>{item.assetCode}</TableCell>
                    <TableCell>{item.modelNumber}</TableCell>
                    <TableCell>{item.purchaseDate}</TableCell>
                    <TableCell>{item.purchaseCost}</TableCell>
                    <TableCell>{item.createdOn}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                {emailTriggerRules.length === 0 && (
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
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Kwah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assetMappingData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.assetName}</TableCell>
                    <TableCell>{item.kwah}</TableCell>
                  </TableRow>
                ))}
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
          <Button 
            onClick={() => navigate(`/maintenance/schedule/edit/${id}`)}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-8"
          >
            Edit Schedule
          </Button>
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
