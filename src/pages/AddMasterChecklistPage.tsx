
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

export const AddMasterChecklistPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Basic Info state
  const [scheduleFor, setScheduleFor] = useState('asset');
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [assetType, setAssetType] = useState('');
  
  // Task sections state
  const [taskSections, setTaskSections] = useState([
    {
      id: 1,
      group: '',
      subGroup: '',
      tasks: [
        {
          id: 1,
          taskName: '',
          inputType: '',
          mandatory: false,
          reading: false,
          helpText: false
        }
      ]
    }
  ]);

  // Toggle buttons state
  const [createTask, setCreateTask] = useState(false);
  const [weightage, setWeightage] = useState(false);

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
      fontSize: { xs: '12px', sm: '13px', md: '14px' },
    },
    '& .MuiInputLabel-root': {
      fontSize: { xs: '12px', sm: '13px', md: '14px' },
    },
  };

  // Handler functions for checkboxes
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
          helpText: false
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
          helpText: false
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', {
      scheduleFor,
      activityName,
      description,
      assetType,
      taskSections,
      createTask,
      weightage
    });
    
    toast({
      title: "Success",
      description: "Master checklist created successfully!",
    });
    
    navigate('/maintenance/audit/operational/master-checklists');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Master Checklist &gt; Add Master Checklist</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">ADD MASTER CHECKLIST</h1>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="mb-6 flex gap-4">
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

          <div className="space-y-4">
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
              </div>
            </div>

            <div>
              <TextField
                required
                label="Activity Name"
                placeholder="Enter Activity Name"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>

            <div>
              <TextField
                label="Description"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>

            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="asset-type-label" shrink>Asset Type</InputLabel>
                <MuiSelect
                  labelId="asset-type-label"
                  label="Asset Type"
                  displayEmpty
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Asset Type</em></MenuItem>
                  <MenuItem value="electrical">Electrical</MenuItem>
                  <MenuItem value="mechanical">Mechanical</MenuItem>
                  <MenuItem value="hvac">HVAC</MenuItem>
                  <MenuItem value="plumbing">Plumbing</MenuItem>
                  <MenuItem value="fire-safety">Fire Safety</MenuItem>
                </MuiSelect>
              </FormControl>
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

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id={`group-${section.id}`} shrink>Select Group</InputLabel>
                  <MuiSelect
                    labelId={`group-${section.id}`}
                    label="Select Group"
                    value={section.group}
                    onChange={(e) => updateTaskSection(section.id, 'group', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value="electrical">Electrical</MenuItem>
                    <MenuItem value="mechanical">Mechanical</MenuItem>
                    <MenuItem value="safety">Safety</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id={`subgroup-${section.id}`} shrink>Select Sub Group</InputLabel>
                  <MuiSelect
                    labelId={`subgroup-${section.id}`}
                    label="Select Sub Group"
                    value={section.subGroup}
                    onChange={(e) => updateTaskSection(section.id, 'subGroup', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value="lighting">Lighting</MenuItem>
                    <MenuItem value="power">Power</MenuItem>
                    <MenuItem value="ventilation">Ventilation</MenuItem>
                    <MenuItem value="cleaning">Cleaning</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            {/* Tasks */}
            {section.tasks.map((task, taskIndex) => (
              <div key={task.id} className="grid grid-cols-2 gap-4 mb-4 p-4 border rounded">
                <div>
                  <TextField
                    required
                    label="Task"
                    placeholder="Enter Task"
                    value={task.taskName}
                    onChange={(e) => updateTask(section.id, task.id, 'taskName', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                  />
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`input-type-${task.id}`} shrink>Input Type</InputLabel>
                    <MuiSelect
                      labelId={`input-type-${task.id}`}
                      label="Input Type"
                      value={task.inputType}
                      onChange={(e) => updateTask(section.id, task.id, 'inputType', e.target.value)}
                      sx={fieldStyles}
                    >
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="checkbox">Checkbox</MenuItem>
                      <MenuItem value="dropdown">Dropdown</MenuItem>
                      <MenuItem value="date">Date</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div className="col-span-2 flex gap-6">
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
              </div>
            ))}

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => addQuestion(section.id)}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:opacity-90 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>
          </div>
        ))}

        <div className="flex justify-between">
          <Button
            type="button"
            onClick={addTaskSection}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </Button>

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
