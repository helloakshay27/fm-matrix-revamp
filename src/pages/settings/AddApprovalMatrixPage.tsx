import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from "@/utils/apiClient";
import { toast } from 'sonner';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Checkbox, FormControlLabel, Box, FormHelperText } from '@mui/material';
import { Plus, X, ArrowLeft } from "lucide-react";

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

const AddApprovalMatrixPage = () => {
  const navigate = useNavigate();
  // Sonner toast imported above
  const [selectedFunction, setSelectedFunction] = useState('');
  const [approvalLevels, setApprovalLevels] = useState<ApprovalLevel[]>([
    { order: 1, name: '', users: [], sendEmails: false }
  ]);
  const [levelErrors, setLevelErrors] = useState<Array<{ order?: string; name?: string; users?: string }>>([
    {}
  ]);
  const [functionError, setFunctionError] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function options with label-value pairs
  const functionOptions = [
    { label: 'Purchase Order', value: 'purchase_order' },
    { label: 'GRN', value: 'grn' },
    { label: 'Work Order', value: 'work_order' },
    { label: 'Work Order Invoice', value: 'work_order_invoice' },
    { label: 'Bill', value: 'bill' },
    { label: 'Vendor Evaluation', value: 'vendor_audit' },
    { label: 'Permit', value: 'permit' },
    { label: 'Permit Extend', value: 'permit_extend' },
    { label: 'Permit Closure', value: 'permit_closure' },
    { label: 'Supplier', value: 'supplier' },
    { label: 'GDN', value: 'gdn' },
    { label: 'Asset Movement', value: 'asset_movement' },
    { label: 'PR Deletion', value: 'pr_deletion_request' },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await apiClient.get('/pms/users/get_escalate_to_users.json');
        console.log('Users API response:', response.data);

        // Ensure we always set an array
        if (Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          console.error('API response.data.users is not an array:', response.data);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]); // Ensure users is always an array on error
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const addApprovalLevel = () => {
    const newLevel: ApprovalLevel = {
      order: 1,
      name: '',
      users: [],
      sendEmails: false
    };
    setApprovalLevels([...approvalLevels, newLevel]);
    setLevelErrors(prev => [...prev, {}]);
  };

  const removeApprovalLevel = (index: number) => {
    if (approvalLevels.length > 1) {
      const updatedLevels = approvalLevels.filter((_, i) => i !== index);
      setApprovalLevels(updatedLevels);
      setLevelErrors(errs => errs.filter((_, i) => i !== index));
    }
  };

  const updateApprovalLevel = (index: number, field: keyof ApprovalLevel, value: any) => {
    const updatedLevels = [...approvalLevels];
    updatedLevels[index] = { ...updatedLevels[index], [field]: value };
    setApprovalLevels(updatedLevels);
    // Clear field-specific error when user edits
    setLevelErrors(prev => {
      const copy = [...prev];
      const current = { ...(copy[index] || {}) } as { order?: string; name?: string; users?: string };
      if (field === 'order') current.order = '';
      if (field === 'name') current.name = '';
      if (field === 'users') current.users = '';
      copy[index] = current;
      return copy;
    });
  };

  const validateForm = (): boolean => {
    let valid = true;
    // Function required
    if (!selectedFunction) {
      setFunctionError('Please select a function.');
      valid = false;
    } else {
      setFunctionError('');
    }

    // Per-level validation
    const newErrors: Array<{ order?: string; name?: string; users?: string }> = approvalLevels.map((level) => ({}));

    approvalLevels.forEach((level, idx) => {
      // Order: required, integer >= 1
      const orderNum = Number(level.order);
      if (!Number.isInteger(orderNum) || orderNum < 1) {
        newErrors[idx].order = 'Order must be a positive integer.';
        valid = false;
      }
      // Name: required
      if (!level.name || !String(level.name).trim()) {
        newErrors[idx].name = 'Name of Level is required.';
        valid = false;
      }
      // Users: at least 1, at most 15
      const count = Array.isArray(level.users) ? level.users.length : 0;
      if (count === 0) {
        newErrors[idx].users = 'Select at least one user.';
        valid = false;
      } else if (count > 15) {
        newErrors[idx].users = 'You can select up to 15 users.';
        valid = false;
      }
    });

    setLevelErrors(newErrors);

    if (!valid) {
      toast.error('Please fill the required fields.');
    }

    return valid;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        invoice_approval: {
          approval_type: selectedFunction,
          invoice_approval_levels_attributes: approvalLevels.map(level => ({
            name: level.name,
            order: level.order,
            active: true,
            send_email: level.sendEmails,
            escalate_to_users: level.users
          }))
        }
      };

      await apiClient.post('/pms/admin/invoice_approvals.json', payload);
      toast.success('Approval matrix created successfully');

      navigate('/settings/approval-matrix/setup');
    } catch (error) {
      console.error('Error creating approval matrix:', error);
      // Try to surface server-side validation errors inline
      try {
        // Common axios error shape
        const data: any = (error as any)?.response?.data ?? {};
        let handled = false;

        // Support multiple shapes: { approval_type: ["has already been taken"] }
        // or { errors: { approval_type: ["has already been taken"] } }
        const firstOf = (v: any) => (Array.isArray(v) && v.length ? String(v[0]) : '');
        const approvalTypeMsg = firstOf(data?.approval_type) || firstOf(data?.errors?.approval_type);
        if (approvalTypeMsg) {
          setFunctionError(approvalTypeMsg);
          handled = true;
        }

        // Fallback to a general message if provided by API
        if (!handled && typeof data?.message === 'string' && data.message.trim()) {
          toast.error(data.message.trim());
          handled = true;
        }

        if (!handled) {
          toast.error('Failed to create approval matrix. Please try again.');
        }
      } catch {
        // If parsing error shape fails, show a generic message
        toast.error('Failed to create approval matrix. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving and creating new:', { selectedFunction, approvalLevels });
    setSelectedFunction('');
    setApprovalLevels([{ order: 1, name: '', users: [], sendEmails: false }]);
  };

  return (
    <div className="p-8 min-h-screen bg-transparent">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-[#1a1a1a]">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings" className="text-[#1a1a1a]">
              Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/approval-matrix" className="text-[#1a1a1a]">
              Approval Matrix
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/approval-matrix/setup" className="text-[#1a1a1a]">
              Setup
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-[#C72030]">Add</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title with Back Button */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/settings/approval-matrix/setup')}
          className="text-[#1a1a1a] w-10 h-10 rounded-lg p-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Heading level="h1" className="text-[#1a1a1a]">
          ADD APPROVAL MATRIX
        </Heading>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Function Selection */}
        <div className="mb-8">
          <FormControl fullWidth error={!!functionError}>
            <InputLabel
              required
              shrink={true}
              sx={{
                color: '#1a1a1a',
                '&.Mui-focused': { color: '#C72030' }
              }}
            >
              Function
            </InputLabel>
            <MuiSelect
              value={selectedFunction}
              onChange={(e) => { setSelectedFunction(e.target.value); setFunctionError(''); }}
              label="Function"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D5DbDB',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#C72030',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#C72030',
                },
              }}
            >
              {functionOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </MuiSelect>
            {functionError && <FormHelperText>{functionError}</FormHelperText>}
          </FormControl>
        </div>

        {/* Approval Levels Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <h2 className="text-xl font-semibold text-[#C72030]">Approval Levels</h2>
          </div>

          {approvalLevels.map((level, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Order */}
                <div className="md:col-span-1">
                  <TextField
                    label="Order"
                    required
                    value={level.order}
                    type="number"
                    onChange={(e) => updateApprovalLevel(index, 'order', parseInt(e.target.value) || 1)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#D5DbDB' },
                        '&:hover fieldset': { borderColor: '#C72030' },
                        '&.Mui-focused fieldset': { borderColor: '#C72030' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#C72030' },
                    }}
                    error={!!levelErrors[index]?.order}
                    helperText={levelErrors[index]?.order}
                  />
                </div>

                {/* Name of Level */}
                <div className="md:col-span-3">
                  <TextField
                    label="Name of Level"
                    required
                    placeholder="Enter Name of Level"
                    value={level.name}
                    onChange={(e) => updateApprovalLevel(index, 'name', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#D5DbDB' },
                        '&:hover fieldset': { borderColor: '#C72030' },
                        '&.Mui-focused fieldset': { borderColor: '#C72030' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#C72030' },
                    }}
                    error={!!levelErrors[index]?.name}
                    helperText={levelErrors[index]?.name}
                  />
                </div>

                {/* Users */}
                <div className="md:col-span-5">
                  <FormControl fullWidth size="small" error={!!levelErrors[index]?.users}>
                    <InputLabel
                      required
                      shrink={true}
                      sx={{
                        color: '#1a1a1a',
                        '&.Mui-focused': { color: '#C72030' }
                      }}
                    >
                      Users
                    </InputLabel>
                    <MuiSelect
                      multiple
                      value={level.users}
                      onChange={(e) => updateApprovalLevel(index, 'users', e.target.value)}
                      label="Users"
                      renderValue={(selected) => {
                        if (selected.length === 0) return 'Select up to 15 Options...';
                        if (!Array.isArray(users)) return 'Loading...';
                        const selectedUsers = users.filter(user => selected.includes(user.id.toString()));
                        return selectedUsers.map(user => user.full_name).join(', ');
                      }}
                      displayEmpty
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#D5DbDB',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#C72030',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#C72030',
                        },
                      }}
                    >
                      {loadingUsers ? (
                        <MenuItem disabled>Loading users...</MenuItem>
                      ) : !Array.isArray(users) ? (
                        <MenuItem disabled>Error loading users</MenuItem>
                      ) : (
                        users.map((user) => (
                          <MenuItem key={user.id} value={user.id.toString()}>
                            <Checkbox
                              checked={level.users.includes(user.id.toString())}
                              sx={{
                                color: '#C72030',
                                '&.Mui-checked': { color: '#C72030' },
                              }}
                            />
                            {user.full_name}
                          </MenuItem>
                        ))
                      )}
                    </MuiSelect>
                    {levelErrors[index]?.users && (
                      <FormHelperText>{levelErrors[index]?.users}</FormHelperText>
                    )}
                  </FormControl>
                </div>

                {/* Send Emails & Remove Button */}
                <div className="md:col-span-3 flex items-center gap-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={level.sendEmails}
                        onChange={(e) => updateApprovalLevel(index, 'sendEmails', e.target.checked)}
                        sx={{
                          color: '#C72030',
                          '&.Mui-checked': { color: '#C72030' },
                        }}
                      />
                    }
                    label="Send Emails"
                    sx={{ color: '#1a1a1a' }}
                  />

                  {approvalLevels.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeApprovalLevel(index)}
                      className="bg-[#f6f4ee] hover:bg-[#e8e5dc] text-[#C72030] min-w-[32px] h-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add More Level Button */}
          <Button
            variant="ghost"
            onClick={addApprovalLevel}
            className="bg-[#f6f4ee] hover:bg-[#e8e5dc] text-[#6B2C91] w-12 h-12 rounded-lg p-0"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <Button
            onClick={handleCreate}
            disabled={isSubmitting}
            className="bg-[#6B2C91] hover:bg-[#5A2478] text-white px-8 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>

          <Button
            variant="outline"
            onClick={handleSaveAndCreateNew}
            className="border-[#6B2C91] text-[#6B2C91] hover:bg-[#6B2C91] hover:text-white px-8"
          >
            Save And Create New
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddApprovalMatrixPage;