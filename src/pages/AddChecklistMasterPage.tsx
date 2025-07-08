
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 44 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const AddChecklistMasterPage = () => {
  const navigate = useNavigate();
  const [type, setType] = useState('PPM');
  const [scheduleFor, setScheduleFor] = useState('Asset');
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [assetType, setAssetType] = useState('');
  const [createTicket, setCreateTicket] = useState(false);
  const [weightage, setWeightage] = useState(false);
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
          helpText: false,
        },
      ],
    },
  ]);

  const addTaskSection = () => {
    setTaskSections((prev) => [
      ...prev,
      {
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
          },
        ],
      },
    ]);
  };

  const updateTaskSection = (sectionId: number, field: string, value: string) => {
    setTaskSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };

  const updateTask = (sectionId: number, taskId: number, field: string, value: any) => {
    setTaskSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          tasks: section.tasks.map((task) =>
            task.id === taskId ? { ...task, [field]: value } : task
          ),
        };
      })
    );
  };

  const addQuestion = (sectionId: number) => {
    setTaskSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          tasks: [
            ...section.tasks,
            {
              id: Date.now(),
              taskName: '',
              inputType: '',
              mandatory: false,
              reading: false,
              helpText: false,
            },
          ],
        };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ type, scheduleFor, activityName, description, assetType, taskSections });
    alert('Checklist master created successfully!');
    navigate('/settings/masters/checklist-master');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            checked={createTicket} 
            onCheckedChange={(checked) => setCreateTicket(checked === true)} 
            id="createTicket" 
          />
          <Label htmlFor="createTicket">Create Ticket</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            checked={weightage} 
            onCheckedChange={(checked) => setWeightage(checked === true)} 
            id="weightage" 
          />
          <Label htmlFor="weightage">Weightage</Label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm">1</div>
            <h2 className="font-semibold text-lg">Basic Info</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block text-sm font-medium">Type</Label>
              <div className="flex gap-4">
                {['PPM', 'AMC', 'Preparedness', 'HSC', 'Routine'].map((typeOption) => (
                  <label key={typeOption} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      value={typeOption}
                      checked={type === typeOption}
                      onChange={(e) => setType(e.target.value)}
                    />
                    <span>{typeOption}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium">Schedule For</Label>
              <div className="flex gap-4">
                {['Asset', 'Service', 'Vendor'].map((scheduleOption) => (
                  <label key={scheduleOption} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="scheduleFor"
                      value={scheduleOption}
                      checked={scheduleFor === scheduleOption}
                      onChange={(e) => setScheduleFor(e.target.value)}
                    />
                    <span>{scheduleOption}</span>
                  </label>
                ))}
              </div>
            </div>

            <TextField
              fullWidth
              required
              label="Activity Name"
              placeholder="Enter Activity Name"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: {
                  ...fieldStyles,
                  alignItems: 'flex-start',
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel shrink>Asset Type</InputLabel>
              <MuiSelect
                displayEmpty
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>Select Asset Type</em>
                </MenuItem>
                {['electrical', 'mechanical', 'hvac', 'plumbing'].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>
        </div>

        {taskSections.map((section) => (
          <div key={section.id} className="bg-white border rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm">2</div>
                <h2 className="font-semibold text-lg">Task</h2>
              </div>
              <Button
                type="button"
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:opacity-90"
                onClick={addTaskSection}
              >
                + Add Section
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormControl fullWidth>
                <InputLabel shrink>Select Group</InputLabel>
                <MuiSelect
                  displayEmpty
                  value={section.group}
                  onChange={(e) => updateTaskSection(section.id, 'group', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select Group</em>
                  </MenuItem>
                  {['option1', 'option2', 'option3'].map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel shrink>Select Sub Group</InputLabel>
                <MuiSelect
                  displayEmpty
                  value={section.subGroup}
                  onChange={(e) => updateTaskSection(section.id, 'subGroup', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select Sub Group</em>
                  </MenuItem>
                  {['option1', 'option2', 'option3'].map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            {section.tasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border p-4 rounded"
              >
                <TextField
                  fullWidth
                  label="Task"
                  placeholder="Enter Task"
                  value={task.taskName}
                  onChange={(e) => updateTask(section.id, task.id, 'taskName', e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />

                <FormControl fullWidth>
                  <InputLabel shrink>Input Type</InputLabel>
                  <MuiSelect
                    displayEmpty
                    value={task.inputType}
                    onChange={(e) => updateTask(section.id, task.id, 'inputType', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value="">
                      <em>Select Input Type</em>
                    </MenuItem>
                    {['text', 'number', 'checkbox', 'dropdown', 'date'].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
                  {['mandatory', 'reading', 'helpText'].map((field) => (
                    <label key={field} className="flex items-center gap-2">
                      <Checkbox
                        checked={task[field as keyof typeof task] as boolean}
                        onCheckedChange={(checked) => updateTask(section.id, task.id, field, checked === true)}
                      />
                      <span className="capitalize">{field === 'helpText' ? 'Help Text' : field}</span>
                    </label>
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
                <Plus className="w-4 h-4" /> Add Question
              </Button>
            </div>
          </div>
        ))}

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
