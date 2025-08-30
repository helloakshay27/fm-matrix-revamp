import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { lockFunctionService, LockFunction, UpdateLockFunctionPayload } from '@/services/lockFunctionService';

export const LockFunctionEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lockFunction, setLockFunction] = useState<LockFunction | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    action_name: '',
    active: true,
    lock_controller_id: '',
    phase_id: '',
    module_id: '',
    parent_function: '',
    url: ''
  });

  useEffect(() => {
    const fetchLockFunction = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await lockFunctionService.fetchLockFunction(parseInt(id));
        setLockFunction(data);
        setFormData({
          name: data.name || '',
          action_name: data.action_name || '',
          active: Boolean(data.active),
          lock_controller_id: data.lock_controller_id?.toString() || '',
          phase_id: data.phase_id?.toString() || '',
          module_id: data.module_id?.toString() || '',
          parent_function: data.parent_function || '',
          url: data.url || ''
        });
      } catch (error: any) {
        console.error('Error fetching lock function:', error);
        toast.error(`Failed to load lock function: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLockFunction();
  }, [id]);

  const handleSave = async () => {
    if (!lockFunction || !formData.name.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const payload: UpdateLockFunctionPayload = {
        lock_function: {
          name: formData.name.trim(),
          action_name: formData.action_name.trim(),
          active: formData.active,
          lock_controller_id: formData.lock_controller_id ? parseInt(formData.lock_controller_id) : undefined,
          phase_id: formData.phase_id ? parseInt(formData.phase_id) : undefined,
          module_id: parseInt(formData.module_id) || 0,
          parent_function: formData.parent_function.trim() || undefined,
        }
      };

      await lockFunctionService.updateLockFunction(lockFunction.id, payload);
      toast.success('Lock function updated successfully!');
      navigate('/settings/account/lock-function');
    } catch (error: any) {
      console.error('Error updating lock function:', error);
      toast.error(`Failed to update lock function: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/settings/account/lock-function');
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
      </div>
    );
  }

  if (!lockFunction) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Lock Function Not Found</h2>
          <p className="text-gray-600 mt-2">The requested lock function could not be found.</p>
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
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide uppercase">Edit Lock Function</h1>
              <p className="text-gray-600">Update lock function information</p>
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
              <Label htmlFor="name">Function Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter function name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="action_name">Action Name</Label>
              <Input
                id="action_name"
                value={formData.action_name}
                onChange={(e) => handleChange('action_name', e.target.value)}
                placeholder="Enter action name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parent_function">Parent Function</Label>
              <Input
                id="parent_function"
                value={formData.parent_function}
                onChange={(e) => handleChange('parent_function', e.target.value)}
                placeholder="Enter parent function"
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
            <CardTitle>System Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lock_controller_id">Lock Controller ID</Label>
              <Input
                id="lock_controller_id"
                type="number"
                value={formData.lock_controller_id}
                onChange={(e) => handleChange('lock_controller_id', e.target.value)}
                placeholder="Enter lock controller ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phase_id">Phase ID</Label>
              <Input
                id="phase_id"
                type="number"
                value={formData.phase_id}
                onChange={(e) => handleChange('phase_id', e.target.value)}
                placeholder="Enter phase ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="module_id">Module ID</Label>
              <Input
                id="module_id"
                type="number"
                value={formData.module_id}
                onChange={(e) => handleChange('module_id', e.target.value)}
                placeholder="Enter module ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="Enter URL"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
