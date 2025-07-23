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
import { useMutation } from '@tanstack/react-query';
import { createChecklistMaster, ChecklistCreateRequest } from '@/services/customFormsAPI';
import { toast } from 'sonner';

interface Task {
  id: string;
  question: string;
  inputType: string;
  mandatory: boolean;
  reading: boolean;
  helpText: string;
  values: Array<{
    label: string;
    type: string;
    value: string;
  }>;
  consumption_type: string;
  consumption_unit_type: string;
  weightage: string;
  rating_enabled: boolean;
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
    assetType: '',
    groupId: '55',
    subGroupId: '160'
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
          helpText: 'Inspect for any visible damage or wear',
          values: [],
          consumption_type: '',
          consumption_unit_type: '',
          weightage: '',
          rating_enabled: false
        }
      ]
    }
  ]);

  const createChecklistMutation = useMutation({
    mutationFn: createChecklistMaster,
    onSuccess: (data) => {
      toast.success('Checklist created successfully!');
      console.log('Checklist created:', data);
    },
    onError: (error) => {
      toast.error('Failed to create checklist');
      console.error('Error creating checklist:', error);
    },
  });

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
      helpText: '',
      values: [],
      consumption_type: '',
      consumption_unit_type: '',
      weightage: '',
      rating_enabled: false
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

  const updateTaskValues = (sectionId: string, taskId: string, values: Array<{label: string; type: string; value: string}>) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            tasks: section.tasks.map(task => 
              task.id === taskId 
                ? { ...task, values }
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

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.activityName || !formData.assetType) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate that all tasks have questions
    const hasEmptyQuestions = sections.some(section => 
      section.tasks.some(task => !task.question.trim())
    );

    if (hasEmptyQuestions) {
      toast.error('Please provide questions for all tasks');
      return;
    }

    // Transform form data to API payload format
    const content = sections.flatMap(section => 
      section.tasks.map(task => ({
        label: task.question,
        name: `qnm_${task.id}`,
        className: "form-control",
        group_id: formData.groupId,
        sub_group_id: formData.subGroupId,
        type: task.inputType.toLowerCase().replace(' ', '-'),
        subtype: "",
        required: task.mandatory.toString(),
        is_reading: task.reading.toString(),
        hint: task.helpText,
        values: task.inputType === 'radio-group' || task.inputType === 'dropdown' 
          ? task.values.length > 0 
            ? task.values 
            : [
                { label: "Yes", type: "positive", value: "Yes" },
                { label: "No", type: "negative", value: "No" }
              ]
          : task.values,
        consumption_type: task.consumption_type,
        consumption_unit_type: task.consumption_unit_type,
        weightage: task.weightage,
        rating_enabled: task.rating_enabled.toString()
      }))
    );

    const payload: ChecklistCreateRequest = {
      source: "form",
      schedule_type: formData.type.toLowerCase(),
      sch_type: formData.type.toLowerCase(),
      checklist_type: formData.scheduleFor,
      group_id: formData.groupId,
      sub_group_id: formData.subGroupId,
      tmp_custom_form: {
        ticket_level: "question",
        helpdesk_category_id: "",
        schedule_type: formData.type,
        organization_id: "1",
        form_name: formData.activityName,
        description: formData.description,
        asset_meter_type_id: 1
      },
      content
    };

    createChecklistMutation.mutate(payload);
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

              <div className="space-y-2">
                <Label htmlFor="groupId">Group ID</Label>
                <Input
                  id="groupId"
                  value={formData.groupId}
                  onChange={(e) => setFormData({...formData, groupId: e.target.value})}
                  placeholder="Enter group ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subGroupId">Sub Group ID</Label>
                <Input
                  id="subGroupId"
                  value={formData.subGroupId}
                  onChange={(e) => setFormData({...formData, subGroupId: e.target.value})}
                  placeholder="Enter sub group ID"
                />
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
                                  onValueChange={(value) => {
                                    updateTask(section.id, task.id, 'inputType', value);
                                    // Set default values for radio-group and dropdown
                                    if (value === 'radio-group' || value === 'dropdown') {
                                      updateTaskValues(section.id, task.id, [
                                        { label: "Yes", type: "positive", value: "Yes" },
                                        { label: "No", type: "negative", value: "No" }
                                      ]);
                                    } else {
                                      updateTaskValues(section.id, task.id, []);
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select input type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="dropdown">Dropdown</SelectItem>
                                    <SelectItem value="checkbox">Checkbox</SelectItem>
                                    <SelectItem value="radio-group">Radio</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="file">File Upload</SelectItem>
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

                            {/* Values section for radio-group and dropdown */}
                            {(task.inputType === 'radio-group' || task.inputType === 'dropdown') && (
                              <div className="space-y-2">
                                <Label>Options</Label>
                                <div className="space-y-2">
                                  {task.values.map((value, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <Input
                                        value={value.label}
                                        onChange={(e) => {
                                          const newValues = [...task.values];
                                          newValues[index] = { ...value, label: e.target.value, value: e.target.value };
                                          updateTaskValues(section.id, task.id, newValues);
                                        }}
                                        placeholder="Option label"
                                        className="flex-1"
                                      />
                                      <Select
                                        value={value.type}
                                        onValueChange={(newType) => {
                                          const newValues = [...task.values];
                                          newValues[index] = { ...value, type: newType };
                                          updateTaskValues(section.id, task.id, newValues);
                                        }}
                                      >
                                        <SelectTrigger className="w-32">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="positive">Positive</SelectItem>
                                          <SelectItem value="negative">Negative</SelectItem>
                                          <SelectItem value="neutral">Neutral</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const newValues = task.values.filter((_, i) => i !== index);
                                          updateTaskValues(section.id, task.id, newValues);
                                        }}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newValues = [...task.values, { label: "", type: "neutral", value: "" }];
                                      updateTaskValues(section.id, task.id, newValues);
                                    }}
                                  >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Option
                                  </Button>
                                </div>
                              </div>
                            )}

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

                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`rating-${task.id}`}
                                  checked={task.rating_enabled}
                                  onCheckedChange={(checked) => updateTask(section.id, task.id, 'rating_enabled', checked)}
                                />
                                <Label htmlFor={`rating-${task.id}`}>Rating Enabled</Label>
                              </div>
                            </div>

                            {/* Additional fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Weightage</Label>
                                <Input
                                  value={task.weightage}
                                  onChange={(e) => updateTask(section.id, task.id, 'weightage', e.target.value)}
                                  placeholder="Enter weightage"
                                  type="number"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Consumption Type</Label>
                                <Input
                                  value={task.consumption_type}
                                  onChange={(e) => updateTask(section.id, task.id, 'consumption_type', e.target.value)}
                                  placeholder="Enter consumption type"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Consumption Unit Type</Label>
                                <Input
                                  value={task.consumption_unit_type}
                                  onChange={(e) => updateTask(section.id, task.id, 'consumption_unit_type', e.target.value)}
                                  placeholder="Enter consumption unit type"
                                />
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
          <Button 
            type="button" 
            className="bg-[#C72030] hover:bg-[#C72030]/90"
            onClick={handleSubmit}
            disabled={createChecklistMutation.isPending}
          >
            {createChecklistMutation.isPending ? 'Saving...' : 'Save Checklist'}
          </Button>
        </div>
      </div>
    </div>
  );
};