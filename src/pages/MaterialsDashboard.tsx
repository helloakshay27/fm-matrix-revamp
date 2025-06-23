
import React from 'react';
import { Heading } from '@/components/ui/heading';

export const MaterialsDashboard = () => {
  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>visitors</span>
          <span>&gt;</span>
          <span>Materials</span>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-[400px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Heading level="h2" variant="default" className="mb-2">Materials</Heading>
            <p>Materials content will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};
