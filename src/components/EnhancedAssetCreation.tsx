
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { StepProgress } from '@/components/ui/step-progress';
import { SectionCard } from '@/components/ui/section-card';
import { EnhancedSelect } from '@/components/ui/enhanced-select';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { DynamicFormField } from '@/components/DynamicFormField';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MapPin, 
  Package, 
  Wrench, 
  DollarSign, 
  Shield, 
  Users, 
  Gauge, 
  Paperclip,
  Save,
  Check
} from 'lucide-react';
import { useAssetForm } from '@/hooks/useAssetForm';
import { useDynamicAssetForm } from '@/hooks/useDynamicAssetForm';
import { toast } from 'sonner';

export const EnhancedAssetCreation: React.FC = () => {
  const {
    expandedSections,
    locationData,
    formData,
    itAssetData,
    toggleSection,
    handleLocationChange,
    handleInputChange,
    handleItAssetChange
  } = useAssetForm();

  const {
    selectedCategory,
    extraFieldsData,
    expandedSections: dynamicExpandedSections,
    handleCategoryChange,
    handleFieldChange,
    getCategoryConfig,
    hasCustomFields
  } = useDynamicAssetForm();

  // Form validation and progress tracking
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const steps = useMemo(() => [
    { id: 'location', title: 'Location', isCompleted: false, isActive: true },
    { id: 'basic', title: 'Basic Info', isCompleted: false, isActive: false },
    { id: 'technical', title: 'Technical', isCompleted: false, isActive: false },
    { id: 'financial', title: 'Financial', isCompleted: false, isActive: false },
    { id: 'warranty', title: 'Warranty', isCompleted: false, isActive: false },
    { id: 'allocation', title: 'Allocation', isCompleted: false, isActive: false },
    { id: 'attachments', title: 'Attachments', isCompleted: false, isActive: false },
  ], []);

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully');
  };

  const handleSubmit = () => {
    toast.success('Asset created successfully');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center text-sm text-muted-foreground mb-4">
          <span>Assets</span>
          <span className="mx-2">{'>'}</span>
          <span>Add Asset</span>
        </nav>
        <h1 className="text-3xl font-bold text-foreground mb-6">CREATE NEW ASSET</h1>
        
        {/* Progress Indicator */}
        <StepProgress steps={steps} />
      </div>

      {/* Location Details Section */}
      <SectionCard
        title="Location Details"
        icon={<MapPin size={18} />}
        isExpanded={expandedSections.location}
        onToggle={() => toggleSection('location')}
        isCompleted={false}
        requiredFieldsCount={2}
        completedFieldsCount={1}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <EnhancedSelect
            label="Site"
            value={locationData.site}
            onChange={(e) => handleLocationChange('site', e.target.value as string)}
            options={[
              { value: 'Lockated', label: 'Lockated' },
              { value: 'sebc', label: 'SEBC' }
            ]}
            placeholder="Select Site"
            required
          />

          <EnhancedSelect
            label="Building"
            value={locationData.building}
            onChange={(e) => handleLocationChange('building', e.target.value as string)}
            options={[
              { value: 'sebc', label: 'SEBC Building' },
              { value: 'main', label: 'Main Building' }
            ]}
            placeholder="Select Building"
            required
          />

          <EnhancedInput
            label="Wing"
            value={locationData.wing}
            onChange={(e) => handleLocationChange('wing', e.target.value)}
            placeholder="Enter Wing"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EnhancedInput
            label="Area"
            value={locationData.area}
            onChange={(e) => handleLocationChange('area', e.target.value)}
            placeholder="Enter Area"
          />

          <EnhancedInput
            label="Floor"
            value={locationData.floor}
            onChange={(e) => handleLocationChange('floor', e.target.value)}
            placeholder="Enter Floor"
          />

          <EnhancedInput
            label="Room"
            value={locationData.room}
            onChange={(e) => handleLocationChange('room', e.target.value)}
            placeholder="Enter Room"
          />
        </div>
      </SectionCard>

      {/* Basic Asset Information */}
      <SectionCard
        title="Basic Asset Information"
        icon={<Package size={18} />}
        isExpanded={expandedSections.asset}
        onToggle={() => toggleSection('asset')}
        isCompleted={false}
        requiredFieldsCount={5}
        completedFieldsCount={3}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <EnhancedInput
            label="Asset Name"
            value={formData.assetName}
            onChange={(e) => handleInputChange('assetName', e.target.value)}
            placeholder="Enter Asset Name"
            required
          />

          <EnhancedInput
            label="Asset Number"
            value={formData.assetNo}
            onChange={(e) => handleInputChange('assetNo', e.target.value)}
            placeholder="Enter Asset Number"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <EnhancedSelect
            label="Group"
            value={formData.group}
            onChange={(e) => handleInputChange('group', e.target.value)}
            options={[
              { value: 'Electrical', label: 'Electrical' },
              { value: 'Mechanical', label: 'Mechanical' },
              { value: 'Civil', label: 'Civil' }
            ]}
            placeholder="Select Group"
            required
          />

          <EnhancedSelect
            label="Sub Group"
            value={formData.subgroup}
            onChange={(e) => handleInputChange('subgroup', e.target.value)}
            options={[
              { value: 'Electric Meter', label: 'Electric Meter' },
              { value: 'Generator', label: 'Generator' }
            ]}
            placeholder="Select Sub Group"
            required
          />

          <EnhancedSelect
            label="Status"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            options={[
              { value: 'in-use', label: 'In Use' },
              { value: 'available', label: 'Available' },
              { value: 'maintenance', label: 'Under Maintenance' }
            ]}
            placeholder="Select Status"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EnhancedInput
            label="Model Number"
            value={formData.modelNo}
            onChange={(e) => handleInputChange('modelNo', e.target.value)}
            placeholder="Enter Model Number"
          />

          <EnhancedInput
            label="Serial Number"
            value={formData.serialNo}
            onChange={(e) => handleInputChange('serialNo', e.target.value)}
            placeholder="Enter Serial Number"
          />
        </div>
      </SectionCard>

      {/* Technical Specifications */}
      <SectionCard
        title="Technical Specifications"
        icon={<Wrench size={18} />}
        isExpanded={expandedSections.asset}
        onToggle={() => toggleSection('asset')}
        isCompleted={false}
      >
        <div className="mb-6">
          <EnhancedSelect
            label="Asset Category"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value as string)}
            options={[
              { value: 'Land', label: 'Land' },
              { value: 'Building', label: 'Building' },
              { value: 'Vehicle', label: 'Vehicle' },
              { value: 'Leasehold Improvement', label: 'Leasehold Improvement' }
            ]}
            placeholder="Select Category for Additional Fields"
          />
        </div>

        {/* Dynamic Fields */}
        {hasCustomFields() && (
          <div className="space-y-6">
            {getCategoryConfig().map((section, sectionIndex) => (
              <div key={sectionIndex} className="border rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-4 text-foreground">
                  {section.title}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map((field) => (
                    <DynamicFormField
                      key={field.name}
                      field={field}
                      value={extraFieldsData[field.name] || ''}
                      onChange={(value) => handleFieldChange(field.name, value)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <EnhancedInput
            label="Capacity"
            value={formData.capacity}
            onChange={(e) => handleInputChange('capacity', e.target.value)}
            placeholder="Enter Capacity"
          />

          <EnhancedInput
            label="Unit"
            value={formData.unit}
            onChange={(e) => handleInputChange('unit', e.target.value)}
            placeholder="Enter Unit"
          />
        </div>
      </SectionCard>

      {/* Financial Information */}
      <SectionCard
        title="Financial Information"
        icon={<DollarSign size={18} />}
        isExpanded={expandedSections.asset}
        onToggle={() => toggleSection('asset')}
        isCompleted={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EnhancedInput
            label="Purchase Cost"
            type="number"
            value={formData.purchaseCost}
            onChange={(e) => handleInputChange('purchaseCost', e.target.value)}
            placeholder="0.00"
          />

          <EnhancedInput
            label="Purchase Date"
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
          />

          <EnhancedInput
            label="Vendor"
            value={formData.vendor}
            onChange={(e) => handleInputChange('vendor', e.target.value)}
            placeholder="Enter Vendor Name"
          />
        </div>
      </SectionCard>

      {/* Warranty Information */}
      <SectionCard
        title="Warranty & Maintenance"
        icon={<Shield size={18} />}
        isExpanded={expandedSections.warranty}
        onToggle={() => toggleSection('warranty')}
        isCompleted={false}
      >
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="underWarranty"
              checked={formData.underWarranty === 'yes'}
              onCheckedChange={(checked) => 
                handleInputChange('underWarranty', checked ? 'yes' : 'no')
              }
            />
            <label htmlFor="underWarranty" className="text-sm font-medium">
              Under Warranty
            </label>
          </div>
        </div>

        {formData.underWarranty === 'yes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EnhancedInput
              label="Warranty Start Date"
              type="date"
              value={formData.warrantyStartDate}
              onChange={(e) => handleInputChange('warrantyStartDate', e.target.value)}
            />

            <EnhancedInput
              label="Warranty Expires On"
              type="date"
              value={formData.warrantyExpiresOn}
              onChange={(e) => handleInputChange('warrantyExpiresOn', e.target.value)}
            />
          </div>
        )}
      </SectionCard>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 pb-4">
        <Button
          variant="outline"
          onClick={handleSaveDraft}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          Save as Draft
        </Button>
        
        <Button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <Check size={16} />
          Create Asset
        </Button>
      </div>
    </div>
  );
};
