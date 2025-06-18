
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

interface AttachmentsSectionProps {
  expanded: boolean;
  onToggle: () => void;
  onFileUpload: (type: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
  expanded,
  onToggle,
  onFileUpload
}) => {
  return (
    <div className="mb-6">
      <div 
        className="flex items-center gap-3 mb-4 cursor-pointer"
        onClick={onToggle}
      >
        <div style={{ backgroundColor: '#C72030' }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
          📎
        </div>
        <h3 className="text-lg font-semibold text-sidebar-foreground flex-1">ATTACHMENTS</h3>
        {expanded ? <ChevronUp className="w-5 h-5 text-sidebar-foreground" /> : <ChevronDown className="w-5 h-5 text-sidebar-foreground" />}
      </div>
      
      {expanded && (
        <div className="bg-white p-6 rounded-lg border border-sidebar-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Manual Upload</Label>
              <div className="border-2 border-dashed border-sidebar-border rounded-lg p-6 text-center">
                <div className="text-sidebar-foreground/70 mb-2">Choose File</div>
                <div className="text-sm text-sidebar-foreground/50 mb-2">No file chosen</div>
                <input
                  type="file"
                  onChange={(e) => onFileUpload('manual', e)}
                  className="hidden"
                  id="manual-upload"
                />
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => document.getElementById('manual-upload')?.click()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Insurance Details</Label>
              <div className="border-2 border-dashed border-sidebar-border rounded-lg p-6 text-center">
                <div className="text-sidebar-foreground/70 mb-2">Choose File</div>
                <div className="text-sm text-sidebar-foreground/50 mb-2">No file chosen</div>
                <input
                  type="file"
                  onChange={(e) => onFileUpload('insurance', e)}
                  className="hidden"
                  id="insurance-upload"
                />
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => document.getElementById('insurance-upload')?.click()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Purchase Invoice</Label>
              <div className="border-2 border-dashed border-sidebar-border rounded-lg p-6 text-center">
                <div className="text-sidebar-foreground/70 mb-2">Choose File</div>
                <div className="text-sm text-sidebar-foreground/50 mb-2">No file chosen</div>
                <input
                  type="file"
                  onChange={(e) => onFileUpload('invoice', e)}
                  className="hidden"
                  id="invoice-upload"
                />
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => document.getElementById('invoice-upload')?.click()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">AMC</Label>
              <div className="border-2 border-dashed border-sidebar-border rounded-lg p-6 text-center">
                <div className="text-sidebar-foreground/70 mb-2">Choose File</div>
                <div className="text-sm text-sidebar-foreground/50 mb-2">No file chosen</div>
                <input
                  type="file"
                  onChange={(e) => onFileUpload('amc', e)}
                  className="hidden"
                  id="amc-upload"
                />
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => document.getElementById('amc-upload')?.click()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
