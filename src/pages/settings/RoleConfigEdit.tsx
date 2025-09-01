import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, Save, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { roleConfigService, RoleConfigItem, UpdateRoleConfigPayload } from '@/services/roleConfigService';

export const RoleConfigEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [roleConfig, setRoleConfig] = useState<RoleConfigItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    roleName: '',
    description: '',
    active: true,
    permissions: [] as string[]
  });

  const [newPermission, setNewPermission] = useState('');

  // Common permissions that can be selected
  const commonPermissions = [
    'CREATE', 'READ', 'UPDATE', 'DELETE',
    'MANAGE_USERS', 'MANAGE_ROLES', 'MANAGE_ASSETS',
    'MANAGE_TICKETS', 'MANAGE_TASKS', 'MANAGE_VISITORS',
    'MANAGE_SECURITY', 'MANAGE_FINANCE', 'APPROVE_INVOICES',
    'VIEW_REPORTS', 'EXPORT_DATA', 'SYSTEM_CONFIG'
  ];

  useEffect(() => {
    const fetchRoleConfig = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await roleConfigService.fetchRoleConfig(parseInt(id));
        setRoleConfig(data);
        setFormData({
          roleName: data.roleName || '',
          description: data.description || '',
          active: Boolean(data.active),
          permissions: data.permissions || []
        });
      } catch (error: any) {
        console.error('Error fetching role config:', error);
        toast.error(`Failed to load role configuration: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleConfig();
  }, [id]);

  const handleSave = async () => {
    if (!roleConfig || !formData.roleName.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const payload: UpdateRoleConfigPayload = {
        role_config: {
          name: formData.roleName.trim(),
          description: formData.description.trim(),
          permissions: formData.permissions,
          active: formData.active,
        }
      };

      await roleConfigService.updateRoleConfig(roleConfig.id, payload);
      toast.success('Role configuration updated successfully!');
      navigate('/settings/account/role-config');
    } catch (error: any) {
      console.error('Error updating role config:', error);
      toast.error(`Failed to update role configuration: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/settings/account/role-config');
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addPermission = (permission: string) => {
    if (permission && !formData.permissions.includes(permission)) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permission]
      }));
    }
  };

  const removePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.filter(p => p !== permission)
    }));
  };

  const addCustomPermission = () => {
    if (newPermission.trim() && !formData.permissions.includes(newPermission.trim().toUpperCase())) {
      addPermission(newPermission.trim().toUpperCase());
      setNewPermission('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
      </div>
    );
  }

  if (!roleConfig) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Role Configuration Not Found</h2>
          <p className="text-gray-600 mt-2">The requested role configuration could not be found.</p>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C72030]/10 text-[#C72030] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide uppercase">Edit Role Configuration</h1>
              <p className="text-gray-600">Update role configuration information</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleBack}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[#C72030] hover:bg-[#C72030]/90"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name *</Label>
              <Input
                id="roleName"
                value={formData.roleName}
                onChange={(e) => handleChange('roleName', e.target.value)}
                placeholder="Enter role name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter role description"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleChange('active', checked)}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Common Permissions</Label>
              <div className="grid grid-cols-2 gap-2">
                {commonPermissions.map(permission => (
                  <Button
                    key={permission}
                    variant="outline"
                    size="sm"
                    onClick={() => addPermission(permission)}
                    disabled={formData.permissions.includes(permission)}
                    className="justify-start text-xs"
                  >
                    {permission}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Custom Permission</Label>
              <div className="flex gap-2">
                <Input
                  value={newPermission}
                  onChange={(e) => setNewPermission(e.target.value)}
                  placeholder="Enter custom permission"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomPermission();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCustomPermission}
                  disabled={!newPermission.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {formData.permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.permissions.map((permission, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 pr-1"
                  >
                    {permission}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-red-100"
                      onClick={() => removePermission(permission)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No permissions assigned. Add permissions using the form above.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
