import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';

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
  const { setCurrentSection } = useLayout();

  useEffect(() => {
    setCurrentSection('Master');
  }, [setCurrentSection]);
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
    <div className="w-full min-h-screen bg-[#fafafa] p-6">
      <div className="w-full max-w-none space-y-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">CHECKLIST MASTER</h1>

        {/* Basic Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Type*</Label>
                <RadioGroup 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({...formData, type: value})}
                  className="flex flex-row space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PPM" id="ppm" />
                    <Label htmlFor="ppm">PPM</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Breakdown" id="breakdown" />
                    <Label htmlFor="breakdown">Breakdown</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Schedule For*</Label>
                <Select value={formData.scheduleFor} onValueChange={(value) => setFormData({...formData, scheduleFor: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asset">Asset</SelectItem>
                    <SelectItem value="Location">Location</SelectItem>
                    <SelectItem value="Area">Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="HVAC">HVAC</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
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
                className="min-h-20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Task Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader 
                className="cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{section.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addTask(section.id);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Task
                    </Button>
                    {section.isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {section.isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {section.tasks.map((task) => (
                      <div key={task.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <Label>Question*</Label>
                              <Input
                                value={task.question}
                                onChange={(e) => updateTask(section.id, task.id, 'question', e.target.value)}
                                placeholder="Enter question"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Input Type*</Label>
                                <Select 
                                  value={task.inputType} 
                                  onValueChange={(value) => updateTask(section.id, task.id, 'inputType', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select input type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Text">Text</SelectItem>
                                    <SelectItem value="Number">Number</SelectItem>
                                    <SelectItem value="Dropdown">Dropdown</SelectItem>
                                    <SelectItem value="Checkbox">Checkbox</SelectItem>
                                    <SelectItem value="Radio">Radio</SelectItem>
                                    <SelectItem value="Date">Date</SelectItem>
                                    <SelectItem value="File">File Upload</SelectItem>
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

                            <div className="flex items-center gap-6">
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
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTask(section.id, task.id)}
                            className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Add Section Button */}
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={addSection}
            className="w-48"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" className="bg-[#C72030] hover:bg-[#C72030]/90">
            Save Checklist
          </Button>
        </div>
      </div>
    </div>
  );
};