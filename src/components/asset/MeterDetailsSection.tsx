
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
          { value: 'ht-panel', label: 'HT Panel', icon: <Zap className="w-6 h-6" /> },
          { value: 'vcb', label: 'VCB', icon: <Package className="w-6 h-6" /> },
          { value: 'transformer', label: 'Transformer', icon: <Shield className="w-6 h-6" /> },
          { value: 'lt-panel', label: 'LT Panel', icon: <Activity className="w-6 h-6" /> }
        ];
      case 'renewable':
        return [
          { value: 'solar', label: 'Solar', icon: <Sun className="w-6 h-6" /> },
          { value: 'bio-methanol', label: 'Bio Methanol', icon: <Droplet className="w-6 h-6" /> },
          { value: 'wind', label: 'Wind', icon: <Activity className="w-6 h-6" /> }
        ];
      case 'fresh-water':
        return [
          { value: 'source', label: 'Source (Input)', icon: <Droplet className="w-6 h-6" /> },
          { value: 'destination', label: 'Destination (Output)', icon: <Droplet className="w-6 h-6" /> }
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
        <div className="p-4 sm:p-6">
          {/* Meter Type Section */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="font-medium text-red-700">Meter Type</span>
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="meter-parent"
                    name="meterType"
                    value="parent"
                    checked={meterType === 'parent'}
                    onChange={(e) => setMeterType(e.target.value)}
                    className="w-4 h-4 border-gray-300 focus:ring-[#C72030] text-[#C72030]"
                  />
                  <label htmlFor="meter-parent" className="text-sm">Parent</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="meter-sub"
                    name="meterType"
                    value="sub"
                    checked={meterType === 'sub'}
                    onChange={(e) => setMeterType(e.target.value)}
                    className="w-4 h-4 border-gray-300 focus:ring-[#C72030] text-[#C72030]"
                  />
                  <label htmlFor="meter-sub" className="text-sm">Sub</label>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Section */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <span className="font-medium text-red-700">CRITICAL</span>
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="critical-yes"
                    name="critical"
                    value="yes"
                    checked={critical === 'yes'}
                    onChange={(e) => setCritical(e.target.value)}
                    className="w-4 h-4 border-gray-300 focus:ring-[#C72030] text-[#C72030]"
                  />
                  <label htmlFor="critical-yes" className="text-sm">Yes</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="critical-no"
                    name="critical"
                    value="no"
                    checked={critical === 'no'}
                    onChange={(e) => setCritical(e.target.value)}
                    className="w-4 h-4 border-gray-300 focus:ring-[#C72030] text-[#C72030]"
                  />
                  <label htmlFor="critical-no" className="text-sm">No</label>
                </div>
              </div>
            </div>
          </div>

          {/* Meter Details Section */}
          <div className="p-4 rounded-lg bg-[#f6f4ee]">
            <h3 className="font-semibold text-sm mb-4 text-red-700">METER DETAILS</h3>
            
            {/* Responsive grid for meter category options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4">
              {getMeterCategoryOptions().map((option) => (
                <div key={option.value} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-center space-x-2 px-3 py-3">
                    <div className="text-gray-600">
                      {option.icon}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={option.value}
                        name="meterCategory"
                        value={option.value}
                        checked={meterCategoryType === option.value}
                        onChange={(e) => handleMeterCategoryChange(e.target.value)}
                        className="w-4 h-4 border-gray-300 focus:ring-[#C72030] text-[#C72030]"
                      />
                      <label htmlFor={option.value} className="text-xs sm:text-sm cursor-pointer font-medium text-center">
                        {option.label}
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subcategory options for Board and Renewable */}
            {(meterCategoryType === 'board' || meterCategoryType === 'renewable') && getSubCategoryOptions().length > 0 && (
              <div className="mt-6">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {getSubCategoryOptions().map((option) => (
                    <div key={option.value} className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-gray-600">
                          {option.icon}
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`sub-${option.value}`}
                            name="subMeterCategory"
                            value={option.value}
                            checked={subCategoryType === option.value}
                            onChange={(e) => setSubCategoryType(e.target.value)}
                            className="w-4 h-4 border-gray-300 focus:ring-[#C72030] text-[#C72030]"
                          />
                          <label htmlFor={`sub-${option.value}`} className="text-xs sm:text-sm cursor-pointer font-medium text-center">
                            {option.label}
                          </label>
                        </div>
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
