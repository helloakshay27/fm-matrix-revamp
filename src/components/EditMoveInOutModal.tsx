import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TextField } from '@mui/material';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { editMoveInOutPurpose } from '@/services/moveInOutPurposeAPI';

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  backgroundColor: '#fff',
  '& .MuiInputBase-input': {
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

interface MoveInOutData {
  id: string;
  purpose: string;
  status: boolean;
  createdOn: string;
  createdBy: string;
}

interface EditMoveInOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  moveInOutData?: MoveInOutData;
  onUpdate: (data: MoveInOutData) => void;
}

export const EditMoveInOutModal = ({ isOpen, onClose, moveInOutData, onUpdate }: EditMoveInOutModalProps) => {
  const [purposes, setPurposes] = useState<string[]>(['']);
  const [status, setStatus] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (moveInOutData && isOpen) {
      // Split the purpose string by pipe separator or use single purpose
      const purposeArray = moveInOutData.purpose.includes('|') 
        ? moveInOutData.purpose.split('|') 
        : [moveInOutData.purpose];
      setPurposes(purposeArray);
      setStatus(moveInOutData.status);
    } else {
      setPurposes(['']);
      setStatus(true);
    }
  }, [moveInOutData, isOpen]);

  const handleSubmit = async () => {
    const validPurposes = purposes.filter(p => p.trim());
    
    if (validPurposes.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one move in/out purpose",
        variant: "destructive"
      });
      return;
    }

    if (!moveInOutData) return;

    setIsSubmitting(true);
    
    try {
      // For edit, we'll update with the first purpose (main purpose)
      // Multiple purposes can be handled differently if needed
      const mainPurpose = validPurposes[0];
      
      const result = await editMoveInOutPurpose(
        parseInt(moveInOutData.id),
        mainPurpose,
        status
      );
      
      if (result.success) {
        const updatedData = {
          ...moveInOutData,
          purpose: validPurposes.join('|'),
          status,
          createdOn: new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        };
        
        onUpdate(updatedData);
        toast({
          title: "Success",
          description: "Move In/Out purpose updated successfully",
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update move in/out purpose. Please try again.",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Error updating move in/out purpose:', error);
      toast({
        title: "Error",
        description: "Failed to update move in/out purpose. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPurposes(['']);
    setStatus(true);
    onClose();
  };

  const addPurpose = () => {
    setPurposes([...purposes, '']);
  };

  const removePurpose = (index: number) => {
    if (purposes.length > 1) {
      const newPurposes = purposes.filter((_, i) => i !== index);
      setPurposes(newPurposes);
    }
  };

  const updatePurpose = (index: number, value: string) => {
    const newPurposes = [...purposes];
    newPurposes[index] = value;
    setPurposes(newPurposes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium text-gray-900">Edit Move In/Out Purpose</DialogTitle>
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
          {/* Multiple Move In/Out Purpose Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Purpose *</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPurpose}
                className="border-[#C72030] text-[#C72030] hover:bg-[#EDEAE3] hover:text-[#C72030] h-8"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {purposes.map((purpose, index) => (
                <div key={index} className="flex items-center gap-2">
                  <TextField
                    label={`Purpose ${index + 1} *`}
                    placeholder="Enter purpose"
                    value={purpose}
                    onChange={(e) => updatePurpose(index, e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                  {purposes.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePurpose(index)}
                      className="text-destructive border-destructive hover:bg-destructive/10 flex-shrink-0 h-10 w-10 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
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
        </div>

        <div className="flex justify-center px-6 py-4 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            className="bg-brand hover:bg-brand-hover text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || purposes.every(p => !p.trim())}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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