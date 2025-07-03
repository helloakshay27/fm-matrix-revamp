import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 44 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
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

            <div>
              <Label className="block mb-2 text-sm font-medium">Activity Name <span className="text-red-500">*</span></Label>
              <TextField fullWidth required placeholder="Enter Activity" value={activityName} onChange={(e) => setActivityName(e.target.value)} variant="outlined" InputProps={{ sx: fieldStyles }} />
            </div>

            <div className="md:col-span-2">
              <Label className="block mb-2 text-sm font-medium">Description</Label>
              <TextField multiline minRows={3} fullWidth placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)} variant="outlined" InputProps={{ sx: fieldStyles }} />
            </div>

            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Select Asset Type</InputLabel>
                <MuiSelect displayEmpty value={assetType} onChange={(e) => setAssetType(e.target.value)} sx={fieldStyles}>
                  <MenuItem value=""><em>Select Asset Type</em></MenuItem>
                  {['electrical', 'mechanical', 'hvac', 'plumbing', 'fire-safety'].map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
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
                  <Label className="text-sm font-medium mb-2 block">Select {field === 'group' ? 'Group' : 'Sub Group'}</Label>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Select</InputLabel>
                    <MuiSelect displayEmpty value={section[field]} onChange={(e) => updateTaskSection(section.id, field, e.target.value)} sx={fieldStyles}>
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
                <TextField placeholder="Enter Task" fullWidth value={task.taskName} onChange={(e) => updateTask(section.id, task.id, 'taskName', e.target.value)} variant="outlined" label="Task *" InputProps={{ sx: fieldStyles }} />
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Select Input Type</InputLabel>
                  <MuiSelect displayEmpty value={task.inputType} onChange={(e) => updateTask(section.id, task.id, 'inputType', e.target.value)} sx={fieldStyles}>
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
