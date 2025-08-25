
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export const AddMasterChecklistDashboard = () => {
  const [type, setType] = useState('PPM');
  const [scheduleFor, setScheduleFor] = useState('Asset');
  const [tasks, setTasks] = useState([{
    group: '',
    subGroup: '',
    task: '',
    inputType: '',
    mandatory: false,
    reading: false,
    helpText: false
  }]);

  const addNewSection = () => {
    setTasks([...tasks, {
      group: '',
      subGroup: '',
      task: '',
      inputType: '',
      mandatory: false,
      reading: false,
      helpText: false
    }]);
  };

  const addNewQuestion = () => {
    const newTask = {
      group: '',
      subGroup: '',
      task: '',
      inputType: '',
      mandatory: false,
      reading: false,
      helpText: false
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (index: number, field: string, value: any) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  const handleSubmit = () => {
    console.log('Form submitted');
  };

  return (
    <SetupLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ADD MASTER CHECKLIST</h1>

        <div className="space-y-6">
          {/* Create Ticket and Weightage checkboxes */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox id="createTicket" />
              <Label htmlFor="createTicket">Create Ticket</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="weightage" />
              <Label htmlFor="weightage">Weightage</Label>
            </div>
          </div>

          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                Basic Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Type Section */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Type</Label>
                  <RadioGroup value={type} onValueChange={setType} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PPM" id="ppm" />
                      <Label htmlFor="ppm">PPM</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="AMC" id="amc" />
                      <Label htmlFor="amc">AMC</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Preparedness" id="preparedness" />
                      <Label htmlFor="preparedness">Preparedness</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Hoto" id="hoto" />
                      <Label htmlFor="hoto">Hoto</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Routine" id="routine" />
                      <Label htmlFor="routine">Routine</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Schedule For Section */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Schedule Fonjnjr</Label>
                  <RadioGroup value={scheduleFor} onValueChange={setScheduleFor} className="flex gap-6">
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
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="activityName" className="text-sm font-medium">Activity Name *</Label>
                  <Input id="activityName" placeholder="Enter Activity Name" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea id="description" placeholder="Enter Description" className="mt-1" rows={4} />
                </div>

                <div>
                  <Label htmlFor="assetType" className="text-sm font-medium">Asset Type</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Asset Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                  Task
                </CardTitle>
                <Button 
                  onClick={addNewSection}
                  className="bg-purple-700 hover:bg-purple-800 text-white text-sm"
                >
                  + Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {tasks.map((task, index) => (
                <div key={index} className="space-y-4 border-b pb-4 last:border-b-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Select Group</Label>
                      <Select value={task.group} onValueChange={(value) => updateTask(index, 'group', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="group1">Group 1</SelectItem>
                          <SelectItem value="group2">Group 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Select Sub Group</Label>
                      <Select value={task.subGroup} onValueChange={(value) => updateTask(index, 'subGroup', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select Sub Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="subgroup1">Sub Group 1</SelectItem>
                          <SelectItem value="subgroup2">Sub Group 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Task *</Label>
                      <Input 
                        placeholder="Enter Task" 
                        className="mt-1"
                        value={task.task}
                        onChange={(e) => updateTask(index, 'task', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Input Type *</Label>
                      <Select value={task.inputType} onValueChange={(value) => updateTask(index, 'inputType', value)}>
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

                  <div className="flex gap-8">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`mandatory-${index}`}
                        checked={task.mandatory}
                        onCheckedChange={(checked) => updateTask(index, 'mandatory', checked)}
                      />
                      <Label htmlFor={`mandatory-${index}`}>Mandatory</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`reading-${index}`}
                        checked={task.reading}
                        onCheckedChange={(checked) => updateTask(index, 'reading', checked)}
                      />
                      <Label htmlFor={`reading-${index}`}>Reading</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`helpText-${index}`}
                        checked={task.helpText}
                        onCheckedChange={(checked) => updateTask(index, 'helpText', checked)}
                      />
                      <Label htmlFor={`helpText-${index}`}>Help Text</Label>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <Button 
                  onClick={addNewQuestion}
                  className="bg-purple-700 hover:bg-purple-800 text-white text-sm"
                >
                  + Add Question
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleSubmit}
              className="bg-purple-700 hover:bg-purple-800 text-white px-8"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </SetupLayout>
  );
};
