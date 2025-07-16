import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/utils/apiClient';
import { TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox as MuiCheckbox, ListItemText } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

interface ApprovalLevel {
  order: number;
  name: string;
  users: string[];
  sendEmails: boolean;
}

interface User {
  id: number;
  full_name: string;
}

export const AddInvoiceApprovalsPage = () => {
  const [selectedFunction, setSelectedFunction] = useState('');
  const [approvalLevels, setApprovalLevels] = useState<ApprovalLevel[]>([
    { order: 1, name: '', users: [], sendEmails: false }
  ]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // MUI theme for consistent styling
  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  // Function options as specified
  const functionOptions = [
    { label: 'Asset', value: 'asset' },
    { label: 'Asset Movement', value: 'asset_movement' }
  ];

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/pms/users/get_escalate_to_users.json');
        const userData = response.data;
        
        // Handle different response formats
        if (Array.isArray(userData)) {
          setUsers(userData);
        } else if (userData && Array.isArray(userData.users)) {
          setUsers(userData.users);
        } else {
          console.error('Unexpected user data format:', userData);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const addApprovalLevel = () => {
    const newLevel: ApprovalLevel = {
      order: approvalLevels.length + 1,
      name: '',
      users: [],
      sendEmails: false
    };
    setApprovalLevels([...approvalLevels, newLevel]);
  };

  const removeApprovalLevel = (index: number) => {
    if (approvalLevels.length > 1) {
      const updated = approvalLevels.filter((_, i) => i !== index);
      // Reorder the remaining levels
      const reordered = updated.map((level, i) => ({ ...level, order: i + 1 }));
      setApprovalLevels(reordered);
    }
  };

  const updateApprovalLevel = (index: number, field: keyof ApprovalLevel, value: any) => {
    const updated = [...approvalLevels];
    updated[index] = { ...updated[index], [field]: value };
    setApprovalLevels(updated);
  };

  const handleCreate = async () => {
    // Validation
    if (!selectedFunction) {
      toast.error('Please select a function');
      return;
    }

    const hasEmptyLevels = approvalLevels.some(level => !level.name.trim() || level.users.length === 0);
    if (hasEmptyLevels) {
      toast.error('Please fill in all approval level details');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        function: selectedFunction,
        approval_levels: approvalLevels.map(level => ({
          order: level.order,
          name: level.name,
          user_ids: level.users,
          send_emails: level.sendEmails
        }))
      };

      // Create the invoice approval matrix using the existing API endpoint
      await apiClient.post('/pms/admin/invoice_approvals.json', payload);

      toast.success('Invoice approval matrix created successfully');
      
      // Reset form
      setSelectedFunction('');
      setApprovalLevels([{ order: 1, name: '', users: [], sendEmails: false }]);
      
    } catch (error) {
      console.error('Error creating invoice approval matrix:', error);
      toast.error('Failed to create invoice approval matrix');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAndCreateNew = () => {
    setSelectedFunction('');
    setApprovalLevels([{ order: 1, name: '', users: [], sendEmails: false }]);
    toast.success('Form cleared for new entry');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground">
          Setup &gt; Invoice Approvals &gt; Add
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">ADD INVOICE APPROVALS</h1>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-6">
          {/* Function Selection */}
          <FormControl fullWidth variant="outlined">
            <InputLabel>Function *</InputLabel>
            <Select
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
              label="Function *"
            >
              {functionOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Approval Levels Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
              <h3 className="text-lg font-semibold text-destructive">Approval Levels</h3>
            </div>

            {approvalLevels.map((level, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg">
                {/* Order */}
                <div className="col-span-2">
                  <TextField
                    label="Order *"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={level.order}
                    onChange={(e) => updateApprovalLevel(index, 'order', parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1 }}
                    size="small"
                  />
                </div>

                {/* Name of Level */}
                <div className="col-span-3">
                  <TextField
                    label="Name of Level *"
                    variant="outlined"
                    fullWidth
                    value={level.name}
                    onChange={(e) => updateApprovalLevel(index, 'name', e.target.value)}
                    placeholder="Enter Name of Level"
                    size="small"
                  />
                </div>

                {/* Users */}
                <div className="col-span-4">
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Users *</InputLabel>
                    <Select
                      multiple
                      value={level.users}
                      onChange={(e) => {
                        const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                        updateApprovalLevel(index, 'users', value);
                      }}
                      label="Users *"
                      renderValue={(selected) => {
                        const selectedUsers = users.filter(user => selected.includes(user.id.toString()));
                        return selectedUsers.map(user => user.full_name).join(', ');
                      }}
                    >
                      {loading ? (
                        <MenuItem disabled>Loading users...</MenuItem>
                      ) : users.length > 0 ? (
                        users.map((user) => (
                          <MenuItem key={user.id} value={user.id.toString()}>
                            <MuiCheckbox 
                              checked={level.users.includes(user.id.toString())}
                              sx={{ 
                                color: '#dc2626',
                                '&.Mui-checked': {
                                  color: '#dc2626',
                                },
                                marginRight: 1
                              }}
                            />
                            <ListItemText primary={user.full_name} />
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No users available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </div>

                {/* Send Emails */}
                <div className="col-span-2 flex items-center">
                  <FormControlLabel
                    control={
                      <MuiCheckbox
                        checked={level.sendEmails}
                        onChange={(e) => updateApprovalLevel(index, 'sendEmails', e.target.checked)}
                        size="small"
                      />
                    }
                    label="Send Emails"
                  />
                </div>

                {/* Remove Button */}
                <div className="col-span-1 flex justify-end">
                  {approvalLevels.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeApprovalLevel(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {/* Add More Level Button */}
            <Button
              variant="ghost"
              onClick={addApprovalLevel}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-4 h-4" />
              Add More Level
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              onClick={handleCreate}
              disabled={submitting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {submitting ? 'Creating...' : 'Create'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSaveAndCreateNew}
              className="border-destructive text-destructive hover:bg-destructive/10"
            >
              Save And Create New
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};