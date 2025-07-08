
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

export const AddMasterChecklistPage = () => {
  const navigate = useNavigate();
  const [scheduleFor, setScheduleFor] = useState('asset');
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [assetType, setAssetType] = useState('');
  const [taskSections, setTaskSections] = useState([{
    id: 1,
    group: '',
    subGroup: '',
    tasks: [{ id: 1, taskName: '', inputType: '', mandatory: false, reading: false, helpText: false }]
  }]);
  const [createTask, setCreateTask] = useState(false);
  const [weightage, setWeightage] = useState(false);

  const handleCreateTaskChange = (checked) => setCreateTask(checked === true);
  const handleWeightageChange = (checked) => setWeightage(checked === true);

  const addTaskSection = () => {
    setTaskSections([...taskSections, {
      id: Date.now(),
      group: '',
      subGroup: '',
      tasks: [{ id: 1, taskName: '', inputType: '', mandatory: false, reading: false, helpText: false }]
    }]);
  };

  const removeTaskSection = (sectionId) => {
    setTaskSections(taskSections.filter(section => section.id !== sectionId));
  };

  const updateTaskSection = (sectionId, field, value) => {
    setTaskSections(taskSections.map(section => section.id === sectionId ? { ...section, [field]: value } : section));
  };

  const addQuestion = (sectionId) => {
    setTaskSections(taskSections.map(section => {
      if (section.id === sectionId) {
        return { ...section, tasks: [...section.tasks, { id: Date.now(), taskName: '', inputType: '', mandatory: false, reading: false, helpText: false }] };
      }
      return section;
    }));
  };

  const updateTask = (sectionId, taskId, field, value) => {
    setTaskSections(taskSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tasks: section.tasks.map(task => task.id === taskId ? { ...task, [field]: value } : task)
        };
      }
      return section;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ scheduleFor, activityName, description, assetType, taskSections, createTask, weightage });
    alert('Master checklist created successfully!');
    navigate('/maintenance/audit/operational/master-checklists');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2 text-sm">Master Checklist &gt; Add Master Checklist</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ADD MASTER CHECKLIST</h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="createTask" checked={createTask} onCheckedChange={handleCreateTaskChange} />
          <Label htmlFor="createTask">Create Task</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="weightage" checked={weightage} onCheckedChange={handleWeightageChange} />
          <Label htmlFor="weightage">Weightage</Label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Section */}
        <div className="bg-white rounded-lg border p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm">1</div>
            <h2 className="text-lg font-semibold">Basic Info</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="block mb-2 text-sm font-medium">Schedule For</Label>
              <div className="flex flex-wrap gap-4">
                {['asset', 'service', 'vendor'].map(option => (
                  <label key={option} className="flex items-center space-x-2">
                    <input type="radio" name="scheduleFor" value={option} checked={scheduleFor === option} onChange={(e) => setScheduleFor(e.target.value)} />
                    <span className="capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="field-group relative" style={{ margin: '20px 0' }}>
              <input
                required
                className="floating-label w-full pt-4 pb-2 px-[15px] text-base border border-[#ccc] rounded transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#C72030]"
                placeholder=""
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
              />
              <label className={`absolute left-[15px] transition-all duration-150 ease-in text-[#676767] pointer-events-none ${activityName ? 'field-active -translate-y-[25px] text-[0.9em] text-black' : 'top-4 text-base'}`}
                style={{
                  textShadow: activityName ? '1px 0 0 #fff, -1px 0 0 #fff, 2px 0 0 #fff, -2px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff' : 'none'
                }}>
                Activity Name *
              </label>
            </div>

            <div className="md:col-span-2">
              <div className="field-group relative" style={{ margin: '20px 0' }}>
                <textarea
                  rows={3}
                  className="floating-label flex min-h-[80px] w-full pt-4 pb-2 px-[15px] text-base border border-[#ccc] rounded transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#C72030] resize-vertical"
                  placeholder=""
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <label className={`absolute left-[15px] transition-all duration-150 ease-in text-[#676767] pointer-events-none ${description ? 'field-active -translate-y-[25px] text-[0.9em] text-black' : 'top-4 text-base'}`}
                  style={{
                    textShadow: description ? '1px 0 0 #fff, -1px 0 0 #fff, 2px 0 0 #fff, -2px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff' : 'none'
                  }}>
                  Description
                </label>
              </div>
            </div>

            <div>
              <div className="field-group relative" style={{ margin: '20px 0' }}>
                <select
                  className="floating-label w-full pt-4 pb-2 px-[15px] text-base border border-[#ccc] rounded transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#C72030] bg-white"
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                >
                  <option value="">Select Asset Type</option>
                  {['electrical', 'mechanical', 'hvac', 'plumbing', 'fire-safety'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <label className={`absolute left-[15px] transition-all duration-150 ease-in text-[#676767] pointer-events-none ${assetType ? 'field-active -translate-y-[25px] text-[0.9em] text-black' : 'top-4 text-base'}`}
                  style={{
                    textShadow: assetType ? '1px 0 0 #fff, -1px 0 0 #fff, 2px 0 0 #fff, -2px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff' : 'none'
                  }}>
                  Select Asset Type
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Task Sections */}
        {taskSections.map(section => (
          <div key={section.id} className="bg-white rounded-lg border p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm">2</div>
                <h2 className="text-lg font-semibold">Task</h2>
              </div>
              {taskSections.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeTaskSection(section.id)} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {['group', 'subGroup'].map((field, i) => (
                <div key={i}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel id={`${field}-label-${section.id}`} shrink>Select {field === 'group' ? 'Group' : 'Sub Group'}</InputLabel>
                    <MuiSelect 
                      labelId={`${field}-label-${section.id}`}
                      label={`Select ${field === 'group' ? 'Group' : 'Sub Group'}`}
                      displayEmpty 
                      value={section[field]} 
                      onChange={(e) => updateTaskSection(section.id, field, e.target.value)} 
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select</em></MenuItem>
                      {['electrical', 'mechanical', 'safety', 'maintenance', 'lighting', 'power', 'ventilation', 'cleaning'].map(opt => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>
              ))}
            </div>

            {section.tasks.map(task => (
              <div key={task.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border p-4 rounded">
                <TextField 
                  placeholder="Enter Task" 
                  fullWidth 
                  value={task.taskName} 
                  onChange={(e) => updateTask(section.id, task.id, 'taskName', e.target.value)} 
                  variant="outlined" 
                  label="Task *" 
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles} 
                />
                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                  <InputLabel id={`input-type-label-${task.id}`} shrink>Select Input Type</InputLabel>
                  <MuiSelect 
                    labelId={`input-type-label-${task.id}`}
                    label="Select Input Type"
                    displayEmpty 
                    value={task.inputType} 
                    onChange={(e) => updateTask(section.id, task.id, 'inputType', e.target.value)} 
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Input Type</em></MenuItem>
                    {['text', 'number', 'checkbox', 'dropdown', 'date'].map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
                <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
                  {['mandatory', 'reading', 'helpText'].map(field => (
                    <label key={field} className="flex items-center space-x-2">
                      <Checkbox checked={task[field]} onCheckedChange={val => updateTask(section.id, task.id, field, val === true)} />
                      <span className="capitalize">{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <Button type="button" onClick={() => addQuestion(section.id)} style={{ backgroundColor: '#C72030' }} className="text-white flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Question
              </Button>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap justify-between gap-4">
          <Button type="button" onClick={addTaskSection} style={{ backgroundColor: '#C72030' }} className="text-white flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Section
          </Button>

          <Button type="submit" style={{ backgroundColor: '#C72030' }} className="text-white px-6">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
