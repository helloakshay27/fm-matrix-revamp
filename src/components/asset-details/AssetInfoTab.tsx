import React from 'react';
import { MapPin, QrCode, Settings, CreditCard, UserCheck, TrendingUp, User, FileText, CheckCircle, Box, Clock, UserIcon } from 'lucide-react';
interface AssetInfoTabProps {
  assetId: string;
}
export const AssetInfoTab = ({
  assetId
}: AssetInfoTabProps) => {
  return <div className="space-y-6 min-h-full ">
      <div className="flex gap-6">
        {/* Location Details - 80% width */}
        <div className="w-4/5 bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
            backgroundColor: '#C72030'
          }}>
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold uppercase" style={{
            color: '#C72030'
          }}>Location Details</h3>
          </div>

          {/* Location Timeline - Vertical Layout */}
          <div className="flex-1">
            <div className="relative">
              {/* Site */}
              <div className="flex items-center mb-6">
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-4" style={{
                  backgroundColor: '#C72030'
                }}>
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div className="flex-1">
                  <div className="text-lg font-medium text-gray-800">Haven Infoline</div>
                  <div className="text-sm text-gray-500">Site</div>
                </div>
              </div>
              
              {/* Connecting line */}
              <div className="absolute left-3 top-6 bottom-6 w-0.5" style={{
                backgroundColor: '#C72030'
              }}></div>
              
              {/* Building */}
              <div className="flex items-center mb-6">
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-4" style={{
                  backgroundColor: '#C72030'
                }}>
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div className="flex-1">
                  <div className="text-lg font-medium text-gray-800">Jyoti Tower</div>
                  <div className="text-sm text-gray-500">Building</div>
                </div>
              </div>
              
              {/* Wing */}
              <div className="flex items-center mb-6">
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-4" style={{
                  backgroundColor: '#C72030'
                }}>
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div className="flex-1">
                  <div className="text-lg font-medium text-gray-800">J - Wing</div>
                  <div className="text-sm text-gray-500">Wing</div>
                </div>
              </div>
              
              {/* Floor */}
              <div className="flex items-center mb-6">
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-4" style={{
                  backgroundColor: '#C72030'
                }}>
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div className="flex-1">
                  <div className="text-lg font-medium text-gray-800">02<sup>nd</sup></div>
                  <div className="text-sm text-gray-500">Floor</div>
                </div>
              </div>
              
              {/* Area */}
              <div className="flex items-center mb-6">
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-4" style={{
                  backgroundColor: '#C72030'
                }}>
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div className="flex-1">
                  <div className="text-lg font-medium text-gray-800">East</div>
                  <div className="text-sm text-gray-500">Area</div>
                </div>
              </div>
              
              {/* Room */}
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-4" style={{
                  backgroundColor: '#C72030'
                }}>
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div className="flex-1">
                  <div className="text-lg font-medium text-gray-800">R 202</div>
                  <div className="text-sm text-gray-500">Room</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code - 20% width */}
        
      </div>

      {/* Asset Details - Full Width */}
      <div className="bg-white rounded-lg p-6 shadow-sm border-2">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
          backgroundColor: '#C72030'
        }}>
            <Settings className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold uppercase" style={{
          color: '#C72030'
        }}>Asset Details</h3>
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
            <div className="text-base font-semibold mb-6" style={{
            color: '#C72030'
          }}>System Details</div>
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
            <div className="text-base font-semibold mb-6" style={{
            color: '#C72030'
          }}>Hard Disk Details</div>
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

      {/* Purchase Details and Asset Loaned - Updated width distribution */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Purchase Details - 80% width */}
        <div className="w-full lg:w-4/5 bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
            backgroundColor: '#C72030'
          }}>
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold uppercase" style={{
            color: '#C72030'
          }}>Purchase Details</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Purchase Cost</div>
                <div className="font-medium">₹ 1,00000</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Current Date Cost</div>
                <div className="font-medium">₹ 52000 (Straight Line)</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Purchase Date</div>
                <div className="font-medium">01/02/2019</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Under Warranty</div>
                <div className="font-medium">Yes</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

        {/* Asset Loaned - 20% width */}
        <div className="w-full lg:w-1/5 bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
            backgroundColor: '#C72030'
          }}>
              <UserCheck className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold uppercase" style={{
            color: '#C72030'
          }}>Asset Loaned</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Vendor</div>
              <div className="font-medium">Croma Electronics</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Agreement From</div>
              <div className="font-medium">01/02/2019</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Agreement To</div>
              <div className="font-medium">01/02/2021</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Movement Details */}
        <div className="w-full lg:w-4/5 bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
            backgroundColor: '#C72030'
          }}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold uppercase" style={{
            color: '#C72030'
          }}>Movement Details</h3>
          </div>

          <div className="space-y-8">
            {/* From/To Sites */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">From Site</span>
                </div>
                <div className="font-semibold text-gray-800 text-lg">Sai Radhe, Bund Garden</div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">To Site</span>
                </div>
                <div className="font-semibold text-gray-800 text-lg">Sai Radhe, Bund Garden</div>
              </div>
            </div>

            {/* Movement Timeline */}
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-0">
                {/* Requested Stage */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{
                  backgroundColor: '#C72030'
                }}>
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-base font-semibold mb-2" style={{
                  color: '#C72030'
                }}>Requested</div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span>19/06/2025 , 11:00 AM</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <UserIcon className="w-4 h-4" />
                    <span>Abdul Ghaffar</span>
                  </div>
                </div>

                {/* Connecting line */}
                <div className="hidden md:block flex-1 h-px mx-4" style={{
                backgroundColor: '#C72030'
              }}></div>
                <div className="md:hidden w-px h-8 mx-auto" style={{
                backgroundColor: '#C72030'
              }}></div>

                {/* Approved Stage */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{
                  backgroundColor: '#C72030'
                }}>
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-base font-semibold mb-2" style={{
                  color: '#C72030'
                }}>Approved</div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span>20/06/2025 , 11:10 AM</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <UserIcon className="w-4 h-4" />
                    <span>Chetan Bafna</span>
                  </div>
                </div>

                {/* Connecting line */}
                <div className="hidden md:block flex-1 h-px bg-gray-300 mx-4"></div>
                <div className="md:hidden w-px h-8 bg-gray-300 mx-auto"></div>

                {/* Received Stage */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                    <Box className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="text-base font-semibold text-gray-400 mb-2">Received</div>
                  <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <UserIcon className="w-4 h-4" />
                    <span>Awaiting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Contact Details */}
        <div className="w-full lg:w-1/5 bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
            backgroundColor: '#C72030'
          }}>
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold uppercase" style={{
            color: '#C72030'
          }}>Vendor Contact Details</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Name</div>
                <div className="font-medium">Croma Electronics</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Mobile No.</div>
                <div className="font-medium">9989998999</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
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
    </div>;
};