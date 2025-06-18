import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useParams, useNavigate } from 'react-router-dom';
import { SetApprovalDialog } from '@/components/SetApprovalDialog';

export const ViewSchedulePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSetApproval, setShowSetApproval] = useState(false);

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

  const handleViewPerformance = () => {
    navigate(`/maintenance/schedule/performance/${id}`);
  };

  const handleSetApproval = () => {
    setShowSetApproval(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">View Schedule</h1>
        <div className="flex gap-3">
          <Button style={{ backgroundColor: '#C72030' }} className="text-white">
            Create Ticket
          </Button>
          <Button variant="outline" className="border-[#C72030] text-[#C72030]">
            Weightage
          </Button>
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
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <span className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" checked={scheduleData.type === 'PPM'} readOnly />
                    <Label>PPM</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" checked={scheduleData.type === 'AMC'} readOnly />
                    <Label>AMC</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" checked={scheduleData.type === 'Preparedness'} readOnly />
                    <Label>Preparedness</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" checked={scheduleData.type === 'Hoto'} readOnly />
                    <Label>Hoto</Label>
                  </div>
                </div>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" checked={scheduleData.type === 'Routine'} readOnly />
                    <Label>Routine</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" checked={scheduleData.type === 'Audit'} readOnly />
                    <Label>Audit</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Schedule for</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" checked={scheduleData.scheduleFor === 'Asset'} readOnly />
                    <Label>Asset</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" checked={scheduleData.scheduleFor === 'Service'} readOnly />
                    <Label>Service</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" checked={scheduleData.scheduleFor === 'Vendor'} readOnly />
                    <Label>Vendor</Label>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Activity Name</Label>
              <Input value={scheduleData.activityName} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={scheduleData.description} readOnly className="min-h-[100px]" />
            </div>
          </CardContent>
        </Card>

        {/* Task */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <span className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Task
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Checklist Group</Label>
                <Input value="Select Group" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Checklist Group</Label>
                <Input value="Select Sub Group" readOnly />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Task</Label>
                <Input value="Kwah" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Input Type</Label>
                <Input value="Numeric" readOnly />
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
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <span className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Checklist Type</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input type="radio" checked={scheduleData.checklistType === 'Individual'} readOnly />
                  <Label>Individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" checked={scheduleData.checklistType === 'Asset Group'} readOnly />
                  <Label>Asset Group</Label>
                </div>
              </div>
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
                <Input value={scheduleData.assignTo} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Scan Type</Label>
                <Input value={scheduleData.scanType} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Plan Duration Type</Label>
                <Input value={scheduleData.planDurationType} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Plan value</Label>
                <Input value={scheduleData.planValue} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Email Trigger Rule</Label>
                <Input value={scheduleData.emailTriggerRule} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Supervisors</Label>
                <Input value={scheduleData.supervisors} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Input value={scheduleData.priority} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Submission Type</Label>
                <Input value={scheduleData.submissionType} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Submission Time Value</Label>
                <Input value={scheduleData.submissionTimeValue} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={scheduleData.category} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Grace Time Value</Label>
                <Input value={scheduleData.graceTimeValue} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Lock Overdue Task</Label>
                <Input value={scheduleData.lockOverdueTask} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Grace Time</Label>
                <Input value={scheduleData.graceTime} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Input value={scheduleData.frequency} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input value={scheduleData.startTime} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>End At</Label>
                <Input value={scheduleData.endAt} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Select Supplier</Label>
                <Input value={scheduleData.selectSupplier} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Association */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <span className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
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
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <span className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
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
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <span className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
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

      <SetApprovalDialog
        open={showSetApproval}
        onOpenChange={setShowSetApproval}
      />
    </div>
  );
};
