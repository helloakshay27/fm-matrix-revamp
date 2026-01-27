import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Box,
  Paper,
  TextField,
  Button as MuiButton,
  Typography,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  MenuItem,
  Select as MuiSelect,
  FormControl,
  InputLabel,
  Checkbox as MuiCheckbox,
  IconButton,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Settings, Add, Delete, ArrowBack } from '@mui/icons-material';
import { stepConnectorClasses } from '@mui/material/StepConnector';

// Styled Components
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#C72030',
      borderStyle: 'dashed',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#C72030',
      borderStyle: 'dashed',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#E0E0E0',
    borderTopWidth: 2,
    borderStyle: 'dashed',
  },
}));

const RedButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#C72030',
  color: 'white',
  borderRadius: 0,
  textTransform: 'none',
  padding: '10px 24px',
  fontFamily: 'Work Sans, sans-serif',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#A01828',
    boxShadow: '0 4px 8px rgba(199, 32, 48, 0.3)',
  },
}));

const DraftButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#e7e3d9',
  color: '#C72030',
  borderRadius: 0,
  textTransform: 'none',
  padding: '10px 24px',
  fontFamily: 'Work Sans, sans-serif',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#d9d5c9',
  },
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  borderRadius: 0,
  overflow: 'hidden',
  marginBottom: '24px',
  padding: '24px',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '24px',
}));

const RedIcon = styled(Settings)(({ theme }) => ({
  color: '#fff',
  backgroundColor: '#C72030',
  borderRadius: '50%',
  padding: '8px',
  fontSize: '32px',
}));

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    fontSize: '14px',
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: '#C72030',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '14px',
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

const steps = ['Basic Info', 'Task', 'Schedule'];

interface TaskQuestion {
  id: string;
  group: string;
  subGroup: string;
  task: string;
  inputType: string;
  mandatory: boolean;
  reading: boolean;
  helpText: string;
}

interface TaskSection {
  id: string;
  group: string;
  subGroup: string;
  tasks: TaskQuestion[];
}

export const AddOperationalAuditSchedulePage = () => {
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [scheduleFor, setScheduleFor] = useState('Asset');
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [taskSections, setTaskSections] = useState<TaskSection[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);

  // Schedule fields
  const [checklistType, setChecklistType] = useState('Individual');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [assetGroup, setAssetGroup] = useState('');
  const [assetSubGroup, setAssetSubGroup] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [scanType, setScanType] = useState('');
  const [assets, setAssets] = useState<any[]>([]);
  const [assetGroups, setAssetGroups] = useState<any[]>([]);
  const [assetSubGroups, setAssetSubGroups] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [subGroups, setSubGroups] = useState<any>({});
  const [planDuration, setPlanDuration] = useState('Day');
  const [planDurationValue, setPlanDurationValue] = useState('');
  const [priority, setPriority] = useState('');
  const [emailTriggerRule, setEmailTriggerRule] = useState('');
  const [category, setCategory] = useState('');
  const [lockOverdueTask, setLockOverdueTask] = useState('');
  const [supervisors, setSupervisors] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startFrom, setStartFrom] = useState('');
  const [endAt, setEndAt] = useState('');
  const [supplier, setSupplier] = useState('');
  const [suppliers, setSuppliers] = useState<any[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch(`https://${baseUrl}/assets.json`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setAssets(data.assets || []);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(`https://${baseUrl}/users.json`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await fetch(`https://${baseUrl}/suppliers.json`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setSuppliers(data.suppliers || []);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await fetch(`https://${baseUrl}/pms/checklist_groups.json`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setGroups(data.data || []);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    if (baseUrl && token) {
      fetchAssets();
      fetchUsers();
      fetchSuppliers();
      fetchGroups();
    }
  }, [baseUrl, token]);

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.includes(stepIndex);
  };

  const handleNext = () => {
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps([...completedSteps, activeStep]);
    }
    if (activeStep < 2) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      toast.success('Operational audit schedule created successfully!');
      navigate(-1);
    } catch (error) {
      toast.error('Failed to save operational audit schedule');
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const addTaskSection = () => {
    const newSection: TaskSection = {
      id: `section_${Date.now()}`,
      group: '',
      subGroup: '',
      tasks: [{
        id: `task_${Date.now()}`,
        group: '',
        subGroup: '',
        task: '',
        inputType: '',
        mandatory: false,
        reading: false,
        helpText: ''
      }]
    };
    setTaskSections([...taskSections, newSection]);
  };

  const addTaskToSection = (sectionIndex: number) => {
    const updatedSections = [...taskSections];
    updatedSections[sectionIndex].tasks.push({
      id: `task_${Date.now()}`,
      group: updatedSections[sectionIndex].group,
      subGroup: updatedSections[sectionIndex].subGroup,
      task: '',
      inputType: '',
      mandatory: false,
      reading: false,
      helpText: ''
    });
    setTaskSections(updatedSections);
  };

  const removeTaskFromSection = (sectionIndex: number, taskIndex: number) => {
    const updatedSections = [...taskSections];
    updatedSections[sectionIndex].tasks.splice(taskIndex, 1);
    setTaskSections(updatedSections);
  };

  const updateSectionGroup = (sectionIndex: number, group: string) => {
    const updatedSections = [...taskSections];
    updatedSections[sectionIndex].group = group;
    updatedSections[sectionIndex].tasks.forEach(task => task.group = group);
    setTaskSections(updatedSections);
  };

  const updateSectionSubGroup = (sectionIndex: number, subGroup: string) => {
    const updatedSections = [...taskSections];
    updatedSections[sectionIndex].subGroup = subGroup;
    updatedSections[sectionIndex].tasks.forEach(task => task.subGroup = subGroup);
    setTaskSections(updatedSections);
  };

  const updateTaskField = (sectionIndex: number, taskIndex: number, field: string, value: any) => {
    const updatedSections = [...taskSections];
    updatedSections[sectionIndex].tasks[taskIndex] = {
      ...updatedSections[sectionIndex].tasks[taskIndex],
      [field]: value
    };
    setTaskSections(updatedSections);
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack} sx={{ color: '#666' }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
              Schedule List &gt; Create New Schedule
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, fontFamily: 'Work Sans, sans-serif' }}>
              ADD SCHEDULE
            </Typography>
          </Box>
        </Box>

        {/* Stepper */}
        <Box sx={{ mb: 4, backgroundColor: 'white', p: 3, borderRadius: 0 }}>
          <Stepper
            activeStep={activeStep}
            connector={<CustomStepConnector />}
            sx={{
              '& .MuiStepLabel-root .Mui-completed': {
                color: '#C72030',
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: '#C72030',
              },
              '& .MuiStepLabel-label': {
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Work Sans, sans-serif',
              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={label} completed={isStepCompleted(index)}>
                <StepLabel
                  sx={{
                    cursor: 'pointer',
                    '& .MuiStepIcon-root': {
                      color: isStepCompleted(index) || activeStep === index ? '#C72030' : '#E0E0E0',
                      '&.Mui-active': {
                        color: '#C72030',
                      },
                      '&.Mui-completed': {
                        color: '#C72030',
                      },
                    },
                  }}
                  onClick={() => handleStepClick(index)}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step Content */}
        {activeStep === 0 && (
          <SectionCard>
            <SectionHeader>
              <RedIcon />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030', fontFamily: 'Work Sans, sans-serif' }}>
                BASIC INFO
              </Typography>
              <Typography variant="caption" sx={{ ml: 'auto', color: '#666' }}>
                Schedule For: <strong>Asset</strong>
              </Typography>
            </SectionHeader>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                Schedule For
              </Typography>
              <MuiRadioGroup row value={scheduleFor} onChange={(e) => setScheduleFor(e.target.value)}>
                <FormControlLabel value="Asset" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Asset" />
                <FormControlLabel value="Service" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Service" />
                <FormControlLabel value="Vendor" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Vendor" />
                <FormControlLabel value="Training" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Training" />
              </MuiRadioGroup>
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Activity Name *"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="Enter Activity Name"
                sx={fieldStyles}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description"
                sx={fieldStyles}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <RedButton
                variant="contained"
                onClick={() => {
                  toast.success('Attachment functionality coming soon');
                }}
                startIcon={<Add />}
              >
                Add Attachment
              </RedButton>
            </Box>
          </SectionCard>
        )}

        {/* Step 2: Task */}
        {activeStep === 1 && (
          <SectionCard>
            <SectionHeader>
              <RedIcon />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030', fontFamily: 'Work Sans, sans-serif' }}>
                TASK
              </Typography>
              <Box sx={{ ml: 'auto' }}>
                <RedButton
                  variant="contained"
                  onClick={addTaskSection}
                  startIcon={<Add />}
                >
                  Add Section
                </RedButton>
              </Box>
            </SectionHeader>

            {taskSections.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No sections added yet. Click "Add Section" to get started.
                </Typography>
              </Box>
            ) : (
              taskSections.map((section, sectionIndex) => (
                <Box key={section.id} sx={{ mb: 3, p: 3, border: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                  {/* Group and SubGroup Selection */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                    <FormControl fullWidth sx={fieldStyles}>
                      <InputLabel>Group</InputLabel>
                      <MuiSelect
                        value={section.group}
                        label="Group"
                        onChange={(e) => updateSectionGroup(sectionIndex, e.target.value)}
                      >
                        <MenuItem value="">Select Group</MenuItem>
                        {groups.map((group: any) => (
                          <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>

                    <FormControl fullWidth sx={fieldStyles}>
                      <InputLabel>SubGroup</InputLabel>
                      <MuiSelect
                        value={section.subGroup}
                        label="SubGroup"
                        onChange={(e) => updateSectionSubGroup(sectionIndex, e.target.value)}
                      >
                        <MenuItem value="">Select Sub Group</MenuItem>
                        {(subGroups[section.group] || []).map((sg: any) => (
                          <MenuItem key={sg.id} value={sg.id}>{sg.name}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </Box>

                  {/* Tasks */}
                  {section.tasks.map((task, taskIndex) => (
                    <Box key={task.id} sx={{ mb: 2, p: 2, backgroundColor: 'white', border: '1px solid #e0e0e0', position: 'relative' }}>
                      {section.tasks.length > 1 && (
                        <IconButton
                          onClick={() => removeTaskFromSection(sectionIndex, taskIndex)}
                          sx={{ position: 'absolute', top: 8, right: 8, color: '#C72030' }}
                          size="small"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      )}

                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                        <TextField
                          fullWidth
                          label="Task"
                          value={task.task}
                          onChange={(e) => updateTaskField(sectionIndex, taskIndex, 'task', e.target.value)}
                          placeholder="Enter Task"
                          sx={fieldStyles}
                        />

                        <FormControl fullWidth sx={fieldStyles}>
                          <InputLabel>Task</InputLabel>
                          <MuiSelect
                            value={task.inputType}
                            label="Task"
                            onChange={(e) => updateTaskField(sectionIndex, taskIndex, 'inputType', e.target.value)}
                          >
                            <MenuItem value="">Select Input Type</MenuItem>
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="number">Number</MenuItem>
                            <MenuItem value="checkbox">Checkbox</MenuItem>
                            <MenuItem value="radio">Radio</MenuItem>
                            <MenuItem value="dropdown">Dropdown</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 3 }}>
                        <FormControlLabel
                          control={
                            <MuiCheckbox
                              checked={task.mandatory}
                              onChange={(e) => updateTaskField(sectionIndex, taskIndex, 'mandatory', e.target.checked)}
                              sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                            />
                          }
                          label="Mandatory"
                        />
                        <FormControlLabel
                          control={
                            <MuiCheckbox
                              checked={task.reading}
                              onChange={(e) => updateTaskField(sectionIndex, taskIndex, 'reading', e.target.checked)}
                              sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                            />
                          }
                          label="Reading"
                        />
                        <FormControlLabel
                          control={
                            <MuiCheckbox
                              checked={!!task.helpText}
                              onChange={(e) => updateTaskField(sectionIndex, taskIndex, 'helpText', e.target.checked ? 'Help text' : '')}
                              sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                            />
                          }
                          label="Help Text"
                        />
                      </Box>
                    </Box>
                  ))}

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <MuiButton
                      variant="outlined"
                      onClick={() => addTaskToSection(sectionIndex)}
                      startIcon={<Add />}
                      sx={{ borderColor: '#C72030', color: '#C72030', '&:hover': { borderColor: '#A01828', backgroundColor: 'rgba(199, 32, 48, 0.04)' } }}
                    >
                      Add Question
                    </MuiButton>
                  </Box>
                </Box>
              ))
            )}
          </SectionCard>
        )}

        {/* Step 3: Schedule */}
        {activeStep === 2 && (
          <SectionCard>
            <SectionHeader>
              <RedIcon />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030', fontFamily: 'Work Sans, sans-serif' }}>
                SCHEDULE
              </Typography>
            </SectionHeader>

            {/* Checklist Type */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                Checklist Type
              </Typography>
              <MuiRadioGroup row value={checklistType} onChange={(e) => setChecklistType(e.target.value)}>
                <FormControlLabel value="Individual" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Individual" />
                <FormControlLabel value="Asset Group" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Asset Group" />
              </MuiRadioGroup>
            </Box>

            {/* Conditional Fields based on Checklist Type */}
            {checklistType === 'Individual' ? (
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth sx={fieldStyles}>
                  <InputLabel>Asset</InputLabel>
                  <MuiSelect
                    value={selectedAsset}
                    label="Asset"
                    onChange={(e) => setSelectedAsset(e.target.value)}
                  >
                    <MenuItem value="">Select Asset</MenuItem>
                    {assets.map((asset: any) => (
                      <MenuItem key={asset.id} value={asset.id}>{asset.name}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                <FormControl fullWidth sx={fieldStyles}>
                  <InputLabel>Group</InputLabel>
                  <MuiSelect
                    value={assetGroup}
                    label="Group"
                    onChange={(e) => setAssetGroup(e.target.value)}
                  >
                    <MenuItem value="">Select Asset Group</MenuItem>
                    {assetGroups.map((group: any) => (
                      <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <FormControl fullWidth sx={fieldStyles}>
                  <InputLabel>Sub-Group</InputLabel>
                  <MuiSelect
                    value={assetSubGroup}
                    label="Sub-Group"
                    onChange={(e) => setAssetSubGroup(e.target.value)}
                  >
                    <MenuItem value="">Select Sub-Group</MenuItem>
                    {assetSubGroups.map((sg: any) => (
                      <MenuItem key={sg.id} value={sg.id}>{sg.name}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </Box>
            )}

            {/* Row 1: Assign To, Scan Type, Plan Duration */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>Assign To</InputLabel>
                <MuiSelect
                  value={assignTo}
                  label="Assign To"
                  onChange={(e) => setAssignTo(e.target.value)}
                >
                  <MenuItem value="">Select Assign To</MenuItem>
                  {users.map((user: any) => (
                    <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>Scan Type</InputLabel>
                <MuiSelect
                  value={scanType}
                  label="Scan Type"
                  onChange={(e) => setScanType(e.target.value)}
                >
                  <MenuItem value="">Select Scan Type</MenuItem>
                  <MenuItem value="qr">QR Code</MenuItem>
                  <MenuItem value="barcode">Barcode</MenuItem>
                  <MenuItem value="manual">Manual</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>Plan Duration</InputLabel>
                <MuiSelect
                  value={planDuration}
                  label="Plan Duration"
                  onChange={(e) => setPlanDuration(e.target.value)}
                >
                  <MenuItem value="Day">Day</MenuItem>
                  <MenuItem value="Week">Week</MenuItem>
                  <MenuItem value="Month">Month</MenuItem>
                </MuiSelect>
              </FormControl>
            </Box>

            {/* Row 2: Plan Duration Field, Priority, Email Trigger Rule */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Plan Duration Field"
                value={planDurationValue}
                onChange={(e) => setPlanDurationValue(e.target.value)}
                placeholder="Enter Plan Duration"
                sx={fieldStyles}
              />

              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>Priority</InputLabel>
                <MuiSelect
                  value={priority}
                  label="Priority"
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <MenuItem value="">Select Priority</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>Email Trigger Rule</InputLabel>
                <MuiSelect
                  value={emailTriggerRule}
                  label="Email Trigger Rule"
                  onChange={(e) => setEmailTriggerRule(e.target.value)}
                >
                  <MenuItem value="">Select Email Trigger Rule</MenuItem>
                  <MenuItem value="immediate">Immediate</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                </MuiSelect>
              </FormControl>
            </Box>

            {/* Row 3: Supervisors, Category, Lock Overdue Task */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>Supervisors</InputLabel>
                <MuiSelect
                  value={supervisors}
                  label="Supervisors"
                  onChange={(e) => setSupervisors(e.target.value)}
                >
                  <MenuItem value="">Select Supervisors</MenuItem>
                  {users.map((user: any) => (
                    <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>Category</InputLabel>
                <MuiSelect
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="">Select Category</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="inspection">Inspection</MenuItem>
                  <MenuItem value="audit">Audit</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>Lock Overdue Task</InputLabel>
                <MuiSelect
                  value={lockOverdueTask}
                  label="Lock Overdue Task"
                  onChange={(e) => setLockOverdueTask(e.target.value)}
                >
                  <MenuItem value="">Select Lock Status</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </MuiSelect>
              </FormControl>
            </Box>

            {/* Row 4: Frequency, Start From, End At */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>Frequency</InputLabel>
                <MuiSelect
                  value={frequency}
                  label="Frequency"
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <MenuItem value="">Select Frequency</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </MuiSelect>
              </FormControl>

              <TextField
                fullWidth
                type="date"
                label="Start From"
                value={startFrom}
                onChange={(e) => setStartFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />

              <TextField
                fullWidth
                type="date"
                label="End At"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />
            </Box>

            {/* Row 5: Select Supplier */}
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>Select Supplier</InputLabel>
                <MuiSelect
                  value={supplier}
                  label="Select Supplier"
                  onChange={(e) => setSupplier(e.target.value)}
                >
                  <MenuItem value="">Select Supplier</MenuItem>
                  {suppliers.map((sup: any) => (
                    <MenuItem key={sup.id} value={sup.id}>{sup.name}</MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </Box>
          </SectionCard>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <DraftButton
            variant="contained"
            onClick={() => {
              toast.success('Draft saved');
              navigate(-1);
            }}
          >
            Save to Draft
          </DraftButton>
          <RedButton
            variant="contained"
            onClick={activeStep === 2 ? handleSubmit : handleNext}
          >
            {activeStep === 2 ? 'Proceed to Save' : 'Proceed to Save'}
          </RedButton>
        </Box>
      </Box>
    </Box>
  );
};
