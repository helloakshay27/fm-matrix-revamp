
import React from 'react';
import { Button } from './ui/button';
import { ButtonGroup } from './ui/button-group';
import { Plus, Download, Filter, Edit, Share } from 'lucide-react';

export const ButtonShowcase = () => {
  return (
    <div className="container-responsive py-8">
      <div className="content-area space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-center mb-8">Button Component System</h1>
        </div>

        {/* Responsive Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Responsive Button Sizes</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Primary Buttons</h3>
              <ButtonGroup spacing="default">
                <Button variant="primary" size="responsive">View More</Button>
                <Button variant="primary" size="desktop">Desktop</Button>
                <Button variant="primary" size="tablet">Tablet</Button>
                <Button variant="primary" size="mobile">Mobile</Button>
              </ButtonGroup>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Secondary Buttons</h3>
              <ButtonGroup spacing="default">
                <Button variant="secondary" size="responsive">View More</Button>
                <Button variant="secondary" size="desktop">Desktop</Button>
                <Button variant="secondary" size="tablet">Tablet</Button>
                <Button variant="secondary" size="mobile">Mobile</Button>
              </ButtonGroup>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Ghost Buttons</h3>
              <ButtonGroup spacing="default">
                <Button variant="ghost" size="responsive">View More</Button>
                <Button variant="ghost" size="desktop">Desktop</Button>
                <Button variant="ghost" size="tablet">Tablet</Button>
                <Button variant="ghost" size="mobile">Mobile</Button>
              </ButtonGroup>
            </div>
          </div>
        </section>

        {/* Icon Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Buttons with Icons</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Icons on Left</h3>
              <ButtonGroup spacing="default">
                <Button variant="primary" size="responsive" icon={<Plus />}>Add Item</Button>
                <Button variant="secondary" size="responsive" icon={<Download />}>Download</Button>
                <Button variant="ghost" size="responsive" icon={<Filter />}>Filter</Button>
              </ButtonGroup>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Icons on Right</h3>
              <ButtonGroup spacing="default">
                <Button variant="primary" size="responsive" icon={<Edit />} iconPosition="right">Edit</Button>
                <Button variant="secondary" size="responsive" icon={<Share />} iconPosition="right">Share</Button>
              </ButtonGroup>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Icon Only Buttons</h3>
              <ButtonGroup spacing="default">
                <Button variant="primary" size="icon" icon={<Plus />} />
                <Button variant="secondary" size="icon" icon={<Download />} />
                <Button variant="ghost" size="icon" icon={<Filter />} />
              </ButtonGroup>
            </div>
          </div>
        </section>

        {/* Button States */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Button States</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Interactive States</h3>
              <ButtonGroup spacing="default">
                <Button variant="primary" size="responsive">Normal</Button>
                <Button variant="primary" size="responsive" disabled>Disabled</Button>
                <Button variant="primary" size="responsive" loading>Loading</Button>
              </ButtonGroup>
            </div>
          </div>
        </section>

        {/* Button Groups */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Button Groups</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Horizontal Groups</h3>
              <ButtonGroup orientation="horizontal" spacing="default">
                <Button variant="primary" size="responsive">Save</Button>
                <Button variant="secondary" size="responsive">Cancel</Button>
                <Button variant="ghost" size="responsive">Reset</Button>
              </ButtonGroup>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Vertical Groups</h3>
              <ButtonGroup orientation="vertical" spacing="default" className="max-w-xs">
                <Button variant="primary" size="responsive" fullWidth>Primary Action</Button>
                <Button variant="secondary" size="responsive" fullWidth>Secondary Action</Button>
                <Button variant="ghost" size="responsive" fullWidth>Tertiary Action</Button>
              </ButtonGroup>
            </div>
          </div>
        </section>

        {/* Use Cases Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Common Use Cases</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Form Actions</h3>
              <ButtonGroup spacing="default">
                <Button variant="primary" size="responsive" icon={<Plus />}>Add New</Button>
                <Button variant="secondary" size="responsive" icon={<Download />}>Export</Button>
                <Button variant="ghost" size="responsive" icon={<Filter />}>Filter</Button>
              </ButtonGroup>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Table Actions</h3>
              <ButtonGroup spacing="tight">
                <Button variant="ghost" size="icon" icon={<Edit />} />
                <Button variant="ghost" size="icon" icon={<Share />} />
                <Button variant="ghost" size="icon" icon={<Download />} />
              </ButtonGroup>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">CTA Section</h3>
              <div className="text-center space-y-4">
                <Button variant="primary" size="responsive" icon={<Plus />}>Get Started</Button>
                <div>
                  <Button variant="ghost" size="responsive">Learn More</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
