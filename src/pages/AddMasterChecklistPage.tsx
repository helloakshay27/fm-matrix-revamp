import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  FormControl,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';
import { PostHogAuditActivity } from '@/components/PostHogAuditActivity';

// Business Genie input spec: label sits above the control (see FieldLabel),
// white surface, 44px min height, 12px radius, 1px hairline border, 13.5px/500 text.
const fieldStyles = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    minHeight: '44px',
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: 'rgba(44, 44, 44, 0.12)',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(44, 44, 44, 0.24)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-primary)',
      borderWidth: '1px',
    },
  },
  '& .MuiOutlinedInput-input, & .MuiSelect-select': {
    color: '#2C2C2C',
    fontSize: '13.5px',
    fontWeight: 500,
    padding: '0 14px',
    height: '44px',
    lineHeight: '44px',
    boxSizing: 'border-box',
    '&::placeholder': {
      color: 'rgba(44, 44, 44, 0.48)',
      opacity: 1,
    },
  },
};

const multilineFieldStyles = {
  ...fieldStyles,
  '& .MuiOutlinedInput-root': {
    ...fieldStyles['& .MuiOutlinedInput-root'],
    minHeight: '88px',
    padding: '12px 14px',
    alignItems: 'flex-start',
  },
  '& .MuiOutlinedInput-input': {
    ...fieldStyles['& .MuiOutlinedInput-input, & .MuiSelect-select'],
    padding: 0,
    height: 'auto',
    lineHeight: 1.5,
  },
};

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    className="block mb-1.5 text-[12px] font-semibold"
    style={{ color: 'rgba(44, 44, 44, 0.68)' }}
  >
    {children}
  </span>
);

// One ink primary action per view; supporting actions use the neutral outlined shell.
const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 h-[42px] px-[22px] rounded-[8px] bg-[#2C2C2C] text-white text-[13px] font-semibold hover:bg-[#2C2C2C]/90 transition-colors';
const secondaryButtonClass =
  'inline-flex items-center justify-center gap-[7px] h-[40px] px-[18px] rounded-[8px] bg-white border border-[rgba(44,44,44,0.12)] text-[#2C2C2C] text-[12.5px] font-semibold hover:bg-[#F6F4EE] transition-colors';

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
  const [checklistCreatedEvent, setChecklistCreatedEvent] = useState<{ key: number; properties: Record<string, unknown> } | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

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
    const questionCount = taskSections.reduce((sum, section) => sum + section.tasks.length, 0);
    setChecklistCreatedEvent({
      key: Date.now(),
      properties: {
        question_count: questionCount,
        import_method: 'manual',
        schedule_for: scheduleFor,
      },
    });
    navigate('/maintenance/audit/operational/master-checklists');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto">
      {checklistCreatedEvent && (
        <PostHogAuditActivity
          key={checklistCreatedEvent.key}
          event="Master Checklist Created"
          properties={checklistCreatedEvent.properties}
        />
      )}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <p className="text-sm text-gray-500">Master Checklist &gt; Add Master Checklist</p>
        </div>
        <h1 className="text-2xl font-bold">ADD MASTER CHECKLIST</h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            checked={createTask} 
            onCheckedChange={(checked) => setCreateTask(checked === true)} 
            id="createTask" 
          />
          <Label htmlFor="createTask">Create Task</Label>
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
            <div className="w-6 h-6 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-sm">1</div>
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

            <div>
              <FieldLabel>Activity Name *</FieldLabel>
              <TextField
                placeholder="Enter Activity"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                variant="outlined"
                required
                inputProps={{ 'aria-label': 'Activity Name' }}
                sx={fieldStyles}
              />
            </div>

            <div>
              <FieldLabel>Description</FieldLabel>
              <TextField
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                multiline
                minRows={3}
                inputProps={{ 'aria-label': 'Description' }}
                sx={multilineFieldStyles}
              />
            </div>

            <div>
            <FieldLabel>Asset Type</FieldLabel>
            <FormControl variant="outlined" sx={fieldStyles}>
              <MuiSelect
                displayEmpty
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                inputProps={{ 'aria-label': 'Asset Type' }}
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
        </div>

        {taskSections.map((section) => (
          <div key={section.id} className="bg-white border rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-sm">2</div>
                <h2 className="font-semibold text-lg">Task</h2>
              </div>
              {taskSections.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTaskSection(section.id)}
                  className="text-[var(--color-primary)]"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
              <FieldLabel>Group</FieldLabel>
              <FormControl variant="outlined" sx={fieldStyles}>
                <MuiSelect
                  displayEmpty
                  value={section.group}
                  onChange={(e) => updateTaskSection(section.id, 'group', e.target.value)}
                  inputProps={{ 'aria-label': 'Group' }}
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
              </div>

              <div>
              <FieldLabel>Sub Group</FieldLabel>
              <FormControl variant="outlined" sx={fieldStyles}>
                <MuiSelect
                  displayEmpty
                  value={section.subGroup}
                  onChange={(e) => updateTaskSection(section.id, 'subGroup', e.target.value)}
                  inputProps={{ 'aria-label': 'Sub Group' }}
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
              </div>
            </div>

            {section.tasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border p-4 rounded"
              >
                <div>
                  <FieldLabel>Task *</FieldLabel>
                  <TextField
                    placeholder="Enter Task"
                    value={task.taskName}
                    onChange={(e) => updateTask(section.id, task.id, 'taskName', e.target.value)}
                    variant="outlined"
                    inputProps={{ 'aria-label': 'Task' }}
                    sx={fieldStyles}
                  />
                </div>

                <div>
                <FieldLabel>Input Type</FieldLabel>
                <FormControl variant="outlined" sx={fieldStyles}>
                  <MuiSelect
                    displayEmpty
                    value={task.inputType}
                    onChange={(e) => updateTask(section.id, task.id, 'inputType', e.target.value)}
                    inputProps={{ 'aria-label': 'Input Type' }}
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
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
                  {['mandatory', 'reading', 'helpText'].map((field) => (
                    <label key={field} className="flex items-center gap-2">
                      <Checkbox
                        checked={task[field]}
                        onCheckedChange={(checked) => updateTask(section.id, task.id, field, checked === true)}
                      />
                      <span className="capitalize">{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => addQuestion(section.id)}
                className={secondaryButtonClass}
              >
                <Plus className="w-4 h-4" /> Add Question
              </button>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap justify-between gap-4">
          <button
            type="button"
            onClick={addTaskSection}
            className={secondaryButtonClass}
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>

          <button
            type="submit"
            className={primaryButtonClass}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
