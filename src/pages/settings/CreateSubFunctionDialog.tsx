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
import { moduleService, CreateSubFunctionPayload, LockFunction } from '@/services/moduleService';

interface CreateSubFunctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubFunctionCreated?: () => void;
}

export const CreateSubFunctionDialog = ({ 
  open, 
  onOpenChange, 
  onSubFunctionCreated 
}: CreateSubFunctionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [functions, setFunctions] = useState<LockFunction[]>([]);
  const [loadingFunctions, setLoadingFunctions] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sub_function_name: '',
    lock_function_id: '',
    active: true,
  });

  // Fetch functions for dropdown
  useEffect(() => {
    const fetchFunctions = async () => {
      setLoadingFunctions(true);
      try {
        const data = await moduleService.fetchFunctions();
        setFunctions(data);
      } catch (error) {
        console.error('Error fetching functions:', error);
        toast.error('Failed to load functions');
      } finally {
        setLoadingFunctions(false);
      }
    };

    if (open) {
      fetchFunctions();
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
      toast.error('Name is required');
      return false;
    }
    if (!formData.sub_function_name.trim()) {
      toast.error('Sub-function name is required');
      return false;
    }
    if (!formData.lock_function_id) {
      toast.error('Function selection is required');
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
      const payload: CreateSubFunctionPayload = {
        lock_sub_function: {
          name: formData.name,
          sub_function_name: formData.sub_function_name,
          lock_function_id: parseInt(formData.lock_function_id),
          active: formData.active,
        }
      };

      const response = await moduleService.createSubFunction(payload);
      
      if (response.success) {
        toast.success('Sub-function created successfully');
        onSubFunctionCreated?.();
        handleClose();
      } else {
        toast.error(response.message || 'Failed to create sub-function');
      }
    } catch (error) {
      console.error('Error creating sub-function:', error);
      toast.error('Failed to create sub-function');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      sub_function_name: '',
      lock_function_id: '',
      active: true,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Sub-Function</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter internal name"
              required
            />
          </div>

          {/* Sub Function Name (Display Name) */}
          <div className="space-y-2">
            <Label htmlFor="sub_function_name">Sub-Function Names *</Label>
            <Input
              id="sub_function_name"
              value={formData.sub_function_name}
              onChange={(e) => handleInputChange('sub_function_name', e.target.value)}
              placeholder="Enter display name (e.g., Create, Update, Delete)"
              required
            />
          </div>

          {/* Function Selection */}
          <div className="space-y-2">
            <Label htmlFor="lock_function_id">Function *</Label>
            <Select 
              value={formData.lock_function_id} 
              onValueChange={(value) => handleInputChange('lock_function_id', value)}
              disabled={loadingFunctions}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingFunctions ? "Loading functions..." : "Select function"} />
              </SelectTrigger>
              <SelectContent>
                {functions.map((func) => (
                  <SelectItem key={func.id} value={func.id?.toString() || ''}>
                    {func.name} ({func.action_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                'Create Sub-Function'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
