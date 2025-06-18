
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export const AddMasterChecklistPage = () => {
  const navigate = useNavigate();
  
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
    // Add submission logic here
    alert('Master checklist created successfully!');
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
            onCheckedChange={setCreateTask}
          />
          <Label htmlFor="createTask">Create Task</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="weightage" 
            checked={weightage}
            onCheckedChange={setWeightage}
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
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="assetType" className="text-sm font-medium mb-2 block">Asset Type</Label>
              <Select value={assetType} onValueChange={setAssetType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="mechanical">Mechanical</SelectItem>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="fire-safety">Fire Safety</SelectItem>
                </SelectContent>
              </Select>
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
                <Label className="text-sm font-medium mb-2 block">Select Group</Label>
                <Select value={section.group} onValueChange={(value) => updateTaskSection(section.id, 'group', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrical">Electrical</SelectItem>
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
                    <SelectItem value="lighting">Lighting</SelectItem>
                    <SelectItem value="power">Power</SelectItem>
                    <SelectItem value="ventilation">Ventilation</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tasks */}
            {section.tasks.map((task, taskIndex) => (
              <div key={task.id} className="grid grid-cols-2 gap-4 mb-4 p-4 border rounded">
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
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="dropdown">Dropdown</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 flex gap-6">
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={task.mandatory}
                      onCheckedChange={(checked) => updateTask(section.id, task.id, 'mandatory', checked)}
                    />
                    <span>Mandatory</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={task.reading}
                      onCheckedChange={(checked) => updateTask(section.id, task.id, 'reading', checked)}
                    />
                    <span>Reading</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={task.helpText}
                      onCheckedChange={(checked) => updateTask(section.id, task.id, 'helpText', checked)}
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
