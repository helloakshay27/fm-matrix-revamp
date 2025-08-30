import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Edit, Trash2, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { moduleService, LockModule } from '@/services/moduleService';

export const LockModuleView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [module, setModule] = useState<LockModule | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleEdit = () => {
    navigate(`/settings/account/lock-module/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!module || !window.confirm('Are you sure you want to delete this module?')) {
      return;
    }

    try {
      if (module.id) {
        await moduleService.deleteModule(module.id);
        toast.success('Module deleted successfully!');
        navigate('/settings/account/lock-module');
      }
    } catch (error: any) {
      console.error('Error deleting module:', error);
      toast.error(`Failed to delete module: ${error.message}`);
    }
  };

  const handleBack = () => {
    navigate('/settings/account/lock-module');
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
              <h1 className="text-xl font-bold tracking-wide uppercase">Module Details</h1>
              <p className="text-gray-600">View lock module information</p>
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
              <label className="text-sm font-medium text-gray-500">Module Name</label>
              <p className="text-lg font-semibold text-gray-900">{module.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Display Name</label>
              <p className="text-gray-900">{module.show_name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Abbreviation</label>
              <Badge variant="outline" className="text-xs">
                {module.abbreviation}
              </Badge>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Module Type</label>
              <p className="text-gray-900">{module.module_type || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge 
                  variant={module.active ? "default" : "secondary"}
                  className={module.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {module.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Rate</label>
              <p className="text-gray-900">{module.rate || 'Not set'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Rate Type</label>
              <p className="text-gray-900">{module.rate_type || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Charged Per</label>
              <p className="text-gray-900">{module.charged_per || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Number of Licenses</label>
              <p className="text-gray-900">{module.no_of_licences || 'Not set'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Minimum Billing</label>
              <p className="text-gray-900">{module.min_billing ? `$${module.min_billing}` : 'Not set'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Maximum Billing</label>
              <p className="text-gray-900">{module.max_billing ? `$${module.max_billing}` : 'Not set'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Total Billing</label>
              <p className="text-gray-900">{module.total_billing ? `$${module.total_billing}` : 'Not set'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Phase ID</label>
              <p className="text-gray-900">{module.phase_id || 'Not set'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">URL</label>
              <p className="text-gray-900 break-all">{module.url || 'Not set'}</p>
            </div>
            
            {module.created_at && (
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="text-gray-900">
                  {new Date(module.created_at).toLocaleString()}
                </p>
              </div>
            )}
            
            {module.updated_at && (
              <div>
                <label className="text-sm font-medium text-gray-500">Updated At</label>
                <p className="text-gray-900">
                  {new Date(module.updated_at).toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {module.lock_functions && module.lock_functions.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Associated Functions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {module.lock_functions.map((func) => (
                  <div key={func.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{func.name}</p>
                        <p className="text-sm text-gray-600">{func.action_name}</p>
                      </div>
                      <Badge 
                        variant={func.active ? "default" : "secondary"}
                        className={func.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {func.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
