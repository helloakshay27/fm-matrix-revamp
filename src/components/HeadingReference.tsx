
import React from 'react';
import { Heading } from './ui/heading';

export const HeadingReference = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">HEADING</h1>
        <div className="flex justify-center space-x-8 text-sm text-gray-600">
          <span>Desktop</span>
          <span>Tablet</span>
          <span>Mobile</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* References Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">References</h3>
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-600 mb-3">
              Headings are used to create hierarchy and structure content. They should be used semantically and consistently across the application.
            </p>
          </div>
        </div>

        {/* Desktop Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <h3 className="text-sm font-medium text-gray-900">BASIC INFO</h3>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Desktop</h3>
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
            <Heading level="h1" variant="default">Heading H1 - Main Page Title</Heading>
            <Heading level="h2" variant="default">Heading H2 - Section Title</Heading>
            <Heading level="h3" variant="default">Heading H3 - Subsection Title</Heading>
            <Heading level="h4" variant="default">Heading H4 - Component Title</Heading>
            <Heading level="h5" variant="default">Heading H5 - Small Section</Heading>
            <Heading level="h6" variant="default">Heading H6 - Label</Heading>
            
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Font Size: 32</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Font Weight: SemiBold</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Line Height: Auto</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Letter Spacing: 0% / Auto</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color: #1F2937</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color Opacity: 100%</span>
            </div>
          </div>
        </div>

        {/* Tablet Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <h3 className="text-sm font-medium text-gray-900">BASIC INFO</h3>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Tablet</h3>
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
            <Heading level="h2" variant="default">Heading H2 - Tablet Main</Heading>
            <Heading level="h3" variant="default">Heading H3 - Tablet Section</Heading>
            <Heading level="h4" variant="default">Heading H4 - Tablet Subsection</Heading>
            <Heading level="h5" variant="default">Heading H5 - Tablet Component</Heading>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Font Size: 28</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Font Weight: Medium</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Line Height: Auto</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Letter Spacing: 0% / Auto</span>
            </div>
          </div>
        </div>

        {/* Mobile Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <h3 className="text-sm font-medium text-gray-900">BASIC INFO</h3>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Mobile</h3>
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
            <Heading level="h3" variant="default">Mobile Main Heading</Heading>
            <Heading level="h4" variant="default">Mobile Section Heading</Heading>
            <Heading level="h5" variant="default">Mobile Subsection</Heading>
            <Heading level="h6" variant="default">Mobile Component</Heading>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Font Size: 24</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Font Weight: SemiBold</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Line Height: Auto</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color Opacity: 100%</span>
            </div>
          </div>
        </div>

        {/* Use cases Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Use cases</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Purpose:</strong> Create hierarchy and structure content across all modules.</p>
            <p><strong>Places:</strong> Page titles, section headers, component titles, form labels.</p>
            <p><strong>Responsive:</strong> Adapts font sizes and spacing across desktop, tablet, and mobile.</p>
            <p><strong>Variants:</strong> Default, primary, secondary, and muted color options.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
