import React, { useState, useEffect } from 'react';
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
import { lockSubFunctionService, CreateLockSubFunctionPayload } from '@/services/lockSubFunctionService';
import { lockFunctionService } from '@/services/lockFunctionService';

interface CreateLockSubFunctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLockSubFunctionCreated?: () => void;
}

interface LockFunction {
  id: number;
  name: string;
  function_name: string;
}

export const CreateLockSubFunctionDialog = ({ open, onOpenChange, onLockSubFunctionCreated }: CreateLockSubFunctionDialogProps) => {
  const { toast } = useToast();
  const [subFunctionName, setSubFunctionName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [parentFunctionId, setParentFunctionId] = useState<string>("");
  const [priority, setPriority] = useState<string>("MEDIUM");
  const [conditions, setConditions] = useState<string>("");
  const [lockFunctions, setLockFunctions] = useState<LockFunction[]>([]);
  const [active, setActive] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingFunctions, setIsLoadingFunctions] = useState(true);

  const priorityOptions = [
    { value: 'CRITICAL', label: 'Critical' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' }
  ];

  // Fetch lock functions for parent selection
  useEffect(() => {
    const fetchLockFunctions = async () => {
      if (!open) return;
      
      setIsLoadingFunctions(true);
      try {
        const data = await lockFunctionService.fetchLockFunctions();
        const functions = data.map(func => ({
          id: func.id,
          name: func.functionName,
          function_name: func.functionName
        }));
        setLockFunctions(functions);
      } catch (error: any) {
        console.error('Error fetching lock functions:', error);
        sonnerToast.error('Failed to load lock functions');
      } finally {
        setIsLoadingFunctions(false);
      }
    };

    fetchLockFunctions();
  }, [open]);

  const validateForm = () => {
    if (!subFunctionName.trim()) {
      toast({
        title: "Validation Error",
        description: "Sub function name is required",
        variant: "destructive",
      });
      return false;
    }

    if (!parentFunctionId) {
      toast({
        title: "Validation Error",
        description: "Please select a parent function",
        variant: "destructive",
      });
      return false;
    }

    if (!priority) {
      toast({
        title: "Validation Error",
        description: "Please select a priority level",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setSubFunctionName("");
    setDescription("");
    setParentFunctionId("");
    setPriority("MEDIUM");
    setConditions("");
    setActive(true);
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    const payload: CreateLockSubFunctionPayload = {
      lock_sub_function: {
        sub_function_name: subFunctionName,
        description: description,
        parent_function_id: parseInt(parentFunctionId),
        priority: priority,
        conditions: conditions ? conditions.split(',').map(c => c.trim()) : [],
        active: active
      }
    };

    try {
      await lockSubFunctionService.createLockSubFunction(payload);
      
      console.log('Lock Sub Function created successfully');

      sonnerToast.success('Lock Sub Function created successfully!');
      
      // Reset form
      resetForm();
      
      // Close dialog
      onOpenChange(false);
      
      // Trigger callback to refresh parent data
      if (onLockSubFunctionCreated) {
        onLockSubFunctionCreated();
      }
    } catch (error: any) {
      console.error('Error creating lock sub function:', error);
      const errorMessage = error.message || 'Unknown error';
        
      toast({
        title: "Error",
        description: `Failed to create lock sub function: ${errorMessage}`,
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

        <div className="space-y-6 py-4">
          {/* Sub Function Name */}
          <div className="space-y-2">
            <Label htmlFor="subFunctionName" className="text-sm font-medium">
              Sub Function Name *
            </Label>
            <Input
              id="subFunctionName"
              type="text"
              value={subFunctionName}
              onChange={(e) => setSubFunctionName(e.target.value)}
              placeholder="Enter sub function name"
              className="w-full"
            />
          </div>

          {/* Parent Function */}
          <div className="space-y-2">
            <Label htmlFor="parentFunction" className="text-sm font-medium">
              Parent Function *
            </Label>
            {isLoadingFunctions ? (
              <div className="flex items-center space-x-2 p-2 border rounded-md">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-500">Loading functions...</span>
              </div>
            ) : (
              <Select value={parentFunctionId} onValueChange={setParentFunctionId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a parent function" />
                </SelectTrigger>
                <SelectContent>
                  {lockFunctions.map((func) => (
                    <SelectItem key={func.id} value={func.id.toString()}>
                      {func.function_name || func.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium">
              Priority *
            </Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              placeholder="Enter a brief description of the sub function"
              className="w-full min-h-[80px]"
            />
          </div>

          {/* Conditions */}
          <div className="space-y-2">
            <Label htmlFor="conditions" className="text-sm font-medium">
              Conditions
            </Label>
            <Textarea
              id="conditions"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              placeholder="Enter conditions separated by commas (optional)"
              className="w-full min-h-[60px]"
            />
            <p className="text-xs text-gray-500">
              Separate multiple conditions with commas
            </p>
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
              'Create Sub Function'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLockSubFunctionDialog;
