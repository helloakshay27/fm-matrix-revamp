import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/utils/apiClient';

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
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Function <span className="text-destructive">*</span>
          </label>
          <Select value={selectedFunction} onValueChange={setSelectedFunction}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Function" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              {functionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
                <label className="text-sm font-medium text-muted-foreground">
                  Order <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  value={level.order}
                  onChange={(e) => updateApprovalLevel(index, 'order', parseInt(e.target.value) || 1)}
                  className="mt-1"
                  min="1"
                />
              </div>

              {/* Name of Level */}
              <div className="col-span-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Name of Level <span className="text-destructive">*</span>
                </label>
                <Input
                  value={level.name}
                  onChange={(e) => updateApprovalLevel(index, 'name', e.target.value)}
                  placeholder="Enter Name of Level"
                  className="mt-1"
                />
              </div>

              {/* Users */}
              <div className="col-span-4">
                <label className="text-sm font-medium text-muted-foreground">
                  Users <span className="text-destructive">*</span>
                </label>
                <Select
                  value={level.users.join(',')}
                  onValueChange={(value) => {
                    const userIds = value ? value.split(',') : [];
                    updateApprovalLevel(index, 'users', userIds);
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select up to 15 Options..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {loading ? (
                      <SelectItem value="" disabled>Loading users...</SelectItem>
                    ) : users.length > 0 ? (
                      users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.full_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>No users available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Send Emails */}
              <div className="col-span-2 flex items-center space-x-2">
                <Checkbox
                  id={`send-emails-${index}`}
                  checked={level.sendEmails}
                  onCheckedChange={(checked) => updateApprovalLevel(index, 'sendEmails', checked)}
                />
                <label htmlFor={`send-emails-${index}`} className="text-sm font-medium">
                  Send Emails
                </label>
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
  );
};