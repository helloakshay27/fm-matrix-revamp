
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Checkbox } from '@mui/material';

export const AddOperationalAuditSchedulePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    auditName: '',
    auditType: '',
    frequency: '',
    startDate: '',
    endDate: '',
    auditor: '',
    department: '',
    location: '',
    description: '',
    priority: '',
    checklist: ''
  });

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    console.log('Audit Schedule Data:', { ...formData, taskSections });
    
    toast({
      title: "Success",
      description: "Operational audit schedule created successfully!",
    });
    
    navigate('/maintenance/audit/operational');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/audit/operational')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Operational Audit
        </Button>
        <p className="text-[#1a1a1a] opacity-70 mb-2">Operational Audit &gt; Add Schedule</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ADD OPERATIONAL AUDIT SCHEDULE</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
              AUDIT DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <TextField
                  required
                  label="Audit Name"
                  placeholder="Enter Audit Name"
                  name="auditName"
                  value={formData.auditName}
                  onChange={(e) => handleInputChange('auditName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="audit-type-label" shrink>Audit Type</InputLabel>
                  <MuiSelect
                    labelId="audit-type-label"
                    label="Audit Type"
                    displayEmpty
                    value={formData.auditType}
                    onChange={(e) => handleInputChange('auditType', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Type</em></MenuItem>
                    <MenuItem value="operational">Operational</MenuItem>
                    <MenuItem value="compliance">Compliance</MenuItem>
                    <MenuItem value="safety">Safety</MenuItem>
                    <MenuItem value="quality">Quality</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="frequency-label" shrink>Frequency</InputLabel>
                  <MuiSelect
                    labelId="frequency-label"
                    label="Frequency"
                    displayEmpty
                    value={formData.frequency}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Frequency</em></MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <TextField
                  required
                  label="Start Date"
                  placeholder="Select Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    sx: {
                      ...fieldStyles,
                      '& .MuiInputBase-input': {
                        ...fieldStyles['& .MuiInputBase-input, & .MuiSelect-select'],
                        fontSize: { xs: '11px', sm: '12px', md: '13px' },
                      }
                    }
                  }}
                />
              </div>

              <div>
                <TextField
                  label="End Date"
                  placeholder="Select Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    sx: {
                      ...fieldStyles,
                      '& .MuiInputBase-input': {
                        ...fieldStyles['& .MuiInputBase-input, & .MuiSelect-select'],
                        fontSize: { xs: '11px', sm: '12px', md: '13px' },
                      }
                    }
                  }}
                />
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="auditor-label" shrink>Auditor</InputLabel>
                  <MuiSelect
                    labelId="auditor-label"
                    label="Auditor"
                    displayEmpty
                    value={formData.auditor}
                    onChange={(e) => handleInputChange('auditor', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Auditor</em></MenuItem>
                    <MenuItem value="john-doe">John Doe</MenuItem>
                    <MenuItem value="jane-smith">Jane Smith</MenuItem>
                    <MenuItem value="mike-johnson">Mike Johnson</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="department-label" shrink>Department</InputLabel>
                  <MuiSelect
                    labelId="department-label"
                    label="Department"
                    displayEmpty
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Department</em></MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="operations">Operations</MenuItem>
                    <MenuItem value="safety">Safety</MenuItem>
                    <MenuItem value="quality">Quality</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="location-label" shrink>Location</InputLabel>
                  <MuiSelect
                    labelId="location-label"
                    label="Location"
                    displayEmpty
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Location</em></MenuItem>
                    <MenuItem value="building-a">Building A</MenuItem>
                    <MenuItem value="building-b">Building B</MenuItem>
                    <MenuItem value="parking">Parking Area</MenuItem>
                    <MenuItem value="lobby">Lobby</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            <div className="mb-4">
              <TextField
                label="Description"
                placeholder="Enter description"
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Task Sections */}
        {taskSections.map((section, sectionIndex) => (
          <Card key={section.id} className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-[#C72030] flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
                AUDIT CHECKLIST
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                        onChange={(e) => updateTask(section.id, task.id, 'mandatory', e.target.checked)}
                      />
                      <span>Mandatory</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={task.reading}
                        onChange={(e) => updateTask(section.id, task.id, 'reading', e.target.checked)}
                      />
                      <span>Reading</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={task.helpText}
                        onChange={(e) => updateTask(section.id, task.id, 'helpText', e.target.checked)}
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
            </CardContent>
          </Card>
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

          <div className="flex gap-4">
            <Button
              type="submit"
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90 px-8"
            >
              Submit
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/maintenance/audit/operational')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="text-sm text-[#1a1a1a] opacity-70">
          Powered by <span className="font-semibold">go</span><span className="text-[#C72030]">Phygital</span><span className="font-semibold">.work</span>
        </div>
      </div>
    </div>
  );
};
