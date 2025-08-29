import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { moduleService, CreateModulePayload, LockModule } from '@/services/moduleService';

export const ModuleAPIDemo = () => {
  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
    show_name: '',
  });
  const [modules, setModules] = useState<LockModule[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // POST API - Create Module
  const createModule = async () => {
    if (!formData.name || !formData.abbreviation || !formData.show_name) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload: CreateModulePayload = {
        lock_module: {
          name: formData.name,
          abbreviation: formData.abbreviation,
          show_name: formData.show_name,
          active: true,
        }
      };

      const response = await moduleService.createModule(payload);
      
      if (response.success) {
        toast.success('Module created successfully!');
        setFormData({ name: '', abbreviation: '', show_name: '' });
        fetchModules(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to create module');
      }
    } catch (error) {
      console.error('Error creating module:', error);
      toast.error('Failed to create module');
    } finally {
      setLoading(false);
    }
  };

  // GET API - Fetch Modules
  const fetchModules = async () => {
    setLoading(true);
    try {
      const data = await moduleService.fetchModules();
      setModules(data);
      toast.success(`Fetched ${data.length} modules successfully!`);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error('Failed to fetch modules');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Module API Demo</CardTitle>
          <CardDescription>
            Test the POST (create) and GET (fetch) APIs for modules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* CREATE FORM */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Module Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Safety Management"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="abbreviation">Abbreviation *</Label>
              <Input
                id="abbreviation"
                value={formData.abbreviation}
                onChange={(e) => handleInputChange('abbreviation', e.target.value)}
                placeholder="e.g., safety"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="show_name">Display Name *</Label>
              <Input
                id="show_name"
                value={formData.show_name}
                onChange={(e) => handleInputChange('show_name', e.target.value)}
                placeholder="e.g., Safety"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={createModule}
              disabled={loading}
              className="bg-[#C72030] hover:bg-[#A11D2A] text-white"
            >
              {loading ? 'Creating...' : 'POST - Create Module'}
            </Button>
            <Button 
              onClick={fetchModules}
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Fetching...' : 'GET - Fetch Modules'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* MODULES LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Modules List ({modules.length})</CardTitle>
          <CardDescription>
            Results from the GET API mapped according to your response structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          {modules.length === 0 ? (
            <p className="text-gray-500">No modules found. Click "GET - Fetch Modules" to load.</p>
          ) : (
            <div className="space-y-3">
              {modules.map((module) => (
                <div key={module.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <strong>ID:</strong> {module.id}
                    </div>
                    <div>
                      <strong>Name:</strong> {module.name}
                    </div>
                    <div>
                      <strong>Abbreviation:</strong> {module.abbreviation}
                    </div>
                    <div>
                      <strong>Display Name:</strong> {module.show_name}
                    </div>
                    <div>
                      <strong>Status:</strong> {module.active ? 'Active' : 'Inactive'}
                    </div>
                    <div>
                      <strong>Functions:</strong> {module.lock_functions?.length || 0}
                    </div>
                  </div>
                  
                  {/* Show functions if available */}
                  {module.lock_functions && module.lock_functions.length > 0 && (
                    <div className="mt-4">
                      <strong>Functions:</strong>
                      <div className="mt-2 space-y-2">
                        {module.lock_functions.map((func) => (
                          <div key={func.id} className="ml-4 p-2 bg-white rounded border-l-4 border-blue-200">
                            <div><strong>{func.name}</strong> ({func.action_name})</div>
                            {func.lock_sub_functions && func.lock_sub_functions.length > 0 && (
                              <div className="mt-1 text-sm text-gray-600">
                                Sub-functions: {func.lock_sub_functions.map(sf => sf.sub_function_name).join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
