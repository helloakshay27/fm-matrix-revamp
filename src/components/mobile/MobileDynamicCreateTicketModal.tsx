import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ChevronDown } from 'lucide-react';
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

  const [currentStep, setCurrentStep] = useState<'form' | 'overview'>('form');
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  const loadCategories = useCallback(async () => {
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
  }, [toast]);

  const loadSubcategories = useCallback(async (categoryId: number) => {
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
  }, [toast]);

  // Load categories on mount
  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, loadCategories]);

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

  const handleNext = () => {
    // Validation
    if (!formData.issueType || !formData.category || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep('overview');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const siteId = localStorage.getItem('siteId') || '2189';
      
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      let userId = null;
      
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          userId = parsedUser.id;
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      }
      
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
        ...(userId && { id_user: userId }),
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
      setCurrentStep('form');
      
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

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id.toString() === categoryId);
    return category?.name || categoryId;
  };

  const getSubCategoryName = (subCategoryId: string) => {
    const subCategory = subcategories.find(subCat => subCat.id.toString() === subCategoryId);
    return subCategory?.name || subCategoryId;
  };

  const getBuildingName = (buildingValue: string) => {
    const building = BUILDINGS.find(b => b.value === buildingValue);
    return building?.label || buildingValue;
  };

  const handleClose = () => {
    setCurrentStep('form');
    onClose();
  };

  const handleBack = () => {
    if (currentStep === 'overview') {
      setCurrentStep('form');
    } else {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white rounded-2xl shadow-2xl max-w-md w-[90%] max-h-[85vh] border-0 p-0 overflow-hidden">
        {currentStep === 'form' ? (
            /* Form Content */
            <div className="relative">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="absolute top-4 left-4 z-10 text-red-600 hover:text-red-800 hover:bg-red-50 h-auto font-bold text-lg p-2"
              >
                ×
              </Button>

              {/* Form Container */}
              <div className="bg-white p-6 overflow-y-auto max-h-[80vh]">
                <div className="space-y-6 mt-8">
                  {/* Issue Type */}
                  <div>
                    <Label className="text-base font-medium text-black mb-2 block">Issue Type</Label>
                    <Select value={formData.issueType} onValueChange={(value) => handleInputChange('issueType', value)}>
                      <SelectTrigger className="h-12 bg-white border border-gray-300 rounded-lg text-base">
                        <SelectValue placeholder="Request" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-50">
                        <SelectItem value="request" className="text-base py-2">Request</SelectItem>
                        <SelectItem value="complaint" className="text-base py-2">Complaint</SelectItem>
                        <SelectItem value="suggestion" className="text-base py-2">Suggestion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category */}
                  <div>
                    <Label className="text-base font-medium text-black mb-2 block">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleInputChange('category', value)}
                      disabled={loadingCategories}
                    >
                      <SelectTrigger className="h-12 bg-white border border-gray-300 rounded-lg text-base">
                        <SelectValue placeholder={loadingCategories ? "Loading..." : "Request"} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()} className="text-base py-2">
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sub-category */}
                  <div>
                    <Label className="text-base font-medium text-black mb-2 block">Sub-category</Label>
                    <Select 
                      value={formData.subCategory} 
                      onValueChange={(value) => handleInputChange('subCategory', value)}
                      disabled={loadingSubcategories || !formData.category}
                    >
                      <SelectTrigger className="h-12 bg-white border border-gray-300 rounded-lg text-base">
                        <SelectValue placeholder={loadingSubcategories ? "Loading..." : "Request"} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        {subcategories.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id.toString()} className="text-base py-2">
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div>
                    <Label className="text-base font-medium text-black mb-2 block">Location</Label>
                    <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                      <SelectTrigger className="h-12 bg-white border border-gray-300 rounded-lg text-base">
                        <SelectValue placeholder="Select Building" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        {BUILDINGS.map((building) => (
                          <SelectItem key={building.value} value={building.value} className="text-base py-2">
                            {building.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div>
                    <Label className="text-base font-medium text-black mb-2 block">Description</Label>
                    <Textarea
                      placeholder="Enter description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="min-h-20 bg-white border border-gray-300 rounded-lg resize-none text-base p-3"
                      rows={3}
                    />
                  </div>

                  {/* Next Button */}
                  <div className="pt-4">
                    <Button
                      onClick={handleNext}
                      className="w-full h-12 bg-red-700 hover:bg-red-800 text-white font-medium text-base rounded-lg"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>          ) : (
            /* Overview Content */
            <div className="relative">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="absolute top-4 left-4 z-10 text-red-600 hover:text-red-800 hover:bg-red-50 h-auto font-bold text-lg p-2"
              >
                ←
              </Button>

              {/* Overview Container */}
              <div className="bg-white p-6 overflow-y-auto max-h-[80vh]">
                <div className="mt-8">
                  {/* Overview Header */}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-black">Overview</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep('form')}
                      className="p-2 h-auto"
                    >
                      <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </Button>
                  </div>

                  {/* Overview Fields */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-3">Issue Type</h3>
                      <p className="text-gray-600 text-base capitalize">{formData.issueType || 'Request'}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-black mb-3">Category</h3>
                      <p className="text-gray-600 text-base">{formData.category ? getCategoryName(formData.category) : 'Request'}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-black mb-3">Sub-category</h3>
                      <p className="text-gray-600 text-base">{formData.subCategory ? getSubCategoryName(formData.subCategory) : 'Request'}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-black mb-3">Location</h3>
                      <p className="text-gray-500 text-base">{formData.location ? getBuildingName(formData.location) : 'Select Building'}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-black mb-3">Description</h3>
                      <p className="text-gray-500 text-base">{formData.description || 'Enter description'}</p>
                    </div>
                  </div>

                  {/* Create Ticket Button */}
                  <div className="mt-10">
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg rounded-xl"
                    >
                      {loading ? 'Creating...' : 'Create Ticket'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
};