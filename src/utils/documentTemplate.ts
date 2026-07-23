// Frontend-only (localStorage-backed) branding settings used by document PDF
// renderers: Quotes, Sales Orders, Invoices, Bills, Vendor Credits, Purchase
// Orders, Payment Made/Received. There is no backend endpoint for this yet.
//
// Each module/document type gets its own isolated settings object — editing
// the Quote template must never change what a Sales Order or Invoice PDF
// shows, so settings are keyed by `documentType` rather than shared globally.

export interface DocumentTemplateSettings {
  logo: string; // data URL, '' if none set
  organizationAddress: string;
  signature: string; // data URL, '' if none set
  termsAndConditions: string;
  // Heading override for this document type, e.g. renaming "Quote" to "Estimate".
  templateName: string;
}

const STORAGE_PREFIX = 'documentTemplateSettings:';

const EMPTY_SETTINGS: DocumentTemplateSettings = {
  logo: '',
  organizationAddress: '',
  signature: '',
  termsAndConditions: '',
  templateName: '',
};

// Turns a document title like "RECURRING BILL" into a stable storage key
// ("recurring_bill") for components that don't have an explicit type slug.
export const slugifyDocumentType = (label: string): string => {
  const slug = String(label || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return slug || 'document';
};

export const getDocumentTemplateSettings = (documentType: string): DocumentTemplateSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + documentType);
    if (!raw) return { ...EMPTY_SETTINGS };
    return { ...EMPTY_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_SETTINGS };
  }
};

export const saveDocumentTemplateSettings = (documentType: string, settings: DocumentTemplateSettings): void => {
  localStorage.setItem(STORAGE_PREFIX + documentType, JSON.stringify(settings));
};

export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
