
import React from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

export const OptionsReference = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">OPTIONS</h1>
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
              Options provide users with multiple choices using radio buttons and checkboxes. They are essential for forms, filters, and configuration panels.
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
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-6">
            {/* Main Options */}
            <div className="space-y-4">
              <RadioGroup defaultValue="ppm" className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ppm" id="ppm" className="border-red-500 text-red-500" />
                  <Label htmlFor="ppm" className="text-sm font-medium">PPM</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="audit" id="audit" />
                  <Label htmlFor="audit" className="text-sm font-medium">Audit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hoto" id="hoto" />
                  <Label htmlFor="hoto" className="text-sm font-medium">Hoto</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="amc" id="amc" />
                  <Label htmlFor="amc" className="text-sm font-medium">AMC</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="preparedness" id="preparedness" />
                  <Label htmlFor="preparedness" className="text-sm font-medium">Preparedness</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="routine" id="routine" />
                  <Label htmlFor="routine" className="text-sm font-medium">Routine</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Text Properties */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Body Text S / Work Sans</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Font Size: 16</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Font Weight: Regular</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Line Height: Auto</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Letter Spacing: 0% / Auto</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color: #1A1A1A</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color Opacity: 100%</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Left Padding: 10</span>
              </div>
            </div>

            {/* Icon Properties */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Icon</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Width: 20</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Height: 20</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color: #C72030</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color Opacity: 100%</span>
              </div>
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
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-6">
            {/* Main Options */}
            <div className="space-y-4">
              <RadioGroup defaultValue="ppm" className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ppm" id="ppm-tablet" className="border-red-500 text-red-500" />
                  <Label htmlFor="ppm-tablet" className="text-sm font-medium">PPM</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="amc" id="amc-tablet" />
                  <Label htmlFor="amc-tablet" className="text-sm font-medium">AMC</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="preparedness" id="preparedness-tablet" />
                  <Label htmlFor="preparedness-tablet" className="text-sm font-medium">Preparedness</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="routine" id="routine-tablet" />
                  <Label htmlFor="routine-tablet" className="text-sm font-medium">Routine</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hoto" id="hoto-tablet" />
                  <Label htmlFor="hoto-tablet" className="text-sm font-medium">Hoto</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Text Properties */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Body Text S / Work Sans</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Font Size: 14</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Font Weight: Regular</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Line Height: Auto</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Letter Spacing: 0% / Auto</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color: #1A1A1A</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color Opacity: 100%</span>
              </div>
            </div>

            {/* Icon Properties */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Icon</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Width: 16</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Height: 16</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color: #C72030</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color Opacity: 100%</span>
              </div>
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
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-6">
            {/* Main Options */}
            <div className="space-y-4">
              <RadioGroup defaultValue="ppm" className="flex flex-col gap-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ppm" id="ppm-mobile" className="border-red-500 text-red-500" />
                  <Label htmlFor="ppm-mobile" className="text-sm font-medium">PPM</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="amc" id="amc-mobile" />
                  <Label htmlFor="amc-mobile" className="text-sm font-medium">AMC</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="preparedness" id="preparedness-mobile" />
                  <Label htmlFor="preparedness-mobile" className="text-sm font-medium">Preparedness</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hoto" id="hoto-mobile" />
                  <Label htmlFor="hoto-mobile" className="text-sm font-medium">Hoto</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="routine" id="routine-mobile" />
                  <Label htmlFor="routine-mobile" className="text-sm font-medium">Routine</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Text Properties */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Body Text S / Work Sans</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Font Size: 10</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Font Weight: Regular</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Line Height: Auto</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Letter Spacing: 0% / Auto</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color: #1A1A1A</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color Opacity: 100%</span>
              </div>
            </div>

            {/* Icon Properties */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Icon</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Width: 10</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Height: 10</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color: #C72030</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border">Color Opacity: 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Use cases Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Use cases</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Purpose:</strong> Provide multiple choice selections in forms, filters, and configuration panels.</p>
            <p><strong>Places:</strong> Filter modals, settings pages, form inputs, category selections.</p>
            <p><strong>Responsive:</strong> Adapts layout and sizing across desktop, tablet, and mobile devices.</p>
            <p><strong>Types:</strong> Radio buttons for single selection, checkboxes for multiple selections.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
