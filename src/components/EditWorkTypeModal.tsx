import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';
import { X, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getWorkTypeById, editWorkType } from '@/services/workTypeAPI';

interface WorkTypeData {
  id: number;
  staffType: string;
  workType: string;
  status: boolean;
  createdOn: string;
  createdBy: string;
}

interface EditWorkTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  workTypeData?: WorkTypeData;
  onUpdate: (data: WorkTypeData) => void;
}

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  backgroundColor: '#fff',
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff',
    '& fieldset': { borderColor: '#e5e7eb' },
    '&:hover fieldset': { borderColor: '#C72030' },
    '&.Mui-focused fieldset': { borderColor: '#C72030' },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#C72030',
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

const isMuiOverlayTarget = (target: EventTarget | null) =>
  !!(target as HTMLElement | null)?.closest?.(
    '.MuiPopover-root, .MuiModal-root, .MuiMenu-root'
  );

export const EditWorkTypeModal = ({ isOpen, onClose, workTypeData, onUpdate }: EditWorkTypeModalProps) => {
  const [staffType, setStaffType] = useState('');
  const [workType, setWorkType] = useState('');
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (!workTypeData || !isOpen) return;
      
      setLoading(true);
      
      try {
        const result = await getWorkTypeById(workTypeData.id);
        
        if (result.success && result.data) {
          const apiData = result.data;
          setStaffType(apiData.related_to || workTypeData.staffType);
          setWorkType(apiData.staff_type || workTypeData.workType);
          setStatus(Boolean(apiData.active !== undefined ? apiData.active : workTypeData.status));
        } else {
          setStaffType(workTypeData.staffType);
          setWorkType(workTypeData.workType);
          setStatus(workTypeData.status);
        }
      } catch (error) {
        console.error('Error loading work type data:', error);
        setStaffType(workTypeData.staffType);
        setWorkType(workTypeData.workType);
        setStatus(workTypeData.status);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [workTypeData, isOpen]);

  const handleSubmit = async () => {
    if (!staffType || !workType.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!workTypeData) {
      toast({
        title: "Error",
        description: "Work type data not found",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await editWorkType(
        workTypeData.id,
        workType.trim(), // staff_type in API
        staffType,       // related_to in API
        status
      );

      if (result.success) {
        onUpdate({
          ...workTypeData,
          staffType,
          workType: workType.trim(),
          status
        });
        
        toast({
          title: "Success",
          description: "Work type updated successfully",
        });
        
        handleClose();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update work type",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating work type:', error);
      toast({
        title: "Error",
        description: "Failed to update work type. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
      <DialogContent
        className="sm:max-w-[500px] p-0"
        onPointerDownOutside={(e) => {
          if (isMuiOverlayTarget(e.target)) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          if (isMuiOverlayTarget(e.target)) e.preventDefault();
        }}
      >
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium text-gray-900">Edit Work Type</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="px-6 py-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="ml-2 text-sm text-gray-600">Loading work type data...</span>
            </div>
          ) : (
            <>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="edit-staff-type-label" shrink>
                  Select Staff Type *
                </InputLabel>
                <MuiSelect
                  labelId="edit-staff-type-label"
                  label="Select Staff Type *"
                  value={staffType}
                  onChange={(e) => setStaffType(e.target.value as string)}
                  displayEmpty
                  notched
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>Select Staff Type</em>
                  </MenuItem>
                  <MenuItem value="Personal">Personal</MenuItem>
                  <MenuItem value="Society">Society</MenuItem>
                </MuiSelect>
              </FormControl>
              
              <TextField
                label="Enter Work Type *"
                placeholder="Enter work type"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={status}
                  onCheckedChange={setStatus}
                />
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Active
                </Label>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center px-6 py-4 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            className="bg-brand hover:bg-brand-hover text-white px-8"
            disabled={!staffType || !workType.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
