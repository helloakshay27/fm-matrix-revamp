import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ticketManagementAPI, CategoryResponse, SubCategoryResponse } from '@/services/ticketManagementAPI';
import { useToast } from '@/hooks/use-toast';

interface MobileDynamicCreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BUILDINGS = [
  { value: 'building1', label: 'Building A' },
  { value: 'building2', label: 'Building B' },
  { value: 'building3', label: 'Building C' },
  { value: 'building4', label: 'Building D' }
];

export const MobileDynamicCreateTicketModal: React.FC<MobileDynamicCreateTicketModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    issueType: '',
    category: '',
    subCategory: '',
    location: '',
    description: ''
  });

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  // Load categories on mount
  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await ticketManagementAPI.getCategories();
      setCategories(response.helpdesk_categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadSubcategories = async (categoryId: number) => {
    setLoadingSubcategories(true);
    try {
      const subcats = await ticketManagementAPI.getSubCategoriesByCategory(categoryId);
      setSubcategories(subcats);
    } catch (error) {
      console.error('Error loading subcategories:', error);
      toast({
        title: "Error",
        description: "Failed to load subcategories",
        variant: "destructive"
      });
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Load subcategories when category changes
    if (field === 'category' && value) {
      const categoryId = parseInt(value);
      loadSubcategories(categoryId);
      setFormData(prev => ({ ...prev, subCategory: '' }));
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.issueType || !formData.category || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const siteId = localStorage.getItem('siteId') || '2189';
      
      const ticketData = {
        of_phase: 'pms',
        site_id: parseInt(siteId),
        on_behalf_of: 'admin',
        complaint_type: formData.issueType,
        category_type_id: parseInt(formData.category),
        heading: formData.description,
        complaint_mode_id: 75,
        room_id: 1,
        wing_id: 1,
        area_id: 1,
        floor_id: 1,
        priority: 'P3',
        society_staff_type: 'User',
        proactive_reactive: 'reactive',
        ...(formData.subCategory && { sub_category_id: parseInt(formData.subCategory) })
      };

      await ticketManagementAPI.createTicket(ticketData, []);
      
      toast({
        title: "Success",
        description: "Ticket created successfully!"
      });
      
      // Reset form
      setFormData({
        issueType: '',
        category: '',
        subCategory: '',
        location: '',
        description: ''
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-lg" style={{ backgroundColor: '#E5DFD2' }}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">Create New Ticket</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Issue Type */}
          <div>
            <Label className="text-sm font-medium text-gray-900">Issue Type</Label>
            <Select value={formData.issueType} onValueChange={(value) => handleInputChange('issueType', value)}>
              <SelectTrigger className="mt-2 bg-white border-gray-300 rounded-lg">
                <SelectValue placeholder="Request" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="request">Request</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
                <SelectItem value="suggestion">Suggestion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div>
            <Label className="text-sm font-medium text-gray-900">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleInputChange('category', value)}
              disabled={loadingCategories}
            >
              <SelectTrigger className="mt-2 bg-white border-gray-300 rounded-lg">
                <SelectValue placeholder={loadingCategories ? "Loading..." : "Request"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sub-category */}
          <div>
            <Label className="text-sm font-medium text-gray-900">Sub-category</Label>
            <Select 
              value={formData.subCategory} 
              onValueChange={(value) => handleInputChange('subCategory', value)}
              disabled={loadingSubcategories || !formData.category}
            >
              <SelectTrigger className="mt-2 bg-white border-gray-300 rounded-lg">
                <SelectValue placeholder={loadingSubcategories ? "Loading..." : "Request"} />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div>
            <Label className="text-sm font-medium text-gray-900">Location</Label>
            <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
              <SelectTrigger className="mt-2 bg-white border-gray-300 rounded-lg">
                <SelectValue placeholder="Select Building" />
              </SelectTrigger>
              <SelectContent>
                {BUILDINGS.map((building) => (
                  <SelectItem key={building.value} value={building.value}>
                    {building.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-medium text-gray-900">Description</Label>
            <Textarea
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="mt-2 bg-white border-gray-300 rounded-lg resize-none"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg"
          >
            {loading ? 'Creating...' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};