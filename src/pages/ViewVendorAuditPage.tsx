
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const ViewVendorAuditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [createTask, setCreateTask] = useState(false);
  const [weightage, setWeightage] = useState(false);

  const handleSetApproval = () => {
    console.log('Set approval clicked');
  };

  const handleViewPerformance = () => {
    console.log('View performance clicked');
  };

  const emailTriggerData = [
    {
      ruleName: "Rule 1",
      triggerType: "Daily",
      triggerTo: "admin@example.com",
      role: "Admin",
      periodValue: "1",
      periodType: "Day",
      createdOn: "10/12/2024",
      createdBy: "System"
    }
  ];

  const assetMappingData = [
    {
      assetName: "Engineering Asset 1"
    }
  ];

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Maintenance</span>
          <span className="mx-2">{'>'}</span>
          <span>Audit</span>
          <span className="mx-2">{'>'}</span>
          <span>Vendor</span>
          <span className="mx-2">{'>'}</span>
          <span>View Schedule</span>
        </nav>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">VENDOR AUDIT SCHEDULE - {id}</h1>
          <div className="flex gap-4">
            <Button
              onClick={handleSetApproval}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              <Edit className="w-4 h-4 mr-2" />
              Set Approval
            </Button>
            <Button
              onClick={handleViewPerformance}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Performance
            </Button>
          </div>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="create-task"
            checked={createTask}
            onCheckedChange={setCreateTask}
          />
          <Label htmlFor="create-task">Create Task</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="weightage"
            checked={weightage}
            onCheckedChange={setWeightage}
          />
          <Label htmlFor="weightage">Weightage</Label>
        </div>
      </div>

      {/* Basic Info Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs">i</div>
            Basic Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Schedule For</Label>
            <RadioGroup 
              value="vendor"
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asset" id="asset" disabled />
                <Label htmlFor="asset">Asset</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="service" id="service" disabled />
                <Label htmlFor="service">Service</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vendor" id="vendor" disabled />
                <Label htmlFor="vendor">Vendor</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="activity-name">Activity Name</Label>
            <Input 
              id="activity-name" 
              value="Engineering Audit Checklist 2"
              disabled
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value=""
              disabled
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="allow-observations" disabled />
            <Label htmlFor="allow-observations">Allow Observations</Label>
          </div>
        </CardContent>
      </Card>

      {/* Task Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs">T</div>
            Task
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Checklist Group</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Daily Substation Log" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily-log">Daily Substation Log</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Checklist Group</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="E-Block EMT" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="e-block">E-Block EMT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-orange-500 pl-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div>
                  <Label>Task</Label>
                  <Input value="Section 1" disabled />
                </div>
                <div>
                  <Label>Input Type</Label>
                  <Input value="Radio Button" disabled />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox checked disabled />
                    <Label>Mandatory</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox disabled />
                    <Label>Reading</Label>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Label>Selected Enter Value</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroup value="yes" disabled>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes1" />
                        <Label htmlFor="yes1">Yes</Label>
                      </div>
                    </RadioGroup>
                    <Select disabled>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="P" />
                      </SelectTrigger>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroup disabled>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no1" />
                        <Label htmlFor="no1">No</Label>
                      </div>
                    </RadioGroup>
                    <Select disabled>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="N" />
                      </SelectTrigger>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div>
                  <Label>Task</Label>
                  <Input value="Q2" disabled />
                </div>
                <div>
                  <Label>Input Type</Label>
                  <Input value="Radio Button" disabled />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox checked disabled />
                    <Label>Mandatory</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox disabled />
                    <Label>Reading</Label>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Label>Selected Enter Value</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroup value="yes" disabled>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes2" />
                        <Label htmlFor="yes2">Yes</Label>
                      </div>
                    </RadioGroup>
                    <Select disabled>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="P" />
                      </SelectTrigger>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroup disabled>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no2" />
                        <Label htmlFor="no2">No</Label>
                      </div>
                    </RadioGroup>
                    <Select disabled>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="N" />
                      </SelectTrigger>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs">S</div>
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Checklist Type</Label>
            <RadioGroup 
              value="individual"
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" disabled />
                <Label htmlFor="individual">Individual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asset-group" id="asset-group" disabled />
                <Label htmlFor="asset-group">Asset Group</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Assign To</Label>
              <Input placeholder="Select Assign To" disabled />
            </div>
            <div>
              <Label>Scan Type</Label>
              <Input placeholder="Select Scan Type" disabled />
            </div>
            <div>
              <Label>Plan Duration Type</Label>
              <Input placeholder="Select Plan Duration" disabled />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Plan value</Label>
              <Input disabled />
            </div>
            <div>
              <Label>Priority</Label>
              <Input placeholder="Select Priority" disabled />
            </div>
            <div>
              <Label>Email Trigger Rule</Label>
              <Input placeholder="Select Email Trigger Rule" disabled />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Supervisors</Label>
              <Input placeholder="Select Supervisors" disabled />
            </div>
            <div>
              <Label>Category</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
              </Select>
            </div>
            <div>
              <Label>Submission Type</Label>
              <Input placeholder="Select Submission Type" disabled />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Submission Time Value</Label>
              <Input placeholder="Select Time Value" disabled />
            </div>
            <div>
              <Label>Grace Time</Label>
              <Input placeholder="Select Grace Time" disabled />
            </div>
            <div>
              <Label>Grace Time Value</Label>
              <Input disabled />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Lock Overdue Task</Label>
              <Input disabled />
            </div>
            <div>
              <Label>Frequency</Label>
              <Input disabled />
            </div>
            <div>
              <Label>Start Time</Label>
              <Input disabled />
            </div>
          </div>

          <div>
            <Label>End At</Label>
            <Input disabled />
          </div>

          <div>
            <Label>Select Supplier</Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select Supplier" />
              </SelectTrigger>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Association Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs">A</div>
            Association
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Email Trigger Rules Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs">E</div>
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
              {emailTriggerData.map((rule, index) => (
                <TableRow key={index}>
                  <TableCell>{rule.ruleName}</TableCell>
                  <TableCell>{rule.triggerType}</TableCell>
                  <TableCell>{rule.triggerTo}</TableCell>
                  <TableCell>{rule.role}</TableCell>
                  <TableCell>{rule.periodValue}</TableCell>
                  <TableCell>{rule.periodType}</TableCell>
                  <TableCell>{rule.createdOn}</TableCell>
                  <TableCell>{rule.createdBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Asset Mapping List Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs">A</div>
            Asset Mapping List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assetMappingData.map((asset, index) => (
                <TableRow key={index}>
                  <TableCell>{asset.assetName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewVendorAuditPage;
