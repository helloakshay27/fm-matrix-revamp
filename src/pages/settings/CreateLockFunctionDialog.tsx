import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { moduleService, LockModule } from '@/services/moduleService';
import { lockFunctionService, CreateLockFunctionPayload } from '@/services/lockFunctionService';

interface CreateLockFunctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLockFunctionCreated?: () => void;
}

export const CreateLockFunctionDialog = ({ open, onOpenChange, onLockFunctionCreated }: CreateLockFunctionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modules, setModules] = useState<LockModule[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    action_name: '',
    module_id: '',
    lock_controller_id: '',
    phase_id: '',
    parent_function: '',
  });

  // Fetch modules on component mount
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await moduleService.fetchModules();
        setModules(data);
      } catch (error) {
        console.error('Error fetching modules:', error);
        toast.error('Failed to load modules');
      }
    };

    if (open) {
      fetchModules();
    }
  }, [open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const resetForm = () => {
    setFormData({
      name: '',
      action_name: '',
      module_id: '',
      lock_controller_id: '',
      phase_id: '',
      parent_function: '',
    });
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const payload: CreateLockFunctionPayload = {
        lock_function: {
          name: formData.name,
          action_name: formData.action_name,
          active: true,
          module_id: parseInt(formData.module_id),
          lock_controller_id: formData.lock_controller_id ? parseInt(formData.lock_controller_id) : undefined,
          phase_id: formData.phase_id ? parseInt(formData.phase_id) : undefined,
          parent_function: formData.parent_function || undefined,
        }
      };

      // Use the lockFunctionService to create the function
      const createdFunction = await lockFunctionService.createLockFunction(payload);
      
      if (createdFunction) {
        toast.success('Lock Function created successfully!');
        resetForm();
        onOpenChange(false);
        onLockFunctionCreated?.();
      } else {
        toast.error('Failed to create lock function');
      }
    } catch (error: any) {
      console.error('Error creating lock function:', error);
      toast.error(`Failed to create lock function: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">Create Lock Function</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Function Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Function Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter function name"
              className="w-full"
            />
          </div>

          {/* Action Name */}
          <div className="space-y-2">
            <Label htmlFor="action_name" className="text-sm font-medium">
              Action Name *
            </Label>
            <Input
              id="action_name"
              type="text"
              value={formData.action_name}
              onChange={(e) => handleInputChange('action_name', e.target.value)}
              placeholder="Enter action name (e.g., unlock, pms_notices)"
              className="w-full"
            />
          </div>

          {/* Module Selection */}
          <div className="space-y-2">
            <Label htmlFor="module_id" className="text-sm font-medium">
              Module *
            </Label>
            <Select value={formData.module_id} onValueChange={(value) => handleInputChange('module_id', value)}>
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

          {/* Lock Controller ID (Optional) */}

        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={isSubmitting}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              'Create Function'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLockFunctionDialog;
