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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Loader2 } from "lucide-react";
import { toast } from 'sonner';

interface CreateLockSubFunctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLockSubFunctionCreated?: () => void;
}

interface LockFunction {
  id: number;
  name: string;
  action_name: string;
}

interface CreateLockSubFunctionPayload {
  lock_sub_function: {
    lock_function_id: number;
    name: string;
    sub_function_name: string;
    active: boolean;
  };
}

export const CreateLockSubFunctionDialog = ({ 
  open, 
  onOpenChange, 
  onLockSubFunctionCreated 
}: CreateLockSubFunctionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockFunctions, setLockFunctions] = useState<LockFunction[]>([]);
  const [formData, setFormData] = useState({
    lock_function_id: '',
    name: '',
    sub_function_name: '',
  });

  // Fetch lock functions on component mount
  useEffect(() => {
    const fetchLockFunctions = async () => {
      try {
        // Replace with actual API call to fetch lock functions
        const response = await fetch('/api/lock_functions');
        if (response.ok) {
          const data = await response.json();
          setLockFunctions(data);
        }
      } catch (error) {
        console.error('Error fetching lock functions:', error);
        toast.error('Failed to load lock functions');
      }
    };

    if (open) {
      fetchLockFunctions();
    }
  }, [open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.lock_function_id) {
      toast.error('Lock function selection is required');
      return false;
    }
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.sub_function_name.trim()) {
      toast.error('Sub function name is required');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      lock_function_id: '',
      name: '',
      sub_function_name: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload: CreateLockSubFunctionPayload = {
        lock_sub_function: {
          lock_function_id: parseInt(formData.lock_function_id),
          name: formData.name,
          sub_function_name: formData.sub_function_name,
          active: true,
        }
      };

      const response = await fetch('/api/lock_sub_functions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Lock Sub Function created successfully!');
        resetForm();
        onOpenChange(false);
        onLockSubFunctionCreated?.();
      } else {
        throw new Error('Failed to create sub function');
      }
    } catch (error: any) {
      console.error('Error creating lock sub function:', error);
      toast.error(`Failed to create lock sub function: ${error.message || 'Unknown error'}`);
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">Create Lock Sub Function</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 py-4">
            {/* Lock Function Selection */}
            <div className="space-y-2">
              <Label htmlFor="lock_function_id" className="text-sm font-medium">
                Lock Function *
              </Label>
              <Select value={formData.lock_function_id} onValueChange={(value) => handleInputChange('lock_function_id', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select lock function" />
                </SelectTrigger>
                <SelectContent>
                  {lockFunctions.map((func) => (
                    <SelectItem key={func.id} value={func.id.toString()}>
                      {func.name} ({func.action_name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter name (e.g., New Sub Function)"
                className="w-full"
              />
            </div>

            {/* Sub Function Name */}
            <div className="space-y-2">
              <Label htmlFor="sub_function_name" className="text-sm font-medium">
                Sub Function Name *
              </Label>
              <Input
                id="sub_function_name"
                type="text"
                value={formData.sub_function_name}
                onChange={(e) => handleInputChange('sub_function_name', e.target.value)}
                placeholder="Enter sub function name (e.g., create, update, show)"
                className="w-full"
              />
            </div>
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
              type="submit"
              disabled={isSubmitting}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Sub Function'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
