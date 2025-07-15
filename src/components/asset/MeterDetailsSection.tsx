
import React from 'react';
import { ChevronDown, ChevronUp, Percent, BarChart3, Zap, Sun, Droplet, Recycle, BarChart, Package, Shield, Activity } from 'lucide-react';

interface MeterDetailsProps {
  isExpanded: boolean;
  onToggle: () => void;
  meterDetailsApplicable: boolean;
  setMeterDetailsApplicable: (value: boolean) => void;
  meterType: string;
  setMeterType: (value: string) => void;
  critical: string;
  setCritical: (value: string) => void;
  meterCategoryType: string;
  handleMeterCategoryChange: (value: string) => void;
  subCategoryType: string;
  setSubCategoryType: (value: string) => void;
}

export const MeterDetailsSection: React.FC<MeterDetailsProps> = ({
  isExpanded,
  onToggle,
  meterDetailsApplicable,
  setMeterDetailsApplicable,
  meterType,
  setMeterType,
  critical,
  setCritical,
  meterCategoryType,
  handleMeterCategoryChange,
  subCategoryType,
  setSubCategoryType
}) => {
  const getMeterCategoryOptions = () => [
    { value: 'board', label: 'Board', icon: <BarChart3 className="w-4 h-4" /> },
    { value: 'dg', label: 'DG', icon: <Zap className="w-4 h-4" /> },
    { value: 'renewable', label: 'Renewable', icon: <Sun className="w-4 h-4" /> },
    { value: 'fresh-water', label: 'Fresh Water', icon: <Droplet className="w-4 h-4" /> },
    { value: 'recycled', label: 'Recycled', icon: <Recycle className="w-4 h-4" /> },
    { value: 'iex-gdam', label: 'IEX-GDAM', icon: <BarChart className="w-4 h-4" /> }
  ];

  const getSubCategoryOptions = () => {
    switch (meterCategoryType) {
      case 'board':
        return [
          { value: 'ht-panel', label: 'HT Panel', icon: <Zap className="w-5 h-5" /> },
          { value: 'vcb', label: 'VCB', icon: <Package className="w-5 h-5" /> },
          { value: 'transformer', label: 'Transformer', icon: <Shield className="w-5 h-5" /> },
          { value: 'lt-panel', label: 'LT Panel', icon: <Activity className="w-5 h-5" /> }
        ];
      case 'renewable':
        return [
          { value: 'solar', label: 'Solar', icon: <Sun className="w-5 h-5" /> },
          { value: 'bio-methanol', label: 'Bio Methanol', icon: <Droplet className="w-5 h-5" /> },
          { value: 'wind', label: 'Wind', icon: <Activity className="w-5 h-5" /> }
        ];
      case 'fresh-water':
        return [
          { value: 'source', label: 'Source (Input)', icon: <Droplet className="w-5 h-5" /> },
          { value: 'destination', label: 'Destination (Output)', icon: <Droplet className="w-5 h-5" /> }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div onClick={onToggle} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
          <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
            <Percent className="w-3 h-3 sm:w-4 sm:h-4" />
          </span>
          METER DETAILS
          <div className="flex items-center gap-2 ml-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={meterDetailsApplicable}
                onChange={(e) => setMeterDetailsApplicable(e.target.checked)}
              />
              <div className="w-11 h-6 bg-green-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
            <span className="text-sm text-gray-600">If Applicable</span>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </div>
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-6">
          {/* Meter Type Section */}
          <div className="mb-8">
            <div className="flex items-center gap-8 mb-4">
              <span className="font-medium text-red-700 min-w-[100px]">Meter Type</span>
              <div className="flex items-center gap-8">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="meter-parent"
                    name="meterType"
                    value="parent"
                    checked={meterType === 'parent'}
                    onChange={(e) => setMeterType(e.target.value)}
                    className="w-4 h-4 border-2 border-[#C72030] focus:ring-[#C72030] text-[#C72030]"
                  />
                  <label htmlFor="meter-parent" className="text-sm font-medium cursor-pointer">Parent</label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="meter-sub"
                    name="meterType"
                    value="sub"
                    checked={meterType === 'sub'}
                    onChange={(e) => setMeterType(e.target.value)}
                    className="w-4 h-4 border-2 border-[#C72030] focus:ring-[#C72030] text-[#C72030]"
                  />
                  <label htmlFor="meter-sub" className="text-sm font-medium cursor-pointer">Sub</label>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Section */}
          <div className="mb-8">
            <div className="flex items-center gap-8">
              <span className="font-medium text-red-700 min-w-[100px]">CRITICAL</span>
              <div className="flex items-center gap-8">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="critical-yes"
                    name="critical"
                    value="yes"
                    checked={critical === 'yes'}
                    onChange={(e) => setCritical(e.target.value)}
                    className="w-4 h-4 border-2 border-[#C72030] focus:ring-[#C72030] text-[#C72030]"
                  />
                  <label htmlFor="critical-yes" className="text-sm font-medium cursor-pointer">Yes</label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="critical-no"
                    name="critical"
                    value="no"
                    checked={critical === 'no'}
                    onChange={(e) => setCritical(e.target.value)}
                    className="w-4 h-4 border-2 border-[#C72030] focus:ring-[#C72030] text-[#C72030]"
                  />
                  <label htmlFor="critical-no" className="text-sm font-medium cursor-pointer">No</label>
                </div>
              </div>
            </div>
          </div>

          {/* Meter Details Section */}
          <div>
            <h3 className="font-semibold text-sm mb-6 text-red-700">METER DETAILS</h3>
            
            {/* Responsive grid for meter category options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 mb-6">
              {getMeterCategoryOptions().map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 lg:p-2">
                  <input
                    type="radio"
                    id={option.value}
                    name="meterCategory"
                    value={option.value}
                    checked={meterCategoryType === option.value}
                    onChange={(e) => handleMeterCategoryChange(e.target.value)}
                    className="w-4 h-4 border-2 border-[#C72030] focus:ring-[#C72030] text-[#C72030]"
                  />
                  <div className="flex items-center space-x-2">
                    <div className="text-gray-600">
                      {option.icon}
                    </div>
                    <label htmlFor={option.value} className="text-sm font-medium cursor-pointer">
                      {option.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Subcategory options for Board and Renewable */}
            {(meterCategoryType === 'board' || meterCategoryType === 'renewable' || meterCategoryType === 'fresh-water') && getSubCategoryOptions().length > 0 && (
              <div className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {getSubCategoryOptions().map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 p-3 lg:p-2">
                      <input
                        type="radio"
                        id={`sub-${option.value}`}
                        name="subMeterCategory"
                        value={option.value}
                        checked={subCategoryType === option.value}
                        onChange={(e) => setSubCategoryType(e.target.value)}
                        className="w-4 h-4 border-2 border-[#C72030] focus:ring-[#C72030] text-[#C72030]"
                      />
                      <div className="flex items-center space-x-2">
                        <div className="text-gray-600">
                          {option.icon}
                        </div>
                        <label htmlFor={`sub-${option.value}`} className="text-sm font-medium cursor-pointer">
                          {option.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
