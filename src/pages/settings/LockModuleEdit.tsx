import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { moduleService, LockModule, CreateModulePayload } from '@/services/moduleService';

export const LockModuleEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [module, setModule] = useState<LockModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
    active: true,
    phase_id: '',
    show_name: '',
    module_type: '',
    charged_per: '',
    no_of_licences: '',
    min_billing: '',
    rate: '',
    max_billing: '',
    total_billing: '',
    rate_type: '',
    url: ''
  });

  useEffect(() => {
    const fetchModule = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Since moduleService doesn't have fetchSingleModule, we'll fetch all and find the one
        const modules = await moduleService.fetchModules();
        const foundModule = modules.find(m => m.id === parseInt(id));
        if (foundModule) {
          setModule(foundModule);
          setFormData({
            name: foundModule.name || '',
            abbreviation: foundModule.abbreviation || '',
            active: Boolean(foundModule.active),
            phase_id: foundModule.phase_id?.toString() || '',
            show_name: foundModule.show_name || '',
            module_type: foundModule.module_type || '',
            charged_per: foundModule.charged_per || '',
            no_of_licences: foundModule.no_of_licences?.toString() || '',
            min_billing: foundModule.min_billing?.toString() || '',
            rate: foundModule.rate?.toString() || '',
            max_billing: foundModule.max_billing?.toString() || '',
            total_billing: foundModule.total_billing?.toString() || '',
            rate_type: foundModule.rate_type || '',
            url: foundModule.url || ''
          });
        } else {
          toast.error('Module not found');
          navigate('/settings/account/lock-module');
        }
      } catch (error: any) {
        console.error('Error fetching module:', error);
        toast.error(`Failed to load module: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!module || !formData.name.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<CreateModulePayload> = {
        lock_module: {
          name: formData.name.trim(),
          abbreviation: formData.abbreviation.trim(),
          active: formData.active,
          phase_id: formData.phase_id ? parseInt(formData.phase_id) : undefined,
          show_name: formData.show_name.trim(),
          module_type: formData.module_type.trim(),
          charged_per: formData.charged_per.trim(),
          no_of_licences: formData.no_of_licences ? parseInt(formData.no_of_licences) : undefined,
          min_billing: formData.min_billing ? parseFloat(formData.min_billing) : undefined,
          rate: formData.rate ? parseFloat(formData.rate) : undefined,
          max_billing: formData.max_billing ? parseFloat(formData.max_billing) : undefined,
          total_billing: formData.total_billing ? parseFloat(formData.total_billing) : undefined,
          rate_type: formData.rate_type.trim(),
        }
      };

      await moduleService.updateModule(module.id!, payload);
      toast.success('Module updated successfully!');
      navigate('/settings/account/lock-module');
    } catch (error: any) {
      console.error('Error updating module:', error);
      toast.error(`Failed to update module: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/settings/account/lock-module');
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

  if (!module) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Module Not Found</h2>
          <p className="text-gray-600 mt-2">The requested module could not be found.</p>
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
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide uppercase">Edit Lock Module</h1>
              <p className="text-gray-600">Update module configuration</p>
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
              <Label htmlFor="name">Module Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter module name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="show_name">Display Name</Label>
              <Input
                id="show_name"
                value={formData.show_name}
                onChange={(e) => handleChange('show_name', e.target.value)}
                placeholder="Enter display name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="abbreviation">Abbreviation</Label>
              <Input
                id="abbreviation"
                value={formData.abbreviation}
                onChange={(e) => handleChange('abbreviation', e.target.value)}
                placeholder="Enter abbreviation"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="module_type">Module Type</Label>
              <Input
                id="module_type"
                value={formData.module_type}
                onChange={(e) => handleChange('module_type', e.target.value)}
                placeholder="Enter module type"
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
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="no_of_licences">Number of Licenses</Label>
              <Input
                id="no_of_licences"
                type="number"
                value={formData.no_of_licences}
                onChange={(e) => handleChange('no_of_licences', e.target.value)}
                placeholder="Enter number of licenses"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="charged_per">Charged Per</Label>
              <Input
                id="charged_per"
                value={formData.charged_per}
                onChange={(e) => handleChange('charged_per', e.target.value)}
                placeholder="Enter charging unit"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rate_type">Rate Type</Label>
              <Select value={formData.rate_type} onValueChange={(value) => handleChange('rate_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rate type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="variable">Variable</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="Enter module URL"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Billing Configuration</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rate">Rate</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                value={formData.rate}
                onChange={(e) => handleChange('rate', e.target.value)}
                placeholder="Enter rate"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="min_billing">Minimum Billing</Label>
              <Input
                id="min_billing"
                type="number"
                step="0.01"
                value={formData.min_billing}
                onChange={(e) => handleChange('min_billing', e.target.value)}
                placeholder="Enter minimum billing"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max_billing">Maximum Billing</Label>
              <Input
                id="max_billing"
                type="number"
                step="0.01"
                value={formData.max_billing}
                onChange={(e) => handleChange('max_billing', e.target.value)}
                placeholder="Enter maximum billing"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total_billing">Total Billing</Label>
              <Input
                id="total_billing"
                type="number"
                step="0.01"
                value={formData.total_billing}
                onChange={(e) => handleChange('total_billing', e.target.value)}
                placeholder="Enter total billing"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
