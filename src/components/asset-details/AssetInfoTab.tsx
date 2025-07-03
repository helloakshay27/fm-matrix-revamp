
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface AssetInfoTabProps {
  assetId: string;
}

export const AssetInfoTab: React.FC<AssetInfoTabProps> = ({ assetId }) => {
  return (
    <div className="space-y-8">
      {/* Location Details */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
          <h3 className="text-lg font-semibold text-[#C72030] uppercase">Location Details</h3>
        </div>
        
        {/* Location Timeline */}
       <div className="flex items-center justify-between mb-6 relative z-[1]">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#C72030]"></div>
          {['Site', 'Building', 'Wing', 'Floor', 'Area', 'Room'].map((item, index) => (
            <div key={item} className="flex flex-col items-center relative z-10">
              <div className="w-3 h-3 bg-[#C72030] rounded-full mb-2"></div>
              <span className="text-sm font-medium text-gray-700">{item}</span>
              <span className="text-xs text-gray-500">
                {item === 'Site' ? 'Loccated' : item === 'Building' ? 'sebc' : 'NA'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Asset Details */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
            <h3 className="text-lg font-semibold text-[#C72030] uppercase">Asset Details</h3>
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
              <p className="font-medium">sdcsdc</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Model Number</label>
              <p className="font-medium">tested</p>
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
              <p className="font-medium">TBD</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Subgroup</label>
              <p className="font-medium">Electric Meter</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Meter Category</label>
              <p className="font-medium">Energy Meter</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Description</label>
              <p className="font-medium">-</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Life Left (yy:mm:dd)</label>
              <p className="font-medium">-</p>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Asset Name</label>
              <p className="font-medium">sdcsdc</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Asset Code</label>
              <p className="font-medium">026dd95aa50be420318ea</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Serial No.</label>
              <p className="font-medium">sdcsdc</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Meter Type</label>
              <p className="font-medium">-</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Purchased on</label>
              <p className="font-medium">26/05/2024</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Created On</label>
              <p className="font-medium">28/02/2025 1:00 PM</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Group</label>
              <p className="font-medium">Electrical</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Critical</label>
              <p className="font-medium">No</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Updated On</label>
              <p className="font-medium">29/04/2025 1:28 PM</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Consumer No.</label>
              <p className="font-medium">-</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Meter Type</label>
              <p className="font-medium">Adam Electric Meter Parent/Meter</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Asset Type</label>
              <p className="font-medium">Comprehensive</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Manufactured</label>
              <p className="font-medium">-</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Meter Category Name</label>
              <p className="font-medium">Transformer</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Date Of Installation</label>
              <p className="font-medium">N/A</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Capacity</label>
              <p className="font-medium">10 10</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Equipment Id</label>
              <p className="font-medium">-</p>
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
              <label className="text-sm text-gray-600">Total Cost Of Repair</label>
              <p className="font-medium">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code and Warranty */}
      <div className="grid grid-cols-2 gap-8">
        {/* QR Code */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
              <h3 className="text-lg font-semibold text-[#C72030] uppercase">QR Code</h3>
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

        {/* Warranty Details */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
            <h3 className="text-lg font-semibold text-[#C72030] uppercase">Warranty Details</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Under Warranty</span>
              <span className="font-medium">No</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Commissioning Date</span>
              <span className="font-medium">17/03/2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Warranty Expires on</span>
              <span className="font-medium">10/03/2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Warranty Start Date</span>
              <span className="font-medium">N/A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Supplier Contact Details */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs font-bold">5</div>
          <h3 className="text-lg font-semibold text-[#C72030] uppercase">Supplier Contact Details</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Name</span>
            <span className="font-medium">Reliance Digital</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Mobile Number</span>
            <span className="font-medium">9850264875</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Email</span>
            <span className="font-medium">rdi@mail.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">PAN Number</span>
            <span className="font-medium">N/A</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">GSTIN Number</span>
            <span className="font-medium">N/A</span>
          </div>
        </div>
      </div>
    </div>
  );
};
