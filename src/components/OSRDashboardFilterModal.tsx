
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FormControl as MuiFormControl,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

// h-9 on the old triggers is 36px.
const fieldStyles = {
  height: '36px',
  backgroundColor: '#fff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d1d5db',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-primary)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-primary)',
  },
  '& .MuiSelect-select': {
    fontSize: '14px',
  },
};

// Portals to document.body so the menu anchors under the field instead of
// inheriting the Radix Dialog's translate transform (which mispositions it).
// Radix's modal Dialog sets `pointer-events: none` on <body>, which the portaled
// menu inherits — without pointerEvents:'auto' the backdrop never receives the
// click that closes the menu.
const selectMenuProps = {
  sx: { pointerEvents: 'auto' },
  PaperProps: {
    sx: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

interface FilterSelectProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  containerClassName: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  options,
  containerClassName,
}) => (
  <div className={containerClassName}>
    <Label htmlFor={id} className="text-sm font-medium mb-1 block">{label}</Label>
    <MuiFormControl fullWidth size="small">
      <MuiSelect
        id={id}
        displayEmpty
        value={value}
        onChange={(event) => onChange(event.target.value)}
        renderValue={(selected) =>
          selected ? (
            options.find((option) => option.value === selected)?.label ?? selected
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )
        }
        sx={fieldStyles}
        MenuProps={selectMenuProps}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </MuiFormControl>
  </div>
);

interface OSRDashboardFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  onReset: () => void;
}

export const OSRDashboardFilterModal = ({ isOpen, onClose, onApply, onReset }: OSRDashboardFilterModalProps) => {
  const [filters, setFilters] = useState({
    tower: '',
    flats: '',
    category: '',
    dateRange: undefined as DateRange | undefined,
    status: '',
    rating: ''
  });

  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(filters.dateRange);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleFilterChange = (field: string, value: string | DateRange | undefined) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      tower: '',
      flats: '',
      category: '',
      dateRange: undefined,
      status: '',
      rating: ''
    });
    setTempDateRange(undefined);
    onReset();
  };

  const handleDateRangeCancel = () => {
    setTempDateRange(filters.dateRange);
    setIsDatePickerOpen(false);
  };

  const handleDateRangeApply = () => {
    handleFilterChange('dateRange', tempDateRange);
    setIsDatePickerOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Filter</DialogTitle>
          <DialogDescription className="sr-only">
            Filter the OSR dashboard data by various criteria
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
          <div className="flex items-end gap-4 flex-wrap">
            <FilterSelect
              id="tower"
              label="Select Tower"
              placeholder="Select Tower"
              value={filters.tower}
              onChange={(value) => handleFilterChange('tower', value)}
              containerClassName="min-w-[150px]"
              options={[
                { value: 'tower-a', label: 'Tower A' },
                { value: 'tower-b', label: 'Tower B' },
                { value: 'tower-c', label: 'Tower C' },
              ]}
            />

            <FilterSelect
              id="flats"
              label="Select Flats"
              placeholder="Select Flats"
              value={filters.flats}
              onChange={(value) => handleFilterChange('flats', value)}
              containerClassName="min-w-[150px]"
              options={[
                { value: 'a-101', label: 'A-101' },
                { value: 'a-102', label: 'A-102' },
                { value: 'a-103', label: 'A-103' },
                { value: 'a-104', label: 'A-104' },
                { value: 'fm-office', label: 'FM - Office' },
              ]}
            />

            <FilterSelect
              id="category"
              label="Select Category"
              placeholder="Invisible Grill Starts from (per sq. ft.)"
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
              containerClassName="min-w-[200px]"
              options={[
                { value: 'pest-control', label: 'Pest Control' },
                { value: 'deep-cleaning', label: 'Deep Cleaning' },
                { value: 'civil-mason', label: 'Civil & Mason Works' },
                { value: 'invisible-grill', label: 'Invisible Grill' },
                { value: 'mosquito-mesh', label: 'Mosquito Mesh Sta...' },
              ]}
            />

            <div className="min-w-[200px]">
              <Label className="text-sm font-medium mb-1 block">Created on</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 w-full justify-start text-left font-normal",
                      !filters.dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(filters.dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(filters.dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      "01/01/2025 - 12/31/2025"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-4">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={filters.dateRange?.from}
                      selected={tempDateRange}
                      onSelect={setTempDateRange}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Input
                          placeholder="01/01/2025 - 12/31/2025"
                          value={
                            tempDateRange?.from
                              ? tempDateRange.to
                                ? `${format(tempDateRange.from, "dd/MM/yyyy")} - ${format(tempDateRange.to, "dd/MM/yyyy")}`
                                : format(tempDateRange.from, "dd/MM/yyyy")
                              : ""
                          }
                          readOnly
                          className="flex-1"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDateRangeCancel}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleDateRangeApply}
                          className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <FilterSelect
              id="status"
              label="Select Status"
              placeholder="Select Status"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              containerClassName="min-w-[150px]"
              options={[
                { value: 'work-pending', label: 'Work Pending' },
                { value: 'payment-pending', label: 'Payment Pending' },
                { value: 'completed', label: 'Completed' },
              ]}
            />

            <FilterSelect
              id="rating"
              label="Select Rating"
              placeholder="Select Rating"
              value={filters.rating}
              onChange={(value) => handleFilterChange('rating', value)}
              containerClassName="min-w-[150px]"
              options={[
                { value: '1', label: '1 Star' },
                { value: '2', label: '2 Stars' },
                { value: '3', label: '3 Stars' },
                { value: '4', label: '4 Stars' },
                { value: '5', label: '5 Stars' },
              ]}
            />

            <div className="flex gap-2 ml-auto">
              <Button
                onClick={handleApply}
                variant="ghost"
                className="fm-button-fix fm-button-brand px-4 py-2 h-9"
              >
                Apply
              </Button>
              <Button
                onClick={handleReset}
                variant="ghost"
                className="fm-button-fix fm-button-brand px-4 py-2 h-9"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
