
import React from 'react';

interface AssetTableDisplayProps {
  selectedAssets: any[];
}

export const AssetTableDisplay: React.FC<AssetTableDisplayProps> = ({ selectedAssets }) => {
  return (
    <div className="mb-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] sm:min-w-[800px] lg:min-w-[1000px] xl:min-w-[1200px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Asset Name</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Asset Code</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Asset Status</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Site</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Building</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Wing</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Floor</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Area</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Room</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Department/User</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-t border-gray-200">
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Dell Laptop</td>
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">#3423</td>
                <td className="px-2 sm:px-3 py-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                    In Use
                  </span>
                </td>
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Haven Infoline</td>
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Jyoti Tower</td>
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">J</td>
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">2</td>
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">East</td>
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">R 202</td>
                <td className="px-2 sm:px-3 py-2 text-xs text-blue-600">👤 Technical</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Computer Table</td>
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">#1233</td>
                <td className="px-2 sm:px-3 py-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                    Breakdown
                  </span>
                </td>
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Haven Infoline</td>
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Jyoti Tower</td>
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">J</td>
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">2</td>
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">East</td>
                <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">R 202</td>
                <td className="px-2 sm:px-3 py-2 text-xs text-orange-600">👤 Rakesh K.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
