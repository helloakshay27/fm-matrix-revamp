
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExportModalProps {
  onClose: () => void;
}

export const ExportModal = ({ onClose }: ExportModalProps) => {
  const [fromDate, setFromDate] = useState('17/06/2025');
  const [toDate, setToDate] = useState('17/06/2025');

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="fromDate">From</Label>
          <Input
            id="fromDate"
            type="text"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="toDate">To</Label>
          <Input
            id="toDate"
            type="text"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          className="bg-[#8B5A5A] hover:bg-[#7A4949] text-white px-8"
          onClick={onClose}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
