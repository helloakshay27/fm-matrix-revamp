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
      
      if (response.success) {
        toast.success('Module created successfully');
        onModuleCreated?.();
        handleClose();
      } else {
        toast.error(response.message || 'Failed to create module');
      }
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

            {/* Module Configuration */}
            <div className="space-y-2">
              <Label htmlFor="module_type">Module Type</Label>
              <Select 
                value={formData.module_type} 
                onValueChange={(value) => handleInputChange('module_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select module type" />
                </SelectTrigger>
                <SelectContent>
                  {moduleTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="charged_per">Charged Per</Label>
              <Select 
                value={formData.charged_per} 
                onValueChange={(value) => handleInputChange('charged_per', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select charging basis" />
                </SelectTrigger>
                <SelectContent>
                  {chargedPerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Licensing */}
            <div className="space-y-2">
              <Label htmlFor="no_of_licences">Number of Licenses</Label>
              <Input
                id="no_of_licences"
                type="number"
                value={formData.no_of_licences}
                onChange={(e) => handleInputChange('no_of_licences', parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phase_id">Phase ID</Label>
              <Input
                id="phase_id"
                type="number"
                value={formData.phase_id}
                onChange={(e) => handleInputChange('phase_id', parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>

            {/* Billing */}
            <div className="space-y-2">
              <Label htmlFor="rate">Rate</Label>
              <Input
                id="rate"
                type="number"
                value={formData.rate}
                onChange={(e) => handleInputChange('rate', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate_type">Rate Type</Label>
              <Select 
                value={formData.rate_type} 
                onValueChange={(value) => handleInputChange('rate_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rate type" />
                </SelectTrigger>
                <SelectContent>
                  {rateTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_billing">Minimum Billing</Label>
              <Input
                id="min_billing"
                type="number"
                value={formData.min_billing}
                onChange={(e) => handleInputChange('min_billing', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_billing">Maximum Billing</Label>
              <Input
                id="max_billing"
                type="number"
                value={formData.max_billing}
                onChange={(e) => handleInputChange('max_billing', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="total_billing">Total Billing</Label>
              <Input
                id="total_billing"
                type="number"
                value={formData.total_billing}
                onChange={(e) => handleInputChange('total_billing', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2 md:col-span-2">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleInputChange('active', checked)}
              />
              <Label htmlFor="active">Active</Label>
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
