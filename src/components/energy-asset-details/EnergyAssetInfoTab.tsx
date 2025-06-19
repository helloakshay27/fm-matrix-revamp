
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface EnergyAssetInfoTabProps {
  assetId: string;
}

export const EnergyAssetInfoTab: React.FC<EnergyAssetInfoTabProps> = ({ assetId }) => {
  return (
    <div className="space-y-8">
      {/* Location Details */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
          <h3 className="text-lg font-semibold text-orange-500 uppercase">Location Details</h3>
        </div>
        
        {/* Location Timeline */}
        <div className="flex items-center justify-between mb-6 relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-orange-500"></div>
          {['Site', 'Building', 'Wing', 'Floor', 'Area', 'Room'].map((item, index) => (
            <div key={item} className="flex flex-col items-center relative z-10">
              <div className="w-3 h-3 bg-orange-500 rounded-full mb-2"></div>
              <span className="text-sm font-medium text-gray-700">{item}</span>
              <span className="text-xs text-gray-500">
                {item === 'Site' ? 'Lockated Site 1' : 
                 item === 'Building' ? 'Tower 101' : 
                 item === 'Wing' ? 'A Wing' :
                 item === 'Area' ? 'Common' : 'NA'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Asset Details */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
            <h3 className="text-lg font-semibold text-orange-500 uppercase">Asset Details</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Customer Name</label>
              <p className="font-medium">-</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Asset Number</label>
              <p className="font-medium">DIESEL GENERATOR</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Model Number</label>
              <p className="font-medium">ABC</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Location Type</label>
              <p className="font-medium">N/A</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Ethical Status</label>
              <p className="font-medium">-</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Breakdown Date</label>
              <p className="font-medium">N/A</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Purchase Cost</label>
              <p className="font-medium">₹1000000</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Subgroup</label>
              <p className="font-medium">DG Set</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Meter Category</label>
              <p className="font-medium">NA</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Description</label>
              <p className="font-medium">-</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Total Cost Of Repair</label>
              <p className="font-medium">₹560</p>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Asset Name</label>
              <p className="font-medium">DIESEL GENERATOR</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Asset Code</label>
              <p className="font-medium">865ae576f09cde4b4afb</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Serial No.</label>
              <p className="font-medium">ACEF12</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Meter Type</label>
              <p className="font-medium">ParentMeter</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Purchased on</label>
              <p className="font-medium">02/02/2025</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Created On</label>
              <p className="font-medium">03/02/2025 5:11 PM</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Group</label>
              <p className="font-medium">Electrical System</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Critical</label>
              <p className="font-medium">No</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Updated On</label>
              <p className="font-medium">13/06/2025 10:52 AM</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Consumer No.</label>
              <p className="font-medium">A1&2C3</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Meter Type</label>
              <p className="font-medium">Non-Comprehensive</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Asset Type</label>
              <p className="font-medium">-</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Manufactured</label>
              <p className="font-medium">-</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Meter Category Name</label>
              <p className="font-medium">DG</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Date Of Installation</label>
              <p className="font-medium">N/A</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Capacity</label>
              <p className="font-medium">1000 J</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Equipment Id</label>
              <p className="font-medium">123456</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Meter Applicable</label>
              <p className="font-medium">Yes</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Comments</label>
              <p className="font-medium">-</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Life Left (yy:mm:dd)</label>
              <p className="font-medium">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warranty Details */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
          <h3 className="text-lg font-semibold text-orange-500 uppercase">Warranty Details</h3>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Under Warranty</span>
              <span className="font-medium">Yes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Commissioning Date</span>
              <span className="font-medium">NA</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Warranty Expires on</span>
              <span className="font-medium">NA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Warranty Start Date</span>
              <span className="font-medium">NA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Supplier Contact Details */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">5</div>
          <h3 className="text-lg font-semibold text-orange-500 uppercase">Supplier Contact Details</h3>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Name</span>
              <span className="font-medium">NA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Email</span>
              <span className="font-medium">NA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">GSTIN Number</span>
              <span className="font-medium">NA</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Mobile Number</span>
              <span className="font-medium">NA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">PAN Number</span>
              <span className="font-medium">NA</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">🔲</div>
            <h3 className="text-lg font-semibold text-orange-500 uppercase">QR Code</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            download
          </Button>
        </div>
        <div className="w-32 h-32 border-2 border-gray-300 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">QR Code</span>
        </div>
      </div>
    </div>
  );
};
