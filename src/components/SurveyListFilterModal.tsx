import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Loader2 } from 'lucide-react';
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
    categoryId: 'all'
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Sync internal filters with current filters when modal opens
  useEffect(() => {
    if (open && currentFilters) {
      setFilters(currentFilters);
    }
  }, [open, currentFilters]);

  // Fetch categories when modal opens
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await apiClient.get('/snag_audit_categories.json');
      setCategories(response.data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleReset = () => {
    const resetFilters = {
      surveyName: '',
      categoryId: 'all'
    };
    setFilters(resetFilters);
    onResetFilters();
    onClose();
  };

  const handleApply = () => {
    onApplyFilters(filters);
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
      <DialogContent className="max-w-2xl">
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
            <h3 className="text-lg font-semibold text-[#C72030] mb-4">Survey Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Survey Name Filter */}
              <div className="space-y-2">
                <Label htmlFor="surveyName">Survey Name</Label>
                <Input
                  id="surveyName"
                  placeholder="Enter Survey Name"
                  value={filters.surveyName}
                  onChange={(e) => handleInputChange('surveyName', e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label htmlFor="category">Ticket Category</Label>
                <Select
                  value={filters.categoryId}
                  onValueChange={(value) => handleInputChange('categoryId', value)}
                  disabled={loadingCategories}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {loadingCategories ? (
                      <div className="flex items-center gap-2 p-2 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading categories...
                      </div>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
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
