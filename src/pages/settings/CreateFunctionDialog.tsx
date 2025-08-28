import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { moduleService, CreateFunctionPayload, LockModule } from '@/services/moduleService';

interface CreateFunctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFunctionCreated?: () => void;
}

export const CreateFunctionDialog = ({ 
  open, 
  onOpenChange, 
  onFunctionCreated 
}: CreateFunctionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modules, setModules] = useState<LockModule[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    action_name: '',
    module_id: '',
    lock_controller_id: '',
    phase_id: '',
    parent_function: '',
    active: true,
  });

  // Fetch modules for dropdown
  useEffect(() => {
    const fetchModules = async () => {
      setLoadingModules(true);
      try {
        const data = await moduleService.fetchModules();
        setModules(data);
      } catch (error) {
        console.error('Error fetching modules:', error);
        toast.error('Failed to load modules');
      } finally {
        setLoadingModules(false);
      }
    };

    if (open) {
      fetchModules();
    }
  }, [open]);

  const handleInputChange = (field: string, value: any) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload: CreateFunctionPayload = {
        lock_function: {
          name: formData.name,
          action_name: formData.action_name,
          module_id: parseInt(formData.module_id),
          lock_controller_id: formData.lock_controller_id ? parseInt(formData.lock_controller_id) : undefined,
          phase_id: formData.phase_id ? parseInt(formData.phase_id) : undefined,
          parent_function: formData.parent_function || undefined,
          active: formData.active,
        }
      };

      const response = await moduleService.createFunction(payload);
      
      if (response.success) {
        toast.success('Function created successfully');
        onFunctionCreated?.();
        handleClose();
      } else {
        toast.error(response.message || 'Failed to create function');
      }
    } catch (error) {
      console.error('Error creating function:', error);
      toast.error('Failed to create function');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      action_name: '',
      module_id: '',
      lock_controller_id: '',
      phase_id: '',
      parent_function: '',
      active: true,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Function</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Function Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Function Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter function name"
              required
            />
          </div>

          {/* Action Name */}
          <div className="space-y-2">
            <Label htmlFor="action_name">Action Name *</Label>
            <Input
              id="action_name"
              value={formData.action_name}
              onChange={(e) => handleInputChange('action_name', e.target.value)}
              placeholder="e.g., unlock, index, show"
              required
            />
          </div>

          {/* Module Selection */}
          <div className="space-y-2">
            <Label htmlFor="module_id">Module *</Label>
            <Select 
              value={formData.module_id} 
              onValueChange={(value) => handleInputChange('module_id', value)}
              disabled={loadingModules}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingModules ? "Loading modules..." : "Select module"} />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module.id} value={module.id?.toString() || ''}>
                    {module.show_name} ({module.abbreviation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional Fields */}
          <div className="space-y-2">
            <Label htmlFor="lock_controller_id">Lock Controller ID</Label>
            <Input
              id="lock_controller_id"
              type="number"
              value={formData.lock_controller_id}
              onChange={(e) => handleInputChange('lock_controller_id', e.target.value)}
              placeholder="Optional controller ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phase_id">Phase ID</Label>
            <Input
              id="phase_id"
              type="number"
              value={formData.phase_id}
              onChange={(e) => handleInputChange('phase_id', e.target.value)}
              placeholder="Optional phase ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent_function">Parent Function</Label>
            <Input
              id="parent_function"
              value={formData.parent_function}
              onChange={(e) => handleInputChange('parent_function', e.target.value)}
              placeholder="Optional parent function"
            />
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleInputChange('active', checked)}
            />
            <Label htmlFor="active">Active</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#C72030] hover:bg-[#A11D2A] text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Function'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
