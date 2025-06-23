
import React from 'react';
import { StatusBadge } from './ui/status-badge';

export const StatusReference = () => {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8 bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">STATUS</h1>
        <div className="flex justify-center space-x-8 text-sm text-gray-600">
          <span>Desktop</span>
          <span>Tablet</span>
          <span>Mobile</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* References Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">References</h3>
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-600 mb-3">
              Status refers to the current state or condition of an item, process, or entity, such as "NEW", "REJECT", "YELLOW", "PENDING" or "GREEN-Accepted".
            </p>
            <div className="flex gap-2">
              <StatusBadge status="pending">Pending</StatusBadge>
              <StatusBadge status="rejected">Rejected</StatusBadge>
              <StatusBadge status="accepted">Accepted</StatusBadge>
            </div>
          </div>
        </div>

        {/* Colored Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Colored</h3>
        </div>

        {/* Colors Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Colors</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <span className="text-sm text-gray-600">D9CA20</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">D92E14</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">168364</span>
            </div>
          </div>
        </div>

        {/* Do's Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Do's</h3>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex gap-2">
              <StatusBadge status="pending">Pending</StatusBadge>
              <StatusBadge status="rejected">Rejected</StatusBadge>
              <StatusBadge status="accepted">Accepted</StatusBadge>
            </div>
          </div>
        </div>

        {/* Don'ts Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Don'ts</h3>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex gap-2">
              <span className="px-2 py-1 text-xs border border-yellow-300 text-yellow-700 bg-white">Pending</span>
              <span className="px-2 py-1 text-xs border border-red-300 text-red-700 bg-white underline">Rejected</span>
              <span className="px-2 py-1 text-xs border border-green-300 text-green-700 bg-white">Accepted</span>
            </div>
          </div>
        </div>

        {/* Use cases Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Use cases</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Purpose:</strong> Indicate current state of an item or process.</p>
            <p><strong>Places:</strong> List and detail page.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
