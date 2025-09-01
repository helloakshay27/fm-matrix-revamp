import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Key, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { lockSubFunctionService, LockSubFunction } from '@/services/lockSubFunctionService';

export const LockSubFunctionView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lockSubFunction, setLockSubFunction] = useState<LockSubFunction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLockSubFunction = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await lockSubFunctionService.fetchLockSubFunction(parseInt(id));
        setLockSubFunction(data);
      } catch (error: any) {
        console.error('Error fetching lock sub function:', error);
        toast.error(`Failed to load lock sub function: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLockSubFunction();
  }, [id]);

  const handleEdit = () => {
    navigate(`/settings/account/lock-sub-function/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!lockSubFunction || !window.confirm('Are you sure you want to delete this lock sub function?')) {
      return;
    }

    try {
      await lockSubFunctionService.deleteLockSubFunction(lockSubFunction.id);
      toast.success('Lock sub function deleted successfully!');
      navigate('/settings/account/lock-sub-function');
    } catch (error: any) {
      console.error('Error deleting lock sub function:', error);
      toast.error(`Failed to delete lock sub function: ${error.message}`);
    }
  };

  const handleBack = () => {
    navigate('/settings/account/lock-sub-function');
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
              <h1 className="text-xl font-bold tracking-wide uppercase">Lock Sub Function Details</h1>
              <p className="text-gray-600">View lock sub function information</p>
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
              <label className="text-sm font-medium text-gray-500">Sub Function Name</label>
              <p className="text-lg font-semibold text-gray-900">{lockSubFunction.sub_function_name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900">{lockSubFunction.name || 'N/A'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge 
                  variant={lockSubFunction.active ? "default" : "secondary"}
                  className={lockSubFunction.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {lockSubFunction.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">URL</label>
              <p className="text-gray-900 break-all">{lockSubFunction.url || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parent Function</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Lock Function ID</label>
              <p className="text-gray-900">{lockSubFunction.lock_function_id}</p>
            </div>
            
            {lockSubFunction.lock_function && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-500">Function Name</label>
                  <p className="text-gray-900">{lockSubFunction.lock_function.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Function Action</label>
                  <p className="text-gray-900">{lockSubFunction.lock_function.action_name || 'N/A'}</p>
                </div>
              </>
            )}
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
                {new Date(lockSubFunction.created_at).toLocaleString()}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Updated At</label>
              <p className="text-gray-900">
                {new Date(lockSubFunction.updated_at).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
