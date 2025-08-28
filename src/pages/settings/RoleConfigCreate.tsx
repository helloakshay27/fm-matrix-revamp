import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  UserCheck,
  Settings,
  Shield,
  Users,
  FileText,
  Building2,
  Loader2,
  Save,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';

// Section component for consistent layout
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <section className="bg-white rounded-lg border border-gray-200 shadow-sm">
    <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-[#C72030]/10 text-[#C72030] flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </section>
);

// Permission groups similar to shift timings
const permissionGroups = {
  'User Management': ['CREATE_USERS', 'READ_USERS', 'UPDATE_USERS', 'DELETE_USERS'],
  'Asset Management': ['CREATE_ASSETS', 'READ_ASSETS', 'UPDATE_ASSETS', 'DELETE_ASSETS'],
  'Maintenance': ['CREATE_TICKETS', 'READ_TICKETS', 'UPDATE_TICKETS', 'ASSIGN_TICKETS'],
  'Finance': ['CREATE_INVOICES', 'READ_INVOICES', 'APPROVE_INVOICES', 'MANAGE_BUDGET'],
  'Security': ['MANAGE_VISITORS', 'MANAGE_ACCESS', 'VIEW_SECURITY_LOGS'],
  'Admin': ['SYSTEM_CONFIG', 'MANAGE_ROLES', 'BACKUP_DATA', 'AUDIT_LOGS']
};
interface RoleFormData {
  roleName: string;
  description: string;
  permissions: string[];
  active: boolean;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Available permissions grouped by category
const availablePermissions: Permission[] = [
  // User Management
  { id: 'CREATE_USER', name: 'Create User', description: 'Create new users', category: 'User Management' },
  { id: 'READ_USER', name: 'View User', description: 'View user information', category: 'User Management' },
  { id: 'UPDATE_USER', name: 'Update User', description: 'Modify user information', category: 'User Management' },
  { id: 'DELETE_USER', name: 'Delete User', description: 'Remove users from system', category: 'User Management' },
  { id: 'MANAGE_ROLES', name: 'Manage Roles', description: 'Assign and manage user roles', category: 'User Management' },
  
  // Asset Management
  { id: 'CREATE_ASSET', name: 'Create Asset', description: 'Add new assets', category: 'Asset Management' },
  { id: 'READ_ASSET', name: 'View Asset', description: 'View asset information', category: 'Asset Management' },
  { id: 'UPDATE_ASSET', name: 'Update Asset', description: 'Modify asset information', category: 'Asset Management' },
  { id: 'DELETE_ASSET', name: 'Delete Asset', description: 'Remove assets', category: 'Asset Management' },
  { id: 'MANAGE_MAINTENANCE', name: 'Manage Maintenance', description: 'Handle asset maintenance', category: 'Asset Management' },
  
  // Ticket Management
  { id: 'CREATE_TICKET', name: 'Create Ticket', description: 'Create new tickets', category: 'Ticket Management' },
  { id: 'READ_TICKET', name: 'View Ticket', description: 'View ticket details', category: 'Ticket Management' },
  { id: 'UPDATE_TICKET', name: 'Update Ticket', description: 'Modify ticket information', category: 'Ticket Management' },
  { id: 'ASSIGN_TICKET', name: 'Assign Ticket', description: 'Assign tickets to users', category: 'Ticket Management' },
  { id: 'RESOLVE_TICKET', name: 'Resolve Ticket', description: 'Close and resolve tickets', category: 'Ticket Management' },
  
  // Financial Management
  { id: 'CREATE_INVOICE', name: 'Create Invoice', description: 'Generate invoices', category: 'Financial Management' },
  { id: 'APPROVE_INVOICE', name: 'Approve Invoice', description: 'Approve financial transactions', category: 'Financial Management' },
  { id: 'VIEW_REPORTS', name: 'View Reports', description: 'Access financial reports', category: 'Financial Management' },
  { id: 'MANAGE_BUDGET', name: 'Manage Budget', description: 'Handle budget planning', category: 'Financial Management' },
  
  // Security & Access
  { id: 'MANAGE_VISITORS', name: 'Manage Visitors', description: 'Control visitor access', category: 'Security & Access' },
  { id: 'MANAGE_SECURITY', name: 'Manage Security', description: 'Handle security operations', category: 'Security & Access' },
  { id: 'ACCESS_CONTROL', name: 'Access Control', description: 'Manage system access', category: 'Security & Access' },
  { id: 'VIEW_AUDIT_LOGS', name: 'View Audit Logs', description: 'Access system audit trails', category: 'Security & Access' },
  
  // System Administration
  { id: 'SYSTEM_CONFIG', name: 'System Configuration', description: 'Configure system settings', category: 'System Administration' },
  { id: 'BACKUP_RESTORE', name: 'Backup & Restore', description: 'Handle system backups', category: 'System Administration' },
  { id: 'MANAGE_INTEGRATIONS', name: 'Manage Integrations', description: 'Handle third-party integrations', category: 'System Administration' },
  { id: 'SUPER_ADMIN', name: 'Super Admin', description: 'Full system access', category: 'System Administration' },
];

export const RoleConfigCreate: React.FC = () => {
  const navigate = useNavigate();

  // Set document title
  useEffect(() => {
    document.title = 'Create Role Configuration';
  }, []);

  // Form state similar to CreateShiftDialog
  const [roleName, setRoleName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const validateForm = () => {
    if (!roleName.trim()) {
      toast.error('Role name is required');
      return false;
    }

    if (!description.trim()) {
      toast.error('Description is required');
      return false;
    }

    if (selectedPermissions.length === 0) {
      toast.error('At least one permission must be selected');
      return false;
    }

    return true;
  };

  // Handle create - similar to CreateShiftDialog
  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    // Build API payload
    const payload = {
      role_config: {
        name: roleName,
        description: description,
        permissions: selectedPermissions,
        active: isActive
      }
    };

    try {
      // Mock API call - replace with actual API when backend is ready
      console.log('Creating role config:', payload);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      toast.success('Role configuration created successfully!');
      
      // Navigate back to list
      navigate('/settings/account/role-config');

    } catch (error: any) {
      console.error('Error creating role config:', error);
      toast.error(`Failed to create role configuration: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle permission toggle
  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Handle select all permissions for a group
  const handleSelectGroupPermissions = (groupName: string, checked: boolean) => {
    const groupPermissions = permissionGroups[groupName] || [];
    
    if (checked) {
      setSelectedPermissions(prev => [...new Set([...prev, ...groupPermissions])]);
    } else {
      setSelectedPermissions(prev => prev.filter(p => !groupPermissions.includes(p)));
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof RoleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing/selecting
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Handle permission toggle
  const handlePermissionToggle = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));

    // Clear permission error when user selects permissions
    if (errors.permissions) {
      setErrors((prev) => ({ ...prev, permissions: false }));
    }
  };

  // Handle category toggle (select/deselect all permissions in a category)
  const handleCategoryToggle = (category: string) => {
    const categoryPermissions = availablePermissions
      .filter((p) => p.category === category)
      .map((p) => p.id);

    const hasAllCategoryPermissions = categoryPermissions.every((p) =>
      formData.permissions.includes(p)
    );

    if (hasAllCategoryPermissions) {
      // Remove all category permissions
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((p) => !categoryPermissions.includes(p)),
      }));
    } else {
      // Add all category permissions
      setFormData((prev) => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...categoryPermissions])],
      }));
    }

    // Clear permission error
    if (errors.permissions) {
      setErrors((prev) => ({ ...prev, permissions: false }));
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors = {
      roleName: !formData.roleName.trim(),
      description: !formData.description.trim(),
      permissions: formData.permissions.length === 0,
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (hasErrors) {
      const errorFields = [];
      if (newErrors.roleName) errorFields.push('Role Name');
      if (newErrors.description) errorFields.push('Description');
      if (newErrors.permissions) errorFields.push('Permissions');

      toast.error(
        `Please fill in the following required fields: ${errorFields.join(', ')}`,
        {
          duration: 5000,
        }
      );
    }

    return !hasErrors;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Build payload for API
      const payload = {
        role_config: {
          name: formData.roleName,
          description: formData.description,
          permissions: formData.permissions,
          active: formData.active,
        },
      };

      // Log payload to console for debugging
      console.log('🎯 Role Config API Payload:', JSON.stringify(payload, null, 2));

      // Make API call (replace with actual endpoint)
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/admin/role_configs.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthHeader(),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error('API error');

      toast.success('Role configuration created successfully!');
      navigate('/settings/role-config/list');
    } catch (error) {
      console.error('Error creating role configuration:', error);
      toast.error('Failed to create role configuration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel/back
  const handleCancel = () => {
    navigate('/settings/role-config/list');
  };

  // Group permissions by category
  const permissionsByCategory = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="p-6 space-y-6 relative">
      {/* Loading overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Back to Role Configuration List"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C72030]/10 text-[#C72030] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide uppercase">
                Create Role Configuration
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Basic Information Section */}
        <Section title="Basic Information" icon={<FileText className="w-4 h-4" />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <TextField
                label={
                  <>
                    Role Name<span className="text-red-500">*</span>
                  </>
                }
                placeholder="Enter role name"
                value={formData.roleName}
                onChange={(e) => handleInputChange('roleName', e.target.value)}
                fullWidth
                variant="outlined"
                error={errors.roleName}
                helperText={errors.roleName ? 'Role name is required' : ''}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.active}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                    sx={{
                      color: '#D5DbDB',
                      '&.Mui-checked': {
                        color: '#C72030',
                      },
                    }}
                    style={{
                      accentColor: '#C72030'
                    }}
                    disabled={isSubmitting}
                  />
                }
                label="Active"
                className="text-sm text-gray-700"
              />
            </div>
          </div>

          <div className="mt-4">
            <TextField
              label={
                <>
                  Description<span className="text-red-500">*</span>
                </>
              }
              placeholder="Enter role description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              error={errors.description}
              helperText={errors.description ? 'Description is required' : ''}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              InputProps={{
                sx: fieldStyles,
              }}
              disabled={isSubmitting}
            />
          </div>
        </Section>

        {/* Permissions Section */}
        <Section title="Permissions" icon={<Shield className="w-4 h-4" />}>
          <div className="space-y-6">
            <div className="mb-4">
              <Label className="text-sm font-medium text-gray-700">
                Select Permissions <span className="text-red-500">*</span>
              </Label>
              {errors.permissions && (
                <p className="text-red-500 text-sm mt-1">
                  Please select at least one permission
                </p>
              )}
            </div>

            {Object.entries(permissionsByCategory).map(([category, permissions]) => {
              const categoryPermissionIds = permissions.map((p) => p.id);
              const hasAllCategoryPermissions = categoryPermissionIds.every((id) =>
                formData.permissions.includes(id)
              );
              const hasSomeCategoryPermissions = categoryPermissionIds.some((id) =>
                formData.permissions.includes(id)
              );

              return (
                <div
                  key={category}
                  className="p-4 bg-[#f6f4ee] border border-[#D5DbDB] rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-[#C72030]">{category}</h3>
                    <button
                      type="button"
                      onClick={() => handleCategoryToggle(category)}
                      disabled={isSubmitting}
                      className={`
                        px-3 py-1 text-xs rounded transition-all duration-200
                        ${
                          hasAllCategoryPermissions
                            ? 'bg-[#C72030] text-white'
                            : 'bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white'
                        }
                      `}
                    >
                      {hasAllCategoryPermissions ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="bg-white rounded-lg p-3 border border-[#D5DbDB]">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.permissions.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              sx={{
                                color: '#D5DbDB',
                                '&.Mui-checked': {
                                  color: '#C72030',
                                },
                              }}
                              style={{
                                accentColor: '#C72030'
                              }}
                              disabled={isSubmitting}
                            />
                          }
                          label={
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {permission.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {permission.description}
                              </div>
                            </div>
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Selected permissions summary */}
            {formData.permissions.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Selected Permissions ({formData.permissions.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.permissions.map((permissionId) => {
                    const permission = availablePermissions.find((p) => p.id === permissionId);
                    return (
                      <span
                        key={permissionId}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#C72030] text-white"
                      >
                        {permission?.name}
                        <button
                          type="button"
                          onClick={() => handlePermissionToggle(permissionId)}
                          className="ml-1 text-white hover:text-gray-200"
                          disabled={isSubmitting}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Section>
      </div>

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/settings/account/role-config')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="w-10 h-10 rounded-full bg-[#C72030]/10 text-[#C72030] flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide uppercase">Create Role Configuration</h1>
            <p className="text-gray-600">Set up new role with permissions</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 space-y-6">
            {/* Role Name */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
                className="rounded-none border border-gray-300 h-10"
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter role description"
                className="rounded-none border border-gray-300 min-h-[80px]"
                disabled={isSubmitting}
              />
            </div>

            {/* Permissions */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions <span className="text-red-500">*</span>
              </Label>
              
              <div className="space-y-4">
                {Object.entries(permissionGroups).map(([groupName, permissions]) => {
                  const groupSelected = permissions.some(p => selectedPermissions.includes(p));
                  const allGroupSelected = permissions.every(p => selectedPermissions.includes(p));
                  
                  return (
                    <div key={groupName} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`group-${groupName}`} 
                            checked={allGroupSelected}
                            onCheckedChange={(checked) => handleSelectGroupPermissions(groupName, checked as boolean)}
                            disabled={isSubmitting}
                          />
                          <Label 
                            htmlFor={`group-${groupName}`} 
                            className="text-sm font-medium text-gray-900"
                          >
                            {groupName}
                          </Label>
                        </div>
                        <span className="text-xs text-gray-500">
                          {permissions.filter(p => selectedPermissions.includes(p)).length}/{permissions.length} selected
                        </span>
                      </div>
                      
                      <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {permissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox 
                              id={permission} 
                              checked={selectedPermissions.includes(permission)}
                              onCheckedChange={() => handlePermissionToggle(permission)}
                              disabled={isSubmitting}
                            />
                            <Label 
                              htmlFor={permission} 
                              className="text-sm text-gray-700"
                            >
                              {permission.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="active-status" 
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked as boolean)}
                disabled={isSubmitting}
              />
              <Label 
                htmlFor="active-status" 
                className="text-sm font-medium text-gray-700"
              >
                Active Role
              </Label>
            </div>

            {/* Create Button */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleCreate}
                disabled={isSubmitting}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 rounded-none shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Role'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
