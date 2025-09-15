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
        lock_module: {
          name: formData.roleName.trim(),
   
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
              <h1 className="text-xl font-bold tracking-wide uppercase">Edit Module Configuration</h1>
              <p className="text-gray-600">Update Module configuration information</p>
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
            
     
         
          </CardContent>
        </Card>

    

     
      </div>
    </div>
  );
};
