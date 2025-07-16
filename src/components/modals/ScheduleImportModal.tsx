import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface ScheduleImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScheduleImportModal: React.FC<ScheduleImportModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Schedules
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              Drop your schedule file here or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: CSV, XLSX
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="bg-[#C72030] text-white hover:bg-[#C72030]/90">
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};