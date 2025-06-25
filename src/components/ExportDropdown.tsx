
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoreHorizontal } from 'lucide-react';

export const ExportDropdown = () => {
  const [open, setOpen] = useState(false);

  const handleExportExcel = () => {
    console.log('Export to MS-Excel clicked');
    setOpen(false);
    // Handle Excel export logic here
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-32 p-2 bg-white border border-gray-200 shadow-lg z-50" align="end">
        <div className="space-y-1">
          <button
            onClick={handleExportExcel}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
          >
            MS-Excel
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
