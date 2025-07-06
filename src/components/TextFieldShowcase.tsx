
import React, { useState } from 'react';
import { CustomTextField, DesktopTextField, TabletTextField, MobileTextField } from '@/components/ui/custom-text-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TextFieldShowcase = () => {
  const [sampleText, setSampleText] = useState('');

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Custom Text Field Component System</h1>
        <p className="text-gray-600 mb-6">Comprehensive Material-UI text field implementation with responsive design</p>
      </div>

      {/* Responsive Text Field */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive Text Field</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Auto-responsive (changes based on screen size)</h3>
            <CustomTextField
              label="Responsive Field"
              placeholder="This field adapts to screen size"
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Fixed Size Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Fixed Size Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Desktop (316px × 56px)</h3>
            <DesktopTextField
              label="Desktop Field"
              placeholder="Large desktop input"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Tablet (254px × 44px)</h3>
            <TabletTextField
              label="Tablet Field"
              placeholder="Medium tablet input"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Mobile (128px × 28px)</h3>
            <MobileTextField
              label="Mobile Field"
              placeholder="Compact mobile input"
            />
          </div>
        </CardContent>
      </Card>

      {/* State Variations */}
      <Card>
        <CardHeader>
          <CardTitle>State Variations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Default State</h4>
              <CustomTextField
                label="Default"
                placeholder="Normal input field"
              />
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Error State</h4>
              <CustomTextField
                label="Error Field"
                placeholder="Field with error"
                state="error"
                helperText="This field has an error"
              />
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Success State</h4>
              <CustomTextField
                label="Success Field"
                placeholder="Field with success"
                state="success"
                helperText="This field is valid"
              />
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Disabled State</h4>
              <CustomTextField
                label="Disabled Field"
                placeholder="Disabled input"
                state="disabled"
                value="Cannot edit this"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multiline Support */}
      <Card>
        <CardHeader>
          <CardTitle>Multiline Text Fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Multiline Text Area</h3>
            <CustomTextField
              label="Multiline Field"
              placeholder="Enter multiple lines of text here..."
              multiline
              rows={4}
              sx={{ width: '100%', maxWidth: '500px' }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
