import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/utils/apiClient';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox as MuiCheckbox,
  ListItemText
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

interface ApprovalLevel {
  id?: number;
  order: number;
  name: string;
  users: string[];
  sendEmails: boolean;
}

interface User {
  id: number;
  full_name: string;
}

export const EditInvoiceApprovalsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const baseUrl = localStorage.getItem('baseUrl') || '';
  const lockAccountId = localStorage.getItem('lock_account_id');
  const normalizedBaseUrl = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const shouldPassLockAccountId = normalizedBaseUrl === 'club-uat-api.lockated.com';

  const [selectedFunction, setSelectedFunction] = useState('');
  const [approvalLevels, setApprovalLevels] = useState<ApprovalLevel[]>([
    { order: 1, name: '', users: [], sendEmails: false }
  ]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const functionOptions = [
    { label: 'Quote', value: 'quote' },
    { label: 'SaleOrder', value: 'sale_order' },
    { label: 'Invoice', value: 'invoice' },
    { label: 'CreditNote', value: 'credit_note' },
    { label: 'PurchaseOrder', value: 'purchase_order' },
    { label: 'Bill', value: 'bill' },
    { label: 'VendorCredit', value: 'vendor_credit' }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/pms/users/get_escalate_to_users.json');
        const userData = response.data;
        if (Array.isArray(userData)) {
          setUsers(userData);
        } else if (userData && Array.isArray(userData.users)) {
          setUsers(userData.users);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchApproval = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const detailUrl = shouldPassLockAccountId
          ? `/pms/admin/invoice_approvals/${id}.json?lock_account_id=${lockAccountId}`
          : `/pms/admin/invoice_approvals/${id}.json`;
        const response = await apiClient.get(detailUrl);
        const detail = response.data?.invoice_approval || response.data;
        if (!detail) return;

        setSelectedFunction(detail.approval_type || '');
        const levelsSource =
          detail.approval_levels ||
          detail.invoice_approval_levels ||
          detail.invoice_approval_levels_attributes ||
          [];
        const levels = levelsSource.map((lvl: any, idx: number) => ({
          id: lvl.id ? Number(lvl.id) : undefined,
          order: Number(lvl.order || idx + 1),
          name: lvl.name || '',
          users: Array.isArray(lvl.approval_user_id)
            ? lvl.approval_user_id.map((u: any) => String(u))
            : (Array.isArray(lvl.escalate_to_users) ? lvl.escalate_to_users.map((u: any) => String(u)) : []),
          sendEmails: !!lvl.send_email
        }));
        if (levels.length > 0) setApprovalLevels(levels);
      } catch (error) {
        console.error('Error fetching invoice approval detail:', error);
        toast.error('Failed to load approval details');
      } finally {
        setLoading(false);
      }
    };
    fetchApproval();
  }, [id, lockAccountId, shouldPassLockAccountId]);

  const addApprovalLevel = () => {
    setApprovalLevels(prev => [...prev, { order: prev.length + 1, name: '', users: [], sendEmails: false }]);
  };

  const removeApprovalLevel = (index: number) => {
    if (approvalLevels.length <= 1) return;
    const updated = approvalLevels.filter((_, i) => i !== index).map((level, i) => ({ ...level, order: i + 1 }));
    setApprovalLevels(updated);
  };

  const updateApprovalLevel = (index: number, field: keyof ApprovalLevel, value: any) => {
    const updated = [...approvalLevels];
    updated[index] = { ...updated[index], [field]: value };
    setApprovalLevels(updated);
  };

  const getApiErrorMessage = (error: any, fallback: string) => {
    const data = error?.response?.data;
    if (!data) return fallback;
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) return data.join(', ');
    if (typeof data === 'object') {
      const parts: string[] = [];
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          parts.push(`${key} ${value.join(', ')}`);
        } else if (typeof value === 'string') {
          parts.push(`${key} ${value}`);
        }
      });
      if (parts.length > 0) return parts.join(' | ');
    }
    return fallback;
  };

  const handleUpdate = async () => {
    if (!selectedFunction) {
      toast.error('Please select a function');
      return;
    }
    const hasEmptyLevels = approvalLevels.some(level => !level.name.trim() || level.users.length === 0);
    if (hasEmptyLevels) {
      toast.error('Please fill in all approval level details');
      return;
    }
    if (!id) {
      toast.error('Invalid approval id');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        invoice_approval: {
          approval_type: selectedFunction,
          invoice_approval_levels_attributes: approvalLevels.map(level => ({
            ...(level.id ? { id: level.id } : {}),
            name: level.name,
            order: level.order,
            active: true,
            send_email: level.sendEmails,
            escalate_to_users: level.users.map(userId => parseInt(userId))
          }))
        }
      };
      const updateUrl = shouldPassLockAccountId
        ? `/pms/admin/invoice_approvals/${id}.json?lock_account_id=${lockAccountId}`
        : `/pms/admin/invoice_approvals/${id}.json`;
      await apiClient.put(updateUrl, payload);
      toast.success('Invoice approval matrix updated successfully');
      navigate('/settings/asset-setup/approval-matrix');
    } catch (error) {
      console.error('Error updating invoice approval matrix:', error);
      toast.error(getApiErrorMessage(error, 'Failed to update invoice approval matrix'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="p-6 space-y-6">
        <div className="text-sm text-muted-foreground">Setup &gt; Invoice Approvals &gt; Edit</div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">EDIT INVOICE APPROVALS</h1>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-6">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Function *</InputLabel>
            <Select value={selectedFunction} onChange={(e) => setSelectedFunction(e.target.value)} label="Function *">
              {functionOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C72030' }}></div>
              <h3 className="text-lg font-semibold" style={{ color: '#C72030' }}>Approval Levels</h3>
            </div>

            {approvalLevels.map((level, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg">
                <div className="col-span-2">
                  <TextField
                    label="Order *"
                    type="number"
                    fullWidth
                    value={level.order}
                    onChange={(e) => updateApprovalLevel(index, 'order', parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1 }}
                    size="small"
                  />
                </div>
                <div className="col-span-3">
                  <TextField
                    label="Name of Level *"
                    fullWidth
                    value={level.name}
                    onChange={(e) => updateApprovalLevel(index, 'name', e.target.value)}
                    placeholder="Enter Name of Level"
                    size="small"
                  />
                </div>
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
                            <MuiCheckbox checked={level.users.includes(user.id.toString())} sx={{ marginRight: 1 }} />
                            <ListItemText primary={user.full_name} />
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No users available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </div>
                <div className="col-span-2 flex items-center">
                  <FormControlLabel
                    control={<MuiCheckbox checked={level.sendEmails} onChange={(e) => updateApprovalLevel(index, 'sendEmails', e.target.checked)} size="small" />}
                    label="Send Emails"
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  {approvalLevels.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => removeApprovalLevel(index)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button variant="ghost" onClick={addApprovalLevel} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Plus className="w-4 h-4" />
              Add More Level
            </Button>
          </div>

          <div className="flex gap-4 pt-6">
            <Button variant="outline" onClick={() => navigate('/settings/asset-setup/approval-matrix')}>
              Back
            </Button>
            <Button onClick={handleUpdate} disabled={submitting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {submitting ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

