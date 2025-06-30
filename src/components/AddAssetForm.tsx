import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface AddAssetFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAssetForm: React.FC<AddAssetFormProps> = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    asset: true,
    warranty: true,
    meterCategory: true,
    consumption: false,
    nonConsumption: false,
    attachments: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#D5DbDB] p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">NEW ASSET</h2>
            <p className="text-[#1a1a1a] opacity-70">Asset List &gt; Create New Asset</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f6f4ee] rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-[#1a1a1a]" />
          </button>
        </div>

        <div className="p-6">
          {/* Location Details Section */}
          <div className="mb-6">
            <div 
              className="flex items-center gap-3 mb-4 cursor-pointer"
              onClick={() => toggleSection('location')}
            >
              <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-[#C72030]">LOCATION DETAILS</h3>
              {expandedSections.location ? <ChevronUp className="w-5 h-5 text-[#C72030]" /> : <ChevronDown className="w-5 h-5 text-[#C72030]" />}
            </div>
            
            {expandedSections.location && (
              <div className="bg-[#f6f4ee] p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Site*</label>
                    <select className="w-full p-3 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent">
                      <option>Select Site</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Building</label>
                    <select className="w-full p-3 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent">
                      <option>Select Building</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Wing</label>
                    <select className="w-full p-3 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent">
                      <option>Select Wing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Area</label>
                    <select className="w-full p-3 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent">
                      <option>Select Area</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Floor</label>
                    <select className="w-full p-3 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent">
                      <option>Select Floor</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Room</label>
                    <select className="w-full p-3 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent">
                      <option>Select Room</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Asset Details Section */}
          <div className="mb-6">
            <div 
              className="flex items-center gap-3 mb-4 cursor-pointer"
              onClick={() => toggleSection('asset')}
            >
              <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-[#C72030]">ASSET DETAILS</h3>
              {expandedSections.asset ? <ChevronUp className="w-5 h-5 text-[#C72030]" /> : <ChevronDown className="w-5 h-5 text-[#C72030]" />}
            </div>
            
            {expandedSections.asset && (
              <div className="bg-[#f6f4ee] p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Input label="Asset Name*" placeholder="Enter Text" />
                  </div>
                  <div>
                    <Input label="Asset No.*" placeholder="Enter Number" />
                  </div>
                  <div>
                    <Input label="Equipment ID*" placeholder="Enter Number" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Input label="Model No." placeholder="Enter Number" />
                  </div>
                  <div>
                    <Input label="Serial No." placeholder="Enter Number" />
                  </div>
                  <div>
                    <Input label="Consumer No." placeholder="Enter Number" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Input label="Purchase Cost*" placeholder="Enter Numeric value" />
                  </div>
                  <div>
                    <Input label="Capacity" placeholder="Enter Text" />
                  </div>
                  <div>
                    <Input label="Unit" placeholder="Enter Text" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Group*</label>
                    <select className="w-full p-3 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent">
                      <option>Select Group</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Subgroup*</label>
                    <select className="w-full p-3 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent">
                      <option>Select SubGroup</option>
                    </select>
                  </div>
                  <div>
                    <Input label="Purchased ON Date" type="date" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Input label="Expiry date" type="date" />
                  </div>
                  <div>
                    <Input label="Manufacturer" placeholder="Enter Text" />
                  </div>
                </div>

                {/* Radio Button Groups */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-3">Location Type</label>
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input type="radio" name="locationType" value="commonArea" className="mr-2" />
                        <span className="text-[#1a1a1a]">Common Area</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="locationType" value="customer" className="mr-2" />
                        <span className="text-[#1a1a1a]">Customer</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="locationType" value="na" className="mr-2" />
                        <span className="text-[#1a1a1a]">NA</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-3">Asset Type</label>
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input type="radio" name="assetType" value="parent" className="mr-2" />
                        <span className="text-[#1a1a1a]">Parent</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="assetType" value="sub" className="mr-2" />
                        <span className="text-[#1a1a1a]">Sub</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-3">Status</label>
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input type="radio" name="status" value="inUse" className="mr-2" />
                        <span className="text-[#1a1a1a]">In Use</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="status" value="breakdown" className="mr-2" />
                        <span className="text-[#1a1a1a]">Breakdown</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-3">Critical:</label>
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input type="radio" name="critical" value="yes" className="mr-2" />
                        <span className="text-[#1a1a1a]">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="critical" value="no" className="mr-2" />
                        <span className="text-[#1a1a1a]">No</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-[#1a1a1a]">Meter Applicable</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Warranty Details Section */}
          <div className="mb-6">
            <div 
              className="flex items-center gap-3 mb-4 cursor-pointer"
              onClick={() => toggleSection('warranty')}
            >
              <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-[#C72030]">Warranty Details</h3>
              {expandedSections.warranty ? <ChevronUp className="w-5 h-5 text-[#C72030]" /> : <ChevronDown className="w-5 h-5 text-[#C72030]" />}
            </div>
            
            {expandedSections.warranty && (
              <div className="bg-[#f6f4ee] p-6 rounded-lg">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-3">Under Warranty:</label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input type="radio" name="underWarranty" value="yes" className="mr-2" />
                      <span className="text-[#1a1a1a]">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="underWarranty" value="no" className="mr-2" />
                      <span className="text-[#1a1a1a]">No</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Input label="Warranty Start Date" type="date" />
                  </div>
                  <div>
                    <Input label="Warranty expires on" type="date" />
                  </div>
                  <div>
                    <Input label="Commissioning Date" type="date" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Meter Category Type Section */}
          <div className="mb-6">
            <div 
              className="flex items-center gap-3 mb-4 cursor-pointer"
              onClick={() => toggleSection('meterCategory')}
            >
              <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-[#C72030]">Meter Category Type</h3>
              {expandedSections.meterCategory ? <ChevronUp className="w-5 h-5 text-[#C72030]" /> : <ChevronDown className="w-5 h-5 text-[#C72030]" />}
            </div>
            
            {expandedSections.meterCategory && (
              <div className="bg-[#f6f4ee] p-6 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <label className="flex flex-col items-center p-4 border-2 border-[#D5DbDB] rounded-lg hover:border-[#C72030] cursor-pointer transition-colors">
                    <input type="radio" name="meterCategory" value="board" className="mb-2" />
                    <span className="text-2xl mb-2">📋</span>
                    <span className="text-sm text-[#1a1a1a]">Board</span>
                  </label>
                  <label className="flex flex-col items-center p-4 border-2 border-[#D5DbDB] rounded-lg hover:border-[#C72030] cursor-pointer transition-colors">
                    <input type="radio" name="meterCategory" value="dg" className="mb-2" />
                    <span className="text-2xl mb-2">⚡</span>
                    <span className="text-sm text-[#1a1a1a]">DG</span>
                  </label>
                  <label className="flex flex-col items-center p-4 border-2 border-[#D5DbDB] rounded-lg hover:border-[#C72030] cursor-pointer transition-colors">
                    <input type="radio" name="meterCategory" value="renewable" className="mb-2" />
                    <span className="text-2xl mb-2">🔄</span>
                    <span className="text-sm text-[#1a1a1a]">Renewable</span>
                  </label>
                  <label className="flex flex-col items-center p-4 border-2 border-[#D5DbDB] rounded-lg hover:border-[#C72030] cursor-pointer transition-colors">
                    <input type="radio" name="meterCategory" value="freshWater" className="mb-2" />
                    <span className="text-2xl mb-2">💧</span>
                    <span className="text-sm text-[#1a1a1a]">Fresh Water</span>
                  </label>
                  <label className="flex flex-col items-center p-4 border-2 border-[#D5DbDB] rounded-lg hover:border-[#C72030] cursor-pointer transition-colors">
                    <input type="radio" name="meterCategory" value="recycled" className="mb-2" />
                    <span className="text-2xl mb-2">♻️</span>
                    <span className="text-sm text-[#1a1a1a]">Recycled</span>
                  </label>
                  <label className="flex flex-col items-center p-4 border-2 border-[#D5DbDB] rounded-lg hover:border-[#C72030] cursor-pointer transition-colors">
                    <input type="radio" name="meterCategory" value="iexGdam" className="mb-2" />
                    <span className="text-2xl mb-2">🏭</span>
                    <span className="text-sm text-[#1a1a1a]">IEX-GDAM</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Sections */}
          <div className="space-y-4 mb-6">
            {/* Consumption Asset Measure */}
            <div className="border border-[#D5DbDB] rounded-lg">
              <div 
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#f6f4ee]"
                onClick={() => toggleSection('consumption')}
              >
                <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  5+
                </div>
                <h3 className="text-lg font-semibold text-[#C72030] flex-1">CONSUMPTION ASSET MEASURE</h3>
                {expandedSections.consumption ? <ChevronUp className="w-5 h-5 text-[#C72030]" /> : <ChevronDown className="w-5 h-5 text-[#C72030]" />}
              </div>
              {expandedSections.consumption && (
                <div className="p-4 border-t border-[#D5DbDB]">
                  <p className="text-[#1a1a1a]">Consumption asset measure content goes here...</p>
                </div>
              )}
            </div>

            {/* Non Consumption Asset Measure */}
            <div className="border border-[#D5DbDB] rounded-lg">
              <div 
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#f6f4ee]"
                onClick={() => toggleSection('nonConsumption')}
              >
                <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  6+
                </div>
                <h3 className="text-lg font-semibold text-[#C72030] flex-1">NON CONSUMPTION ASSET MEASURE</h3>
                {expandedSections.nonConsumption ? <ChevronUp className="w-5 h-5 text-[#C72030]" /> : <ChevronDown className="w-5 h-5 text-[#C72030]" />}
              </div>
              {expandedSections.nonConsumption && (
                <div className="p-4 border-t border-[#D5DbDB]">
                  <p className="text-[#1a1a1a]">Non-consumption asset measure content goes here...</p>
                </div>
              )}
            </div>

            {/* Attachments */}
            <div className="border border-[#D5DbDB] rounded-lg">
              <div 
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#f6f4ee]"
                onClick={() => toggleSection('attachments')}
              >
                <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  📎
                </div>
                <h3 className="text-lg font-semibold text-[#C72030] flex-1">ATTACHMENTS</h3>
                {expandedSections.attachments ? <ChevronUp className="w-5 h-5 text-[#C72030]" /> : <ChevronDown className="w-5 h-5 text-[#C72030]" />}
              </div>
              {expandedSections.attachments && (
                <div className="p-4 border-t border-[#D5DbDB]">
                  <div className="border-2 border-dashed border-[#D5DbDB] rounded-lg p-6 text-center">
                    <p className="text-[#1a1a1a] opacity-70">Drag and drop files here or click to browse</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6 border-t border-[#D5DbDB]">
            <button className="px-8 py-3 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors">
              Save & Show Details
            </button>
            <button className="px-8 py-3 bg-[#C72030] text-white rounded-lg hover:bg-[#a61b28] transition-colors">
              Save & Create New Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
