import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { moduleService, CreateModulePayload } from '@/services/moduleService';

interface CreateModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onModuleCreated?: () => void;
}

export const CreateModuleDialog = ({ 
  open, 
  onOpenChange, 
  onModuleCreated 
}: CreateModuleDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
    show_name: '',
    module_type: '',
    charged_per: '',
    no_of_licences: 10,
    min_billing: 1000,
    rate: 150,
    max_billing: 5000,
    total_billing: 2000,
    rate_type: 'fixed',
    active: true,
    phase_id: 1,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Module name is required');
      return false;
    }
    if (!formData.abbreviation.trim()) {
      toast.error('Abbreviation is required');
      return false;
    }
    if (!formData.show_name.trim()) {
      toast.error('Display name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload: CreateModulePayload = {
        lock_module: {
          name: formData.name,
          abbreviation: formData.abbreviation,
          show_name: formData.show_name,
          module_type: formData.module_type,
          charged_per: formData.charged_per,
          no_of_licences: formData.no_of_licences,
          min_billing: formData.min_billing,
          rate: formData.rate,
          max_billing: formData.max_billing,
          total_billing: formData.total_billing,
          rate_type: formData.rate_type,
          active: formData.active,
          phase_id: formData.phase_id,
        }
      };

      const response = await moduleService.createModule(payload);
      
        toast.success('Module created successfully');
        onModuleCreated?.();
        handleClose();
    } catch (error) {
      console.error('Error creating module:', error);
      toast.error('Failed to create module');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      abbreviation: '',
      show_name: '',
      module_type: '',
      charged_per: '',
      no_of_licences: 10,
      min_billing: 1000,
      rate: 150,
      max_billing: 5000,
      total_billing: 2000,
      rate_type: 'fixed',
      active: true,
      phase_id: 1,
    });
    onOpenChange(false);
  };

  const moduleTypeOptions = [
    { value: 'standard', label: 'Standard' },
    { value: 'premium', label: 'Premium' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'custom', label: 'Custom' },
  ];

  const chargedPerOptions = [
    { value: 'user', label: 'Per User' },
    { value: 'license', label: 'Per License' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const rateTypeOptions = [
    { value: 'fixed', label: 'Fixed' },
    { value: 'variable', label: 'Variable' },
    { value: 'tiered', label: 'Tiered' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Module</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="name">Module Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter module name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="abbreviation">Abbreviation *</Label>
              <Input
                id="abbreviation"
                value={formData.abbreviation}
                onChange={(e) => handleInputChange('abbreviation', e.target.value)}
                placeholder="e.g., pms"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="show_name">Display Name *</Label>
              <Input
                id="show_name"
                value={formData.show_name}
                onChange={(e) => handleInputChange('show_name', e.target.value)}
                placeholder="Display name for the module"
                required
              />
            </div>

       
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#C72030] hover:bg-[#A11D2A] text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Module'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
