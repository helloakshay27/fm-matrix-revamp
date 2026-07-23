import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, PenLine, X } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { DocumentTemplateSettings, fileToDataUrl } from '@/utils/documentTemplate';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  icon: React.ReactNode;
  helperText?: string;
}

const ImageField: React.FC<ImageFieldProps> = ({ label, value, onChange, icon, helperText }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      sonnerToast.error('Please select an image file');
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    onChange(dataUrl);
  };

  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="flex items-center gap-4">
        <div className="w-32 h-20 border border-dashed rounded-md flex items-center justify-center bg-muted/30 overflow-hidden">
          {value ? (
            <img src={value} alt={label} className="max-w-full max-h-full object-contain" />
          ) : (
            <span className="text-muted-foreground">{icon}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
            {value ? 'Replace' : 'Upload'}
          </Button>
          {value && (
            <Button type="button" size="sm" variant="ghost" className="text-red-600" onClick={() => onChange('')}>
              <X className="h-3.5 w-3.5 mr-1" /> Remove
            </Button>
          )}
        </div>
      </div>
      {helperText && <p className="text-xs text-muted-foreground mt-2">{helperText}</p>}
    </div>
  );
};

interface DocumentTemplateEditorProps {
  settings: DocumentTemplateSettings;
  onChange: (next: DocumentTemplateSettings) => void;
  /** Human-readable module name, e.g. "Quote", "Sales Order", "Invoice". */
  moduleLabel: string;
  /** The hardcoded heading this module's PDF falls back to, e.g. "QUOTE". */
  defaultHeading: string;
}

export const DocumentTemplateEditor: React.FC<DocumentTemplateEditorProps> = ({
  settings,
  onChange,
  moduleLabel,
  defaultHeading,
}) => {
  const update = <K extends keyof DocumentTemplateSettings>(key: K, value: DocumentTemplateSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      <ImageField
        label="Logo"
        value={settings.logo}
        onChange={(v) => update('logo', v)}
        icon={<ImagePlus className="h-6 w-6" />}
        helperText={`Shown at the top of the ${moduleLabel} PDF.`}
      />

      <div>
        <Label htmlFor="organizationAddress" className="mb-2 block">Organization Address</Label>
        <Textarea
          id="organizationAddress"
          rows={3}
          value={settings.organizationAddress}
          onChange={(e) => update('organizationAddress', e.target.value)}
          placeholder="Pune, Maharashtra 411006"
        />
      </div>

      <div>
        <Label htmlFor="templateName" className="mb-2 block">Template Name</Label>
        <Input
          id="templateName"
          value={settings.templateName}
          onChange={(e) => update('templateName', e.target.value)}
          placeholder={`Eg: ${defaultHeading} to Estimate`}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Overrides the "{defaultHeading}" heading shown on this {moduleLabel} PDF.
        </p>
      </div>

      <ImageField
        label="Signature"
        value={settings.signature}
        onChange={(v) => update('signature', v)}
        icon={<PenLine className="h-6 w-6" />}
        helperText={`Shown above the Authorized Signature line on the ${moduleLabel} PDF.`}
      />

      <div>
        <Label htmlFor="termsAndConditions" className="mb-2 block">Terms and Condition</Label>
        <Textarea
          id="termsAndConditions"
          rows={5}
          value={settings.termsAndConditions}
          onChange={(e) => update('termsAndConditions', e.target.value)}
          placeholder={`Default terms & conditions text used when a ${moduleLabel.toLowerCase()} doesn't specify its own.`}
        />
      </div>
    </div>
  );
};

export default DocumentTemplateEditor;
