import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
        console.log('Loading work type data for ID:', workTypeData.id);
        
        // Try to get fresh data from API
        const result = await getWorkTypeById(workTypeData.id);
        
        if (result.success && result.data) {
          // Use API data if available
          const apiData = result.data;
          setStaffType(apiData.related_to || workTypeData.staffType);
          setWorkType(apiData.staff_type || workTypeData.workType);
          setStatus(Boolean(apiData.active !== undefined ? apiData.active : workTypeData.status));
        } else {
          // Fallback to passed data if API call fails
          console.warn('Failed to fetch work type data from API, using fallback data');
          setStaffType(workTypeData.staffType);
          setWorkType(workTypeData.workType);
          setStatus(workTypeData.status);
        }
      } catch (error) {
        console.error('Error loading work type data:', error);
        // Use fallback data
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
      // Call the edit API
      const result = await editWorkType(
        workTypeData.id,
        workType.trim(), // This becomes staff_type in API
        staffType,       // This becomes related_to in API
        status
      );

      if (result.success) {
        // Update local data for immediate UI update
        const updatedData = {
          ...workTypeData,
          staffType,
          workType: workType.trim(),
          status
        };
        
        onUpdate(updatedData);
        
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
    setStaffType('');
    setWorkType('');
    setStatus(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
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
              {/* <RefreshCw className="w-6 h-6 animate-spin text-blue-600" /> */}
              <span className="ml-2 text-sm text-gray-600">Loading work type data...</span>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="staffType" className="text-sm font-medium text-gray-700">
                  Staff Type
                </Label>
                <Select value={staffType} onValueChange={setStaffType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Society">Society</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workType" className="text-sm font-medium text-gray-700">
                  Work Type
                </Label>
                <Input
                  id="workType"
                  placeholder="Enter work type"
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full"
                />
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
            </>
          )}
        </div>

        <div className="flex justify-center px-6 py-4 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
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