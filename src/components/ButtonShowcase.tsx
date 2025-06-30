
import React from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

export const ButtonShowcase = () => {
  return (
    <div className="container-responsive">
      <div className="content-area section-spacing">
        <div className="space-y-12">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Button System</h1>
            <p className="text-gray-600">Comprehensive button component system with responsive sizing and variants</p>
          </div>

          {/* Button Variants */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Button Variants</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Primary Buttons</h3>
                <ButtonGroup>
                  <Button variant="primary">Default</Button>
                  <Button variant="primary" icon="plus">Add Item</Button>
                  <Button variant="primary" icon="download" iconPosition="right">Download</Button>
                  <Button variant="primary" icon="plus" />
                </ButtonGroup>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Secondary Buttons</h3>
                <ButtonGroup>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="secondary" icon="filter">Filter</Button>
                  <Button variant="secondary" icon="share" iconPosition="right">Share</Button>
                  <Button variant="secondary" icon="edit" />
                </ButtonGroup>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Ghost Buttons</h3>
                <ButtonGroup>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="ghost" icon="edit">Edit</Button>
                  <Button variant="ghost" icon="share" iconPosition="right">Share</Button>
                  <Button variant="ghost" icon="filter" />
                </ButtonGroup>
              </div>
            </div>
          </section>

          {/* Button States */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Button States</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Interactive States</h3>
                <ButtonGroup>
                  <Button variant="primary">Normal</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                  <Button variant="primary" loading>Loading</Button>
                  <Button variant="primary" icon="plus" loading>Loading with Icon</Button>
                </ButtonGroup>
              </div>
            </div>
          </section>

          {/* Responsive Sizes */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Responsive Sizing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Auto-responsive (Recommended)</h3>
                <ButtonGroup>
                  <Button size="responsive" variant="primary">Responsive</Button>
                  <Button size="responsive" variant="primary" icon="plus">Add Item</Button>
                  <Button size="responsive" variant="secondary">Secondary</Button>
                </ButtonGroup>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Fixed Sizes</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Desktop (136px width)</p>
                    <ButtonGroup>
                      <Button size="desktop" variant="primary">Desktop</Button>
                      <Button size="desktop" variant="primary" icon="download">Download</Button>
                    </ButtonGroup>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Tablet (116px width)</p>
                    <ButtonGroup>
                      <Button size="tablet" variant="primary">Tablet</Button>
                      <Button size="tablet" variant="primary" icon="filter">Filter</Button>
                    </ButtonGroup>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Mobile (94px width)</p>
                    <ButtonGroup>
                      <Button size="mobile" variant="primary">Mobile</Button>
                      <Button size="mobile" variant="primary" icon="edit">Edit</Button>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Button Groups */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Button Groups</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Horizontal Groups</h3>
                <ButtonGroup orientation="horizontal">
                  <Button variant="primary" icon="plus">Add</Button>
                  <Button variant="secondary" icon="edit">Edit</Button>
                  <Button variant="ghost" icon="share">Share</Button>
                  <Button variant="secondary" icon="download">Export</Button>
                </ButtonGroup>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Vertical Stack</h3>
                <div className="max-w-xs">
                  <ButtonGroup orientation="vertical">
                    <Button variant="primary" fullWidth icon="plus">Add New Item</Button>
                    <Button variant="secondary" fullWidth icon="download">Download Report</Button>
                    <Button variant="secondary" fullWidth icon="filter">Apply Filters</Button>
                    <Button variant="ghost" fullWidth icon="edit">Edit Settings</Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Common Use Cases</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Property Listings</h3>
                <ButtonGroup>
                  <Button variant="primary" icon="filter">Filter</Button>
                  <Button variant="secondary" icon="download">Export</Button>
                  <Button variant="ghost">View More</Button>
                </ButtonGroup>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Form Actions</h3>
                <ButtonGroup>
                  <Button variant="primary">Submit</Button>
                  <Button variant="secondary">Save Draft</Button>
                  <Button variant="ghost">Cancel</Button>
                </ButtonGroup>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">File Operations</h3>
                <ButtonGroup>
                  <Button variant="primary" icon="plus">Upload</Button>
                  <Button variant="secondary" icon="download">Download</Button>
                  <Button variant="secondary" icon="share">Share</Button>
                </ButtonGroup>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
