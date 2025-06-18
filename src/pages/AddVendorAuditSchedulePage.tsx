
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export const AddVendorAuditSchedulePage = () => {
  const navigate = useNavigate();
  
  // Toggle states
  const [createNew, setCreateNew] = useState(false);
  const [createTask, setCreateTask] = useState(false);
  const [weightage, setWeightage] = useState(false);

  // Basic Info state
  const [type, setType] = useState('');
  const [scheduleFor, setScheduleFor] = useState('asset');
  const [activityName, setActivityName] = useState('Engineering Audit Checklist 2');
  const [description, setDescription] = useState('Enter Description');
  
  // Task sections state
  const [taskSections, setTaskSections] = useState([
    {
      id: 1,
      group: 'Quality Assurance Log',
      subGroup: 'E-Book MZT',
      tasks: [
        {
          id: 1,
          taskName: 'Question 1',
          inputType: 'Radio Button',
          mandatory: false,
          reading: false,
          helpText: false,
          options: [
            { id: 1, value: 'Yes', points: '' },
            { id: 2, value: 'No', points: '' }
          ]
        }
      ]
    }
  ]);

  // Schedule state
  const [checklistType, setChecklistType] = useState('individual');
  const [asset, setAsset] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [scanType, setScanType] = useState('');
  const [planDuration, setPlanDuration] = useState('');
  const [priority, setPriority] = useState('');
  const [emailTriggerRule, setEmailTriggerRule] = useState('');
  const [supervision, setSupervision] = useState('');
  const [category, setCategory] = useState('');
  const [submissionTime, setSubmissionTime] = useState('');
  const [graceTime, setGraceTime] = useState('');
  const [lockOverdueTask, setLockOverdueTask] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startFrom, setStartFrom] = useState('');
  const [endAt, setEndAt] = useState('');
  const [selectSupplier, setSelectSupplier] = useState('');

  // Cron form state
  const [cronType, setCronType] = useState('Minutes');
  const [cronExpression, setCronExpression] = useState('0 0 * * *');

  // Handler functions for checkboxes
  const handleCreateNewChange = (checked: boolean | "indeterminate") => {
    setCreateNew(checked === true);
  };

  const handleCreateTaskChange = (checked: boolean | "indeterminate") => {
    setCreateTask(checked === true);
  };

  const handleWeightageChange = (checked: boolean | "indeterminate") => {
    setWeightage(checked === true);
  };

  const addTaskSection = () => {
    const newSection = {
      id: Date.now(),
      group: '',
      subGroup: '',
      tasks: [
        {
          id: 1,
          taskName: '',
          inputType: '',
          mandatory: false,
          reading: false,
          helpText: false,
          options: [
            { id: 1, value: '', points: '' }
          ]
        }
      ]
    };
    setTaskSections([...taskSections, newSection]);
  };

  const removeTaskSection = (sectionId: number) => {
    setTaskSections(taskSections.filter(section => section.id !== sectionId));
  };

  const updateTaskSection = (sectionId: number, field: string, value: string) => {
    setTaskSections(taskSections.map(section => 
      section.id === sectionId ? { ...section, [field]: value } : section
    ));
  };

  const addQuestion = (sectionId: number) => {
    setTaskSections(taskSections.map(section => {
      if (section.id === sectionId) {
        const newTask = {
          id: Date.now(),
          taskName: '',
          inputType: '',
          mandatory: false,
          reading: false,
          helpText: false,
          options: [
            { id: 1, value: '', points: '' }
          ]
        };
        return { ...section, tasks: [...section.tasks, newTask] };
      }
      return section;
    }));
  };

  const updateTask = (sectionId: number, taskId: number, field: string, value: any) => {
    setTaskSections(taskSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tasks: section.tasks.map(task => 
            task.id === taskId ? { ...task, [field]: value } : task
          )
        };
      }
      return section;
    }));
  };

  const addOption = (sectionId: number, taskId: number) => {
    setTaskSections(taskSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tasks: section.tasks.map(task => {
            if (task.id === taskId) {
              const newOption = {
                id: Date.now(),
                value: '',
                points: ''
              };
              return { ...task, options: [...task.options, newOption] };
            }
            return task;
          })
        };
      }
      return section;
    }));
  };

  const removeOption = (sectionId: number, taskId: number, optionId: number) => {
    setTaskSections(taskSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tasks: section.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, options: task.options.filter(option => option.id !== optionId) };
            }
            return task;
          })
        };
      }
      return section;
    }));
  };

  const updateOption = (sectionId: number, taskId: number, optionId: number, field: string, value: string) => {
    setTaskSections(taskSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tasks: section.tasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                options: task.options.map(option =>
                  option.id === optionId ? { ...option, [field]: value } : option
                )
              };
            }
            return task;
          })
        };
      }
      return section;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', {
      createNew,
      createTask,
      weightage,
      type,
      scheduleFor,
      activityName,
      description,
      taskSections,
      checklistType,
      asset,
      assignTo,
      scanType,
      planDuration,
      priority,
      emailTriggerRule,
      supervision,
      category,
      submissionTime,
      graceTime,
      lockOverdueTask,
      frequency,
      startFrom,
      endAt,
      selectSupplier,
      cronType,
      cronExpression
    });
    alert('Vendor audit schedule copied successfully!');
    navigate('/maintenance/audit/vendor/scheduled');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Schedule &gt; Add Schedule</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">ADD SCHEDULE</h1>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="mb-6 flex gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="createNew" 
            checked={createNew}
            onCheckedChange={handleCreateNewChange}
          />
          <Label htmlFor="createNew">Create New</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="createTask" 
            checked={createTask}
            onCheckedChange={handleCreateTaskChange}
          />
          <Label htmlFor="createTask">Create Task</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="weightage" 
            checked={weightage}
            onCheckedChange={handleWeightageChange}
          />
          <Label htmlFor="weightage">Weightage</Label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Section */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm">1</div>
            <h2 className="text-lg font-semibold">Basic Info</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="type" className="text-sm font-medium mb-2 block">Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="type"
                    value="PPM"
                    checked={type === 'PPM'}
                    onChange={(e) => setType(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>PPM</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="type"
                    value="AMC"
                    checked={type === 'AMC'}
                    onChange={(e) => setType(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>AMC</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="type"
                    value="Preparedness"
                    checked={type === 'Preparedness'}
                    onChange={(e) => setType(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Preparedness</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="type"
                    value="HOTO"
                    checked={type === 'HOTO'}
                    onChange={(e) => setType(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>HOTO</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="type"
                    value="Routine"
                    checked={type === 'Routine'}
                    onChange={(e) => setType(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Routine</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="type"
                    value="Audit"
                    checked={type === 'Audit'}
                    onChange={(e) => setType(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Audit</span>
                </label>
              </div>
            </div>
            
            <div>
              <Label htmlFor="scheduleFor" className="text-sm font-medium mb-2 block">Schedule For</Label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="scheduleFor"
                    value="asset"
                    checked={scheduleFor === 'asset'}
                    onChange={(e) => setScheduleFor(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Asset</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="scheduleFor"
                    value="service"
                    checked={scheduleFor === 'service'}
                    onChange={(e) => setScheduleFor(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Service</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="scheduleFor"
                    value="vendor"
                    checked={scheduleFor === 'vendor'}
                    onChange={(e) => setScheduleFor(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Vendor</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="scheduleFor"
                    value="training"
                    checked={scheduleFor === 'training'}
                    onChange={(e) => setScheduleFor(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Training</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="activityName" className="text-sm font-medium mb-2 block">
                Activity Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="activityName"
                placeholder="Enter Activity Name"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium mb-2 block">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[40px]"
              />
            </div>
          </div>
        </div>

        {/* Task Sections */}
        {taskSections.map((section, sectionIndex) => (
          <div key={section.id} className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm">2</div>
                <h2 className="text-lg font-semibold">Task</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => addTaskSection()}
                  style={{ backgroundColor: '#C72030' }}
                  className="text-white hover:opacity-90 text-sm"
                >
                  + Add Section
                </Button>
                {taskSections.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTaskSection(section.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Select Group</Label>
                <Select value={section.group} onValueChange={(value) => updateTaskSection(section.id, 'group', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quality Assurance Log">Quality Assurance Log</SelectItem>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Select Sub Group</Label>
                <Select value={section.subGroup} onValueChange={(value) => updateTaskSection(section.id, 'subGroup', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sub Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="E-Book MZT">E-Book MZT</SelectItem>
                    <SelectItem value="power">Power</SelectItem>
                    <SelectItem value="ventilation">Ventilation</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tasks */}
            {section.tasks.map((task, taskIndex) => (
              <div key={task.id} className="border rounded p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Task <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter Task"
                      value={task.taskName}
                      onChange={(e) => updateTask(section.id, task.id, 'taskName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Input Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={task.inputType} onValueChange={(value) => updateTask(section.id, task.id, 'inputType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Input Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Radio Button">Radio Button</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                        <SelectItem value="dropdown">Dropdown</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-6 mb-4">
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={task.mandatory}
                      onCheckedChange={(checked) => updateTask(section.id, task.id, 'mandatory', checked === true)}
                    />
                    <span>Mandatory</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={task.reading}
                      onCheckedChange={(checked) => updateTask(section.id, task.id, 'reading', checked === true)}
                    />
                    <span>Reading</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={task.helpText}
                      onCheckedChange={(checked) => updateTask(section.id, task.id, 'helpText', checked === true)}
                    />
                    <span>Help Text</span>
                  </label>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Options</Label>
                    <Button
                      type="button"
                      onClick={() => addOption(section.id, task.id)}
                      style={{ backgroundColor: '#C72030' }}
                      className="text-white hover:opacity-90 text-sm"
                      size="sm"
                    >
                      Add Option
                    </Button>
                  </div>
                  {task.options.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <Input
                        placeholder="Enter Value"
                        value={option.value}
                        onChange={(e) => updateOption(section.id, task.id, option.id, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Points"
                        value={option.points}
                        onChange={(e) => updateOption(section.id, task.id, option.id, 'points', e.target.value)}
                        className="w-20"
                      />
                      {task.options.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(section.id, task.id, option.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => addQuestion(section.id)}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:opacity-90 flex items-center gap-2"
              >
                + Add Question
              </Button>
            </div>
          </div>
        ))}

        {/* Schedule Section */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm">3</div>
            <h2 className="text-lg font-semibold">Schedule</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Checklist Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="checklistType"
                    value="individual"
                    checked={checklistType === 'individual'}
                    onChange={(e) => setChecklistType(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Individual</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="checklistType"
                    value="asset-audit-group"
                    checked={checklistType === 'asset-audit-group'}
                    onChange={(e) => setChecklistType(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Asset Audit Group</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Asset</Label>
                <Select value={asset} onValueChange={setAsset}>
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
                <Label className="text-sm font-medium mb-2 block">Assign To</Label>
                <Select value={assignTo} onValueChange={setAssignTo}>
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
                <Label className="text-sm font-medium mb-2 block">Scan Type</Label>
                <Select value={scanType} onValueChange={setScanType}>
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
                <Label className="text-sm font-medium mb-2 block">Plan Duration</Label>
                <Select value={planDuration} onValueChange={setPlanDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Plan Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1hour">1 Hour</SelectItem>
                    <SelectItem value="2hours">2 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
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
                <Label className="text-sm font-medium mb-2 block">Email Trigger Rule</Label>
                <Select value={emailTriggerRule} onValueChange={setEmailTriggerRule}>
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
                <Label className="text-sm font-medium mb-2 block">Supervision</Label>
                <Select value={supervision} onValueChange={setSupervision}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Supervision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="required">Required</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Submission Time</Label>
                <Select value={submissionTime} onValueChange={setSubmissionTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Submission Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anytime">Anytime</SelectItem>
                    <SelectItem value="specific">Specific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Grace Time</Label>
                <Select value={graceTime} onValueChange={setGraceTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Grace Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15min">15 Minutes</SelectItem>
                    <SelectItem value="30min">30 Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Lock Overdue Task</Label>
                <Select value={lockOverdueTask} onValueChange={setLockOverdueTask}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Lock Menu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Start From</Label>
                <Input
                  type="date"
                  value={startFrom}
                  onChange={(e) => setStartFrom(e.target.value)}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">End At</Label>
                <Input
                  type="date"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Select Supplier</Label>
              <Select value={selectSupplier} onValueChange={setSelectSupplier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier1">Supplier 1</SelectItem>
                  <SelectItem value="supplier2">Supplier 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Cron Form Section */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm">4</div>
            <h2 className="text-lg font-semibold">Cron Form</h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => setCronType('Minutes')}
                className={`${cronType === 'Minutes' ? 'bg-[#C72030] text-white' : 'bg-gray-200 text-gray-700'} hover:opacity-90`}
              >
                Minutes
              </Button>
              <Button
                type="button"
                onClick={() => setCronType('Hours')}
                className={`${cronType === 'Hours' ? 'bg-[#C72030] text-white' : 'bg-gray-200 text-gray-700'} hover:opacity-90`}
              >
                Hours
              </Button>
              <Button
                type="button"
                onClick={() => setCronType('Day')}
                className={`${cronType === 'Day' ? 'bg-[#C72030] text-white' : 'bg-gray-200 text-gray-700'} hover:opacity-90`}
              >
                Day
              </Button>
              <Button
                type="button"
                onClick={() => setCronType('Month')}
                className={`${cronType === 'Month' ? 'bg-[#C72030] text-white' : 'bg-gray-200 text-gray-700'} hover:opacity-90`}
              >
                Month
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600 mb-2">Specifically run on 00:00 on 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59 of every month.</p>
              <div className="mt-4">
                <Label className="text-sm font-medium mb-2 block">Resulting Cron Expression:</Label>
                <Input
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 text-center text-sm">
              <div>
                <Label className="font-medium">Minutes</Label>
                <div className="text-2xl font-bold">0</div>
              </div>
              <div>
                <Label className="font-medium">Hours</Label>
                <div className="text-2xl font-bold">0</div>
              </div>
              <div>
                <Label className="font-medium">Day Of Month</Label>
                <div className="text-2xl font-bold">*</div>
              </div>
              <div>
                <Label className="font-medium">Month</Label>
                <div className="text-2xl font-bold">*</div>
              </div>
              <div>
                <Label className="font-medium">Day Of Week</Label>
                <div className="text-2xl font-bold">*</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:opacity-90 px-8"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
