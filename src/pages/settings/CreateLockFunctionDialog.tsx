import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from 'sonner';
import { lockFunctionService, CreateLockFunctionPayload } from '@/services/lockFunctionService';

interface CreateLockFunctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLockFunctionCreated?: () => void;
}

export const CreateLockFunctionDialog = ({ open, onOpenChange, onLockFunctionCreated }: CreateLockFunctionDialogProps) => {
  const { toast } = useToast();
  const [functionName, setFunctionName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [lockType, setLockType] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [durationUnit, setDurationUnit] = useState<string>("minutes");
  const [active, setActive] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lockTypeOptions = [
    { value: 'SYSTEM', label: 'System Lock' },
    { value: 'USER', label: 'User Lock' },
    { value: 'ADMIN', label: 'Admin Lock' },
    { value: 'TEMPORARY', label: 'Temporary Lock' }
  ];

  const durationUnitOptions = [
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'permanent', label: 'Permanent' }
  ];

  const validateForm = () => {
    if (!functionName.trim()) {
      toast({
        title: "Validation Error",
        description: "Function name is required",
        variant: "destructive",
      });
      return false;
    }

    if (!lockType) {
      toast({
        title: "Validation Error",
        description: "Please select a lock type",
        variant: "destructive",
      });
      return false;
    }

    if (durationUnit !== 'permanent' && (!duration || isNaN(Number(duration)) || Number(duration) <= 0)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid duration",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFunctionName("");
    setDescription("");
    setLockType("");
    setDuration("");
    setDurationUnit("minutes");
    setActive(true);
  };

  const formatDuration = () => {
    if (durationUnit === 'permanent') {
      return 'Permanent';
    }
    return `${duration} ${durationUnit}`;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    const payload: CreateLockFunctionPayload = {
      lock_function: {
        function_name: functionName,
        description: description,
        lock_type: lockType,
        duration: formatDuration(),
        active: active
      }
    };

    try {
      await lockFunctionService.createLockFunction(payload);
      
      console.log('Lock Function created successfully');

      sonnerToast.success('Lock Function created successfully!');
      
      // Reset form
      resetForm();
      
      // Close dialog
      onOpenChange(false);
      
      // Trigger callback to refresh parent data
      if (onLockFunctionCreated) {
        onLockFunctionCreated();
      }
    } catch (error: any) {
      console.error('Error creating lock function:', error);
      const errorMessage = error.message || 'Unknown error';
        
      toast({
        title: "Error",
        description: `Failed to create lock function: ${errorMessage}`,
        variant: "destructive",
      });
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
            <Label htmlFor="functionName" className="text-sm font-medium">
              Function Name *
            </Label>
            <Input
              id="functionName"
              type="text"
              value={functionName}
              onChange={(e) => setFunctionName(e.target.value)}
              placeholder="Enter function name"
              className="w-full"
            />
          </div>

          {/* Lock Type */}
          <div className="space-y-2">
            <Label htmlFor="lockType" className="text-sm font-medium">
              Lock Type *
            </Label>
            <Select value={lockType} onValueChange={setLockType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select lock type" />
              </SelectTrigger>
              <SelectContent>
                {lockTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
              Duration *
            </Label>
            <div className="flex gap-2">
              {durationUnit !== 'permanent' && (
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter duration"
                  className="flex-1"
                  min="1"
                />
              )}
              <Select value={durationUnit} onValueChange={(value) => {
                setDurationUnit(value);
                if (value === 'permanent') {
                  setDuration('');
                }
              }}>
                <SelectTrigger className={durationUnit === 'permanent' ? 'w-full' : 'w-32'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationUnitOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description of the lock function"
              className="w-full min-h-[100px]"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="active" 
              checked={active}
              onCheckedChange={(checked) => setActive(checked as boolean)}
            />
            <Label htmlFor="active" className="text-sm font-medium cursor-pointer">
              Active
            </Label>
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
