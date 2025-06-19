
import React from 'react';

export const WaterHistoryCardTab = () => {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
            <span className="text-white text-xs">📄</span>
          </div>
          <h3 className="text-lg font-semibold text-[#C72030] uppercase">History In Details</h3>
        </div>

        {/* Asset Information Card */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Borewell Name:</span>
                <span className="text-gray-900">Borewell</span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Supplier:</span>
                <span className="text-gray-900"></span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Capacity:</span>
                <span className="text-gray-900"></span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Date of Commissioning:</span>
                <span className="text-gray-900"></span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Serial Number:</span>
                <span className="text-gray-900">540</span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Manufacturer:</span>
                <span className="text-gray-900"></span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Date of Purchase:</span>
                <span className="text-gray-900">01/04/2024</span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Date of Installation:</span>
                <span className="text-gray-900"></span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Model Number:</span>
                <span className="text-gray-900">7805</span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Asset Code:</span>
                <span className="text-gray-900 font-mono text-xs">83898732f107c5df0121</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Manufacturer:</span>
                <span className="text-gray-900"></span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Date of Purchase:</span>
                <span className="text-gray-900">01/04/2024</span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Date of Installation:</span>
                <span className="text-gray-900"></span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Model Number:</span>
                <span className="text-gray-900">7805</span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Asset Code:</span>
                <span className="text-gray-900 font-mono text-xs">83898732f107c5df0121</span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Supplier:</span>
                <span className="text-gray-900"></span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Capacity:</span>
                <span className="text-gray-900"></span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Date of Commissioning:</span>
                <span className="text-gray-900"></span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Serial Number:</span>
                <span className="text-gray-900">540</span>
              </div>
              <div className="flex">
                <span className="text-gray-700 font-medium min-w-32">Location of Asset:</span>
                <span className="text-gray-900"></span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-orange-100 rounded">
            <div className="text-orange-800 font-medium">MDM CREST 3900</div>
            <div className="text-sm text-orange-700 mt-1">
              Site : Located Site 1 / Building : Sarova / Wing : SW1 / Floor : FW1 / Area : AW1 / Room : NA
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type of activity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Performed by</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 text-sm">16/06/2024</td>
                <td className="px-4 py-3 text-sm">Update</td>
                <td className="px-4 py-3 text-sm">
                  Model Number: Changed from new to 7805
                  Purchased On: Changed from N/A to 01/04/2024
                  Building: Changed from N/A to Sarova
                  Wing: Changed from N/A to SW1
                  Floor: Changed from N/A to FW1
                  Area: Changed from N/A to AW1
                  Group: Changed from N/A to Electrical
                  Serial No: Changed from N/A to 540
                  Capacity Unit: Changed from N/A to NA
                  Breakdown: Changed from N/A to NA
                  Meter Category: Changed from N/A to NA
                  From Unique Meter made before changes: in Sub Asset Number: Changed from new N to 7805
                </td>
                <td className="px-4 py-3 text-sm">Piyush L</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">08/05/2024</td>
                <td className="px-4 py-3 text-sm">Update</td>
                <td className="px-4 py-3 text-sm"></td>
                <td className="px-4 py-3 text-sm">Visank keva</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">08/05/2024</td>
                <td className="px-4 py-3 text-sm">Update</td>
                <td className="px-4 py-3 text-sm"></td>
                <td className="px-4 py-3 text-sm">Visank keva</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
