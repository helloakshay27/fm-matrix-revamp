import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  currentFilters?: FilterState;
}

interface FilterState {
  surveyName: string;
  categoryId: string;
  checkType: string;
}

interface Category {
  id: number;
  name: string;
}

export const SurveyListFilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  onApplyFilters,
  onResetFilters,
  currentFilters
}) => {
  const [filters, setFilters] = useState<FilterState>({
    surveyName: '',
    categoryId: 'all',
    checkType: 'all'
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);

  // Fetch categories when modal opens
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  // Initialize filters with current applied filters when modal opens
  useEffect(() => {
    if (open) {
      if (currentFilters) {
        setFilters(currentFilters);
      } else {
        // Reset to default if no current filters
        setFilters({
          surveyName: '',
          categoryId: 'all',
          checkType: 'all'
        });
      }
    }
  }, [open, currentFilters]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await apiClient.get('/pms/admin/helpdesk_categories.json');
      console.log('Categories API response:', response.data);
      
      // Handle different response structures
      let categoriesData = [];
      if (Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.data && Array.isArray(response.data.helpdesk_categories)) {
        categoriesData = response.data.helpdesk_categories;
      } else if (response.data && Array.isArray(response.data.categories)) {
        categoriesData = response.data.categories;
      }
      
      setCategories(categoriesData || []);
    } catch (error: any) {
      console.error('Error fetching ticket categories:', error);
      toast.error('Failed to fetch ticket categories');
      setCategories([]); // Ensure it's always an array
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleReset = () => {
    setFilters({
      surveyName: '',
      categoryId: 'all',
      checkType: 'all'
    });
    onResetFilters();
    toast.success('Filters reset successfully');
  };

  const handleApply = () => {
    onApplyFilters(filters);
    toast.success('Filters applied successfully');
    onClose();
  };

  const handleInputChange = (field: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl min-h-[200px]">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl text-slate-950 font-normal">FILTER BY</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>
        
        <div className="py-4">
          {/* Survey Filter Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#C72030] mb-4">Question Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Survey Name Filter */}
              <div className="space-y-2">
                <Label htmlFor="surveyName">Title</Label>
                <Input
                  id="surveyName"
                  placeholder="Enter Title"
                  value={filters.surveyName}
                  onChange={(e) => handleInputChange('surveyName', e.target.value)}
                  className="h-10 border-gray-300 focus-visible:border-gray-500 text-black"
                />
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label htmlFor="category">Ticket Category</Label>
                <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={categoryPopoverOpen}
                      className="!h-10 w-full justify-between text-left font-normal !border-gray hover:!border-gray focus:!border-gray focus-visible:!border-black !text-black bg-white hover:bg-white focus:bg-white px-3 py-2 rounded-md shadow-sm sm:!h-10"
                      disabled={loadingCategories}
                    >
                      {filters.categoryId === 'all' 
                        ? "All Categories" 
                        : categories.find((category) => category.id.toString() === filters.categoryId)?.name || "Select Category"
                      }
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 max-h-80" align="start">
                    <Command>
                      <CommandInput placeholder="Search categories..." className="h-9" />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <div className="max-h-60 overflow-y-auto overscroll-contain scroll-smooth" 
                           style={{ 
                             scrollbarWidth: 'thin',
                             scrollBehavior: 'smooth',
                           }}
                           onWheel={(e) => {
                             e.stopPropagation();
                             const container = e.currentTarget;
                             container.scrollTop += e.deltaY;
                           }}
                      >
                        <CommandGroup className="h-auto">
                          <CommandItem
                            value="all-categories"
                            onSelect={() => {
                              handleInputChange('categoryId', 'all');
                              setCategoryPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                filters.categoryId === 'all' ? "opacity-100" : "opacity-0"
                              )}
                            />
                            All Categories
                          </CommandItem>
                          {loadingCategories ? (
                            <div className="flex items-center gap-2 p-2 text-sm text-gray-500">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Loading categories...
                            </div>
                          ) : (
                            Array.isArray(categories) && categories.map((category) => (
                              <CommandItem
                                key={category.id}
                                value={category.name.toLowerCase()}
                                onSelect={() => {
                                  handleInputChange('categoryId', category.id.toString());
                                  setCategoryPopoverOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    filters.categoryId === category.id.toString() ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {category.name}
                              </CommandItem>
                            ))
                          )}
                        </CommandGroup>
                      </div>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check Type Filter */}
              <div className="space-y-2">
                <Label htmlFor="checkType">Check Type</Label>
                <Select
                  value={filters.checkType}
                  onValueChange={(value) => handleInputChange('checkType', value)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Check Type" />
                  </SelectTrigger>
                  <SelectContent 
                    side="bottom" 
                    align="start" 
                    className="z-[9999] max-h-48 overflow-y-auto"
                    avoidCollisions={false}
                    sideOffset={4}
                  >
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="patrolling">Patrolling</SelectItem>
                    <SelectItem value="survey">Survey</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <Button 
            onClick={handleReset} 
            variant="outline" 
            className="text-[#C72030] border-[#C72030] hover:bg-[#C72030] hover:text-white px-8"
          >
            Reset
          </Button>
          <Button 
            onClick={handleApply} 
            className="bg-[#C72030] text-white hover:bg-[#A01828] px-8"
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
