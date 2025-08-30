import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Key, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { lockSubFunctionService, LockSubFunction, UpdateLockSubFunctionPayload } from '@/services/lockSubFunctionService';
import { lockFunctionService, LockFunction } from '@/services/lockFunctionService';

export const LockSubFunctionEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lockSubFunction, setLockSubFunction] = useState<LockSubFunction | null>(null);
  const [lockFunctions, setLockFunctions] = useState<LockFunction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    sub_function_name: '',
    active: true,
    lock_function_id: '',
    url: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch both the lock sub function and available lock functions
        const [subFunctionData, functionsData] = await Promise.all([
          lockSubFunctionService.fetchLockSubFunction(parseInt(id)),
          lockFunctionService.fetchLockFunctions()
        ]);
        
        setLockSubFunction(subFunctionData);
        setLockFunctions(functionsData);
        setFormData({
          name: subFunctionData.name || '',
          sub_function_name: subFunctionData.sub_function_name || '',
          active: Boolean(subFunctionData.active),
          lock_function_id: subFunctionData.lock_function_id?.toString() || '',
          url: subFunctionData.url || ''
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

  const handleSave = async () => {
    if (!lockSubFunction || !formData.sub_function_name.trim() || !formData.lock_function_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const payload: UpdateLockSubFunctionPayload = {
        lock_sub_function: {
          name: formData.name.trim(),
          sub_function_name: formData.sub_function_name.trim(),
          active: formData.active,
          lock_function_id: parseInt(formData.lock_function_id),
        }
      };

      await lockSubFunctionService.updateLockSubFunction(lockSubFunction.id, payload);
      toast.success('Lock sub function updated successfully!');
      navigate('/settings/account/lock-sub-function');
    } catch (error: any) {
      console.error('Error updating lock sub function:', error);
      toast.error(`Failed to update lock sub function: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/settings/account/lock-sub-function');
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

  if (!lockSubFunction) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Lock Sub Function Not Found</h2>
          <p className="text-gray-600 mt-2">The requested lock sub function could not be found.</p>
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
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide uppercase">Edit Lock Sub Function</h1>
              <p className="text-gray-600">Update lock sub function information</p>
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
              <Label htmlFor="sub_function_name">Sub Function Name *</Label>
              <Input
                id="sub_function_name"
                value={formData.sub_function_name}
                onChange={(e) => handleChange('sub_function_name', e.target.value)}
                placeholder="Enter sub function name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter name/description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lock_function_id">Parent Lock Function *</Label>
              <Select
                value={formData.lock_function_id}
                onValueChange={(value) => handleChange('lock_function_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent lock function" />
                </SelectTrigger>
                <SelectContent>
                  {lockFunctions.map((func) => (
                    <SelectItem key={func.id} value={func.id.toString()}>
                      {func.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
