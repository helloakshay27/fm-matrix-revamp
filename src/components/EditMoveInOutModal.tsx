import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TextField } from '@mui/material';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const handleSubmit = () => {
    const validPurposes = purposes.filter(p => p.trim());
    
    if (validPurposes.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one move in/out purpose",
        variant: "destructive"
      });
      return;
    }

    if (moveInOutData) {
      const updatedData = {
        ...moveInOutData,
        purpose: validPurposes.join('|'),
        status
      };
      onUpdate(updatedData);
      toast({
        title: "Success",
        description: "Move In/Out purpose updated successfully",
      });
      onClose();
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
              <Label>Enter move in/ out purpose</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPurpose}
                className="text-primary border-primary hover:bg-primary/10"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {purposes.map((purpose, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextField
                      placeholder="Enter purpose"
                      value={purpose}
                      onChange={(e) => updatePurpose(index, e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#d1d5db',
                          },
                          '&:hover fieldset': {
                            borderColor: '#C72030',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#C72030',
                          },
                        },
                      }}
                    />
                  </div>
                  {purposes.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePurpose(index)}
                      className="text-destructive border-destructive hover:bg-destructive/10 flex-shrink-0"
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
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            disabled={purposes.every(p => !p.trim())}
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};