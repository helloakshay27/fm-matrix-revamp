import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { roleConfigService, RoleConfigItem } from '@/services/roleConfigService';

export const RoleConfigView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [roleConfig, setRoleConfig] = useState<RoleConfigItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoleConfig = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await roleConfigService.fetchRoleConfig(parseInt(id));
        setRoleConfig(data);
      } catch (error: any) {
        console.error('Error fetching role config:', error);
        toast.error(`Failed to load role configuration: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleConfig();
  }, [id]);

  const handleEdit = () => {
    navigate(`/settings/account/role-config/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!roleConfig || !window.confirm('Are you sure you want to delete this role configuration?')) {
      return;
    }

    try {
      await roleConfigService.deleteRoleConfig(roleConfig.id);
      toast.success('Role configuration deleted successfully!');
      navigate('/settings/account/role-config');
    } catch (error: any) {
      console.error('Error deleting role config:', error);
      toast.error(`Failed to delete role configuration: ${error.message}`);
    }
  };

  const handleBack = () => {
    navigate('/settings/account/role-config');
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
              <h1 className="text-xl font-bold tracking-wide uppercase">Role Configuration Details</h1>
              <p className="text-gray-600">View role configuration information</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Role Name</label>
              <p className="text-lg font-semibold text-gray-900">{roleConfig.roleName}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900">{roleConfig.description || 'No description available'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge 
                  variant={roleConfig.active ? "default" : "secondary"}
                  className={roleConfig.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {roleConfig.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Created On</label>
              <p className="text-gray-900">{roleConfig.createdOn}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Created By</label>
              <p className="text-gray-900">{roleConfig.createdBy || 'System'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {roleConfig.permissions && roleConfig.permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {roleConfig.permissions.map((permission, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {permission}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No permissions assigned</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};