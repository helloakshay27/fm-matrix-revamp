import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormControl, InputLabel, MenuItem, Select as MuiSelect } from '@mui/material';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OperationalAuditConductedFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OperationalAuditConductedFilterDialog = ({
  isOpen,
  onClose,
}: OperationalAuditConductedFilterDialogProps) => {
  const { toast } = useToast();
  const [status, setStatus] = useState('');
  const [site, setSite] = useState('');

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  const selectMenuProps = {
    disablePortal: false,
    disableAutoFocus: true,
    disableEnforceFocus: true,
    disableScrollLock: true,
    anchorOrigin: {
      vertical: 'bottom' as const,
      horizontal: 'left' as const,
    },
    transformOrigin: {
      vertical: 'top' as const,
      horizontal: 'left' as const,
    },
    style: {
      zIndex: 10001,
    },
    PaperProps: {
      style: {
        maxHeight: 224,
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 10001,
      },
    },
  };

  const handleApply = () => {
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    onClose();
  };

  const handleReset = () => {
    setStatus('');
    setSite('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] max-w-4xl overflow-y-auto"
        aria-describedby="operational-audit-filter-description"
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="operational-audit-filter-description" className="sr-only">
            Filter conducted operational audits by status and site
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="mb-4 text-sm font-medium text-brand">Audit Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="operational-audit-status-label" shrink>Status</InputLabel>
                <MuiSelect
                  labelId="operational-audit-status-label"
                  label="Status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>All Statuses</em></MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel id="operational-audit-site-label" shrink>Site</InputLabel>
                <MuiSelect
                  labelId="operational-audit-site-label"
                  label="Site"
                  value={site}
                  onChange={(event) => setSite(event.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>All Sites</em></MenuItem>
                  <MenuItem value="mina-al-fahal">Mina Al Fahal</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t pt-6">
          <Button
            onClick={handleApply}
            className="bg-brand px-4 py-2 text-white hover:bg-brand-hover"
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-brand px-4 py-2 text-brand hover:bg-brand-selected hover:text-brand"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
