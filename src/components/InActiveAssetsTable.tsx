
import React, { useState } from 'react';

export const InActiveAssetsTable = () => {
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);

  const handleSelectAll = (checked: boolean) => {
    // Handle select all logic
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#D5DbDB]">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f6f4ee]">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-[#D5DbDB] text-[#C72030] focus:ring-[#C72030]"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Actions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Equipment Id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Site
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Building
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Wing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Floor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Area
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Meter Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#D5DbDB]">
            <tr>
              <td colSpan={16} className="px-6 py-12 text-center text-[#1a1a1a] opacity-50">
                No in-active assets found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
