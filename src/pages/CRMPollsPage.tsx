import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Paper,
  InputAdornment,
  Pagination,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';

const CRMPollsPage = () => {
  const baseUrl = localStorage.getItem('baseUrl')
  const token = localStorage.getItem('token')

  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
  const [polls, setPolls] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://${baseUrl}/pms/polls.json`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        setPolls(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, pollId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedPollId(pollId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPollId(null);
  };

  // const polls = [
  //   {
  //     id: 1,
  //     title: 'Hshsksk',
  //     createdDate: '22-06-2022',
  //     startTime: '06:30 AM',
  //     endDate: '22-06-2022',
  //     endTime: '06:30 AM',
  //     sharedWith: 'Individual',
  //     publishResults: 'Yes',
  //     status: 'Closed',
  //     votes: '0%',
  //     options: [
  //       { name: 'Joshi', votes: '0%' },
  //       { name: 'Shashi', votes: '0%' },
  //       { name: 'Joshi', votes: '0%' },
  //       { name: 'Priya', votes: '0%' }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     title: 'Eyiey',
  //     createdDate: '06-12-2024',
  //     startTime: '3:32 PM',
  //     endDate: '06-12-2024',
  //     endTime: '11:30 PM',
  //     sharedWith: 'All',
  //     publishResults: 'Yes',
  //     status: 'Closed',
  //     votes: 'A',
  //     options: []
  //   },
  //   {
  //     id: 3,
  //     title: 'Society event',
  //     createdDate: '23-09-2024',
  //     startTime: '6:31 PM',
  //     endDate: '04-10-2024',
  //     endTime: '6:31 PM',
  //     sharedWith: 'All',
  //     publishResults: 'Yes',
  //     status: 'Closed',
  //     votes: '3%',
  //     options: [
  //       { name: 'Yes', votes: '3%' },
  //       { name: 'No', votes: '100%' },
  //       { name: 'Not Sure', votes: '0%' }
  //     ]
  //   },
  //   {
  //     id: 4,
  //     title: 'Test',
  //     createdDate: '26-08-2024',
  //     startTime: '7:32 PM',
  //     endDate: '25-08-2024',
  //     endTime: '6:34 PM',
  //     sharedWith: 'Individual',
  //     publishResults: 'Yes',
  //     status: 'Closed',
  //     votes: '100%',
  //     options: [
  //       { name: '1', votes: '0%' },
  //       { name: '2', votes: '0%' },
  //       { name: '3', votes: '0%' },
  //       { name: '4', votes: '0%' }
  //     ]
  //   },
  //   {
  //     id: 5,
  //     title: 'Vbb',
  //     createdDate: '25-08-2024',
  //     startTime: '5:37 PM',
  //     endDate: '26-08-2024',
  //     endTime: '6:34 PM',
  //     sharedWith: 'Individual',
  //     publishResults: 'Yes',
  //     status: 'Closed',
  //     votes: 'Voters',
  //     options: [
  //       { name: 'H', votes: '3%' },
  //       { name: 'Hi', votes: '3%' },
  //       { name: 'C', votes: '3%' },
  //       { name: 'S', votes: '2%' }
  //     ]
  //   },
  //   {
  //     id: 6,
  //     title: 'Test',
  //     createdDate: '21-11-2023',
  //     startTime: '10:29 PM',
  //     endDate: '21-11-2023',
  //     endTime: '2:30 PM',
  //     sharedWith: 'Individual',
  //     publishResults: 'Yes',
  //     status: 'Closed',
  //     votes: 'Voters',
  //     options: [
  //       { name: 'Demo', votes: '0%' }
  //     ]
  //   },
  //   {
  //     id: 7,
  //     title: 'Demo Subject',
  //     createdDate: '08-11-2023',
  //     startTime: '6:30 PM',
  //     endDate: '08-11-2023',
  //     endTime: '6:30 PM',
  //     sharedWith: 'Individual',
  //     publishResults: 'Yes',
  //     status: 'Closed',
  //     votes: 'Voters',
  //     options: [
  //       { name: 'Opt 1', votes: '3%' },
  //       { name: 'Opt 2', votes: '3%' }
  //     ]
  //   },
  //   {
  //     id: 8,
  //     title: 'Demo Subject',
  //     createdDate: '29-09-2023',
  //     startTime: '3:35 PM',
  //     endDate: '29-09-2023',
  //     endTime: '6:02 PM',
  //     sharedWith: 'Individual',
  //     publishResults: 'Yes',
  //     status: 'Closed',
  //     votes: 'Voters',
  //     options: [
  //       { name: 'Option 1 Demo', votes: '3%' },
  //       { name: 'Option 2 Name', votes: '3%' }
  //     ]
  //   },
  //   {
  //     id: 9,
  //     title: 'Demo',
  //     createdDate: '31-08-2023',
  //     startTime: '3:34 PM',
  //     endDate: '30-08-2023',
  //     endTime: '10:00 AM',
  //     sharedWith: 'Individual',
  //     status: 'Closed',
  //     votes: 'Voters',
  //     options: [
  //       { name: 'Option', votes: '0%' }
  //     ]
  //   },
  //   {
  //     id: 10,
  //     title: 'Demo',
  //     createdDate: '29-08-2023',
  //     startTime: '4:04 PM',
  //     endDate: '30-08-2023',
  //     endTime: '6:00 PM',
  //     sharedWith: 'Individual',
  //     status: 'Closed',
  //     votes: 'Voters',
  //     options: [
  //       { name: 'Demo Option 1', votes: '0%' }
  //     ]
  //   }
  // ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Draft':
        return 'warning';
      case 'Closed':
        return 'default';
      default:
        return 'default';
    }
  };

  const filteredPolls = polls.filter(poll =>
    poll.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Polls
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your polls and surveys
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => navigate('/crm/polls/add')}
          sx={{
            bgcolor: '#C72030',
            '&:hover': { bgcolor: '#B01E2A' },
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: 2
          }}
        >
          Add Poll
        </Button>
      </Box>

      {/* Search and Filter */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            All Polls
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search polls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 280 }}
            />
            <Button
              variant="outlined"
              startIcon={<Filter size={18} />}
              sx={{ textTransform: 'none' }}
            >
              Filter
            </Button>
          </Stack>
        </Box>

        {/* Polls Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          {filteredPolls.map((poll) => (
            <Card
              key={poll.id}
              elevation={2}
              sx={{
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Poll Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1.5 }}>
                      {poll.title}
                    </Typography>

                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary" className='flex items-center'>
                        <Calendar size={14} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
                        Created: {poll.showcreated}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" className='flex items-center'>
                        <Clock size={14} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
                        Duration: {poll.showstart} - {poll.showend}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Shared with: <strong>{poll.sharedWith}</strong>
                      </Typography>
                      {poll.publishResults && (
                        <Typography variant="body2" color="text.secondary">
                          Results: <strong>{poll.publishResults}</strong>
                        </Typography>
                      )}
                    </Stack>
                  </Box>

                  <Stack direction="column" alignItems="flex-end" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, poll.id)}
                      sx={{ ml: 1 }}
                    >
                      <MoreHorizontal size={18} />
                    </IconButton>

                    <Chip
                      label={poll.status}
                      color={getStatusColor(poll.status) as any}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}
                    />
                  </Stack>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Poll Options */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                    Poll Options & Results
                  </Typography>

                  {poll.poll_options.length > 0 ? (
                    <List dense sx={{ p: 0 }}>
                      {poll.poll_options.map((option, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            px: 0,
                            py: 0.5,
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          <ListItemText
                            primary={option.name}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: 'text.primary'
                            }}
                          />
                          <Chip
                            label={
                              poll.total_votes > 0
                                ? `${((option.vote_count / poll.total_votes) * 100).toFixed(1)}%`
                                : "0%"
                            }
                            size="small"
                            variant="outlined"
                            sx={{ minWidth: 50, textAlign: "center" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        No options available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: { borderRadius: 2, minWidth: 160 }
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <Eye size={16} style={{ marginRight: 12 }} />
            View Results
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Edit size={16} style={{ marginRight: 12 }} />
            Edit Poll
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
            <Trash2 size={16} style={{ marginRight: 12 }} />
            Delete
          </MenuItem>
        </Menu>
      </Paper>
    </Container>
  );
};

export default CRMPollsPage;
