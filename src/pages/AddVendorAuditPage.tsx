
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';

const muiFieldStyles = {
  width: '100%',
  marginBottom: '16px',
  '& .MuiOutlinedInput-root': {
    height: '56px',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#E5E7EB'
    },
    '&:hover fieldset': {
      borderColor: '#D1D5DB'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3B82F6'
    }
  },
  '& .MuiInputLabel-root': {
    color: '#6B7280',
    fontSize: '16px',
    '&.Mui-focused': {
      color: '#3B82F6'
    }
  },
  '& .MuiOutlinedInput-input': {
    color: '#111827',
    fontSize: '14px',
    padding: '16px 14px'
  }
};

export const AddVendorAuditPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    asset: '',
    assignTo: '',
    scanType: '',
    planDuration: '',
    priority: '',
    emailTriggerRule: '',
    supervisors: '',
    category: '',
    lockOverdueTask: '',
    frequency: '',
    startFrom: '',
    endAt: '',
    supplier: '',
    auditName: '',
    description: '',
    location: '',
    department: '',
    auditType: '',
    checklist: '',
    duration: '',
    reminderSettings: '',
    escalationMatrix: '',
    costCenter: '',
    budgetAllocation: '',
    complianceStandard: '',
    riskLevel: '',
    documentRequired: '',
    approvalRequired: '',
    notificationSettings: '',
    reportingFrequency: ''
  });

  const handleInputChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add your submission logic here
    navigate('/maintenance/audit/vendor/scheduled');
  };

  const handleBack = () => {
    navigate('/maintenance/audit/vendor/scheduled');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Add Vendor Audit</h1>
          </div>
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Audit
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Audit Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Asset</InputLabel>
                  <Select
                    value={formData.asset}
                    onChange={handleInputChange('asset')}
                    label="Asset"
                  >
                    <MenuItem value="">Select Asset</MenuItem>
                    <MenuItem value="asset1">Asset 1</MenuItem>
                    <MenuItem value="asset2">Asset 2</MenuItem>
                    <MenuItem value="asset3">Asset 3</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Assign To</InputLabel>
                  <Select
                    value={formData.assignTo}
                    onChange={handleInputChange('assignTo')}
                    label="Assign To"
                  >
                    <MenuItem value="">Select Assign To</MenuItem>
                    <MenuItem value="user1">User 1</MenuItem>
                    <MenuItem value="user2">User 2</MenuItem>
                    <MenuItem value="user3">User 3</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Scan Type</InputLabel>
                  <Select
                    value={formData.scanType}
                    onChange={handleInputChange('scanType')}
                    label="Scan Type"
                  >
                    <MenuItem value="">Select Scan Type</MenuItem>
                    <MenuItem value="qr">QR Code</MenuItem>
                    <MenuItem value="barcode">Barcode</MenuItem>
                    <MenuItem value="manual">Manual</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Plan Duration</InputLabel>
                  <Select
                    value={formData.planDuration}
                    onChange={handleInputChange('planDuration')}
                    label="Plan Duration"
                  >
                    <MenuItem value="">Select Plan Duration</MenuItem>
                    <MenuItem value="1week">1 Week</MenuItem>
                    <MenuItem value="2weeks">2 Weeks</MenuItem>
                    <MenuItem value="1month">1 Month</MenuItem>
                    <MenuItem value="3months">3 Months</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={handleInputChange('priority')}
                    label="Priority"
                  >
                    <MenuItem value="">Select Priority</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Email Trigger Rule</InputLabel>
                  <Select
                    value={formData.emailTriggerRule}
                    onChange={handleInputChange('emailTriggerRule')}
                    label="Email Trigger Rule"
                  >
                    <MenuItem value="">Select Email Trigger Rule</MenuItem>
                    <MenuItem value="immediate">Immediate</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="onCompletion">On Completion</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Third Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Supervisors</InputLabel>
                  <Select
                    value={formData.supervisors}
                    onChange={handleInputChange('supervisors')}
                    label="Supervisors"
                  >
                    <MenuItem value="">Select Supervisors</MenuItem>
                    <MenuItem value="supervisor1">Supervisor 1</MenuItem>
                    <MenuItem value="supervisor2">Supervisor 2</MenuItem>
                    <MenuItem value="supervisor3">Supervisor 3</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={handleInputChange('category')}
                    label="Category"
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    <MenuItem value="safety">Safety</MenuItem>
                    <MenuItem value="quality">Quality</MenuItem>
                    <MenuItem value="compliance">Compliance</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Lock Overdue Task</InputLabel>
                  <Select
                    value={formData.lockOverdueTask}
                    onChange={handleInputChange('lockOverdueTask')}
                    label="Lock Overdue Task"
                  >
                    <MenuItem value="">Select Lock Status</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Fourth Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={formData.frequency}
                    onChange={handleInputChange('frequency')}
                    label="Frequency"
                  >
                    <MenuItem value="">Select Frequency</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="annually">Annually</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Start From"
                  type="date"
                  value={formData.startFrom}
                  onChange={handleInputChange('startFrom')}
                  sx={muiFieldStyles}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  label="End At"
                  type="date"
                  value={formData.endAt}
                  onChange={handleInputChange('endAt')}
                  sx={muiFieldStyles}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>

              {/* Fifth Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Select Supplier</InputLabel>
                  <Select
                    value={formData.supplier}
                    onChange={handleInputChange('supplier')}
                    label="Select Supplier"
                  >
                    <MenuItem value="">Select Supplier</MenuItem>
                    <MenuItem value="supplier1">Supplier 1</MenuItem>
                    <MenuItem value="supplier2">Supplier 2</MenuItem>
                    <MenuItem value="supplier3">Supplier 3</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Audit Name"
                  value={formData.auditName}
                  onChange={handleInputChange('auditName')}
                  sx={muiFieldStyles}
                />

                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={formData.location}
                    onChange={handleInputChange('location')}
                    label="Location"
                  >
                    <MenuItem value="">Select Location</MenuItem>
                    <MenuItem value="building1">Building 1</MenuItem>
                    <MenuItem value="building2">Building 2</MenuItem>
                    <MenuItem value="warehouse">Warehouse</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Sixth Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formData.department}
                    onChange={handleInputChange('department')}
                    label="Department"
                  >
                    <MenuItem value="">Select Department</MenuItem>
                    <MenuItem value="facilities">Facilities</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="security">Security</MenuItem>
                    <MenuItem value="operations">Operations</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Audit Type</InputLabel>
                  <Select
                    value={formData.auditType}
                    onChange={handleInputChange('auditType')}
                    label="Audit Type"
                  >
                    <MenuItem value="">Select Audit Type</MenuItem>
                    <MenuItem value="internal">Internal</MenuItem>
                    <MenuItem value="external">External</MenuItem>
                    <MenuItem value="compliance">Compliance</MenuItem>
                    <MenuItem value="financial">Financial</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Checklist</InputLabel>
                  <Select
                    value={formData.checklist}
                    onChange={handleInputChange('checklist')}
                    label="Checklist"
                  >
                    <MenuItem value="">Select Checklist</MenuItem>
                    <MenuItem value="safety_checklist">Safety Checklist</MenuItem>
                    <MenuItem value="quality_checklist">Quality Checklist</MenuItem>
                    <MenuItem value="maintenance_checklist">Maintenance Checklist</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Seventh Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Risk Level</InputLabel>
                  <Select
                    value={formData.riskLevel}
                    onChange={handleInputChange('riskLevel')}
                    label="Risk Level"
                  >
                    <MenuItem value="">Select Risk Level</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Compliance Standard</InputLabel>
                  <Select
                    value={formData.complianceStandard}
                    onChange={handleInputChange('complianceStandard')}
                    label="Compliance Standard"
                  >
                    <MenuItem value="">Select Compliance Standard</MenuItem>
                    <MenuItem value="iso9001">ISO 9001</MenuItem>
                    <MenuItem value="iso14001">ISO 14001</MenuItem>
                    <MenuItem value="ohsas18001">OHSAS 18001</MenuItem>
                    <MenuItem value="sox">SOX</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Document Required</InputLabel>
                  <Select
                    value={formData.documentRequired}
                    onChange={handleInputChange('documentRequired')}
                    label="Document Required"
                  >
                    <MenuItem value="">Select Document Required</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Eighth Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Approval Required</InputLabel>
                  <Select
                    value={formData.approvalRequired}
                    onChange={handleInputChange('approvalRequired')}
                    label="Approval Required"
                  >
                    <MenuItem value="">Select Approval Required</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={muiFieldStyles}>
                  <InputLabel>Reporting Frequency</InputLabel>
                  <Select
                    value={formData.reportingFrequency}
                    onChange={handleInputChange('reportingFrequency')}
                    label="Reporting Frequency"
                  >
                    <MenuItem value="">Select Reporting Frequency</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Cost Center"
                  value={formData.costCenter}
                  onChange={handleInputChange('costCenter')}
                  sx={muiFieldStyles}
                />
              </div>

              {/* Description Field */}
              <div className="grid grid-cols-1 gap-6">
                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  sx={{
                    ...muiFieldStyles,
                    '& .MuiOutlinedInput-root': {
                      ...muiFieldStyles['& .MuiOutlinedInput-root'],
                      height: 'auto'
                    }
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
