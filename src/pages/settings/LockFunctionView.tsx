import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { lockFunctionService, LockFunction } from '@/services/lockFunctionService';

export const LockFunctionView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lockFunction, setLockFunction] = useState<LockFunction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLockFunction = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await lockFunctionService.fetchLockFunction(parseInt(id));
        setLockFunction(data);
      } catch (error: any) {
        console.error('Error fetching lock function:', error);
        toast.error(`Failed to load lock function: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLockFunction();
  }, [id]);

  const handleEdit = () => {
    navigate(`/settings/account/lock-function/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!lockFunction || !window.confirm('Are you sure you want to delete this lock function?')) {
      return;
    }

    try {
      await lockFunctionService.deleteLockFunction(lockFunction.id);
      toast.success('Lock function deleted successfully!');
      navigate('/settings/account/lock-function');
    } catch (error: any) {
      console.error('Error deleting lock function:', error);
      toast.error(`Failed to delete lock function: ${error.message}`);
    }
  };

  const handleBack = () => {
    navigate('/settings/account/lock-function');
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
              <h1 className="text-xl font-bold tracking-wide uppercase">Lock Function Details</h1>
              <p className="text-gray-600">View lock function information</p>
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
              <label className="text-sm font-medium text-gray-500">Function Name</label>
              <p className="text-lg font-semibold text-gray-900">{lockFunction.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Action Name</label>
              <p className="text-gray-900">{lockFunction.action_name || 'N/A'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Parent Function</label>
              <p className="text-gray-900">{lockFunction.parent_function || 'N/A'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge 
                  variant={lockFunction.active ? "default" : "secondary"}
                  className={lockFunction.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {lockFunction.active ? 'Active' : 'Inactive'}
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
              <label className="text-sm font-medium text-gray-500">Lock Controller ID</label>
              <p className="text-gray-900">{lockFunction.lock_controller_id || 'N/A'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Phase ID</label>
              <p className="text-gray-900">{lockFunction.phase_id || 'N/A'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Module ID</label>
              <p className="text-gray-900">{lockFunction.module_id || 'N/A'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">URL</label>
              <p className="text-gray-900 break-all">{lockFunction.url || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Timestamps</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p className="text-gray-900">
                {new Date(lockFunction.created_at).toLocaleString()}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Updated At</label>
              <p className="text-gray-900">
                {new Date(lockFunction.updated_at).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {lockFunction.lock_sub_functions && lockFunction.lock_sub_functions.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Sub Functions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lockFunction.lock_sub_functions.map((subFunction) => (
                  <div key={subFunction.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{subFunction.sub_function_name}</p>
                        <p className="text-sm text-gray-600">{subFunction.name}</p>
                      </div>
                      <Badge 
                        variant={subFunction.active ? "default" : "secondary"}
                        className={subFunction.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {subFunction.active ? 'Active' : 'Inactive'}
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
