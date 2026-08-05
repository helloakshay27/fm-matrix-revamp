import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { lockFunctionService, LockFunction, UpdateLockFunctionPayload } from '@/services/lockFunctionService';
import { moduleService, LockModule } from '@/services/moduleService';

export const LockFunctionEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lockFunction, setLockFunction] = useState<LockFunction | null>(null);
  const [modules, setModules] = useState<LockModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    action_name: '',
    active: true,
    lock_controller_id: '',
    phase_id: '',
    module_id: '',
    react_link: '',
    parent_function: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch both lock function and modules
        const [lockFunctionData, modulesData] = await Promise.all([
          lockFunctionService.fetchLockFunction(parseInt(id)),
          moduleService.fetchModules()
        ]);
        
        setLockFunction(lockFunctionData);
        setModules(modulesData);
        setFormData({
          name: lockFunctionData.name || '',
          action_name: lockFunctionData.action_name || '',
          active: Boolean(lockFunctionData.active),
          lock_controller_id: lockFunctionData.lock_controller_id?.toString() || '',
          phase_id: lockFunctionData.phase_id?.toString() || '',
          module_id: lockFunctionData.module_id?.toString() || '',
          react_link: lockFunctionData.react_link || '',
          parent_function: lockFunctionData.parent_function || '',
        });
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error(`Failed to load data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Function name is required');
      return false;
    }
    if (!formData.action_name.trim()) {
      toast.error('Action name is required');
      return false;
    }
    if (!formData.module_id) {
      toast.error('Module selection is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!lockFunction || !validateForm()) {
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
          module_id: parseInt(formData.module_id),
          react_link: formData.react_link.trim() || undefined,
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
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={handleBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E5E0D3] text-brand flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide uppercase">Edit Lock Function</h1>
            <p className="text-gray-600">Update lock function information</p>
          </div>
        </div>
      </div>

      <Card className="max-w-3xl">
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
            <Label htmlFor="action_name">Action Name *</Label>
            <Input
              id="action_name"
              value={formData.action_name}
              onChange={(e) => handleChange('action_name', e.target.value)}
              placeholder="Enter action name (e.g., unlock, pms_notices)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="module_id">Module *</Label>
            <Select value={formData.module_id} onValueChange={(value) => handleChange('module_id', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module.id} value={module.id?.toString() || ''}>
                    {module.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="react_link">React Link</Label>
            <Input
              id="react_link"
              value={formData.react_link}
              onChange={(e) => handleChange('react_link', e.target.value)}
              placeholder="Enter react link (e.g., /settings/account/lock-function)"
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
        </CardContent>
      </Card>

      <div className="flex items-center gap-3 justify-center pt-2 max-w-3xl">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand text-white hover:bg-brand-hover px-8"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={saving}
          className="px-8 border-brand text-brand hover:bg-brand-selected hover:text-brand"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
