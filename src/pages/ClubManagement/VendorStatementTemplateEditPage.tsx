import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';
import { useAccountingFormOpened } from '@/components/PostHogAccountingEvents';

export const VendorStatementTemplateEditPage: React.FC = () => {
  useAccountingFormOpened('template', 'edit');
  return (
  <DocumentTemplateEditPage
    documentType="vendor_statement"
    moduleLabel="Vendor Statement"
    defaultHeading="Vendor Statement"
    sampleDocumentNumber="VS-00001"
    backRoute="/accounting/vendor"
    detailsRoutePrefix="/accounting/vendor/view"
    pdfTabValue="statement"
  />
  );
};

export default VendorStatementTemplateEditPage;
