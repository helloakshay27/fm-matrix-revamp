
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MaterialDatePicker } from "@/components/ui/material-date-picker";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [fromDate, setFromDate] = useState('17/06/2025');
  const [toDate, setToDate] = useState('17/06/2025');

  const handleSubmit = () => {
    console.log('Export submitted:', { fromDate, toDate });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="fromDate">From</Label>
            <MaterialDatePicker
              value={fromDate}
              onChange={setFromDate}
              placeholder="Select from date"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="toDate">To</Label>
            <MaterialDatePicker
              value={toDate}
              onChange={setToDate}
              placeholder="Select to date"
              className="mt-1"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
              className="hover:bg-[#F2EEE9]/90 px-8"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
