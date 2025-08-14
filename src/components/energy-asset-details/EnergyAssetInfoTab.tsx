
import React from 'react';

interface EnergyAssetInfoTabProps {
  assetId: string;
}

export const EnergyAssetInfoTab = ({ assetId }: EnergyAssetInfoTabProps) => {
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
            <div className="font-medium text-sm">Tower 101</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#C72030] rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xs">●</span>
            </div>
            <div className="text-xs text-gray-600 mb-1">Wing</div>
            <div className="font-medium text-sm">A Wing</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#C72030] rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xs">●</span>
            </div>
            <div className="text-xs text-gray-600 mb-1">Floor</div>
            <div className="font-medium text-sm">NA</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#C72030] rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xs">●</span>
            </div>
            <div className="text-xs text-gray-600 mb-1">Area</div>
            <div className="font-medium text-sm">Common</div>
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
            <span className="font-medium">: DIESEL GENERATOR ParentMeter</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Asset Number.</span>
            <span className="font-medium">: 246810</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Asset Code.</span>
            <span className="font-medium">: 865ae67609cde4b4afb</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Asset Type.</span>
            <span className="font-medium">: Non-Comprehensive</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Model Number.</span>
            <span className="font-medium">: ABC</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Serial No.</span>
            <span className="font-medium">: ACEF12</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Manufacturer</span>
            <span className="font-medium">:</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location Type</span>
            <span className="font-medium">: N/A</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Meter Type</span>
            <span className="font-medium">: ParentMeter</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Meter Category Name</span>
            <span className="font-medium">: DG</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Exteral Status</span>
            <span className="font-medium">:</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Purchased on</span>
            <span className="font-medium">: 02/02/2025</span>
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
            <span className="font-medium">: 03/02/2025 5:11 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Capacity</span>
            <span className="font-medium">: 1000 1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Purchase Cost</span>
            <span className="font-medium">: {localStorage.getItem('currency')}1000000.0</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Group</span>
            <span className="font-medium">: Electrical System</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Equipment Id</span>
            <span className="font-medium">: 123456</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Subgroup</span>
            <span className="font-medium">: DG Set</span>
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
            <span className="font-medium">: NA</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Updated On</span>
            <span className="font-medium">: 13/06/2025 10:52 AM</span>
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
            <span className="font-medium">: A1B2C3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Cost Of Repair</span>
            <span className="font-medium">: 560</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Life Left (yyyy mm dd)</span>
            <span className="font-medium">:</span>
          </div>
        </div>
      </div>

      {/* Warranty Details */}
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
              <span className="font-medium">: Yes</span>
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
    </div>
  );
};
