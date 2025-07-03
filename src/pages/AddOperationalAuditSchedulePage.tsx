
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export const AddOperationalAuditSchedulePage = () => {
  const navigate = useNavigate();
  const [scheduleFor, setScheduleFor] = useState("Asset");
  const [activityName, setActivityName] = useState("");
  const [description, setDescription] = useState("");
  const [checklistType, setChecklistType] = useState("Individual");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [scanType, setScanType] = useState("");
  const [planDuration, setPlanDuration] = useState("");
  const [priority, setPriority] = useState("");
  const [emailTriggerRule, setEmailTriggerRule] = useState("");
  const [supervisors, setSupervisors] = useState("");
  const [category, setCategory] = useState("");
  const [lockOverdueTask, setLockOverdueTask] = useState("");
  const [frequency, setFrequency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [supplier, setSupplier] = useState("");

  const [taskSections, setTaskSections] = useState([
    {
      id: 1,
      group: "",
      subGroup: "",
      task: "",
      inputType: "",
      mandatory: false,
      reading: false,
      helpText: false
    }
  ]);

  const addTaskSection = () => {
    const newSection = {
      id: taskSections.length + 1,
      group: "",
      subGroup: "",
      task: "",
      inputType: "",
      mandatory: false,
      reading: false,
      helpText: false
    };
    setTaskSections([...taskSections, newSection]);
  };

  const removeTaskSection = (id: number) => {
    if (taskSections.length > 1) {
      setTaskSections(taskSections.filter(section => section.id !== id));
    }
  };

  const updateTaskSection = (id: number, field: string, value: any) => {
    setTaskSections(taskSections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const handleSubmit = () => {
    console.log('Submitting schedule with data:', {
      scheduleFor,
      activityName,
      description,
      checklistType,
      selectedAsset,
      assignTo,
      scanType,
      planDuration,
      priority,
      emailTriggerRule,
      supervisors,
      category,
      lockOverdueTask,
      frequency,
      startDate,
      endDate,
      supplier,
      taskSections
    });
    
    // Navigate back to the schedule list
    navigate('/maintenance/audit/operational/scheduled');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">Schedule &gt; Add Schedule</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ADD SCHEDULE</h1>
      </div>

      <div className="space-y-6">
        {/* Basic Info Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C72030]">
              <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white font-bold">
                ⚙
              </div>
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Schedule For</Label>
              <RadioGroup value={scheduleFor} onValueChange={setScheduleFor} className="flex gap-6 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Asset" id="asset" />
                  <Label htmlFor="asset">Asset</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Service" id="service" />
                  <Label htmlFor="service">Service</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Vendor" id="vendor" />
                  <Label htmlFor="vendor">Vendor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Training" id="training" />
                  <Label htmlFor="training">Training</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="activityName" className="text-sm font-medium">Activity Name*</Label>
              <Input
                id="activityName"
                placeholder="Enter Activity Name"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Task Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C72030]">
              <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white font-bold">
                ⚙
              </div>
              Task
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium">Group</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="quality">Quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium">SubGroup</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Sub Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                    <SelectItem value="civil">Civil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={addTaskSection}
                  style={{ backgroundColor: '#C72030' }}
                  className="text-white"
                >
                  + Add Section
                </Button>
              </div>
            </div>

            {taskSections.map((section, index) => (
              <div key={section.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Task Section {index + 1}</h4>
                  {taskSections.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTaskSection(section.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm">Task</Label>
                    <Input
                      placeholder="Enter Task"
                      value={section.task}
                      onChange={(e) => updateTaskSection(section.id, 'task', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Select Input Type</Label>
                    <Select onValueChange={(value) => updateTaskSection(section.id, 'inputType', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Input Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="dropdown">Dropdown</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`mandatory-${section.id}`}
                      checked={section.mandatory}
                      onCheckedChange={(checked) => updateTaskSection(section.id, 'mandatory', checked)}
                    />
                    <Label htmlFor={`mandatory-${section.id}`} className="text-sm">Mandatory</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`reading-${section.id}`}
                      checked={section.reading}
                      onCheckedChange={(checked) => updateTaskSection(section.id, 'reading', checked)}
                    />
                    <Label htmlFor={`reading-${section.id}`} className="text-sm">Reading</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`helpText-${section.id}`}
                      checked={section.helpText}
                      onCheckedChange={(checked) => updateTaskSection(section.id, 'helpText', checked)}
                    />
                    <Label htmlFor={`helpText-${section.id}`} className="text-sm">Help Text</Label>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Schedule Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C72030]">
              <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white font-bold">
                ⚙
              </div>
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Checklist Type</Label>
              <RadioGroup value={checklistType} onValueChange={setChecklistType} className="flex gap-6 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Individual" id="individual" />
                  <Label htmlFor="individual">Individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Asset Group" id="assetGroup" />
                  <Label htmlFor="assetGroup">Asset Group</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Asset</Label>
                <Select onValueChange={setSelectedAsset}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asset1">Asset 1</SelectItem>
                    <SelectItem value="asset2">Asset 2</SelectItem>
                    <SelectItem value="asset3">Asset 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Assign To</Label>
                <Select onValueChange={setAssignTo}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Assign To" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">User 1</SelectItem>
                    <SelectItem value="user2">User 2</SelectItem>
                    <SelectItem value="user3">User 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Scan Type</Label>
                <Select onValueChange={setScanType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Scan Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qr">QR Code</SelectItem>
                    <SelectItem value="barcode">Barcode</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Plan Duration</Label>
                <Select onValueChange={setPlanDuration}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Plan Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30min">30 Minutes</SelectItem>
                    <SelectItem value="1hr">1 Hour</SelectItem>
                    <SelectItem value="2hr">2 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Priority</Label>
                <Select onValueChange={setPriority}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Email Trigger Rule</Label>
                <Select onValueChange={setEmailTriggerRule}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Email Trigger Rule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Supervisors</Label>
                <Select onValueChange={setSupervisors}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Supervisors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supervisor1">Supervisor 1</SelectItem>
                    <SelectItem value="supervisor2">Supervisor 2</SelectItem>
                    <SelectItem value="supervisor3">Supervisor 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Select onValueChange={setCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="non-technical">Non Technical</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Lock Overdue Task</Label>
                <Select onValueChange={setLockOverdueTask}>
                  <SelectTrigger className="mt-1">
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
                <Label className="text-sm font-medium">Frequency</Label>
                <Select onValueChange={setFrequency}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium">Start From</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-sm font-medium">End At</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Select Supplier</Label>
              <Select onValueChange={setSupplier}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier1">Supplier 1</SelectItem>
                  <SelectItem value="supplier2">Supplier 2</SelectItem>
                  <SelectItem value="supplier3">Supplier 3</SelectItem>
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
            className="text-white px-8 py-2"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
