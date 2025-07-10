import React from 'react';
import { MapPin, QrCode, Settings, CreditCard, UserCheck, TrendingUp, User } from 'lucide-react';

interface AssetInfoTabProps {
  assetId: string;
}

export const AssetInfoTab = ({ assetId }: AssetInfoTabProps) => {
  return (
    <div className="space-y-6 min-h-full ">
      <div className="flex gap-6">
        {/* Location Details - 80% width */}
        <div className="w-4/5 bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C72030' }}>
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold uppercase" style={{ color: '#C72030' }}>Location Details</h3>
          </div>

          {/* Location Timeline */}
          <div className="flex-1">
            <div className="relative flex items-center">
              {/* Site */}
              <div className="flex flex-col items-center relative">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#C72030' }}></div>
                <div className="text-xs text-gray-500 mt-2 mb-1">Site</div>
                <div className="text-sm font-medium text-center">Haven Infoline</div>
              </div>
              
              {/* Connecting line */}
              <div className="flex-1 h-px mx-6" style={{ backgroundColor: '#C72030' }}></div>
              
              {/* Building */}
              <div className="flex flex-col items-center relative">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#C72030' }}></div>
                <div className="text-xs text-gray-500 mt-2 mb-1">Building</div>
                <div className="text-sm font-medium text-center">Jyoti Tower</div>
              </div>
              
              {/* Connecting line */}
              <div className="flex-1 h-px mx-6" style={{ backgroundColor: '#C72030' }}></div>
              
              {/* Wing */}
              <div className="flex flex-col items-center relative">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#C72030' }}></div>
                <div className="text-xs text-gray-500 mt-2 mb-1">Wing</div>
                <div className="text-sm font-medium text-center">J - Wing</div>
              </div>
              
              {/* Connecting line */}
              <div className="flex-1 h-px mx-6" style={{ backgroundColor: '#C72030' }}></div>
              
              {/* Floor */}
              <div className="flex flex-col items-center relative">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#C72030' }}></div>
                <div className="text-xs text-gray-500 mt-2 mb-1">Floor</div>
                <div className="text-sm font-medium text-center">02<sup>nd</sup></div>
              </div>
              
              {/* Connecting line */}
              <div className="flex-1 h-px mx-6" style={{ backgroundColor: '#C72030' }}></div>
              
              {/* Area */}
              <div className="flex flex-col items-center relative">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#C72030' }}></div>
                <div className="text-xs text-gray-500 mt-2 mb-1">Area</div>
                <div className="text-sm font-medium text-center">East</div>
              </div>
              
              {/* Connecting line */}
              <div className="flex-1 h-px mx-6" style={{ backgroundColor: '#C72030' }}></div>
              
              {/* Room */}
              <div className="flex flex-col items-center relative">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#C72030' }}></div>
                <div className="text-xs text-gray-500 mt-2 mb-1">Room</div>
                <div className="text-sm font-medium text-center">R 202</div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code - 20% width */}
        <div className="w-1/5 bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C72030' }}>
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold uppercase" style={{ color: '#C72030' }}>QR Code</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-white border border-gray-300 rounded flex items-center justify-center mb-3">
              <div className="w-28 h-28 bg-black flex items-center justify-center">
                <div className="w-24 h-24 bg-white grid grid-cols-8 gap-px p-1">
                  {/* QR Code Pattern */}
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-full h-full ${
                        [0, 1, 2, 5, 6, 7, 8, 14, 16, 23, 24, 30, 32, 39, 40, 41, 42, 45, 46, 47, 48, 49, 50, 53, 54, 55, 56, 62, 63].includes(i) 
                          ? 'bg-black' 
                          : 'bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <button className="bg-gray-600 text-white px-4 py-1 rounded text-sm hover:bg-gray-700 flex items-center gap-1">
              📄
            </button>
          </div>
        </div>
      </div>

      {/* Asset Details - Full Width */}
      <div className="bg-white rounded-lg p-6 shadow-sm border-2">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C72030' }}>
            <Settings className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold uppercase" style={{ color: '#C72030' }}>Asset Details</h3>
        </div>

        <div className="space-y-8">
          {/* Main Asset Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            <div>
              <div className="text-sm text-gray-500 mb-2">Asset No.</div>
              <div className="font-medium text-gray-800">Asset02</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">Model No.</div>
              <div className="font-medium text-gray-800">330n</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">Serial No.</div>
              <div className="font-medium text-gray-800">1234567889</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">Manufacturer</div>
              <div className="font-medium text-gray-800">Dell</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">Group</div>
              <div className="font-medium text-gray-800">IT Devices</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            <div>
              <div className="text-sm text-gray-500 mb-2">Sub Group</div>
              <div className="font-medium text-gray-800">Laptop</div>
            </div>
          </div>

          {/* System Details Section */}
          <div className="border-t pt-6">
            <div className="text-base font-semibold mb-6" style={{ color: '#C72030' }}>System Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              <div>
                <div className="text-sm text-gray-500 mb-2">OS</div>
                <div className="font-medium text-gray-800">Windows 10 Home</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">Total Memory</div>
                <div className="font-medium text-gray-800">4 GB</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">Processor</div>
                <div className="font-medium text-gray-800">Ryzen 3 Dual Core</div>
              </div>
            </div>
          </div>

          {/* Hard Disk Details Section */}
          <div className="border-t pt-6">
            <div className="text-base font-semibold mb-6" style={{ color: '#C72030' }}>Hard Disk Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              <div>
                <div className="text-sm text-gray-500 mb-2">Model</div>
                <div className="font-medium text-gray-800">#12345ba283</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">Serial No.</div>
                <div className="font-medium text-gray-800">#12345ba283</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">Capacity</div>
                <div className="font-medium text-gray-800">1 TB</div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              <div>
                <div className="text-sm text-gray-500 mb-2">Commissioning Date</div>
                <div className="font-medium text-gray-800">01/09/2019</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">Allocation based on</div>
                <div className="font-medium text-gray-800">Department</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">Department</div>
                <div className="font-medium text-gray-800">Technical, Finance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Details */}
        <div className="bg-white rounded-lg p-6 shadow-sm border-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C72030' }}>
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold uppercase" style={{ color: '#C72030' }}>Purchase Details</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Purchase Cost</div>
                <div className="font-medium">₹ 100000</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Current Date Cost</div>
                <div className="font-medium">₹ 52000 <span className="text-sm text-gray-500">(Straight Line)</span></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Purchase Date</div>
                <div className="font-medium">01/02/2019</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Under Warranty</div>
                <div className="font-medium">Yes</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Period</div>
                <div className="font-medium">2 years</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Warranty Expires On</div>
                <div className="font-medium">10/02/2022</div>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Loaned */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C72030' }}>
              <UserCheck className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold uppercase" style={{ color: '#C72030' }}>Asset Loaned</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Vendor</div>
                <div className="font-medium">Croma Electronics</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Agreement From</div>
                <div className="font-medium">01/02/2019</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Agreement To</div>
                <div className="font-medium">01/02/2021</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movement Details */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C72030' }}>
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold uppercase" style={{ color: '#C72030' }}>Movement Details</h3>
          </div>

          <div className="space-y-6">
            {/* Movement Timeline */}
            <div className="relative">
              <div className="flex items-center justify-between">
                {/* From Location */}
                <div className="flex items-start flex-col">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-5 h-5" style={{ color: '#C72030' }} />
                  </div>
                  <div className="text-gray-500 text-sm mb-1">Site</div>
                  <div className="font-medium text-gray-800 mb-3">Assuretech Infoline</div>
                  <div className="text-gray-500 text-sm mb-1">Location</div>
                  <div className="text-sm text-gray-800">Marathon Tower / A-Wing / 05<sup>th</sup> Flr / West / R 504</div>
                </div>
                
                {/* Date and Arrow */}
                <div className="flex flex-col items-center mx-8">
                  <div className="font-medium text-sm mb-2" style={{ color: '#C72030' }}>28/08/2019</div>
                  <div className="flex items-center">
                    <div className="w-12 h-px" style={{ backgroundColor: '#C72030' }}></div>
                    <div className="w-0 h-0 ml-1" style={{ 
                      borderLeft: '4px solid #C72030',
                      borderTop: '2px solid transparent',
                      borderBottom: '2px solid transparent'
                    }}></div>
                  </div>
                </div>
                
                {/* To Location */}
                <div className="flex items-start flex-col">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-5 h-5" style={{ color: '#C72030' }} />
                  </div>
                  <div className="text-gray-500 text-sm mb-1">Site</div>
                  <div className="font-medium text-gray-800 mb-3">Haven Infoline</div>
                  <div className="text-gray-500 text-sm mb-1">Location</div>
                  <div className="text-sm text-gray-800">Jyoti Tower / J-Wing / 02<sup>nd</sup> Flr / East / R 202</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Contact Details */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C72030' }}>
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold uppercase" style={{ color: '#C72030' }}>Vendor Contact Details</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Name</div>
                <div className="font-medium">Croma Electronics</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Mobile No.</div>
                <div className="font-medium">9989998999</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">PAN No.</div>
                <div className="font-medium">AJD102D34</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">GSTIN No.</div>
                <div className="font-medium">NA</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Email ID</div>
              <div className="font-medium">demo@croma.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
