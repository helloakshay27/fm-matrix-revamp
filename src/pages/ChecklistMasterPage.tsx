import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { useMutation } from '@tanstack/react-query';
import { createChecklistMaster, ChecklistCreateRequest } from '@/services/customFormsAPI';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { fromPairs } from 'lodash';

interface Task {
  id: string;
  question: string;
  inputType: string;
  mandatory: boolean;
  reading: boolean;
  helpText: string;
  helpTextEnabled: boolean;
  helpTextValue: string;
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
  const navigate = useNavigate();

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
          helpTextEnabled: false,
          helpTextValue: '',
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
      // Navigate back to checklist master dashboard
      navigate('/settings/masters/checklist');
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
      helpTextEnabled: false,
      helpTextValue: '',
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

  const updateTask = useCallback((sectionId: string, taskId: string, field: keyof Task, value: any) => {
    console.log('Updating task:', { sectionId, taskId, field, value }); // Debug log
    setSections(prevSections => prevSections.map(section => 
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
  }, []);

  const updateTaskValues = useCallback((sectionId: string, taskId: string, values: Array<{label: string; type: string; value: string}>) => {
    setSections(prevSections => prevSections.map(section => 
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
  }, []);

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  // Helper functions for managing task values
  const addValue = (sectionId: string, taskId: string) => {
    const newValue = { label: "", type: "positive", value: "" };
    updateTaskValues(sectionId, taskId, [...getTaskValues(sectionId, taskId), newValue]);
  };

  const removeValue = (sectionId: string, taskId: string, valueIndex: number) => {
    const currentValues = getTaskValues(sectionId, taskId);
    if (currentValues.length > 1) {
      const newValues = currentValues.filter((_, index) => index !== valueIndex);
      updateTaskValues(sectionId, taskId, newValues);
    }
  };

  const updateValue = (sectionId: string, taskId: string, valueIndex: number, field: 'label' | 'type', value: string) => {
    const currentValues = getTaskValues(sectionId, taskId);
    const newValues = currentValues.map((val, index) => 
      index === valueIndex 
        ? { ...val, [field]: value, value: field === 'label' ? value : val.value }
        : val
    );
    updateTaskValues(sectionId, taskId, newValues);
  };

  const getTaskValues = (sectionId: string, taskId: string) => {
    const section = sections.find(s => s.id === sectionId);
    const task = section?.tasks.find(t => t.id === taskId);
    return task?.values || [];
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
        type: task.inputType.toLowerCase().replace(' ', '-').replace('-group', ''),
        subtype: "",
        required: task.mandatory.toString(),
        is_reading: task.reading.toString(),
        hint: task.helpTextEnabled ? task.helpTextValue : task.helpText,
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
                      <div key={task.id} className="p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-4">
                            {/* Checkboxes Row */}
                            <div className="flex items-center justify-between mb-4">
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
                                    id={`helpText-${task.id}`}
                                    checked={task.helpTextEnabled}
                                    onCheckedChange={(checked) => updateTask(section.id, task.id, 'helpTextEnabled', checked)}
                                  />
                                  <Label htmlFor={`helpText-${task.id}`}>Help Text</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`reading-${task.id}`}
                                    checked={task.reading}
                                    onCheckedChange={(checked) => updateTask(section.id, task.id, 'reading', checked)}
                                  />
                                  <Label htmlFor={`reading-${task.id}`}>Reading</Label>
                                </div>

                                {task.weightage && (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`rating-${task.id}`}
                                      checked={task.rating_enabled}
                                      onCheckedChange={(checked) => updateTask(section.id, task.id, 'rating_enabled', checked)}
                                    />
                                    <Label htmlFor={`rating-${task.id}`}>Rating</Label>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Main Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="md:col-span-2 space-y-2">
                                <Label>Task*</Label>
                                <Input
                                  value={task.question}
                                  onChange={(e) => updateTask(section.id, task.id, 'question', e.target.value)}
                                  placeholder="Enter Task"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Input Type*</Label>
                                <Select 
                                  key={`input-type-${task.id}`}
                                  value={task.inputType} 
                                  onValueChange={(value) => {
                                    console.log('Changing input type to:', value); // Debug log
                                    updateTask(section.id, task.id, 'inputType', value);
                                    // Set default values for radio-group and dropdown
                                    if (value === 'radio-group' || value === 'dropdown') {
                                      updateTaskValues(section.id, task.id, [
                                        { label: "Yes", type: "positive", value: "Yes" },
                                        { label: "No", type: "negative", value: "No" }
                                      ]);
                                    } else if (value === 'checkbox' || value === 'options-inputs') {
                                      updateTaskValues(section.id, task.id, [
                                        { label: "", type: "positive", value: "" }
                                      ]);
                                    } else {
                                      updateTaskValues(section.id, task.id, []);
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Input Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="dropdown">Dropdown</SelectItem>
                                    <SelectItem value="checkbox">Checkbox</SelectItem>
                                    <SelectItem value="radio-group">Radio</SelectItem>
                                    <SelectItem value="options-inputs">Options & Inputs</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {task.weightage && (
                                <div className="space-y-2">
                                  <Label>Weightage</Label>
                                  <Input
                                    value={task.weightage}
                                    onChange={(e) => updateTask(section.id, task.id, 'weightage', e.target.value)}
                                    placeholder="Enter weightage"
                                    type="number"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Help Text Field */}
                            {task.helpTextEnabled && (
                              <div className="space-y-2">
                                <Label>Help Text (Hint)</Label>
                                <Input
                                  value={task.helpTextValue}
                                  onChange={(e) => updateTask(section.id, task.id, 'helpTextValue', e.target.value)}
                                  placeholder="Enter help text or hint"
                                />
                              </div>
                            )}

                            {/* Conditional Value Sections */}
                            {task.inputType === 'dropdown' && (
                              <div className="space-y-2">
                                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                                  <Label className="block text-sm font-semibold mb-2 text-gray-700">Enter Value</Label>
                                  
                                  {task.values.map((value, valueIndex) => (
                                    <div key={valueIndex} className="flex items-center gap-2 mb-2">
                                      <Input
                                        value={value.label}
                                        onChange={(e) => updateValue(section.id, task.id, valueIndex, 'label', e.target.value)}
                                        placeholder="Enter option value"
                                        className="flex-1 bg-white"
                                      />
                                      
                                      <Select
                                        value={value.type}
                                        onValueChange={(newType) => updateValue(section.id, task.id, valueIndex, 'type', newType)}
                                      >
                                        <SelectTrigger className="w-20 bg-white">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="positive">P</SelectItem>
                                          <SelectItem value="negative">N</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      
                                      {task.values.length > 1 && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeValue(section.id, task.id, valueIndex)}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                  
                                  <div className="flex justify-end mt-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addValue(section.id, task.id)}
                                      className="text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                      <Plus className="w-4 h-4 mr-1" />
                                      Add Option
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {task.inputType === 'radio-group' && (
                              <div className="space-y-2">
                                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                                  <div className="flex justify-between items-center mb-2">
                                    <Label className="text-sm font-semibold text-gray-700">Selected</Label>
                                    <Label className="text-sm font-semibold text-gray-700">Enter Value</Label>
                                  </div>
                                  
                                  {task.values.map((value, valueIndex) => (
                                    <div key={valueIndex} className="flex items-center gap-2 mb-2">
                                      <input
                                        type="radio"
                                        name={`radio-${section.id}-${task.id}`}
                                        checked={valueIndex === 0}
                                        className="text-red-600"
                                        readOnly
                                      />
                                      
                                      <Input
                                        value={value.label}
                                        onChange={(e) => updateValue(section.id, task.id, valueIndex, 'label', e.target.value)}
                                        placeholder="Enter option value"
                                        className="flex-1 bg-white"
                                      />
                                      
                                      <Select
                                        value={value.type}
                                        onValueChange={(newType) => updateValue(section.id, task.id, valueIndex, 'type', newType)}
                                      >
                                        <SelectTrigger className="w-20 bg-white">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="positive">P</SelectItem>
                                          <SelectItem value="negative">N</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      
                                      {task.values.length > 1 && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeValue(section.id, task.id, valueIndex)}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                  
                                  <div className="flex justify-end mt-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addValue(section.id, task.id)}
                                      className="text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                      <Plus className="w-4 h-4 mr-1" />
                                      Add Option
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {task.inputType === 'checkbox' && (
                              <div className="space-y-2">
                                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                                  <div className="flex justify-between items-center mb-2">
                                    <Label className="text-sm font-semibold text-gray-700">Selected</Label>
                                    <Label className="text-sm font-semibold text-gray-700">Enter Value</Label>
                                  </div>
                                  
                                  {(task.values.length > 0 ? task.values : [{ label: "", type: "positive", value: "" }]).map((value, valueIndex) => (
                                    <div key={valueIndex} className="flex items-center gap-2 mb-2">
                                      <Checkbox
                                        checked={valueIndex === 0}
                                        className="text-red-600"
                                      />
                                      
                                      <Input
                                        value={value.label}
                                        onChange={(e) => {
                                          if (task.values.length === 0) {
                                            updateTaskValues(section.id, task.id, [{ label: e.target.value, type: "positive", value: e.target.value }]);
                                          } else {
                                            updateValue(section.id, task.id, valueIndex, 'label', e.target.value);
                                          }
                                        }}
                                        placeholder="Enter option value"
                                        className="flex-1 bg-white"
                                      />
                                      
                                      {task.values.length > 1 && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeValue(section.id, task.id, valueIndex)}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                  
                                  <div className="flex justify-end mt-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        if (task.values.length === 0) {
                                          updateTaskValues(section.id, task.id, [
                                            { label: "", type: "positive", value: "" },
                                            { label: "", type: "positive", value: "" }
                                          ]);
                                        } else {
                                          addValue(section.id, task.id);
                                        }
                                      }}
                                      className="text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                      <Plus className="w-4 h-4 mr-1" />
                                      Add Option
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {task.inputType === 'options-inputs' && (
                              <div className="space-y-2">
                                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                                  <Label className="block text-sm font-semibold mb-2 text-gray-700 text-center">Enter Value</Label>
                                  
                                  {(task.values.length > 0 ? task.values : [{ label: "", type: "positive", value: "" }]).map((value, valueIndex) => (
                                    <div key={valueIndex} className="flex items-center gap-2 mb-2">
                                      <Input
                                        value={value.label}
                                        onChange={(e) => {
                                          if (task.values.length === 0) {
                                            updateTaskValues(section.id, task.id, [{ label: e.target.value, type: "positive", value: e.target.value }]);
                                          } else {
                                            updateValue(section.id, task.id, valueIndex, 'label', e.target.value);
                                          }
                                        }}
                                        placeholder=""
                                        className="flex-1 bg-white"
                                      />
                                      
                                      {(task.values.length > 1 || (task.values.length === 1 && valueIndex === 0 && task.values[0].label)) && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            if (task.values.length <= 1) {
                                              updateTaskValues(section.id, task.id, []);
                                            } else {
                                              removeValue(section.id, task.id, valueIndex);
                                            }
                                          }}
                                          className="text-red-600 hover:text-red-700 text-xs"
                                        >
                                          close
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                  
                                  <div className="flex justify-end mt-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        if (task.values.length === 0) {
                                          updateTaskValues(section.id, task.id, [
                                            { label: "", type: "positive", value: "" },
                                            { label: "", type: "positive", value: "" }
                                          ]);
                                        } else {
                                          addValue(section.id, task.id);
                                        }
                                      }}
                                      className="text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                      <Plus className="w-4 h-4 mr-1" />
                                      + Add Option
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Additional fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/settings/masters/checklist-master')}
          >
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