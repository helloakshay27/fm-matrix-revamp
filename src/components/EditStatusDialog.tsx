
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { apiClient } from '@/utils/apiClient';

interface EditStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Status {
  id: number;
  name: string;
  color_code: string;
  fixed_state: string;
  active: number;
}

export const EditStatusDialog = ({ open, onOpenChange }: EditStatusDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [preventiveAction, setPreventiveAction] = useState('');

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await apiClient.get('/pms/admin/complaint_statuses.json');
        setStatuses(response.data || []);
      } catch (error) {
        console.error('Failed to fetch statuses:', error);
      }
    };

    if (open) {
      fetchStatuses();
    }
  }, [open]);

  const handleApply = () => {
    console.log('Status updated:', { selectedStatus, rootCause, correctiveAction, preventiveAction });
    onOpenChange(false);
  };

  const handleReset = () => {
    setSelectedStatus('');
    setRootCause('');
    setCorrectiveAction('');
    setPreventiveAction('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <DialogTitle>Edit Status</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-6 w-6 p-0 hover:bg-gray-100"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.id} value={status.id.toString()}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rootCause" className="text-sm font-medium">
                Root Cause
              </Label>
              <Textarea
                id="rootCause"
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                className="mt-1 min-h-[80px]"
                placeholder=""
              />
            </div>
            <div>
              <Label htmlFor="correctiveAction" className="text-sm font-medium">
                Corrective Action
              </Label>
              <Textarea
                id="correctiveAction"
                value={correctiveAction}
                onChange={(e) => setCorrectiveAction(e.target.value)}
                className="mt-1 min-h-[80px]"
                placeholder=""
              />
            </div>
          </div>

          <div>
            <Label htmlFor="preventiveAction" className="text-sm font-medium">
              Preventive Action
            </Label>
            <Textarea
              id="preventiveAction"
              value={preventiveAction}
              onChange={(e) => setPreventiveAction(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder=""
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleApply}
              className="bg-[#8B4B8C] hover:bg-[#7A427B] text-white flex-1"
            >
              Apply
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
