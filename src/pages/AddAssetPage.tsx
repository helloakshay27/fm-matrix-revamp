
import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AssetDetailsSection } from '../components/asset/AssetDetailsSection';
import { LocationDetailsSection } from '../components/asset/LocationDetailsSection';
import { MeterDetailsSection } from '../components/asset/MeterDetailsSection';
import { ItAssetDetailsSection } from '../components/asset/ItAssetDetailsSection';

const AddAssetPage = () => {
  const navigate = useNavigate();

  // Section visibility states
  const [assetDetailsExpanded, setAssetDetailsExpanded] = useState(true);
  const [locationDetailsExpanded, setLocationDetailsExpanded] = useState(false);
  const [meterDetailsExpanded, setMeterDetailsExpanded] = useState(false);
  const [itAssetDetailsExpanded, setItAssetDetailsExpanded] = useState(false);

  // Form states
  const [assetCategoryType, setAssetCategoryType] = useState('');
  const [formData, setFormData] = useState({
    assetName: '',
    assetNo: '',
    modelNo: '',
    serialNo: '',
    manufacturer: '',
    vendor: '',
    group: '',
    subgroup: '',
    commissioningDate: '',
    status: 'in-use'
  });

  const [locationData, setLocationData] = useState({
    site: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    room: ''
  });

  const [meterDetailsApplicable, setMeterDetailsApplicable] = useState(false);
  const [meterType, setMeterType] = useState('parent');
  const [critical, setCritical] = useState('no');
  const [meterCategoryType, setMeterCategoryType] = useState('');
  const [subCategoryType, setSubCategoryType] = useState('');

  const [itAssetData, setItAssetData] = useState({
    os: '',
    totalMemory: '',
    processor: '',
    model: '',
    serialNo: '',
    capacity: ''
  });

  // Custom fields states
  const [customFields, setCustomFields] = useState<Array<{ id: string; name: string; value: string; }>>([]);
  const [itCustomFields, setItCustomFields] = useState<Array<{
    id: string;
    name: string;
    value: string;
    section: 'System Details' | 'Hard Disk Details';
  }>>([]);

  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [showItCustomFieldModal, setShowItCustomFieldModal] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (field: string, value: string) => {
    setLocationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMeterCategoryChange = (value: string) => {
    setMeterCategoryType(value);
    setSubCategoryType('');
  };

  const handleItAssetChange = (field: string, value: string) => {
    setItAssetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomFieldChange = (id: string, value: string) => {
    setCustomFields(prev => prev.map(field => 
      field.id === id ? { ...field, value } : field
    ));
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(prev => prev.filter(field => field.id !== id));
  };

  const handleItCustomFieldChange = (id: string, value: string) => {
    setItCustomFields(prev => prev.map(field => 
      field.id === id ? { ...field, value } : field
    ));
  };

  const handleRemoveItCustomField = (id: string) => {
    setItCustomFields(prev => prev.filter(field => field.id !== id));
  };

  const shouldShowMeterDetails = assetCategoryType !== 'tools-instruments';

  // Collapsible section component
  const CollapsibleSection = ({ 
    title, 
    icon: Icon, 
    isExpanded, 
    onToggle, 
    children,
    hasToggle = false,
    toggleLabel = '',
    isToggleOn = false,
    onToggleChange = () => {},
    customButton = null
  }: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    hasToggle?: boolean;
    toggleLabel?: string;
    isToggleOn?: boolean;
    onToggleChange?: (value: boolean) => void;
    customButton?: React.ReactNode;
  }) => (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div 
        onClick={onToggle} 
        className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white"
      >
        <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
          <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
            <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
          </span>
          {title}
          {hasToggle && (
            <div className="flex items-center gap-2 ml-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isToggleOn}
                  onChange={(e) => onToggleChange(e.target.checked)}
                />
                <div className="w-11 h-6 bg-green-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
              <span className="text-sm text-gray-600">{toggleLabel}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {customButton}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {isExpanded ? 'Hide' : 'Show Fields'}
            </span>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="animate-accordion-down">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Add New Asset</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#C72030] text-white rounded-md hover:bg-[#B01E2F]">
                Save Asset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Asset Category Selection */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Asset Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: 'building-facility', label: 'Building & Facility', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
              { value: 'furniture-fixture', label: 'Furniture & Fixture', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
              { value: 'tools-instruments', label: 'Tools & Instruments', bgColor: 'bg-green-50', textColor: 'text-green-700' },
              { value: 'vehicles', label: 'Vehicles', bgColor: 'bg-purple-50', textColor: 'text-purple-700' }
            ].map((category) => (
              <div key={category.value} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                assetCategoryType === category.value 
                  ? `${category.bgColor} border-current ${category.textColor}` 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={category.value}
                    name="assetCategory"
                    value={category.value}
                    checked={assetCategoryType === category.value}
                    onChange={(e) => setAssetCategoryType(e.target.value)}
                    className="w-4 h-4 border-gray-300 focus:ring-[#C72030] text-[#C72030]"
                  />
                  <label htmlFor={category.value} className="text-sm font-medium cursor-pointer">
                    {category.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          {/* Asset Details */}
          <CollapsibleSection
            title="ASSET DETAILS"
            icon={({ className }) => <div className={className}>📦</div>}
            isExpanded={assetDetailsExpanded}
            onToggle={() => setAssetDetailsExpanded(!assetDetailsExpanded)}
            customButton={
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCustomFieldModal(true);
                }}
                className="px-3 py-1 rounded-md text-sm flex items-center gap-1 bg-[#f6f4ee] text-red-700"
              >
                + Custom Field
              </button>
            }
          >
            <AssetDetailsSection
              isExpanded={true}
              onToggle={() => {}}
              formData={formData}
              onInputChange={handleInputChange}
              customFields={customFields}
              onCustomFieldChange={handleCustomFieldChange}
              onRemoveCustomField={handleRemoveCustomField}
              onOpenCustomFieldModal={() => setShowCustomFieldModal(true)}
            />
          </CollapsibleSection>

          {/* Location Details */}
          <CollapsibleSection
            title="LOCATION DETAILS"
            icon={({ className }) => <div className={className}>📍</div>}
            isExpanded={locationDetailsExpanded}
            onToggle={() => setLocationDetailsExpanded(!locationDetailsExpanded)}
          >
            <LocationDetailsSection
              isExpanded={true}
              onToggle={() => {}}
              locationData={locationData}
              onLocationChange={handleLocationChange}
            />
          </CollapsibleSection>

          {/* Meter Details */}
          {shouldShowMeterDetails && (
            <CollapsibleSection
              title="METER DETAILS"
              icon={({ className }) => <div className={className}>📊</div>}
              isExpanded={meterDetailsExpanded}
              onToggle={() => setMeterDetailsExpanded(!meterDetailsExpanded)}
              hasToggle={true}
              toggleLabel="If Applicable"
              isToggleOn={meterDetailsApplicable}
              onToggleChange={setMeterDetailsApplicable}
            >
              <MeterDetailsSection
                isExpanded={true}
                onToggle={() => {}}
                meterDetailsApplicable={meterDetailsApplicable}
                setMeterDetailsApplicable={setMeterDetailsApplicable}
                meterType={meterType}
                setMeterType={setMeterType}
                critical={critical}
                setCritical={setCritical}
                meterCategoryType={meterCategoryType}
                handleMeterCategoryChange={handleMeterCategoryChange}
                subCategoryType={subCategoryType}
                setSubCategoryType={setSubCategoryType}
              />
            </CollapsibleSection>
          )}

          {/* IT Asset Details */}
          <CollapsibleSection
            title="IT Asset Details"
            icon={({ className }) => <div className={className}>💻</div>}
            isExpanded={itAssetDetailsExpanded}
            onToggle={() => setItAssetDetailsExpanded(!itAssetDetailsExpanded)}
            hasToggle={true}
            toggleLabel="If Applicable"
            isToggleOn={true}
            customButton={
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowItCustomFieldModal(true);
                }}
                className="px-3 py-1 rounded-md text-sm flex items-center gap-1 bg-[#f6f4ee] text-red-700"
              >
                + Custom Field
              </button>
            }
          >
            <ItAssetDetailsSection
              isExpanded={true}
              onToggle={() => {}}
              itAssetData={itAssetData}
              onItAssetChange={handleItAssetChange}
              itCustomFields={itCustomFields}
              onItCustomFieldChange={handleItCustomFieldChange}
              onRemoveItCustomField={handleRemoveItCustomField}
              onOpenCustomFieldModal={() => setShowItCustomFieldModal(true)}
            />
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
};

export default AddAssetPage;
