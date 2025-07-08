import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
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

export const AddMasterChecklistPage = () => {
  const navigate = useNavigate();
  const [scheduleFor, setScheduleFor] = useState('asset');
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [assetType, setAssetType] = useState('');
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
  const [createTask, setCreateTask] = useState(false);
  const [weightage, setWeightage] = useState(false);

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

  const removeTaskSection = (id) => {
    setTaskSections((prev) => prev.filter((section) => section.id !== id));
  };

  const updateTaskSection = (sectionId, field, value) => {
    setTaskSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };

  const updateTask = (sectionId, taskId, field, value) => {
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

  const addQuestion = (sectionId) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ scheduleFor, activityName, description, assetType, taskSections });
    alert('Master checklist created successfully!');
    navigate('/maintenance/audit/operational/master-checklists');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Master Checklist &gt; Add Master Checklist</p>
        <h1 className="text-2xl font-bold">ADD MASTER CHECKLIST</h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox checked={createTask} onCheckedChange={setCreateTask} id="createTask" />
          <Label htmlFor="createTask">Create Task</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox checked={weightage} onCheckedChange={setWeightage} id="weightage" />
          <Label htmlFor="weightage">Weightage</Label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm">1</div>
            <h2 className="font-semibold text-lg">Basic Info</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block text-sm font-medium">Schedule For</Label>
              <div className="flex gap-4">
                {['asset', 'service', 'vendor'].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="scheduleFor"
                      value={type}
                      checked={scheduleFor === type}
                      onChange={(e) => setScheduleFor(e.target.value)}
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <TextField
              fullWidth
              required
              label="Activity Name"
              placeholder="Enter Activity"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />

            <TextField
              fullWidth
              multiline
              minRows={3}
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
              <InputLabel shrink>Select Asset Type</InputLabel>
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
                <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm">2</div>
                <h2 className="font-semibold text-lg">Task</h2>
              </div>
              {taskSections.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTaskSection(section.id)}
                  className="text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {['group', 'subGroup'].map((field) => (
                <FormControl key={field} fullWidth>
                  <InputLabel shrink>Select</InputLabel>
                  <MuiSelect
                    displayEmpty
                    value={section[field]}
                    onChange={(e) => updateTaskSection(section.id, field, e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {['option1', 'option2', 'option3'].map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              ))}
            </div>

            {section.tasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border p-4 rounded"
              >
                <TextField
                  fullWidth
                  label="Task *"
                  value={task.taskName}
                  onChange={(e) => updateTask(section.id, task.id, 'taskName', e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />

                <FormControl fullWidth>
                  <InputLabel shrink>Select Input Type</InputLabel>
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
                        checked={task[field]}
                        onCheckedChange={(val) => updateTask(section.id, task.id, field, val)}
                      />
                      <span className="capitalize">{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => addQuestion(section.id)}
                className="bg-red-600 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Question
              </Button>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap justify-between gap-4">
          <Button
            type="button"
            onClick={addTaskSection}
            className="bg-red-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Section
          </Button>

          <Button
            type="submit"
            className="bg-red-600 text-white px-6"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
