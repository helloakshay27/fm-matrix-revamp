
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Plus, X } from 'lucide-react';
import { LocationDetailsSection } from '@/components/asset/LocationDetailsSection';
import { AssetDetailsSection } from '@/components/asset/AssetDetailsSection';
import { ItAssetDetailsSection } from '@/components/asset/ItAssetDetailsSection';
import { AttachmentsSection } from '@/components/AttachmentsSection';
import { AddCustomFieldModal } from '@/components/AddCustomFieldModal';
import { useAssetForm } from '@/hooks/useAssetForm';
import { TextField } from '@mui/material';

const fieldStyles = {
  height: {
    xs: 28,
    sm: 36,
    md: 45
  },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: {
      xs: '8px',
      sm: '10px',
      md: '12px'
    }
  }
};

const EditAssetDetailsPage = () => {
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

  // Custom fields state
  const [customFields, setCustomFields] = useState<Array<{ id: string; name: string; value: string; }>>([]);
  const [itCustomFields, setItCustomFields] = useState<Array<{ id: string; name: string; value: string; section: 'System Details' | 'Hard Disk Details'; }>>([]);
  const [meterCustomFields, setMeterCustomFields] = useState<Array<{ id: string; name: string; value: string; }>>([]);
  
  // Modal state
  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState<'asset' | 'it' | 'meter'>('asset');

  // Custom field handlers for Asset Details
  const handleCustomFieldChange = (id: string, value: string) => {
    setCustomFields(prev => prev.map(field => field.id === id ? { ...field, value } : field));
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(prev => prev.filter(field => field.id !== id));
  };

  const handleAddCustomField = (fieldName: string) => {
    const newField = {
      id: `custom-${Date.now()}`,
      name: fieldName,
      value: ''
    };
    setCustomFields(prev => [...prev, newField]);
  };

  // Custom field handlers for IT Asset Details
  const handleItCustomFieldChange = (id: string, value: string) => {
    setItCustomFields(prev => prev.map(field => field.id === id ? { ...field, value } : field));
  };

  const handleRemoveItCustomField = (id: string) => {
    setItCustomFields(prev => prev.filter(field => field.id !== id));
  };

  const handleAddItCustomField = (fieldName: string, section?: string) => {
    const newField = {
      id: `it-custom-${Date.now()}`,
      name: fieldName,
      value: '',
      section: (section as 'System Details' | 'Hard Disk Details') || 'System Details'
    };
    setItCustomFields(prev => [...prev, newField]);
  };

  // Custom field handlers for Meter Details
  const handleMeterCustomFieldChange = (id: string, value: string) => {
    setMeterCustomFields(prev => prev.map(field => field.id === id ? { ...field, value } : field));
  };

  const handleRemoveMeterCustomField = (id: string) => {
    setMeterCustomFields(prev => prev.filter(field => field.id !== id));
  };

  const handleAddMeterCustomField = (fieldName: string) => {
    const newField = {
      id: `meter-custom-${Date.now()}`,
      name: fieldName,
      value: ''
    };
    setMeterCustomFields(prev => [...prev, newField]);
  };

  // Modal handlers
  const openCustomFieldModal = (context: 'asset' | 'it' | 'meter') => {
    setModalContext(context);
    setIsCustomFieldModalOpen(true);
  };

  const closeCustomFieldModal = () => {
    setIsCustomFieldModalOpen(false);
  };

  const handleModalAddField = (fieldName: string, section?: string) => {
    if (modalContext === 'asset') {
      handleAddCustomField(fieldName);
    } else if (modalContext === 'it') {
      handleAddItCustomField(fieldName, section);
    } else if (modalContext === 'meter') {
      handleAddMeterCustomField(fieldName);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Asset Details</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-[#C72030] text-[#C72030] rounded-md hover:bg-[#C72030] hover:text-white transition-colors text-sm">
              Cancel
            </button>
            <button className="px-4 py-2 bg-[#C72030] text-white rounded-md hover:bg-[#A01C28] transition-colors text-sm">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="space-y-6">
          {/* Location Details Section */}
          <LocationDetailsSection
            isExpanded={expandedSections.location}
            onToggle={() => toggleSection('location')}
            locationData={locationData}
            onLocationChange={handleLocationChange}
          />

          {/* Asset Details Section */}
          <AssetDetailsSection
            isExpanded={expandedSections.asset}
            onToggle={() => toggleSection('asset')}
            formData={formData}
            onInputChange={handleInputChange}
            customFields={customFields}
            onCustomFieldChange={handleCustomFieldChange}
            onRemoveCustomField={handleRemoveCustomField}
            onOpenCustomFieldModal={() => openCustomFieldModal('asset')}
          />

          {/* Meter Details Section */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div 
              onClick={() => toggleSection('meterCategory')} 
              className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white"
            >
              <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                </span>
                METER DETAILS
                <div className="flex items-center gap-2 ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.meterApplicable}
                      onChange={(e) => handleInputChange('meterApplicable', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-green-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                  <span className="text-sm text-gray-600">If Applicable</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openCustomFieldModal('meter');
                  }}
                  className="px-3 py-1 rounded-md text-sm flex items-center gap-1 bg-[#f6f4ee] text-red-700"
                >
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
                {expandedSections.meterCategory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
            {expandedSections.meterCategory && (
              <div className="p-4 sm:p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-red-700 font-normal">Meter Category</span>
                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="meter-consumption"
                          name="meterCategory"
                          value="consumption"
                          className="w-4 h-4 border-gray-300 focus:ring-[#C72030] text-[#C72030]"
                        />
                        <label htmlFor="meter-consumption" className="text-sm">Consumption</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="meter-non-consumption"
                          name="meterCategory"
                          value="non-consumption"
                          className="w-4 h-4 border-gray-300 focus:ring-[#C72030] text-[#C72030]"
                        />
                        <label htmlFor="meter-non-consumption" className="text-sm">Non Consumption</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="meter-sub-meter"
                          name="meterCategory"
                          value="sub-meter"
                          className="w-4 h-4 border-gray-300 focus:ring-[#C72030] text-[#C72030]"
                        />
                        <label htmlFor="meter-sub-meter" className="text-sm">Sub Meter</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="meter-check-meter"
                          name="meterCategory"
                          value="check-meter"
                          className="w-4 h-4 border-gray-300 focus:ring-[#C72030] text-[#C72030]"
                        />
                        <label htmlFor="meter-check-meter" className="text-sm">Check Meter</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="meter-main-incoming"
                          name="meterCategory"
                          value="main-incoming"
                          className="w-4 h-4 border-gray-300 focus:ring-[#C72030] text-[#C72030]"
                        />
                        <label htmlFor="meter-main-incoming" className="text-sm">Main Incoming</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="meter-bulk-meter"
                          name="meterCategory"
                          value="bulk-meter"
                          className="w-4 h-4 border-gray-300 focus:ring-[#C72030] text-[#C72030]"
                        />
                        <label htmlFor="meter-bulk-meter" className="text-sm">Bulk Meter</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom Fields for Meter Details */}
                {meterCustomFields.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                    {meterCustomFields.map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          value={field.value}
                          onChange={(e) => handleMeterCustomFieldChange(field.id, e.target.value)}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{ sx: fieldStyles }}
                        />
                        <button
                          onClick={() => handleRemoveMeterCustomField(field.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* IT Asset Details Section */}
          <ItAssetDetailsSection
            isExpanded={expandedSections.nonConsumption}
            onToggle={() => toggleSection('nonConsumption')}
            itAssetData={itAssetData}
            onItAssetChange={handleItAssetChange}
            itCustomFields={itCustomFields}
            onItCustomFieldChange={handleItCustomFieldChange}
            onRemoveItCustomField={handleRemoveItCustomField}
            onOpenCustomFieldModal={() => openCustomFieldModal('it')}
          />

          {/* Attachments Section */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="border-l-4 border-l-[#C72030] p-4 sm:p-6">
              <AttachmentsSection />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Field Modal */}
      <AddCustomFieldModal
        isOpen={isCustomFieldModalOpen}
        onClose={closeCustomFieldModal}
        onAddField={handleModalAddField}
        isItAsset={modalContext === 'it'}
      />
    </div>
  );
};

export default EditAssetDetailsPage;
