
import React from 'react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from './ui/breadcrumb';

export const BreadcrumbReference = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">BREADCRUMBS</h1>
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
              Breadcrumbs are navigation aids that help users understand their current location within a website's hierarchy and provide a way to navigate back to previous pages.
            </p>
          </div>
        </div>

        {/* Desktop Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Desktop</h3>
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <Breadcrumb>
              <BreadcrumbList className="text-sm">
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="text-blue-600 hover:underline">
                    Booking
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-900">Booking Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">New Item # / New Item</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Edit Item #</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Post Weight Request</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Live Weight +90%</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Letter Spacing +5% / Auto</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color: #3366CC</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color Opacity: 54%</span>
            </div>
          </div>
        </div>

        {/* Tablet Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Tablet</h3>
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <Breadcrumb>
              <BreadcrumbList className="text-sm">
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="text-blue-600 hover:underline">
                    Booking
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-900">Booking Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">New Item # / New Item</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Edit Item #</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Post Weight Medium</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Live Weight: 54%</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Letter Spacing +5% / Auto</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color: #3366CC</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color Opacity: 54%</span>
            </div>
          </div>
        </div>

        {/* Mobile Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Mobile</h3>
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <Breadcrumb>
              <BreadcrumbList className="text-sm">
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="text-blue-600 hover:underline">
                    Booking
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-900">Booking Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">New Item # / New Item</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Edit Item #</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Post Weight Medium</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Live Weight: 54%</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Letter Spacing +5% / Auto</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color: #3366CC</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color Opacity: 54%</span>
            </div>
          </div>
        </div>

        {/* Use cases Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Use cases</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Purpose:</strong> Provide navigation context and hierarchy within the application.</p>
            <p><strong>Places:</strong> Header sections, detail pages, multi-step forms.</p>
            <p><strong>Responsive:</strong> Adapts to different screen sizes with appropriate spacing and text sizes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
