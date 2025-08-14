import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { CreateEmailRuleDialogNew } from '@/components/dialogs/CreateEmailRuleDialogNew';
import { EditEmailRuleDialog } from '@/components/dialogs/EditEmailRuleDialog';
import { EmailRule } from '@/types/emailRule';
import { emailRuleService } from '@/services/emailRuleService';
import { toast } from 'sonner';

// Mock data
const mockEmailRules: EmailRule[] = [
  {
    id: '1',
    srNo: 1,
    ruleName: 'PPM Reminder - Equipment',
    triggerType: 'PPM',
    triggerTo: 'Supplier',
    role: 'Maintenance Manager',
    periodValue: 7,
    periodType: 'days',
    createdOn: '2024-01-15',
    createdBy: 'Admin User',
    active: true,
  },
  {
    id: '2',
    srNo: 2,
    ruleName: 'AMC Expiry Alert',
    triggerType: 'AMC',
    triggerTo: 'Occupant Admin',
    role: 'Facility Manager',
    periodValue: 30,
    periodType: 'days',
    createdOn: '2024-01-14',
    createdBy: 'System Admin',
    active: false,
  },
  {
    id: '3',
    srNo: 3,
    ruleName: 'Weekly PPM Check',
    triggerType: 'PPM',
    triggerTo: 'Site Admin',
    role: 'Technician',
    periodValue: 1,
    periodType: 'weeks',
    createdOn: '2024-01-13',
    createdBy: 'Admin User',
    active: true,
  },
];

export const EmailRuleSetupPage: React.FC = () => {
  const [emailRules, setEmailRules] = useState<EmailRule[]>([]);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<EmailRule | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEmailRules = async () => {
    try {
      setLoading(true);
      const rules = await emailRuleService.getEmailRules();
      setEmailRules(rules);
    } catch (error) {
      console.error('Failed to fetch email rules:', error);
      // Fallback to mock data on error
      setEmailRules(mockEmailRules);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailRules();
  }, []);

  const columns: ColumnConfig[] = [
    { key: 'edit', label: 'Edit', sortable: false, hideable: false, defaultVisible: true },
    { key: 'srNo', label: 'Sr.No.', sortable: true, hideable: true, defaultVisible: true },
    { key: 'id', label: 'ID', sortable: true, hideable: true, defaultVisible: true },
    { key: 'ruleName', label: 'Rule Name', sortable: true, hideable: true, defaultVisible: true },
    { key: 'triggerType', label: 'Trigger Type', sortable: true, hideable: true, defaultVisible: true },
    { key: 'triggerTo', label: 'Trigger To', sortable: true, hideable: true, defaultVisible: true },
    { key: 'role', label: 'Role', sortable: true, hideable: true, defaultVisible: true },
    { key: 'periodValue', label: 'Period Value', sortable: true, hideable: true, defaultVisible: true },
    { key: 'periodType', label: 'Period Type', sortable: true, hideable: true, defaultVisible: true },
    { key: 'createdOn', label: 'Created On', sortable: true, hideable: true, defaultVisible: true },
    { key: 'createdBy', label: 'Created By', sortable: true, hideable: true, defaultVisible: true },
    { key: 'active', label: 'Active', sortable: false, hideable: true, defaultVisible: true },
  ];

  const handleCreateRule = (data: Omit<EmailRule, 'id' | 'srNo' | 'createdOn' | 'createdBy' | 'active'>) => {
    const newRule: EmailRule = {
      ...data,
      id: String(emailRules.length + 1),
      srNo: emailRules.length + 1,
      createdOn: new Date().toISOString().split('T')[0],
      createdBy: 'Current User',
      active: true,
    };
    setEmailRules([...emailRules, newRule]);
  };

  const handleEditRule = (id: string, data: Partial<EmailRule>) => {
    setEmailRules(emailRules.map(rule => 
      rule.id === id ? { ...rule, ...data } : rule
    ));
    toast.success('Email rule updated successfully');
  };

  const handleToggleActive = (id: string) => {
    setEmailRules(emailRules.map(rule => {
      if (rule.id === id) {
        const newStatus = !rule.active;
        toast.success(`Email rule ${newStatus ? 'activated' : 'deactivated'} successfully`);
        return { ...rule, active: newStatus };
      }
      return rule;
    }));
  };

  const handleEditClick = (rule: EmailRule) => {
    setEditingRule(rule);
    setEditDialogOpen(true);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRules(emailRules.map(rule => rule.id));
    } else {
      setSelectedRules([]);
    }
  };

  const handleSelectRule = (ruleId: string, checked: boolean) => {
    if (checked) {
      setSelectedRules([...selectedRules, ruleId]);
    } else {
      setSelectedRules(selectedRules.filter(id => id !== ruleId));
    }
  };

  const renderCell = (rule: EmailRule, columnKey: string) => {
    switch (columnKey) {
      case 'edit':
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(rule);
            }}
            className="p-1 h-8 w-8"
          >
            <Edit className="w-4 h-4" />
          </Button>
        );
      case 'srNo':
        return <span className="text-sm text-gray-900">{rule.srNo}</span>;
      case 'id':
        return <span className="text-sm text-gray-600">{rule.id}</span>;
      case 'ruleName':
        return <span className="text-sm font-medium text-gray-900">{rule.ruleName}</span>;
      case 'triggerType':
        return (
          <Badge variant={rule.triggerType === 'PPM' ? 'default' : 'secondary'}>
            {rule.triggerType}
          </Badge>
        );
      case 'triggerTo':
        return <span className="text-sm text-gray-600">{rule.triggerTo}</span>;
      case 'role':
        return <span className="text-sm text-gray-600">{rule.role}</span>;
      case 'periodValue':
        return <span className="text-sm text-gray-600">{rule.periodValue}</span>;
      case 'periodType':
        return <span className="text-sm text-gray-600">{rule.periodType}</span>;
      case 'createdOn':
        return <span className="text-sm text-gray-600">{rule.createdOn}</span>;
      case 'createdBy':
        return <span className="text-sm text-gray-600">{rule.createdBy}</span>;
      case 'active':
        return (
          <div
            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${rule.active ? 'bg-green-500' : 'bg-gray-300'}`}
            onClick={() => handleToggleActive(rule.id)}
            aria-label={rule.active ? 'Deactivate email rule' : 'Activate email rule'}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${rule.active ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            PPM/AMC REMINDER EMAIL RULE SETUP
          </h1>
          
          <div className="flex justify-between items-center">
            <Button 
              onClick={() => setCreateDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Table */}
        <EnhancedTable
          data={emailRules}
          columns={columns}
          renderCell={renderCell}
          storageKey="email-rule-setup-table"
          emptyMessage="No email rules found"
          selectable={true}
          selectedItems={selectedRules}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectRule}
          getItemId={(rule) => rule.id}
          selectAllLabel="Select all email rules"
        />

        {/* Dialogs */}
        <CreateEmailRuleDialogNew
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateRule}
          onSuccess={fetchEmailRules} // Pass the refresh function
        />

        <EditEmailRuleDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingRule(null);
          }}
          onSubmit={handleEditRule}
          emailRule={editingRule}
          onSuccess={fetchEmailRules}
        />
      </div>
    </div>
  );
};
