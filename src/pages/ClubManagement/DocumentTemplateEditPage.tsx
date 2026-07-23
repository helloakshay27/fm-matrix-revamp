import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileSignature, Save } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { DocumentTemplateEditor } from '@/components/DocumentTemplateEditor';
import { DocumentTemplatePreview } from '@/components/DocumentTemplatePreview';
import {
  DocumentTemplateSettings,
  getDocumentTemplateSettings,
  saveDocumentTemplateSettings,
} from '@/utils/documentTemplate';

interface DocumentTemplateEditPageProps {
  /** Storage key for this module's settings, e.g. "quote", "sales_order". */
  documentType: string;
  /** Human-readable module name, e.g. "Quote", "Sales Order". */
  moduleLabel: string;
  /** The hardcoded heading this module's PDF falls back to, e.g. "QUOTE". */
  defaultHeading: string;
  /** Sample document number shown in the live preview, e.g. "QT-00001". */
  sampleDocumentNumber: string;
  /** Route to go back to when there's no originating record, e.g. "/accounting/quotes". */
  backRoute: string;
  /** Prefix used to build the redirect-to-PDF route: `${detailsRoutePrefix}/${recordId}`. */
  detailsRoutePrefix: string;
}

export const DocumentTemplateEditPage: React.FC<DocumentTemplateEditPageProps> = ({
  documentType,
  moduleLabel,
  defaultHeading,
  sampleDocumentNumber,
  backRoute,
  detailsRoutePrefix,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const recordId = (location.state as { recordId?: string | number } | null)?.recordId;

  const [settings, setSettings] = useState<DocumentTemplateSettings>(() => getDocumentTemplateSettings(documentType));
  const [saving, setSaving] = useState(false);

  const handleBack = () => {
    navigate(recordId ? `${detailsRoutePrefix}/${recordId}` : backRoute);
  };

  const handleSave = () => {
    setSaving(true);
    try {
      saveDocumentTemplateSettings(documentType, settings);
      sonnerToast.success('Template saved');
      if (recordId) {
        navigate(`${detailsRoutePrefix}/${recordId}`, { state: { tab: 'pdf' } });
      } else {
        navigate(backRoute);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <FileSignature className="h-6 w-6 text-primary" />
                {moduleLabel} Template
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Customize the logo, address, heading, signature and terms shown on {moduleLabel} PDFs.
              </p>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Template'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card>
            <CardHeader>
              <CardTitle>Template Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentTemplateEditor
                settings={settings}
                onChange={setSettings}
                moduleLabel={moduleLabel}
                defaultHeading={defaultHeading}
              />
            </CardContent>
          </Card>

          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-auto max-h-[75vh] bg-gray-100 p-4">
                <DocumentTemplatePreview
                  settings={settings}
                  defaultHeading={defaultHeading}
                  sampleDocumentNumber={sampleDocumentNumber}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentTemplateEditPage;
