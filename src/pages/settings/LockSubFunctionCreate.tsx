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

// Predefined sub-function names
const PREDEFINED_SUB_FUNCTIONS = [
  { value: 'add', label: 'Add' },
  { value: 'edit', label: 'Edit' },
  { value: 'list', label: 'List' },
  { value: 'export', label: 'Export' },
  { value: 'import', label: 'Import' },
  { value: 'delete', label: 'Delete' },
  { value: 'view', label: 'View' },
  { value: 'approve', label: 'Approve' },
  { value: 'reject', label: 'Reject' },
  { value: 'custom', label: 'Custom (Enter manually)' }
];

export const CreateLockSubFunctionDialog = ({ open, onOpenChange, onLockSubFunctionCreated }: CreateLockSubFunctionDialogProps) => {
  const { toast } = useToast();
  const [subFunctionName, setSubFunctionName] = useState<string>("");
  const [selectedPredefined, setSelectedPredefined] = useState<string>("");
  const [parentFunctionId, setParentFunctionId] = useState<string>("");
  const [lockFunctions, setLockFunctions] = useState<LockFunction[]>([]);
  const [active, setActive] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingFunctions, setIsLoadingFunctions] = useState(true);

  // Fetch lock functions for parent selection
  useEffect(() => {
    const fetchLockFunctions = async () => {
      if (!open) return;
      
      setIsLoadingFunctions(true);
      try {
        const data = await lockFunctionService.fetchLockFunctions();
        console.log('Fetched lock functions:', data); // Debug log
        const functions = data.map(func => ({
          id: func.id,
          name: func.name, // Use 'name' field from API
          function_name: func.action_name || func.name // Fallback to action_name or name
        }));
        console.log('Mapped functions:', functions); // Debug log
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

    return true;
  };

  const resetForm = () => {
    setSubFunctionName("");
    setSelectedPredefined("");
    setParentFunctionId("");
    setActive(true);
  };

  // Handle predefined selection change
  const handlePredefinedChange = (value: string) => {
    setSelectedPredefined(value);
    if (value !== 'custom') {
      // Auto-fill the sub-function name with the selected predefined value
      const selected = PREDEFINED_SUB_FUNCTIONS.find(item => item.value === value);
      if (selected) {
        setSubFunctionName(selected.label);
      }
    } else {
      // Clear the name field for custom entry
      setSubFunctionName("");
    }
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    const payload: CreateLockSubFunctionPayload = {
      lock_sub_function: {
        lock_function_id: parseInt(parentFunctionId),
        name: subFunctionName,
        sub_function_name: subFunctionName, // Using same value for both name and sub_function_name
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
          {/* Predefined Sub Function Selection */}
          <div className="space-y-2">
            <Label htmlFor="predefinedSubFunction" className="text-sm font-medium">
              Select Sub Function Type
            </Label>
            <Select value={selectedPredefined} onValueChange={handlePredefinedChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a predefined sub function or custom" />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_SUB_FUNCTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Choose from predefined options or select "Custom" to enter your own
            </p>
          </div>

          {/* Sub Function Name - Only editable if custom is selected */}
          <div className="space-y-2">
            <Label htmlFor="subFunctionName" className="text-sm font-medium">
              Sub Function Name *
            </Label>
            <Input
              id="subFunctionName"
              type="text"
              value={subFunctionName}
              onChange={(e) => setSubFunctionName(e.target.value)}
              placeholder={selectedPredefined === 'custom' || !selectedPredefined ? "Enter sub function name" : "Auto-filled from selection"}
              className="w-full"
              disabled={selectedPredefined !== 'custom' && selectedPredefined !== ''}
            />
            {selectedPredefined && selectedPredefined !== 'custom' && (
              <p className="text-xs text-blue-600">
                Auto-filled from selection. Choose "Custom" to enter manually.
              </p>
            )}
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
            ) : lockFunctions.length === 0 ? (
              <div className="p-2 border rounded-md text-center text-gray-500">
                No functions available
              </div>
            ) : (
              <Select value={parentFunctionId} onValueChange={setParentFunctionId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a parent function" />
                </SelectTrigger>
                <SelectContent>
                  {lockFunctions.length === 0 ? (
                    <SelectItem value="" disabled>
                      No functions available
                    </SelectItem>
                  ) : (
                    lockFunctions.map((func) => (
                      <SelectItem key={func.id} value={func.id.toString()}>
                        {func.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={active}
              onCheckedChange={(checked) => setActive(checked === true)}
            />
            <Label htmlFor="active" className="text-sm font-medium">
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
