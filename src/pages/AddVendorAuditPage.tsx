
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
import { Plus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddVendorAuditPage = () => {
  const navigate = useNavigate();
  const [createNew, setCreateNew] = useState(false);
  const [createTask, setCreateTask] = useState(false);
  const [weightage, setWeightage] = useState(false);
  const [scheduleFor, setScheduleFor] = useState('asset');
  const [checklistType, setChecklistType] = useState('individual');
  const [taskSections, setTaskSections] = useState([]);

  const handleAddSection = () => {
    setTaskSections([...taskSections, { id: Date.now() }]);
  };

  const handleAddQuestion = () => {
    // Add question functionality
  };

  const handleSubmit = () => {
    console.log('Form submitted');
  };

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
          <span>Add Schedule</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">ADD VENDOR AUDIT SCHEDULE</h1>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="create-new"
            checked={createNew}
            onCheckedChange={setCreateNew}
          />
          <Label htmlFor="create-new">Create New</Label>
        </div>
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
              value={scheduleFor} 
              onValueChange={setScheduleFor}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asset" id="asset" />
                <Label htmlFor="asset">Asset</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="service" id="service" />
                <Label htmlFor="service">Service</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vendor" id="vendor" />
                <Label htmlFor="vendor">Vendor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="training" id="training" />
                <Label htmlFor="training">Training</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="activity-name">Activity Name*</Label>
            <Input 
              id="activity-name" 
              placeholder="Enter Activity Name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Enter Description"
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="allow-observations" />
            <Label htmlFor="allow-observations">Allow Observations</Label>
          </div>
        </CardContent>
      </Card>

      {/* Task Section */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs">T</div>
            Task
          </CardTitle>
          <Button
            onClick={handleAddSection}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:opacity-90"
          >
            + Add Section
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Group</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group1">Group 1</SelectItem>
                  <SelectItem value="group2">Group 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>SubGroup</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Sub Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subgroup1">SubGroup 1</SelectItem>
                  <SelectItem value="subgroup2">SubGroup 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Task</Label>
              <Input placeholder="Enter Task" />
            </div>
            <div>
              <Label>Input Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Input Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="radio">Radio Button</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4 pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="mandatory" />
                <Label htmlFor="mandatory">Mandatory</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="reading" />
                <Label htmlFor="reading">Reading</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="help-text" />
                <Label htmlFor="help-text">Help Text</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleAddQuestion}
              variant="outline"
              className="border-gray-300"
            >
              + Add Question
            </Button>
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
              value={checklistType} 
              onValueChange={setChecklistType}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual">Individual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asset-group" id="asset-group" />
                <Label htmlFor="asset-group">Asset Group</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Asset</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asset1">Asset 1</SelectItem>
                  <SelectItem value="asset2">Asset 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assign To</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Assign To" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">User 1</SelectItem>
                  <SelectItem value="user2">User 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Scan Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Scan Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qr">QR Code</SelectItem>
                  <SelectItem value="barcode">Barcode</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Plan Duration</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Plan Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Email Trigger Rule</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Email Trigger Rule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Supervisors</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Supervisors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supervisor1">Supervisor 1</SelectItem>
                  <SelectItem value="supervisor2">Supervisor 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category1">Category 1</SelectItem>
                  <SelectItem value="category2">Category 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Lock Overdue Task</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Lock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Frequency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Start From</Label>
              <Input type="date" placeholder="Select Start Date" />
            </div>
            <div>
              <Label>End At</Label>
              <Input type="date" placeholder="Select End Date" />
            </div>
          </div>

          <div>
            <Label>Select Supplier</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supplier1">Supplier 1</SelectItem>
                <SelectItem value="supplier2">Supplier 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90 px-8"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AddVendorAuditPage;
