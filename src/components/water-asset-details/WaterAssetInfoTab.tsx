
import React from 'react';

interface WaterAssetInfoTabProps {
  assetId: string;
}

export const WaterAssetInfoTab = ({ assetId }: WaterAssetInfoTabProps) => {
  return (
    <div className="space-y-8">
      {/* Location Details */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
            <span className="text-white text-xs">9</span>
          </div>
          <h3 className="text-lg font-semibold text-[#C72030] uppercase">Location Details</h3>
        </div>

        <div className="grid grid-cols-6 gap-8 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#C72030] rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xs">●</span>
            </div>
            <div className="text-xs text-gray-600 mb-1">Site</div>
            <div className="font-medium text-sm">Located Site 1</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#C72030] rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xs">●</span>
            </div>
            <div className="text-xs text-gray-600 mb-1">Building</div>
            <div className="font-medium text-sm">Sarova</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#C72030] rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xs">●</span>
            </div>
            <div className="text-xs text-gray-600 mb-1">Wing</div>
            <div className="font-medium text-sm">SW1</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#C72030] rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xs">●</span>
            </div>
            <div className="text-xs text-gray-600 mb-1">Floor</div>
            <div className="font-medium text-sm">FW1</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#C72030] rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xs">●</span>
            </div>
            <div className="text-xs text-gray-600 mb-1">Area</div>
            <div className="font-medium text-sm">AW1</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#C72030] rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xs">●</span>
            </div>
            <div className="text-xs text-gray-600 mb-1">Room</div>
            <div className="font-medium text-sm">NA</div>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-xs">📱</span>
            </div>
            <h3 className="text-lg font-semibold text-[#C72030] uppercase">QR Code</h3>
          </div>
        </div>

        <div className="text-right">
          <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-2">
            <div className="w-16 h-16 bg-white rounded flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-400 rounded"></div>
            </div>
          </div>
          <button className="bg-[#C72030] text-white px-4 py-1 rounded text-sm">
            download
          </button>
        </div>
      </div>

      {/* Asset Details */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
            <span className="text-white text-xs">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-[#C72030] uppercase">Asset Details</h3>
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Customer Name.</span>
            <span className="font-medium">:</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Asset Name.</span>
            <span className="font-medium">: Borewell SubMeter</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Asset Number.</span>
            <span className="font-medium">: 505</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Asset Code.</span>
            <span className="font-medium">: 83898732f107c5df0121</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Asset Type.</span>
            <span className="font-medium">: Comprehensive</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Model Number.</span>
            <span className="font-medium">: 7805</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Serial No.</span>
            <span className="font-medium">: 540</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Manufacturer</span>
            <span className="font-medium">:</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location Type</span>
            <span className="font-medium">: NA</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Meter Type</span>
            <span className="font-medium">: SubMeter</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Meter Category Name</span>
            <span className="font-medium">: Borewell</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">External Status</span>
            <span className="font-medium">:</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Purchased on</span>
            <span className="font-medium">: 01/08/2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date Of Installation</span>
            <span className="font-medium">: NA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Breakdown Date</span>
            <span className="font-medium">: NA</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Created On</span>
            <span className="font-medium">: 17/05/2023 11:58 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Capacity</span>
            <span className="font-medium">: litre/hr</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Purchase Cost</span>
            <span className="font-medium">: {localStorage.getItem('currency')}80000.0</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Group</span>
            <span className="font-medium">: Electrical</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Equipment Id</span>
            <span className="font-medium">:</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Subgroup</span>
            <span className="font-medium">: Back Up Source</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Critical</span>
            <span className="font-medium">: No</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Meter Applicable</span>
            <span className="font-medium">: Yes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Meter Category</span>
            <span className="font-medium">: Water meter</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Updated On</span>
            <span className="font-medium">: 13/08/2024 4:17 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Comments</span>
            <span className="font-medium">:</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Description</span>
            <span className="font-medium">:</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Consumer No.</span>
            <span className="font-medium">: 53226444</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Cost Of Repair</span>
            <span className="font-medium">: 0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Life Left (yyyy mm dd)</span>
            <span className="font-medium">:</span>
          </div>
        </div>
      </div>

      {/* Warranty Details & Supplier Contact Details */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🛡️</span>
            </div>
            <h3 className="text-lg font-semibold text-[#C72030] uppercase">Warranty Details</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Under Warranty</span>
              <span className="font-medium">: No</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Warranty Expires on</span>
              <span className="font-medium">: NA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Commissioning Date</span>
              <span className="font-medium">: NA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Warranty Start Date</span>
              <span className="font-medium">: NA</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-xs">📞</span>
            </div>
            <h3 className="text-lg font-semibold text-[#C72030] uppercase">Supplier Contact Details</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Name</span>
              <span className="font-medium">: NA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mobile Number</span>
              <span className="font-medium">: NA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-medium">: NA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">PAN Number</span>
              <span className="font-medium">: NA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">GSTIN Number</span>
              <span className="font-medium">: NA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Consumption Asset Measures */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
            <span className="text-white text-xs">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-[#C72030] uppercase">Consumption Asset Measures</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Id</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Meter Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Unit Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Min Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Max Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Alert Below Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Alert Above Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Multiplier Factor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">40646</td>
                <td className="px-4 py-3 text-sm text-gray-900">kl</td>
                <td className="px-4 py-3 text-sm text-gray-900">Water meter</td>
                <td className="px-4 py-3 text-sm text-gray-900">kl</td>
                <td className="px-4 py-3 text-sm text-gray-900"></td>
                <td className="px-4 py-3 text-sm text-gray-900"></td>
                <td className="px-4 py-3 text-sm text-gray-900"></td>
                <td className="px-4 py-3 text-sm text-gray-900"></td>
                <td className="px-4 py-3 text-sm text-gray-900"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
