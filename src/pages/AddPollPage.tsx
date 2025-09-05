import { useEffect, useState } from 'react';
import { Calendar, Clock, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Container,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  IconButton,
  Stack,
  Alert,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { fetchFMUsers } from '@/store/slices/fmUserSlice';
import { fetchUserGroups } from '@/store/slices/userGroupSlice';

const AddPollPage = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    startDate: '',
    endDate: '',
    startTime: '04:00 AM',
    endTime: '04:00 AM',
    shareWith: 'all',
    options: ['', '']
  });
  const [selectedShareWith, setSelectedShareWith] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await dispatch(fetchFMUsers()).unwrap();
        setUsers(response.fm_users);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await dispatch(fetchUserGroups({ token, baseUrl })).unwrap();
        setGroups(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
    fetchGroups();
  }, [dispatch, token, baseUrl]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        options: newOptions
      }));
    }
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleGroupSelection = (groupId) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleShareWithChange = (value) => {
    setSelectedShareWith(value);
    if (value !== 'individual') {
      setSelectedUsers([]);
    }
    if (value !== 'group') {
      setSelectedGroups([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format dates and times for API
    const formatDateTime = (date, time) => {
      const [hours, minutes] = time.split(/[: ]/);
      const period = time.includes('PM') ? 12 : 0;
      const hour = parseInt(hours) % 12 + period;
      const dateTime = new Date(date);
      dateTime.setHours(hour, parseInt(minutes));
      const year = dateTime.getFullYear();
      const month = String(dateTime.getMonth() + 1).padStart(2, '0');
      const day = String(dateTime.getDate()).padStart(2, '0');
      const formattedHours = String(dateTime.getHours()).padStart(2, '0');
      const formattedMinutes = String(dateTime.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${formattedHours}:${formattedMinutes}`;
    };

    // Prepare payload
    const payload = {
      subject: formData.subject,
      startdate: formData.startDate ? formData.startDate.replace(/-/g, '/') : '',
      enddate: formData.endDate ? formData.endDate.replace(/-/g, '/') : '',
      start: formData.startDate && formData.startTime ? formatDateTime(formData.startDate, formData.startTime) : '',
      end: formData.endDate && formData.endTime ? formatDateTime(formData.endDate, formData.endTime) : '',
      vote_limit: 'All',
      options: formData.options.filter(opt => opt.trim() !== '').map(name => ({ name })),
      shared: selectedShareWith.charAt(0).toUpperCase() + selectedShareWith.slice(1),
      ...(selectedShareWith === 'individual' && { user_ids: selectedUsers }),
      ...(selectedShareWith === 'group' && { group_ids: selectedGroups })
    };

    try {
      const response = await fetch(`https://${baseUrl}/pms/polls.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to create poll');
      }

      navigate('/crm/polls');
    } catch (error) {
      console.error('Error submitting poll:', error);
      // You might want to add error handling UI here
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <div className='px-6 pt-6 mx-auto'>
        <Button
          variant="ghost"
          onClick={() => navigate("/crm/polls")}
          className='p-0'
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold mb-6">NEW POLL</h1>
      </div>
      <Container maxWidth="lg">
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <TextField
                label="Subject"
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Enter poll subject"
                required
                fullWidth
                variant="outlined"
              />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
                  gap: 3
                }}
              >
                <TextField
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Calendar size={20} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Calendar size={20} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Start Time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Clock size={20} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="End Time"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Clock size={20} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" component="h3" sx={{ mb: 3, fontWeight: 600 }}>
                  Poll Options
                </Typography>
                <Stack spacing={2}>
                  {formData.options.map((option, index) => (
                    <Stack key={index} direction="row" alignItems="center" spacing={2}>
                      <TextField
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required
                        fullWidth
                        size="small"
                      />
                      {formData.options.length > 2 && (
                        <IconButton
                          onClick={() => removeOption(index)}
                          sx={{ color: 'error.main' }}
                          size="small"
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                </Stack>
                <Button
                  type='button'
                  size="lg"
                  className="bg-[#C72030] hover:bg-[#C72030] text-white mt-4"
                  onClick={addOption}
                >
                  Add Option
                </Button>
              </Card>
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  bgcolor: 'rgba(199, 32, 48, 0.04)',
                  borderColor: 'rgba(199, 32, 48, 0.12)'
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    color: 'text.secondary'
                  }}
                >
                  Share With
                </Typography>
                <RadioGroup
                  row
                  value={selectedShareWith}
                  onChange={(e) => handleShareWithChange(e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiRadio-root': {
                      color: 'rgba(199, 32, 48, 0.6)',
                      '&.Mui-checked': {
                        color: '#C72030'
                      }
                    }
                  }}
                >
                  <FormControlLabel
                    value="all"
                    control={<Radio size="small" />}
                    label="All"
                  />
                  <FormControlLabel
                    value="individual"
                    control={<Radio size="small" />}
                    label="Individual"
                  />
                  <FormControlLabel
                    value="group"
                    control={<Radio size="small" />}
                    label="Group"
                  />
                </RadioGroup>
                {selectedShareWith === 'individual' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                      Select Users ({selectedUsers.length} selected)
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        maxHeight: 200,
                        overflow: 'auto',
                        bgcolor: 'background.paper',
                        zIndex: 10
                      }}
                    >
                      <List dense>
                        {users.map((user) => (
                          <ListItem key={user.id} disablePadding>
                            <ListItemButton
                              onClick={() => handleUserSelection(user.id)}
                              sx={{
                                '&:hover': { bgcolor: 'rgba(199, 32, 48, 0.08)' }
                              }}
                            >
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={selectedUsers.includes(user.id)}
                                  sx={{
                                    '&.Mui-checked': {
                                      color: '#C72030'
                                    }
                                  }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={user.firstname + ' ' + user.lastname}
                                secondary={user.email}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                    {selectedUsers.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          Selected Users:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {selectedUsers.map((userId) => {
                            const user = users.find(u => u.id === userId);
                            return user ? (
                              <Chip
                                key={userId}
                                label={user.firstname + ' ' + user.lastname}
                                size="small"
                                onDelete={() => handleUserSelection(userId)}
                                sx={{
                                  bgcolor: 'rgba(199, 32, 48, 0.1)',
                                  color: '#C72030',
                                  '& .MuiChip-deleteIcon': {
                                    color: '#C72030'
                                  }
                                }}
                              />
                            ) : null;
                          })}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                )}
                {selectedShareWith === 'group' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                      Select Groups ({selectedGroups.length} selected)
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        maxHeight: 200,
                        overflow: 'auto',
                        bgcolor: 'background.paper',
                        zIndex: 10
                      }}
                    >
                      <List dense>
                        {groups.map((group) => (
                          <ListItem key={group.id} disablePadding>
                            <ListItemButton
                              onClick={() => handleGroupSelection(group.id)}
                              sx={{
                                '&:hover': { bgcolor: 'rgba(199, 32, 48, 0.08)' }
                              }}
                            >
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={selectedGroups.includes(group.id)}
                                  sx={{
                                    '&.Mui-checked': {
                                      color: '#C72030'
                                    }
                                  }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={group.name}
                                secondary={`${group.group_members.length} members`}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                    {selectedGroups.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          Selected Groups:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {selectedGroups.map((groupId) => {
                            const group = groups.find(g => g.id === groupId);
                            return group ? (
                              <Chip
                                key={groupId}
                                label={`${group.name} (${group.group_members.length} members)`}
                                size="small"
                                onDelete={() => handleGroupSelection(groupId)}
                                sx={{
                                  bgcolor: 'rgba(199, 32, 48, 0.1)',
                                  color: '#C72030',
                                  '& .MuiChip-deleteIcon': {
                                    color: '#C72030'
                                  }
                                }}
                              />
                            ) : null;
                          })}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                )}
                {selectedShareWith === 'all' && (
                  <Alert
                    severity="info"
                    sx={{
                      mt: 2,
                      bgcolor: 'rgba(199, 32, 48, 0.08)',
                      borderColor: 'rgba(199, 32, 48, 0.2)',
                      '& .MuiAlert-icon': {
                        color: '#C72030'
                      }
                    }}
                  >
                    This poll will be shared with all users in the system.
                  </Alert>
                )}
              </Card>
              <div className='flex items-center justify-center'>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-[#C72030] hover:bg-[#C72030] text-white"
                >
                  Submit Poll
                </Button>
              </div>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddPollPage;