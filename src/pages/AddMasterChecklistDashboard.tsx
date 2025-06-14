
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus } from 'lucide-react';

interface TaskSection {
  id: string;
  group: string;
  subGroup: string;
  task: string;
  inputType: string;
  mandatory: boolean;
  reading: boolean;
  helpText: boolean;
}

export const AddMasterChecklistDashboard = () => {
  const [createTicket, setCreateTicket] = useState(false);
  const [weightage, setWeightage] = useState(false);
  const [type, setType] = useState('PPM');
  const [scheduleFor, setScheduleFor] = useState('Asset');
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [assetType, setAssetType] = useState('');
  
  const [taskSections, setTaskSections] = useState<TaskSection[]>([
    {
      id: '1',
      group: '',
      subGroup: '',
      task: '',
      inputType: '',
      mandatory: false,
      reading: false,
      helpText: false
    }
  ]);

  const handleAddSection = () => {
    const newSection: TaskSection = {
      id: Date.now().toString(),
      group: '',
      subGroup: '',
      task: '',
      inputType: '',
      mandatory: false,
      reading: false,
      helpText: false
    };
    setTaskSections([...taskSections, newSection]);
  };

  const handleAddQuestion = () => {
    // Add question functionality
    console.log('Add question clicked');
  };

  const updateTaskSection = (id: string, field: keyof TaskSection, value: any) => {
    setTaskSections(taskSections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const handleSubmit = () => {
    const formData = {
      createTicket,
      weightage,
      type,
      scheduleFor,
      activityName,
      description,
      assetType,
      taskSections
    };
    console.log('Form submitted:', formData);
  };

  return (
    <SetupLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Add Master Checklist</h1>
        </div>

        <div className="space-y-6">
          {/* Top checkboxes */}
          <div className="flex gap-8">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="createTicket"
                checked={createTicket}
                onCheckedChange={setCreateTicket}
              />
              <Label htmlFor="createTicket">Create Ticket</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="weightage"
                checked={weightage}
                onCheckedChange={setWeightage}
              />
              <Label htmlFor="weightage">Weightage</Label>
            </div>
          </div>

          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                Basic Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Type Radio Group */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Type</Label>
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

              {/* Schedule For Radio Group */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Schedule For</Label>
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

              {/* Activity Name */}
              <div className="space-y-2">
                <Label htmlFor="activityName" className="text-sm font-medium">
                  Activity Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="activityName"
                  placeholder="Enter Activity Name"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Asset Type */}
              <div className="space-y-2">
                <Label htmlFor="assetType" className="text-sm font-medium">Asset Type</Label>
                <Select value={assetType} onValueChange={setAssetType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Asset Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="fire-safety">Fire Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Task Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  Task
                </CardTitle>
                <Button 
                  onClick={handleAddSection}
                  className="bg-purple-700 hover:bg-purple-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {taskSections.map((section, index) => (
                <div key={section.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Select Group */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Select Group</Label>
                      <Select 
                        value={section.group} 
                        onValueChange={(value) => updateTaskSection(section.id, 'group', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="group1">Group 1</SelectItem>
                          <SelectItem value="group2">Group 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Select Sub Group */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Select Sub Group</Label>
                      <Select 
                        value={section.subGroup} 
                        onValueChange={(value) => updateTaskSection(section.id, 'subGroup', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Sub Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="subgroup1">Sub Group 1</SelectItem>
                          <SelectItem value="subgroup2">Sub Group 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Task */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Task <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Enter Task"
                        value={section.task}
                        onChange={(e) => updateTaskSection(section.id, 'task', e.target.value)}
                      />
                    </div>

                    {/* Input Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Input Type <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={section.inputType} 
                        onValueChange={(value) => updateTaskSection(section.id, 'inputType', value)}
                      >
                        <SelectTrigger>
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

                  {/* Checkboxes */}
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`mandatory-${section.id}`}
                        checked={section.mandatory}
                        onCheckedChange={(checked) => updateTaskSection(section.id, 'mandatory', checked)}
                      />
                      <Label htmlFor={`mandatory-${section.id}`}>Mandatory</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`reading-${section.id}`}
                        checked={section.reading}
                        onCheckedChange={(checked) => updateTaskSection(section.id, 'reading', checked)}
                      />
                      <Label htmlFor={`reading-${section.id}`}>Reading</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`helpText-${section.id}`}
                        checked={section.helpText}
                        onCheckedChange={(checked) => updateTaskSection(section.id, 'helpText', checked)}
                      />
                      <Label htmlFor={`helpText-${section.id}`}>Help Text</Label>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Question Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddQuestion}
                  className="bg-purple-700 hover:bg-purple-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
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
