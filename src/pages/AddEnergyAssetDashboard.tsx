
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LocationDetailsSection } from '@/components/energy-asset/LocationDetailsSection';
import { AssetDetailsSection } from '@/components/energy-asset/AssetDetailsSection';
import { WarrantyDetailsSection } from '@/components/energy-asset/WarrantyDetailsSection';
import { MeterCategorySection } from '@/components/energy-asset/MeterCategorySection';
import { ConsumptionMeasureSection } from '@/components/energy-asset/ConsumptionMeasureSection';
import { NonConsumptionMeasureSection } from '@/components/energy-asset/NonConsumptionMeasureSection';
import { AttachmentsSection } from '@/components/energy-asset/AttachmentsSection';

export const AddEnergyAssetDashboard = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    asset: true,
    warranty: true,
    meterCategory: true,
    consumption: false,
    nonConsumption: false,
    attachments: false
  });

  const [consumptionMeasures, setConsumptionMeasures] = useState([
    { name: '', unitType: '', min: '', max: '', alertBelow: '', alertAbove: '', multiplierFactor: '', checkPreviousReading: false }
  ]);

  const [nonConsumptionMeasures, setNonConsumptionMeasures] = useState([
    { name: '', unitType: '', min: '', max: '', alertBelow: '', alertAbove: '', multiplierFactor: '', checkPreviousReading: false }
  ]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addConsumptionMeasure = () => {
    setConsumptionMeasures([...consumptionMeasures, { 
      name: '', unitType: '', min: '', max: '', alertBelow: '', alertAbove: '', multiplierFactor: '', checkPreviousReading: false 
    }]);
  };

  const removeConsumptionMeasure = (index: number) => {
    setConsumptionMeasures(consumptionMeasures.filter((_, i) => i !== index));
  };

  const addNonConsumptionMeasure = () => {
    setNonConsumptionMeasures([...nonConsumptionMeasures, { 
      name: '', unitType: '', min: '', max: '', alertBelow: '', alertAbove: '', multiplierFactor: '', checkPreviousReading: false 
    }]);
  };

  const removeNonConsumptionMeasure = (index: number) => {
    setNonConsumptionMeasures(nonConsumptionMeasures.filter((_, i) => i !== index));
  };

  const handleSaveAndShowDetails = () => {
    console.log('Saving asset and showing details...');
    navigate('/utility/energy');
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving asset and creating new...');
    // Reset form or navigate to new form
  };

  const handleFileUpload = (type: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Uploading ${type}:`, file.name);
      // Handle file upload logic here
    }
  };

  return (
    <div className="min-h-screen bg-sidebar">
      {/* Header */}
      <div className="bg-white border-b border-sidebar-border p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sidebar-foreground/70 text-sm mb-1">Asset List &gt; Create New Asset</p>
            <h1 className="text-2xl font-bold text-sidebar-foreground">NEW ASSET</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/utility/energy')}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <LocationDetailsSection
          expanded={expandedSections.location}
          onToggle={() => toggleSection('location')}
        />

        <AssetDetailsSection
          expanded={expandedSections.asset}
          onToggle={() => toggleSection('asset')}
        />

        <WarrantyDetailsSection
          expanded={expandedSections.warranty}
          onToggle={() => toggleSection('warranty')}
        />

        <MeterCategorySection
          expanded={expandedSections.meterCategory}
          onToggle={() => toggleSection('meterCategory')}
        />

        <ConsumptionMeasureSection
          expanded={expandedSections.consumption}
          onToggle={() => toggleSection('consumption')}
          measures={consumptionMeasures}
          onAddMeasure={addConsumptionMeasure}
          onRemoveMeasure={removeConsumptionMeasure}
        />

        <NonConsumptionMeasureSection
          expanded={expandedSections.nonConsumption}
          onToggle={() => toggleSection('nonConsumption')}
          measures={nonConsumptionMeasures}
          onAddMeasure={addNonConsumptionMeasure}
          onRemoveMeasure={removeNonConsumptionMeasure}
        />

        <AttachmentsSection
          expanded={expandedSections.attachments}
          onToggle={() => toggleSection('attachments')}
          onFileUpload={handleFileUpload}
        />

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6">
          <Button 
            variant="outline"
            onClick={handleSaveAndShowDetails}
            className="px-8 py-3 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
          >
            Save & Show Details
          </Button>
          <Button 
            onClick={handleSaveAndCreateNew}
            style={{ backgroundColor: '#C72030' }}
            className="px-8 py-3 text-white hover:opacity-90"
          >
            Save & Create New Asset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddEnergyAssetDashboard;
