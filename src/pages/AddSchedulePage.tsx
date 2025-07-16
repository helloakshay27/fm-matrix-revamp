import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
  IconButton,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button as MuiButton,
  Switch as MuiSwitch,
  StepConnector,
  styled
} from '@mui/material';
import {
  Settings,
  Edit,
  Add,
  Close,
  AttachFile,
  ArrowBack
} from '@mui/icons-material';
import { Cog } from 'lucide-react';

// Styled Components
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: '#E0E0E0',
    borderTopWidth: 2,
    borderStyle: 'dotted',
  },
}));

const CustomStep = styled(Step)(({ theme }) => ({
  '& .MuiStepLabel-root .Mui-completed': {
    color: '#D42F2F',
  },
  '& .MuiStepLabel-root .Mui-active': {
    color: '#D42F2F',
  },
  '& .MuiStepLabel-label': {
    fontSize: '14px',
    fontWeight: 500,
  },
}));

const RedButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#D42F2F',
  color: 'white',
  borderRadius: '8px',
  textTransform: 'none',
  padding: '8px 16px',
  boxShadow: '0 2px 4px rgba(212, 47, 47, 0.2)',
  '&:hover': {
    backgroundColor: '#B8252F',
    boxShadow: '0 4px 8px rgba(212, 47, 47, 0.3)',
  },
}));

const DraftButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#F5F1E8',
  color: '#8B7355',
  borderRadius: '8px',
  textTransform: 'none',
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: '#EDE6D8',
  },
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid #F0F0F0',
  marginBottom: '24px',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '24px',
}));

const RedIcon = styled(Settings)(({ theme }) => ({
  color: '#D42F2F',
  backgroundColor: '#D42F2F',
  borderRadius: '50%',
  padding: '8px',
  fontSize: '32px',
}));

interface AttachmentFile {
  id: string;
  name: string;
  url: string;
}

interface TaskQuestion {
  id: string;
  group: string;
  subGroup: string;
  task: string;
  inputType: string;
  mandatory: boolean;
  helpText: boolean;
  autoTicket: boolean;
}

export const AddSchedulePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const steps = ['Basic Configuration', 'Schedule Setup', 'Question Setup', 'Time Setup', 'Mapping'];
  
  // Form data
  const [formData, setFormData] = useState({
    // Basic Configuration
    type: 'PPM',
    scheduleFor: 'Asset',
    activityName: '',
    description: '',
    
    // Schedule Setup
    checklistType: 'Individual',
    asset: '',
    assignTo: '',
    backupAssignee: '',
    planDuration: '',
    emailTriggerRule: '',
    scanType: '',
    category: '',
    submissionTime: '',
    supervisors: '',
    lockOverdueTask: '',
    frequency: '',
    graceTime: '',
    endAt: '',
    supplier: '',
    startFrom: '',
    
    // Mapping
    assetName: '',
    parameter: ''
  });
  
  // Question Setup
  const [tasks, setTasks] = useState<TaskQuestion[]>([
    {
      id: '1',
      group: '',
      subGroup: '',
      task: '',
      inputType: '',
      mandatory: false,
      helpText: false,
      autoTicket: false
    }
  ]);
  
  // Time Setup
  const [timeTab, setTimeTab] = useState(0);
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [hourRange, setHourRange] = useState({ start: 0, end: 23 });
  const [everyHourBetween, setEveryHourBetween] = useState(false);
  
  // Attachments
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  
  // Toggles
  const [createTicket, setCreateTicket] = useState(false);
  const [autoTicket, setAutoTicket] = useState(false);
  
  const handleNext = () => {
    // Mark current step as completed
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps([...completedSteps, activeStep]);
    }
    
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };
  
  const handleBack = () => {
    if (activeStep > 0) {
      const newActiveStep = activeStep - 1;
      // Remove completion status from steps after the new active step
      setCompletedSteps(completedSteps.filter(step => step < newActiveStep));
      setActiveStep(newActiveStep);
    }
  };
  
  const handleStepClick = (step: number) => {
    if (step < activeStep) {
      // Going backwards - remove completion status from steps after the clicked step
      setCompletedSteps(completedSteps.filter(stepIndex => stepIndex < step));
    } else if (step > activeStep) {
      // Going forwards - mark current step as completed
      if (!completedSteps.includes(activeStep)) {
        setCompletedSteps([...completedSteps, activeStep]);
      }
    }
    setActiveStep(step);
  };
  
  // Check if a step should be red (active or completed)
  const isStepRed = (stepIndex: number) => {
    return stepIndex === activeStep || completedSteps.includes(stepIndex);
  };
  
  const addTask = () => {
    const newTask: TaskQuestion = {
      id: Date.now().toString(),
      group: '',
      subGroup: '',
      task: '',
      inputType: '',
      mandatory: false,
      helpText: false,
      autoTicket: false
    };
    setTasks([...tasks, newTask]);
  };
  
  const updateTask = (id: string, field: keyof TaskQuestion, value: any) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };
  
  const addAttachment = () => {
    // In a real app, this would open a file picker
    const newAttachment: AttachmentFile = {
      id: Date.now().toString(),
      name: 'attachment.pdf',
      url: '#'
    };
    setAttachments([...attachments, newAttachment]);
  };
  
  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };
  
  const toggleHour = (hour: number) => {
    setSelectedHours(prev => 
      prev.includes(hour) 
        ? prev.filter(h => h !== hour)
        : [...prev, hour]
    );
  };
  
  const handleSave = () => {
    toast({
      title: "Success",
      description: "Schedule saved successfully!",
    });
  };
  
  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Schedule saved as draft!",
    });
  };

  const renderStepContent = () => {
    // Show all steps up to and including the current active step
    const stepsToShow = [];
    
    for (let i = 0; i <= activeStep; i++) {
      stepsToShow.push(
        <Box key={`step-${i}`}>
          {renderSingleStep(i)}
        </Box>
      );
    }
    
    return stepsToShow;
  };

  const renderSingleStep = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Basic Configuration
        return (
          <Box>
            {/* Header Outside the Box */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 3,
              px: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  backgroundColor: '#C72030',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Cog size={16} color="white" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030' }}>
                  Basic Configuration
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MuiSwitch 
                  checked={createTicket}
                  onChange={(e) => setCreateTicket(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#C72030' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#C72030' }
                  }}
                />
                <Typography variant="body2" sx={{ color: '#666' }}>Create Ticket</Typography>
              </Box>
            </Box>

            {/* Main Content in White Box */}
            <SectionCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Type</Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Schedule For: <strong>Asset</strong>
                </Typography>
              </Box>
              
              <RadioGroup
                row
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                sx={{ mb: 3 }}
              >
                <FormControlLabel 
                  value="PPM" 
                  control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                  label="PPM" 
                />
                <FormControlLabel 
                  value="AMC" 
                  control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                  label="AMC" 
                />
                <FormControlLabel 
                  value="Preparedness" 
                  control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                  label="Preparedness" 
                />
                <FormControlLabel 
                  value="Routine" 
                  control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                  label="Routine" 
                />
              </RadioGroup>
              
              <TextField
                label="Activity Name"
                placeholder="Enter Activity Name"
                fullWidth
                value={formData.activityName}
                onChange={(e) => setFormData({...formData, activityName: e.target.value})}
                sx={{ mb: 3 }}
              />
              
              <TextField
                label="Description"
                placeholder="Enter Description/SOP"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                sx={{ mb: 3 }}
              />
              
              {/* Add Attachment Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <RedButton 
                  startIcon={<AttachFile />}
                  onClick={addAttachment}
                >
                  Add Attachment
                </RedButton>
              </Box>
            </SectionCard>
          </Box>
        );
        
      case 1: // Schedule Setup
        return (
          <Box>
            {/* Header Outside the Box */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mb: 3,
              px: 1
            }}>
              <Box sx={{
                backgroundColor: '#C72030',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Cog size={16} color="white" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030' }}>
                Schedule Setup
              </Typography>
            </Box>

            {/* Main Content in White Box */}
            <SectionCard>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Checklist Type</Typography>
                <RadioGroup
                  row
                  value={formData.checklistType}
                  onChange={(e) => setFormData({...formData, checklistType: e.target.value})}
                >
                  <FormControlLabel 
                    value="Individual" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Individual" 
                  />
                  <FormControlLabel 
                    value="Asset Group" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Asset Group" 
                  />
                  <FormControlLabel 
                    value="Branching" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Branching" 
                  />
                </RadioGroup>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Asset</InputLabel>
                  <Select value={formData.asset} onChange={(e) => setFormData({...formData, asset: e.target.value})}>
                    <MenuItem value="">Select Asset</MenuItem>
                    <MenuItem value="asset1">Asset 1</MenuItem>
                    <MenuItem value="asset2">Asset 2</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Assign To</InputLabel>
                  <Select value={formData.assignTo} onChange={(e) => setFormData({...formData, assignTo: e.target.value})}>
                    <MenuItem value="">Select Assign To</MenuItem>
                    <MenuItem value="user1">User 1</MenuItem>
                    <MenuItem value="user2">User 2</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Backup Assignee</InputLabel>
                  <Select value={formData.backupAssignee} onChange={(e) => setFormData({...formData, backupAssignee: e.target.value})}>
                    <MenuItem value="">Select Backup Assignee</MenuItem>
                    <MenuItem value="backup1">Backup 1</MenuItem>
                    <MenuItem value="backup2">Backup 2</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Plan Duration</InputLabel>
                  <Select value={formData.planDuration} onChange={(e) => setFormData({...formData, planDuration: e.target.value})}>
                    <MenuItem value="">Select Plan Duration</MenuItem>
                    <MenuItem value="1h">1 Hour</MenuItem>
                    <MenuItem value="2h">2 Hours</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Email Trigger Rule</InputLabel>
                  <Select value={formData.emailTriggerRule} onChange={(e) => setFormData({...formData, emailTriggerRule: e.target.value})}>
                    <MenuItem value="">Select Email Trigger Rule</MenuItem>
                    <MenuItem value="immediate">Immediate</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Scan Type</InputLabel>
                  <Select value={formData.scanType} onChange={(e) => setFormData({...formData, scanType: e.target.value})}>
                    <MenuItem value="">Select Scan Type</MenuItem>
                    <MenuItem value="qr">QR Code</MenuItem>
                    <MenuItem value="barcode">Barcode</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <MenuItem value="">Select Category</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="inspection">Inspection</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Submission Time</InputLabel>
                  <Select value={formData.submissionTime} onChange={(e) => setFormData({...formData, submissionTime: e.target.value})}>
                    <MenuItem value="">Select Submission Time</MenuItem>
                    <MenuItem value="9am">9:00 AM</MenuItem>
                    <MenuItem value="12pm">12:00 PM</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Supervisors</InputLabel>
                  <Select value={formData.supervisors} onChange={(e) => setFormData({...formData, supervisors: e.target.value})}>
                    <MenuItem value="">Select Supervisors</MenuItem>
                    <MenuItem value="supervisor1">Supervisor 1</MenuItem>
                    <MenuItem value="supervisor2">Supervisor 2</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Lock Overdue Task</InputLabel>
                  <Select value={formData.lockOverdueTask} onChange={(e) => setFormData({...formData, lockOverdueTask: e.target.value})}>
                    <MenuItem value="">Select Lock Status</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})}>
                    <MenuItem value="">Select Frequency</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Grace Time</InputLabel>
                  <Select value={formData.graceTime} onChange={(e) => setFormData({...formData, graceTime: e.target.value})}>
                    <MenuItem value="">Select Grace Time</MenuItem>
                    <MenuItem value="30min">30 Minutes</MenuItem>
                    <MenuItem value="1h">1 Hour</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>End At</InputLabel>
                  <Select value={formData.endAt} onChange={(e) => setFormData({...formData, endAt: e.target.value})}>
                    <MenuItem value="">Select End Date</MenuItem>
                    <MenuItem value="2024-12-31">Dec 31, 2024</MenuItem>
                    <MenuItem value="2025-06-30">Jun 30, 2025</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Supplier</InputLabel>
                  <Select value={formData.supplier} onChange={(e) => setFormData({...formData, supplier: e.target.value})}>
                    <MenuItem value="">Select Supplier</MenuItem>
                    <MenuItem value="supplier1">Supplier 1</MenuItem>
                    <MenuItem value="supplier2">Supplier 2</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Start From</InputLabel>
                  <Select value={formData.startFrom} onChange={(e) => setFormData({...formData, startFrom: e.target.value})}>
                    <MenuItem value="">Select Start Date</MenuItem>
                    <MenuItem value="2024-01-01">Jan 1, 2024</MenuItem>
                    <MenuItem value="2024-02-01">Feb 1, 2024</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </SectionCard>
          </Box>
        );
        
      case 2: // Question Setup
        return (
          <Box>
            {/* Header Outside the Box */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 3,
              px: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  backgroundColor: '#C72030',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Cog size={16} color="white" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030' }}>
                  Question Setup
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MuiSwitch 
                    checked={autoTicket}
                    onChange={(e) => setAutoTicket(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#C72030' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#C72030' }
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#666' }}>Auto Ticket</Typography>
                </Box>
                <MuiButton
                  variant="outlined"
                  startIcon={<Add />}
                  sx={{
                    color: '#C72030',
                    borderColor: '#C72030',
                    fontSize: '12px',
                    padding: '4px 12px',
                    '&:hover': {
                      borderColor: '#C72030',
                      backgroundColor: 'rgba(199, 32, 48, 0.04)'
                    }
                  }}
                >
                  + Weightage
                </MuiButton>
                <MuiButton
                  variant="outlined"
                  startIcon={<Add />}
                  sx={{
                    color: '#C72030',
                    borderColor: '#C72030',
                    fontSize: '12px',
                    padding: '4px 12px',
                    '&:hover': {
                      borderColor: '#C72030',
                      backgroundColor: 'rgba(199, 32, 48, 0.04)'
                    }
                  }}
                >
                  + Add Section
                </MuiButton>
              </Box>
            </Box>

            {/* Main Content in White Box */}
            <SectionCard>
              {tasks.map((task, index) => (
                <Box key={task.id} sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Task {index + 1}
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Group</InputLabel>
                      <Select 
                        value={task.group} 
                        onChange={(e) => updateTask(task.id, 'group', e.target.value)}
                      >
                        <MenuItem value="">Select Group</MenuItem>
                        <MenuItem value="group1">Group 1</MenuItem>
                        <MenuItem value="group2">Group 2</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControl fullWidth>
                      <InputLabel>Sub-Group</InputLabel>
                      <Select 
                        value={task.subGroup} 
                        onChange={(e) => updateTask(task.id, 'subGroup', e.target.value)}
                      >
                        <MenuItem value="">Select Sub-Group</MenuItem>
                        <MenuItem value="subgroup1">Sub-Group 1</MenuItem>
                        <MenuItem value="subgroup2">Sub-Group 2</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  {/* Dashed Border Section */}
                  <Box sx={{ 
                    border: '2px dashed #E0E0E0', 
                    padding: 2, 
                    borderRadius: '8px',
                    backgroundColor: '#FAFAFA'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', gap: 4 }}>
                        <FormControlLabel
                          control={
                            <Radio 
                              checked={task.mandatory}
                              onChange={(e) => updateTask(task.id, 'mandatory', e.target.checked)}
                              sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                            />
                          }
                          label="Mandatory"
                        />
                        <FormControlLabel
                          control={
                            <Radio 
                              checked={task.helpText}
                              onChange={(e) => updateTask(task.id, 'helpText', e.target.checked)}
                              sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                            />
                          }
                          label="Help Text"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MuiSwitch 
                          checked={task.autoTicket}
                          onChange={(e) => updateTask(task.id, 'autoTicket', e.target.checked)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#C72030' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#C72030' }
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#666' }}>Auto Ticket</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2 }}>
                      <TextField
                        label="Task"
                        placeholder="Enter Task"
                        fullWidth
                        value={task.task}
                        onChange={(e) => updateTask(task.id, 'task', e.target.value)}
                      />
                      
                      <FormControl fullWidth>
                        <InputLabel>Input Type</InputLabel>
                        <Select 
                          value={task.inputType} 
                          onChange={(e) => updateTask(task.id, 'inputType', e.target.value)}
                        >
                          <MenuItem value="">Select Input Type</MenuItem>
                          <MenuItem value="text">Text</MenuItem>
                          <MenuItem value="number">Number</MenuItem>
                          <MenuItem value="dropdown">Dropdown</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Box>
              ))}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <MuiButton
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addTask}
                  sx={{
                    color: '#C72030',
                    borderColor: '#C72030',
                    fontSize: '12px',
                    padding: '4px 12px',
                    '&:hover': {
                      borderColor: '#C72030',
                      backgroundColor: 'rgba(199, 32, 48, 0.04)'
                    }
                  }}
                >
                  + Add Question
                </MuiButton>
              </Box>
            </SectionCard>
          </Box>
        );
        
      case 3: // Time Setup
        return (
          <Box>
            {/* Header Outside the Box */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mb: 3,
              px: 1
            }}>
              <Box sx={{
                backgroundColor: '#C72030',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Cog size={16} color="white" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030' }}>
                Time Setup
              </Typography>
            </Box>

            {/* Main Content in White Box with Dashed Border */}
            <Box sx={{ 
              border: '2px dashed #E0E0E0', 
              borderRadius: '8px',
              backgroundColor: 'white',
              padding: 3,
              mb: 3
            }}>
              <Tabs 
                value={timeTab} 
                onChange={(e, newValue) => setTimeTab(newValue)}
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider', 
                  mb: 3,
                  '& .MuiTab-root.Mui-selected': {
                    backgroundColor: '#C72030',
                    color: 'white',
                    borderRadius: '4px 4px 0 0'
                  }
                }}
              >
                <Tab label="Hours" />
                <Tab label="Minutes" />
                <Tab label="Day" />
                <Tab label="Month" />
              </Tabs>
              
              {timeTab === 0 && (
                <Box>
                  <FormControlLabel
                    control={
                      <Radio 
                        checked={!everyHourBetween}
                        onChange={() => setEveryHourBetween(false)}
                        sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                      />
                    }
                    label="Choose one or more specific hours"
                    sx={{ mb: 2 }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ 
                          color: '#C72030', 
                          '&.Mui-checked': { color: '#C72030' }
                        }}
                      />
                    }
                    label="Select All"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 1, mb: 3 }}>
                    {Array.from({length: 24}, (_, i) => (
                      <FormControlLabel
                        key={i}
                        control={
                          <Checkbox
                            checked={selectedHours.includes(i)}
                            onChange={() => toggleHour(i)}
                            sx={{ 
                              color: '#C72030', 
                              '&.Mui-checked': { color: '#C72030' },
                              padding: '4px'
                            }}
                          />
                        }
                        label={i.toString().padStart(2, '0')}
                        sx={{ margin: 0, fontSize: '12px' }}
                        labelPlacement="bottom"
                      />
                    ))}
                  </Box>
                  
                  <FormControlLabel
                    control={
                      <Radio 
                        checked={everyHourBetween}
                        onChange={() => setEveryHourBetween(true)}
                        sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                      />
                    }
                    label="Every hour between hour"
                  />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                    <FormControl size="small">
                      <Select 
                        value={hourRange.start} 
                        onChange={(e) => setHourRange({...hourRange, start: Number(e.target.value)})}
                        displayEmpty
                      >
                        {Array.from({length: 24}, (_, i) => (
                          <MenuItem key={i} value={i}>{i.toString().padStart(2, '0')}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <Typography>and hour</Typography>
                    
                    <FormControl size="small">
                      <Select 
                        value={hourRange.end} 
                        onChange={(e) => setHourRange({...hourRange, end: Number(e.target.value)})}
                        displayEmpty
                      >
                        {Array.from({length: 24}, (_, i) => (
                          <MenuItem key={i} value={i}>{i.toString().padStart(2, '0')}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Summary Table in separate white box */}
            <Box sx={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#F9F9F9' }}>
                      <TableCell><strong>Hours</strong></TableCell>
                      <TableCell><strong>Minutes</strong></TableCell>
                      <TableCell><strong>Day Of Month</strong></TableCell>
                      <TableCell><strong>Month</strong></TableCell>
                      <TableCell><strong>Day Of Week</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>00</TableCell>
                      <TableCell>00</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        );
        
      case 4: // Mapping
        return (
          <SectionCard>
            <SectionHeader>
              <RedIcon />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#D42F2F' }}>
                Mapping
              </Typography>
            </SectionHeader>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <TextField
                label="Asset Name"
                placeholder="Enter Asset Name"
                fullWidth
                value={formData.assetName}
                onChange={(e) => setFormData({...formData, assetName: e.target.value})}
              />
              
              <FormControl fullWidth>
                <InputLabel>Parameter</InputLabel>
                <Select 
                  value={formData.parameter} 
                  onChange={(e) => setFormData({...formData, parameter: e.target.value})}
                >
                  <MenuItem value="">Select Parameter</MenuItem>
                  <MenuItem value="temperature">Temperature</MenuItem>
                  <MenuItem value="pressure">Pressure</MenuItem>
                  <MenuItem value="voltage">Voltage</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </SectionCard>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={() => navigate('/maintenance/schedule')}>
            <ArrowBack sx={{ color: '#D42F2F' }} />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Schedule &gt; Add Schedule
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          ADD SCHEDULE
        </Typography>
      </Box>

      {/* Custom Stepper - Bordered Box Design */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '100%'
        }}>
          {steps.map((label, index) => (
            <React.Fragment key={label}>
              <Box
                onClick={() => handleStepClick(index)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: isStepRed(index) ? '#C72030' : 'white',
                  color: isStepRed(index) ? 'white' : '#C4B89D',
                  border: `2px solid ${isStepRed(index) ? '#C72030' : '#C4B89D'}`,
                  padding: '12px 20px',
                  fontSize: '13px',
                  fontWeight: 500,
                  textAlign: 'center',
                  minWidth: '140px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: index === activeStep ? '0 2px 4px rgba(199, 32, 48, 0.3)' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    opacity: 0.9
                  }
                }}
              >
                {label}
              </Box>
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    width: '60px',
                    height: '1px',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '1px',
                      backgroundImage: 'repeating-linear-gradient(to right, #C4B89D 0px, #C4B89D 6px, transparent 6px, transparent 12px)',
                    }
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* Step Content */}
      {renderStepContent()}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <RedButton onClick={handleSave}>
          Proceed to save
        </RedButton>
        <DraftButton onClick={handleSaveDraft}>
          Save to draft
        </DraftButton>
      </Box>
    </Box>
  );
};