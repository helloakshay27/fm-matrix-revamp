import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { MasterLayout } from '@/components/MasterLayout';

interface Task {
  id: string;
  question: string;
  inputType: string;
  mandatory: boolean;
  reading: boolean;
  helpText: string;
}

interface TaskSection {
  id: string;
  name: string;
  tasks: Task[];
  isExpanded: boolean;
}

export const ChecklistMasterPage = () => {
  const [formData, setFormData] = useState({
    type: 'PPM',
    scheduleFor: 'Asset',
    activityName: '',
    description: '',
    assetType: ''
  });

  const [sections, setSections] = useState<TaskSection[]>([
    {
      id: '1',
      name: 'General Inspection',
      isExpanded: true,
      tasks: [
        {
          id: '1',
          question: 'Check overall condition',
          inputType: 'text',
          mandatory: true,
          reading: false,
          helpText: 'Inspect for any visible damage or wear'
        }
      ]
    }
  ]);

  const addSection = () => {
    const newSection: TaskSection = {
      id: Date.now().toString(),
      name: 'New Section',
      isExpanded: true,
      tasks: []
    };
    setSections([...sections, newSection]);
  };

  const addTask = (sectionId: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      question: '',
      inputType: 'text',
      mandatory: false,
      reading: false,
      helpText: ''
    };

    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, tasks: [...section.tasks, newTask] }
        : section
    ));
  };

  const removeTask = (sectionId: string, taskId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, tasks: section.tasks.filter(task => task.id !== taskId) }
        : section
    ));
  };

  const updateTask = (sectionId: string, taskId: string, field: keyof Task, value: any) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            tasks: section.tasks.map(task => 
              task.id === taskId 
                ? { ...task, [field]: value }
                : task
            )
          }
        : section
    ));
  };

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  return (
    <MasterLayout>
      <div className="w-full min-h-screen bg-[#fafafa] p-6">
        <div className="w-full max-w-none space-y-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">CHECKLIST MASTER</h1>

          {/* Basic Info Section */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Type*</Label>
                <RadioGroup 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({...formData, type: value})}
                  className="flex gap-6"
                >
                  {['PPM', 'AMC', 'Preparedness', 'Hoto', 'Routine'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type}>{type}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Schedule For Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Schedule For*</Label>
                <RadioGroup 
                  value={formData.scheduleFor} 
                  onValueChange={(value) => setFormData({...formData, scheduleFor: value})}
                  className="flex gap-6"
                >
                  {['Asset', 'Service', 'Vendor'].map((schedule) => (
                    <div key={schedule} className="flex items-center space-x-2">
                      <RadioGroupItem value={schedule} id={schedule} />
                      <Label htmlFor={schedule}>{schedule}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Activity Name and Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="activityName">Activity Name*</Label>
                  <Input
                    id="activityName"
                    value={formData.activityName}
                    onChange={(e) => setFormData({...formData, activityName: e.target.value})}
                    placeholder="Enter activity name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assetType">Asset Type*</Label>
                  <Select value={formData.assetType} onValueChange={(value) => setFormData({...formData, assetType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="mechanical">Mechanical</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tasks Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Task Sections</CardTitle>
              <Button onClick={addSection} className="bg-[#C72030] hover:bg-[#C72030]/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.map((section) => (
                <Card key={section.id} className="border-l-4 border-l-[#C72030]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Input
                        value={section.name}
                        onChange={(e) => {
                          setSections(sections.map(s => 
                            s.id === section.id ? { ...s, name: e.target.value } : s
                          ));
                        }}
                        className="font-medium text-lg border-none p-0 h-auto focus-visible:ring-0"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addTask(section.id)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSection(section.id)}
                        >
                          {section.isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {section.isExpanded && (
                    <CardContent className="space-y-4">
                      {section.tasks.map((task) => (
                        <div key={task.id} className="border rounded-lg p-4 space-y-4 bg-white">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-4">
                              <div className="space-y-2">
                                <Label>Question/Task*</Label>
                                <Input
                                  value={task.question}
                                  onChange={(e) => updateTask(section.id, task.id, 'question', e.target.value)}
                                  placeholder="Enter question or task description"
                                />
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Input Type</Label>
                                  <Select value={task.inputType} onValueChange={(value) => updateTask(section.id, task.id, 'inputType', value)}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text">Text</SelectItem>
                                      <SelectItem value="number">Number</SelectItem>
                                      <SelectItem value="date">Date</SelectItem>
                                      <SelectItem value="checkbox">Checkbox</SelectItem>
                                      <SelectItem value="dropdown">Dropdown</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Help Text</Label>
                                  <Input
                                    value={task.helpText}
                                    onChange={(e) => updateTask(section.id, task.id, 'helpText', e.target.value)}
                                    placeholder="Enter help text"
                                  />
                                </div>
                              </div>
                              
                              <div className="flex gap-6">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`mandatory-${task.id}`}
                                    checked={task.mandatory}
                                    onCheckedChange={(checked) => updateTask(section.id, task.id, 'mandatory', checked)}
                                  />
                                  <Label htmlFor={`mandatory-${task.id}`}>Mandatory</Label>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`reading-${task.id}`}
                                    checked={task.reading}
                                    onCheckedChange={(checked) => updateTask(section.id, task.id, 'reading', checked)}
                                  />
                                  <Label htmlFor={`reading-${task.id}`}>Reading</Label>
                                </div>
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTask(section.id, task.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {section.tasks.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No tasks added yet. Click "+" to add a task.
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button className="bg-[#C72030] hover:bg-[#C72030]/90 px-8">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};